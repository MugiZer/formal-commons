import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const endpoint = new URL(process.argv[2] ?? 'http://localhost:8787/mcp');
const client = new Client({ name: 'ohara-independent-smoke-client', version: '0.1.0' });
const transport = new StreamableHTTPClientTransport(endpoint);
await client.connect(transport);
try {
  assert.equal(client.getServerVersion()?.name, 'ohara');
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((t) => t.name).sort(), ['get_artifact', 'search_artifacts', 'search_projects']);
  const search = await client.callTool({ name: 'search_artifacts', arguments: { query: 'filter membership' } });
  assert.ok(!search.isError);
  const data = search.structuredContent as { snapshot_id: string; results: Array<{ id: string; source: { revision: string } }>; applicability: string };
  assert.equal(data.results[0].id, 'lean/list-mem-filter');
  assert.match(data.applicability, /not established by retrieval/);
  const detail = await client.callTool({ name: 'get_artifact', arguments: { id: data.results[0].id, revision: data.results[0].source.revision } });
  const artifact = (detail.structuredContent as { artifact: { assumptions: string[]; limitations: string[] } }).artifact;
  assert.ok(artifact.assumptions.length && artifact.limitations.length);
  for (const args of [{ query: 'x'.repeat(257) }, { query: '', limit: 100 }, { query: '', execute: 'whoami' }]) {
    const result = await client.callTool({ name: 'search_artifacts', arguments: args });
    assert.equal(result.isError, true);
  }
  const missing = await client.callTool({ name: 'get_artifact', arguments: { id: 'missing/item' } });
  assert.equal(missing.isError, true);
  const health = await fetch(new URL('/health', endpoint)).then((r) => r.json()) as { snapshot_id: string };
  const registry = await fetch(new URL('/registry.json', endpoint)).then((r) => r.json()) as { snapshot_id: string };
  assert.equal(health.snapshot_id, data.snapshot_id);
  assert.equal(registry.snapshot_id, data.snapshot_id);
  const post = (body: string, contentType = 'application/json') => fetch(endpoint, { method: 'POST', headers: { 'Content-Type': contentType }, body });
  assert.equal((await post('{broken')).status, 400);
  assert.equal((await post('x'.repeat(16385))).status, 413);
  assert.equal((await post('[]')).status, 400);
  assert.equal((await post('{}', 'text/plain')).status, 415);
  assert.equal((await fetch(endpoint, { method: 'DELETE' })).status, 405);
  const badOrigin = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.invalid', Accept: 'application/json, text/event-stream' }, body: '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' });
  assert.equal(badOrigin.status, 403);
  console.log(JSON.stringify({ endpoint: endpoint.href, snapshot_id: data.snapshot_id, tools: tools.tools.map((t) => t.name), artifact: data.results[0].id, checks: 'MCP handshake, search, exact retrieval, assumptions, strict inputs, health parity, payload limits, methods, origin rejection: passed' }, null, 2));
} finally { await client.close(); }
