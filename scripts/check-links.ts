import { readCatalogue } from './build-registry.ts';
import { httpsUrl } from '../registry/schema.ts';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function linkTarget(url: string, kind: 'pinned' | 'contribution'): string {
  const parsed = new URL(httpsUrl.parse(url));
  if (parsed.hostname === 'github.com' && /^\/[\w.-]+\/[\w.-]+\/blob\/[a-f0-9]{40}\//.test(parsed.pathname)) return `https://raw.githubusercontent.com${parsed.pathname.replace('/blob/', '/')}`;
  if (kind === 'contribution' && parsed.hostname === 'github.com' && /^\/[\w.-]+\/[\w.-]+(?:\/issues)?\/?$/.test(parsed.pathname)) return url;
  throw new Error(`Manual review required for unsupported ${kind} link: ${url}`);
}

async function checkLinks() {
  const catalogue = await readCatalogue();
  const urls = new Map<string, 'pinned' | 'contribution'>();
  for (const record of catalogue.records) {
    urls.set(record.source_url, 'pinned'); urls.set(record.license.url, 'pinned');
    const contributing = record.project_details?.contributing;
    if (contributing && !urls.has(contributing)) urls.set(contributing, 'contribution');
  }
  for (const [url, kind] of urls) {
    const response = await fetch(linkTarget(url, kind), { method: 'HEAD', redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Broken ${kind} link (${response.status}): ${url}`);
    console.log(`${response.status} ${url}`);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await checkLinks();
