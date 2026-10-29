import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeReturn } from '../site/src/lib/api';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../site/src/components/app';
import { readCatalogue } from '../scripts/build-registry';
import { latestRecords, discoverable } from '../registry/discovery';

test('the homepage shows artifacts and one search when the catalogue includes projects', async () => {
  const catalogue = await readCatalogue();
  const records = latestRecords(catalogue).filter(discoverable);
  const artifact = records.find((record) => record.kind === 'theorem');
  const project = records.find((record) => record.kind === 'project');
  assert.ok(artifact && project);
  const html = renderToStaticMarkup(createElement(App, { snapshot: { ...catalogue, records: [project, artifact] }, route: '/' }));
  assert.match(html, /<h1>Artifacts/);
  assert.equal((html.match(/class="result"/g) ?? []).length, 1);
  assert.equal((html.match(/<input[^>]*type="search"/g) ?? []).length, 1);
  assert.ok(!html.includes(project.title));
});

test('sign-in returns only to an internal task URL',()=>{
  assert.equal(safeReturn('/contributions/new/?record=lean%2Fcore'),'/contributions/new/?record=lean%2Fcore');
  for(const value of [null,'https://example.com/','//example.com/','/\\example.com/','/\n/example.com/']) assert.equal(safeReturn(value),'/workspace/');
});
