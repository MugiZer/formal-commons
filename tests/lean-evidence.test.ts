import test from 'node:test';
import assert from 'node:assert/strict';
import { auditedDeclarations, inspectAxioms } from '../scripts/check-lean.ts';

const log = (axioms: string) => auditedDeclarations.map((name) => `'${name}' depends on axioms: [${axioms}]`).join('\n');
test('proof evidence rejects placeholders, custom axioms and missing audit output', () => {
  assert.throws(() => inspectAxioms(log('sorryAx')), /Unapproved axiom/);
  assert.throws(() => inspectAxioms(log('MyModule.trustMe')), /Unapproved axiom/);
  assert.throws(() => inspectAxioms(''), /Missing/);
  assert.throws(() => inspectAxioms(log('propext') + '\n' + log('sorryAx')), /duplicate/);
  assert.equal(Object.keys(inspectAxioms(log('propext, Quot.sound'))).length, 4);
});
