import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { hash } from './build-registry.ts';
import type { Decision } from '../registry/schema.ts';

const base = process.argv[2];
if (!base || !/^[a-f0-9]{40}$/.test(base)) throw new Error('Supply the trusted base commit SHA.');
const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' });
if (!git('ls-tree', '--name-only', base, 'reviews/decisions.json').trim()) {
  console.log('No previously published registry at the base commit.'); process.exit(0);
}
const decisions: Decision[] = JSON.parse(git('show', `${base}:reviews/decisions.json`));
const paths = git('ls-tree', '-r', '--name-only', base, 'registry/records/').trim().split('\n').filter(Boolean);
for (const path of paths) {
  const old = JSON.parse(git('show', `${base}:${path}`));
  if (!decisions.some((d) => d.id === old.id && d.record_version === old.record_version && ['accepted', 'withdrawn'].includes(d.publication))) continue;
  let current;
  try { current = JSON.parse(await readFile(path, 'utf8')); } catch { throw new Error(`Published history cannot be removed: ${path}`); }
  if (hash(current) !== hash(old)) throw new Error(`Published record is immutable: ${path}. Add a new record_version in a new file.`);
}
console.log('Published record history preserved.');
