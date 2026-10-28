import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildCatalogue, hash, readCatalogue, publishSnapshot } from '../scripts/build-registry.ts';
import { recordSchema, decisionSchema, type Decision } from '../registry/schema.ts';
import { search, getArtifact, searchArtifactsSchema } from '../mcp/catalogue.ts';

const catalogue = await readCatalogue();
const records = catalogue.records.map(({ evidence, source_url, record_digest, ...record }) => record);
const decisions = catalogue.records.map((record) => record.evidence);
const artifact = records.find((r) => r.kind === 'theorem')!;
const decision = decisions.find((d) => d.id === artifact.id)!;

test('strict schema rejects malformed records and contributor evidence claims', () => {
  assert.throws(() => recordSchema.parse({ ...artifact, verified: true }));
  assert.throws(() => recordSchema.parse({ ...artifact, evidence: { mechanical: 'checked' } }));
  assert.throws(() => recordSchema.parse({ ...artifact, source: { ...artifact.source, revision: 'main' } }));
  assert.throws(() => recordSchema.parse({ ...artifact, source: { ...artifact.source, repository: 'javascript:alert(1)' } }));
});
test('unapproved and under-review contributions never enter the published catalogue', () => {
  assert.equal(buildCatalogue(records, [], 'test').records.length, 0);
  const pending = decisions.map((d) => ({ ...d, publication: 'under_review' }));
  assert.equal(buildCatalogue(records, pending, 'test').records.length, 0);
});
test('approval is bound to exact record content', () => {
  assert.throws(() => buildCatalogue(records.map((r) => ({ ...r, summary: 'Changed' })), decisions, 'test'), /digest mismatch/);
  assert.throws(() => buildCatalogue([...records, artifact], decisions, 'test'), /Duplicate record/);
});
test('checking and expert status require separate evidence', () => {
  assert.throws(() => decisionSchema.parse({ ...decision, mechanical: { ...decision.mechanical, status: 'checked_at_pinned_revision' } }));
  assert.throws(() => decisionSchema.parse({ ...decision, semantic: { status: 'qualified_expert_reviewed', reference: decision.approval, qualification: null } }));
  const weakDecision = { ...decision, mechanical: { status: 'not_checked_by_us', reference: null, checker: null, source_revision: null, proof_digest: null, axioms: null } };
  const weak = buildCatalogue(records, decisions.map((item) => item.id === artifact.id && item.record_version === decision.record_version ? weakDecision : item), 'test').records.find((r) => r.id === artifact.id)!;
  assert.equal(weak.evidence.semantic.status, 'unreviewed');
  assert.equal(weak.evidence.mechanical.status, 'not_checked_by_us');
});
test('snapshot hashing is deterministic across file ordering and object key order', () => {
  assert.equal(buildCatalogue([...records].reverse(), [...decisions].reverse(), 'test').snapshot_id, catalogue.snapshot_id);
  assert.equal(hash({ a: 1, b: 2 }), hash({ b: 2, a: 1 }));
});
test('ranked search returns assumptions and makes applicability limits explicit', () => {
  const result = search(catalogue, 'artifacts', { query: 'filter membership' });
  assert.equal(result.results[0].id, 'lean/list-mem-filter');
  assert.ok(result.results[0].assumptions.length);
  assert.match(result.applicability, /not established by retrieval/);
  assert.equal(search(catalogue, 'artifacts', { query: 'filter', evidence_filter: 'checked_at_pinned_revision' }).total, 0);
});
test('pagination is deterministic, bounded and tied to the query and snapshot', () => {
  const first = search(catalogue, 'projects', { query: '', limit: 1 });
  assert.ok(first.next_cursor);
  const second = search(catalogue, 'projects', { query: '', limit: 1, cursor: first.next_cursor });
  assert.notEqual(first.results[0].id, second.results[0].id);
  assert.throws(() => search(catalogue, 'projects', { query: 'Lean', limit: 1, cursor: first.next_cursor }), /cursor/i);
  assert.throws(() => search(catalogue, 'projects', { query: '', cursor: 'garbage' }), /cursor/i);
  assert.throws(() => searchArtifactsSchema.parse({ query: 'x'.repeat(257) }));
  assert.throws(() => searchArtifactsSchema.parse({ query: ' '.repeat(257) }));
  assert.throws(() => searchArtifactsSchema.parse({ query: '', limit: 26 }));
  assert.throws(() => searchArtifactsSchema.parse({ query: '', execute: 'rm -rf /' }));
});
test('withdrawal and stale flags remove latest records from default discovery but preserve explicit history', () => {
  assert.ok(search(catalogue, 'artifacts', { query: '', limit: 25 }).results.some((record) => record.id === artifact.id));
  const newer = { ...artifact, record_version: 2, limitations: [...artifact.limitations, 'Withdrawn after correction.'] };
  const withdrawn: Decision = { ...decision, record_version: 2, record_digest: hash(newer), publication: 'withdrawn' };
  const updated = buildCatalogue([...records, newer], [...decisions, withdrawn], 'test');
  assert.ok(!search(updated, 'artifacts', { query: '', limit: 25 }).results.some((record) => record.id === artifact.id));
  assert.equal(getArtifact(updated, { id: artifact.id }).artifact.evidence.publication, 'withdrawn');
  assert.equal(getArtifact(updated, { id: artifact.id, revision: hash(artifact) }).artifact.record_version, 1);
  const stale = buildCatalogue(records, decisions.map((d) => d.id === artifact.id ? { ...d, freshness: { ...d.freshness, status: 'stale' } } : d), 'test');
  assert.ok(!search(stale, 'artifacts', { query: '', limit: 25 }).results.some((record) => record.id === artifact.id));
});
test('a broken publication preserves the last good snapshot; restoration reproduces it', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ohara-'));
  try {
    await cp('registry', join(directory, 'registry'), { recursive: true });
    await cp('reviews', join(directory, 'reviews'), { recursive: true });
    await publishSnapshot(directory);
    const target = join(directory, 'generated/catalogue.json');
    const good = await readFile(target, 'utf8');
    const source = join(directory, 'registry/records/lean--list-mem-filter--1.json');
    const original = await readFile(source, 'utf8');
    await writeFile(source, '{"malformed":true}');
    await assert.rejects(publishSnapshot(directory));
    assert.equal(await readFile(target, 'utf8'), good);
    await writeFile(source, original);
    await publishSnapshot(directory);
    assert.equal(await readFile(target, 'utf8'), good);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
