import { writeFile, mkdir } from 'node:fs/promises';
import { z } from 'zod';
import { recordSchema, decisionSchema } from '../registry/schema.ts';
await mkdir('schemas', { recursive: true });
for (const [name, schema] of Object.entries({ record: recordSchema, decision: decisionSchema })) {
  await writeFile(`schemas/${name}.v1.schema.json`, JSON.stringify(z.toJSONSchema(schema), null, 2) + '\n');
}
