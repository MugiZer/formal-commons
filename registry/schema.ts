import { z } from 'zod';

const text = z.string().min(1).max(2000).regex(/^[^\u0000-\u0008\u000b-\u001f]*$/u);
export const httpsUrl = z.url().max(500).refine((value) => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, 'Only HTTPS URLs without credentials are allowed');
const list = z.array(text).min(1).max(30);
const date = z.iso.date();
const sha = z.string().regex(/^[a-f0-9]{40}$/);
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const kinds = ['specification', 'theorem', 'behavioral_model', 'verified_component', 'project'] as const;
export const recordSchema = z.strictObject({
  schema_version: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/).max(120),
  record_version: z.int().min(1).max(10000),
  kind: z.enum(kinds),
  title: text.max(160),
  summary: text.max(600),
  tags: z.array(z.string().min(1).max(50)).min(1).max(20),
  proof_system: text.max(100),
  source: z.strictObject({
    repository: httpsUrl.refine((s) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(s), 'Use a canonical GitHub repository URL'),
    revision: sha,
    path: z.string().min(1).max(250).regex(/^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[\w./-]+$/),
    symbol: text.max(200).nullable(),
    statement: text.nullable(),
  }),
  assumptions: z.array(text).max(30),
  limitations: z.array(text).max(30),
  license: z.strictObject({ spdx: text.max(100), url: httpsUrl, attribution: text }),
  owners: list,
  project: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
  updated: date,
  reuse: text,
  project_details: z.strictObject({
    status: z.enum(['active', 'maintenance', 'archived', 'unknown']),
    issues: httpsUrl,
    contributing: httpsUrl,
    opportunities: z.array(text).max(30),
    contents: list.optional(),
    documentation: httpsUrl.optional(),
    setup: text.optional(),
  }).optional(),
}).superRefine((record, ctx) => {
  if (record.kind === 'project' && !record.project_details) ctx.addIssue({ code: 'custom', message: 'Projects require contribution details', path: ['project_details'] });
  if (record.kind !== 'project' && (!record.source.symbol || !record.source.statement)) ctx.addIssue({ code: 'custom', message: 'Artifacts require an exact symbol and statement', path: ['source'] });
});

const reference = z.strictObject({ by: text.max(160), date, url: httpsUrl, notes: text });
export const decisionSchema = z.strictObject({
  id: recordSchema.shape.id,
  record_version: z.int().positive(),
  record_digest: digest,
  publication: z.enum(['proposed', 'under_review', 'accepted', 'withdrawn']),
  approval: reference,
  freshness: z.strictObject({ status: z.enum(['pinned', 'stale', 'unknown']), checked: date.nullable(), notes: text }),
  mechanical: z.strictObject({
    status: z.enum(['not_checked_by_us', 'upstream_reported', 'checked_at_pinned_revision']),
    reference: reference.nullable(),
    checker: text.nullable(),
    source_revision: sha.nullable(),
    proof_digest: digest.nullable(),
    axioms: z.array(text).max(20).nullable(),
    reports: z.array(z.strictObject({
      origin: z.enum(['upstream', 'ohara', 'community']),
      result: z.enum(['pass', 'fail', 'inconclusive']),
      scope: text,
      source_revision: sha,
      reference,
    })).max(20).optional(),
  }),
  semantic: z.strictObject({ status: z.enum(['unreviewed', 'maintainer_reviewed', 'qualified_expert_reviewed']), reference: reference.nullable(), qualification: text.nullable() }),
  implementation: z.strictObject({ status: z.enum(['none', 'claimed', 'independently_evidenced']), reference: reference.nullable(), scope: text }),
}).superRefine((decision, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (decision.mechanical.status !== 'not_checked_by_us' && !decision.mechanical.reference) fail('Mechanical claims require a check reference');
  if (decision.mechanical.status === 'checked_at_pinned_revision' && (!decision.mechanical.checker || !decision.mechanical.source_revision || !decision.mechanical.proof_digest || !decision.mechanical.axioms)) fail('Independent check requires checker, revision, package digest, and inspected axioms');
  if (decision.semantic.status !== 'unreviewed' && !decision.semantic.reference) fail('Semantic review requires an identified review');
  if (decision.semantic.status === 'qualified_expert_reviewed' && !decision.semantic.qualification) fail('Expert review requires a stated qualification');
  if (decision.implementation.status !== 'none' && !decision.implementation.reference) fail('Implementation claims require evidence');
});

export type RecordEntry = z.infer<typeof recordSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type PublishedRecord = RecordEntry & { record_digest: string; source_url: string; evidence: Decision };
export type Catalogue = { schema_version: 1; snapshot_id: string; source_commit: string; records: PublishedRecord[] };
