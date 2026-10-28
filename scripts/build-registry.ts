import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { decisionSchema, recordSchema, type Catalogue, type Decision, type RecordEntry } from '../registry/schema.ts';

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
export const hash = (value: unknown) => createHash('sha256').update(canonical(value)).digest('hex');

export function buildCatalogue(rawRecords: unknown[], rawDecisions: unknown, sourceCommit: string): Catalogue {
  const records = rawRecords.map((record) => recordSchema.parse(record));
  const decisions = z.array(decisionSchema).parse(rawDecisions);
  const keys = new Set<string>();
  for (const record of records) {
    const key = `${record.id}@${record.record_version}`;
    if (keys.has(key)) throw new Error(`Duplicate record ${key}`);
    keys.add(key);
  }
  const approvals = new Map<string, Decision>();
  for (const decision of decisions) {
    const key = `${decision.id}@${decision.record_version}`;
    if (approvals.has(key)) throw new Error(`Duplicate decision ${key}`);
    const record = records.find((r) => r.id === decision.id && r.record_version === decision.record_version);
    if (!record || hash(record) !== decision.record_digest) throw new Error(`Approval digest mismatch: ${key}`);
    if (decision.mechanical.status === 'checked_at_pinned_revision' && decision.mechanical.source_revision !== record.source.revision) throw new Error(`Check revision mismatch: ${key}`);
    if (decision.mechanical.reports?.some((report) => report.source_revision !== record.source.revision)) throw new Error(`Report revision mismatch: ${key}`);
    if (record.kind === 'verified_component' && decision.publication === 'accepted' && decision.implementation.status !== 'independently_evidenced') throw new Error(`Verified components need an evidenced implementation: ${key}`);
    approvals.set(key, decision);
  }
  const published = records.flatMap((record) => {
    const evidence = approvals.get(`${record.id}@${record.record_version}`);
    if (!evidence || !['accepted', 'withdrawn'].includes(evidence.publication)) return [];
    return [{ ...record, record_digest: hash(record), source_url: `${record.source.repository}/blob/${record.source.revision}/${record.source.path}`, evidence }];
  }).sort((a, b) => a.id.localeCompare(b.id, 'en') || a.record_version - b.record_version);
  for (const record of published) {
    if (record.kind !== 'project' && !published.some((r) => r.id === record.project && r.kind === 'project')) throw new Error(`Missing published project ${record.project}`);
  }
  return { schema_version: 1, snapshot_id: hash(published), source_commit: sourceCommit, records: published };
}

export async function readCatalogue(root = process.cwd(), sourceCommit?: string) {
  const files = (await readdir(resolve(root, 'registry/records'))).filter((f) => f.endsWith('.json')).sort();
  const records = await Promise.all(files.map(async (f) => JSON.parse(await readFile(resolve(root, 'registry/records', f), 'utf8')) as RecordEntry));
  const decisions = JSON.parse(await readFile(resolve(root, 'reviews/decisions.json'), 'utf8'));
  let commit = sourceCommit ?? process.env.GITHUB_SHA;
  if (!commit) {
    try {
      const top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (relative(resolve(root), resolve(top))) throw new Error('Registry is outside a dedicated repository');
      commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()) commit = `working-tree:${commit}`;
    }
    catch { commit = 'uncommitted-local-build'; }
  }
  return buildCatalogue(records, decisions, commit);
}

export async function publishSnapshot(root = process.cwd()) {
  const catalogue = await readCatalogue(root);
  const directory = resolve(root, 'generated');
  await mkdir(directory, { recursive: true });
  const temporary = resolve(directory, `catalogue-${process.pid}.tmp`);
  try {
    await writeFile(temporary, canonical(catalogue) + '\n', { flag: 'wx' });
    await rename(temporary, resolve(directory, 'catalogue.json'));
  } finally { await rm(temporary, { force: true }); }
  console.log(`Snapshot ${catalogue.snapshot_id}: ${catalogue.records.length} published records (${catalogue.source_commit})`);
  return catalogue;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await publishSnapshot();
