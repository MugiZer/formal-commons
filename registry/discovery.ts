import type { Catalogue, PublishedRecord } from './schema';

export function latestRecords(catalogue: Catalogue): PublishedRecord[] {
  const latest = new Map<string, PublishedRecord>();
  for (const record of catalogue.records) {
    if ((latest.get(record.id)?.record_version ?? 0) < record.record_version)
      latest.set(record.id, record);
  }
  return [...latest.values()].sort((a, b) => a.id.localeCompare(b.id, 'en'));
}
export const discoverable = (record: PublishedRecord) =>
  record.evidence.publication === 'accepted' && record.evidence.freshness.status !== 'stale';
