import { readFile, writeFile } from 'node:fs/promises';
import { recordSchema, decisionSchema } from '../registry/schema.ts';
import { hash } from './build-registry.ts';

const [recordPath, reviewer, reviewUrl, notes] = process.argv.slice(2);
if (!recordPath || !reviewer || !reviewUrl || !notes) throw new Error('Usage: npm run approve -- registry/records/record--1.json "Reviewer identity" https://github.com/owner/repo/pull/123 "Scope and publication rationale"');
const record = recordSchema.parse(JSON.parse(await readFile(recordPath, 'utf8')));
const decisions = JSON.parse(await readFile('reviews/decisions.json', 'utf8'));
if (decisions.some((d: { id: string; record_version: number }) => d.id === record.id && d.record_version === record.record_version)) throw new Error('A decision already exists; edit its evidence deliberately or publish a new record version.');
const decision = decisionSchema.parse({
  id: record.id, record_version: record.record_version, record_digest: hash(record), publication: 'accepted',
  approval: { by: reviewer, date: new Date().toISOString().slice(0, 10), url: reviewUrl, notes },
  freshness: { status: 'pinned', checked: null, notes: 'Pinned source; freshness has not been assessed.' },
  mechanical: { status: 'not_checked_by_us', reference: null, checker: null, source_revision: null, proof_digest: null, axioms: null },
  semantic: { status: 'unreviewed', reference: null, qualification: null },
  implementation: { status: 'none', reference: null, scope: 'No independently evidenced implementation correspondence.' },
});
decisions.push(decision);
await writeFile('reviews/decisions.json', JSON.stringify(decisions, null, 2) + '\n');
console.log(`Recorded publication decision for ${record.id}; mechanical, semantic and implementation evidence were not upgraded.`);
