import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import snapshot from '../generated/catalogue.json';
import type { Catalogue } from '../registry/schema.ts';
import { CatalogueError, search, getArtifact, searchArtifactsSchema, searchProjectsSchema, getArtifactSchema } from './catalogue.ts';

export const catalogue = snapshot as Catalogue;
export function createServer() {
  const server = new McpServer({ name: 'formal-commons', version: '0.1.0' });
  for (const tool of [
    { name: 'search_artifacts', schema: searchArtifactsSchema, description: 'Find approved formal artifacts by behavior. Read-only discovery; each result includes pinned provenance, assumptions, evidence and reuse limits.', run: (args: unknown) => search(catalogue, 'artifacts', args) },
    { name: 'get_artifact', schema: getArtifactSchema, description: 'Read one published artifact at its latest or exact source/digest revision, including withdrawn records and explicit applicability limits.', run: (args: unknown) => getArtifact(catalogue, args) },
    { name: 'search_projects', schema: searchProjectsSchema, description: 'Find approved upstream verification projects and their contribution opportunities. Registration does not independently verify a project.', run: (args: unknown) => search(catalogue, 'projects', args) },
  ]) {
    server.registerTool(tool.name, {
      description: tool.description,
      inputSchema: tool.schema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (args: unknown) => {
      try {
        const result = tool.run(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }], structuredContent: result };
      } catch (error) {
        const code = error instanceof CatalogueError ? error.code : error instanceof z.ZodError ? 'INVALID_INPUT' : 'INTERNAL_ERROR';
        const message = error instanceof CatalogueError ? error.message : code === 'INVALID_INPUT' ? 'Tool arguments did not match the strict bounded schema.' : 'Unable to complete the request.';
        const result = { error: { code, message }, snapshot_id: catalogue.snapshot_id };
        return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify(result) }], structuredContent: result };
      }
    });
  }
  return server;
}
