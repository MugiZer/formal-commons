import { createMcpHandler } from 'agents/mcp/server';
import { catalogue, createServer } from './server.ts';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SEARCH_LIMITER: { limit(input: { key: string }): Promise<{ success: boolean }> };
}
const mcp = createMcpHandler(createServer, { route: '/mcp', responseMode: 'json', onerror: () => console.error(JSON.stringify({ code: 'MCP_ERROR' })) });
const jsonError = (code: string, status: number) => Response.json({ error: { code }, snapshot_id: catalogue.snapshot_id }, { status });

export async function handleRequest(request: Request, env: Env, context: Parameters<typeof mcp>[2]) {
  const url = new URL(request.url);
  if (url.pathname === '/health') return Response.json({ status: 'ok', snapshot_id: catalogue.snapshot_id, source_commit: catalogue.source_commit, records: catalogue.records.length });
  if (url.pathname === '/registry.json') return Response.json(catalogue, { headers: { 'Cache-Control': 'public, max-age=60', ETag: `"${catalogue.snapshot_id}"` } });
  if (url.pathname !== '/mcp') return env.ASSETS.fetch(request);
  if (!['POST', 'OPTIONS'].includes(request.method)) return jsonError('METHOD_NOT_ALLOWED', 405);
  const allowed = await env.SEARCH_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'local' });
  if (!allowed.success) return Response.json({ error: { code: 'RATE_LIMITED' } }, { status: 429, headers: { 'Retry-After': '60' } });
  if (request.method === 'POST') {
    if (!(request.headers.get('Content-Type') ?? '').toLowerCase().startsWith('application/json')) return jsonError('UNSUPPORTED_MEDIA_TYPE', 415);
    if (Number(request.headers.get('Content-Length') ?? 0) > 16384) return jsonError('REQUEST_TOO_LARGE', 413);
    const reader = request.body?.getReader();
    if (!reader) return jsonError('INVALID_JSON', 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 5000);
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 16384) { await reader.cancel(); return jsonError('REQUEST_TOO_LARGE', 413); }
        chunks.push(value);
      }
      if (timedOut) return jsonError('REQUEST_TIMEOUT', 408);
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      const body = JSON.parse(text);
      if (Array.isArray(body)) return jsonError('BATCH_NOT_SUPPORTED', 400);
      request = new Request(request.url, { method: 'POST', headers: request.headers, body: text });
    } catch { return jsonError(timedOut ? 'REQUEST_TIMEOUT' : 'INVALID_JSON', timedOut ? 408 : 400); }
    finally { clearTimeout(timer); }
  }
  const started = Date.now();
  try {
    const response = await mcp(request, env, context);
    console.log(JSON.stringify({ path: '/mcp', status: response.status, duration_ms: Date.now() - started }));
    return response;
  } catch { return jsonError('INTERNAL_ERROR', 500); }
}
export default { fetch: handleRequest };
