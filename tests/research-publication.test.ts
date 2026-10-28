import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildCatalogue, readCatalogue } from '../scripts/build-registry.ts';
import { linkTarget } from '../scripts/check-links.ts';

const root = 'site/public/research/2026-10/';
const read = async (path: string) => JSON.parse(await readFile(root + path, 'utf8'));
const sha256 = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');

test('contribution landing pages remain valid while source and license links require a pin', () => {
  const repository = 'https://github.com/microsoft/verified-storage';
  assert.equal(linkTarget(repository, 'contribution'), repository);
  assert.equal(linkTarget(repository + '/issues', 'contribution'), repository + '/issues');
  assert.throws(() => linkTarget(repository, 'pinned'), /Manual review/);
  const pinned = 'https://github.com/mit-plv/fiat-crypto/blob/1e721c6f18c43b90922e7bc57fd64848e5cff2be/LICENSE-MIT';
  assert.equal(linkTarget(pinned, 'pinned'), 'https://raw.githubusercontent.com/mit-plv/fiat-crypto/1e721c6f18c43b90922e7bc57fd64848e5cff2be/LICENSE-MIT');
  assert.throws(() => linkTarget('https://github.com@invalid.example/repository', 'contribution'));
});

test('published source and public evidence bytes match their declared hashes', async () => {
  const manifest = await read('manifest.json');
  assert.ok(manifest.files.length >= 50);
  for (const file of manifest.files) {
    assert.doesNotMatch(file.path, /(^|\/)\.\.(\/|$)|^[\\/]/);
    const bytes = await readFile(root + file.path);
    assert.equal(sha256(bytes), file.sha256, file.path);
    assert.equal(bytes.length, file.bytes, file.path);
    if (/\.(lean|tla|cfg)$/.test(file.path)) assert.equal(file.sha256, file.original_sha256, file.path);
    else assert.doesNotMatch(bytes.toString('utf8'), /C:[\\/]+Users[\\/]+moham/i, file.path);
  }
});

test('original involution package and completed finite checks preserve actual results', async () => {
  const manifest = await read('lean/pattern/manifest.json');
  for (const file of manifest.local_proof_files) assert.equal(sha256(await readFile(root + 'lean/pattern/' + file.path)), file.sha256);
  assert.equal(sha256(JSON.stringify(manifest.local_proof_files)), 'e5e77099cf9a19ba4245bcb67d1ff0cc61ab76cb60882c5bdd85aaba8fafecf6');
  const pattern = await read('lean/pattern/logs/Pattern.json');
  assert.equal(pattern.exit_status, 0);
  assert.match(pattern.stdout, /does not depend on any axioms/);
  const two = await read('tla/two-process/check.json');
  assert.equal(two.exit_code, 0); assert.equal(two.state_space.distinct_states, 660); assert.equal(two.state_space.queue_remaining, 0);
  const three = await read('tla/three-process/check.json');
  assert.equal(three.attempts[0].exit_code, 0); assert.equal(three.attempts[0].distinct_states, 90882); assert.equal(three.attempts[0].states_left_on_queue, 0);
  const publicManifest = await read('manifest.json');
  const stdout = publicManifest.files.find((file: { path: string }) => file.path === 'tla/three-process/stdout.txt');
  assert.equal(stdout.original_sha256, '3addf1d534fcd054d6cda2b046162ab2b1929735d05a6f3614c9a5048f1b477f');
  assert.equal(sha256(await readFile(root + stdout.path)), stdout.sha256);
});

test('a recorded check cannot be attached to a different source revision', async () => {
  const catalogue = await readCatalogue();
  const artifact = catalogue.records.find((record) => record.id === 'cedar-policy/sound-policy-slice');
  assert.ok(artifact);
  const { evidence, source_url, record_digest, ...record } = artifact;
  const report = evidence.mechanical.reports?.[0];
  assert.ok(report);
  const decision = { ...evidence, mechanical: { ...evidence.mechanical, reports: [{ ...report, source_revision: '0'.repeat(40) }] } };
  assert.throws(() => buildCatalogue([record], [decision], 'publication-fixture'), /Report revision mismatch/);
});
