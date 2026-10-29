import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecordPage } from '../site/src/components/record';
import { Catalogue } from '../site/src/components/catalogue';
import { readCatalogue } from '../scripts/build-registry';
import type { PublishedRecord } from '../registry/schema';

test('catalogue and record headings show titles before source symbols', async () => {
  const catalogue = await readCatalogue();
  const source = catalogue.records.find((r) => r.kind === 'theorem' && r.source.symbol);
  assert.ok(source);
  const record = { ...source, title: 'A descriptive theorem title', source: { ...source.source, symbol: 'Example.theorem' } };
  const list = renderToStaticMarkup(createElement(Catalogue, { records: [record] }));
  assert.match(list, /<h2><a[^>]*>A descriptive theorem title<\/a><\/h2>\s*<p class="result-symbol"><code>Example\.theorem<\/code><\/p>/);
  const detail = renderToStaticMarkup(createElement(RecordPage, { record, records: [record] }));
  assert.match(detail, /<h1>A descriptive theorem title<\/h1>\s*<p class="record-symbol"><code>Example\.theorem<\/code><\/p>/);

  const withoutSymbol = { ...record, source: { ...record.source, symbol: null } };
  const listWithoutSymbol = renderToStaticMarkup(createElement(Catalogue, { records: [withoutSymbol] }));
  const detailWithoutSymbol = renderToStaticMarkup(createElement(RecordPage, { record: withoutSymbol, records: [withoutSymbol] }));
  assert.ok(listWithoutSymbol.includes('A descriptive theorem title'));
  assert.ok(detailWithoutSymbol.includes('<h1>A descriptive theorem title</h1>'));
  assert.ok(!listWithoutSymbol.includes('class="result-symbol"'));
  assert.ok(!detailWithoutSymbol.includes('class="record-symbol"'));
});

test('record detail preserves source pins, evidence limits and historical or withdrawn warnings', async () => {
  const catalogue = await readCatalogue();
  const original = JSON.stringify(catalogue.records);
  const checkLabels = {
    not_checked_by_us: 'No check recorded',
    upstream_reported: 'Upstream checks recorded',
    checked_at_pinned_revision: 'Checked at this revision',
  };
  for (const record of catalogue.records) {
    const html = renderToStaticMarkup(
      createElement(RecordPage, { record, records: catalogue.records }),
    );
    assert.ok(
      html.includes(record.source_url),
      'The visible source action stays pinned.',
    );
    assert.ok(html.includes(checkLabels[record.evidence.mechanical.status]));
    assert.ok(html.includes('No review recorded'));
    assert.ok(html.includes('No evidence recorded'));
    assert.ok(
      html.includes(encodeURIComponent(record.id)) &&
        html.includes(record.record_digest),
      'Corrections target the exact record.',
    );
    assert.ok(
      html.includes(
        record.kind === 'project' ? 'Use this project' : 'Use this artifact',
      ),
    );
  }
  assert.equal(JSON.stringify(catalogue.records), original);
  const record = catalogue.records.filter((r) => r.kind === 'theorem').sort((a, b) => b.record_version - a.record_version)[0];
  const newer: PublishedRecord = {
    ...record,
    record_version: record.record_version + 1,
    record_digest: '9'.repeat(64),
  };
  const historical = renderToStaticMarkup(
    createElement(RecordPage, {
      record,
      records: [...catalogue.records, newer],
    }),
  );
  assert.ok(
    historical.includes(`Open the latest record, v${newer.record_version}`),
  );
  assert.ok(
    historical.includes(`/records/${record.id}/${newer.record_digest}/`),
  );
  const withdrawn: PublishedRecord = {
    ...record,
    evidence: { ...record.evidence, publication: 'withdrawn' },
  };
  const withdrawnHtml = renderToStaticMarkup(
    createElement(RecordPage, { record: withdrawn, records: [withdrawn] }),
  );
  assert.ok(withdrawnHtml.includes('The registry withdrew this record.'));
  assert.ok(
    withdrawnHtml.includes('It no longer appears in default search results.'),
  );
});
