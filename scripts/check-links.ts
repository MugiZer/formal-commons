import { readCatalogue } from './build-registry.ts';

const catalogue = await readCatalogue();
const urls = new Set(catalogue.records.flatMap((r) => [r.source_url, r.license.url, r.project_details?.contributing].filter((u): u is string => !!u)));
for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.hostname !== 'github.com' || !/^\/[^/]+\/[^/]+\/blob\/[a-f0-9]{40}\//.test(parsed.pathname)) throw new Error(`Manual review required for non-pinned GitHub link: ${url}`);
  const raw = `https://raw.githubusercontent.com${parsed.pathname.replace('/blob/', '/')}`;
  const response = await fetch(raw, { method: 'HEAD', redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Broken source or license link (${response.status}): ${url}`);
  console.log(`${response.status} ${url}`);
}
