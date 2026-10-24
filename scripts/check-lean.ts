import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash } from './build-registry.ts';

export const auditedDeclarations = ['List.mem_filter', 'FormalCommons.keep_mem', 'FormalCommons.keep_origin', 'Consumer.selected_was_submitted'];
const allowedAxioms = new Set(['propext', 'Quot.sound', 'Classical.choice']);
export function inspectAxioms(log: string) {
  const inspected: Record<string, string[]> = {};
  for (const name of auditedDeclarations) {
    const lines = log.split('\n').filter((line) => line.startsWith(`'${name}' `));
    if (lines.length !== 1) throw new Error(`Missing or duplicate axiom inspection for ${name}`);
    const line = lines[0];
    const axioms = line.includes('does not depend on any axioms') ? [] : line.match(/depends on axioms: \[([^\]]*)\]/)?.[1].split(',').map((a) => a.trim()).filter(Boolean);
    if (!axioms || axioms.some((axiom) => !allowedAxioms.has(axiom))) throw new Error(`Unapproved axiom in ${name}: ${line}`);
    inspected[name] = axioms;
  }
  return inspected;
}
export async function checkLean() {
  const cwd = resolve('examples/lean-contracts');
  const files = ['lean-toolchain', 'lakefile.toml', 'Contracts.lean', 'Consumer.lean'];
  const source: Record<string, string> = {};
  for (const name of files) {
    source[name] = (await readFile(resolve(cwd, name), 'utf8')).replace(/\r\n/g, '\n');
    if (name.endsWith('.lean') && /\b(sorry|admit|axiom)\b/.test(source[name])) throw new Error(`Placeholder or axiom declaration in ${name}`);
  }
  const env = { ...process.env, PATH: process.env.LEAN_BIN ? `${process.env.LEAN_BIN}${delimiter}${process.env.PATH}` : process.env.PATH };
  const run = (exe: string, args: string[], input?: string) => {
    const result = spawnSync(process.platform === 'win32' ? `${exe}.exe` : exe, args, { cwd, env, input, encoding: 'utf8', timeout: 180000, maxBuffer: 5_000_000 });
    if (result.error || result.status !== 0) throw new Error(`${exe} ${args.join(' ')} failed\n${result.error?.message ?? ''}\n${result.stdout}\n${result.stderr}`);
    return result.stdout + result.stderr;
  };
  const checker = run('lean', ['--version']).trim();
  if (!checker.includes('version 4.35.0')) throw new Error(`Wrong pinned toolchain: ${checker}`);
  const build = run('lake', ['build']);
  const audit = `import Consumer\n${auditedDeclarations.map((name) => `#print axioms ${name}`).join('\n')}\n`;
  const log = run('lake', ['env', 'lean', '-DwarningAsError=true', '--stdin'], audit);
  const axioms = inspectAxioms(log);
  const report = { schema_version: 1, scope: 'The maintained Contracts and Consumer modules were checked using pinned Lean and its imported core library. List.mem_filter axioms were inspected; upstream core was not independently rebuilt. No human semantic review or correspondence to non-Lean implementations.', checker, package_digest: hash(source), axioms, build, log };
  await mkdir('evidence', { recursive: true });
  await writeFile('evidence/lean-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  return report;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await checkLean();
