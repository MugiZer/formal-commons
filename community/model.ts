import { z } from 'zod';
import { httpsUrl, kinds, recordSchema } from '../registry/schema';

const optionalText = z.string().trim().max(6000).default('');
const optionalUrl = z.union([z.literal(''), httpsUrl]).default('');
export const proposalSchema = z.strictObject({
  title: z.string().trim().min(1).max(160),
  kind: z.enum([...kinds, 'idea', 'correction']),
  summary: z.string().trim().max(600).default(''),
  proof_system: z.string().trim().max(100).default(''),
  repository: optionalUrl,
  source_revision: z.union([z.literal(''), z.string().regex(/^[a-f0-9]{40}$/)]).default(''),
  path: z.string().max(250).default(''),
  symbol: z.string().max(200).default(''),
  statement: optionalText,
  assumptions: optionalText,
  limitations: optionalText,
  license: z.string().max(100).default(''),
  license_url: optionalUrl,
  attribution: optionalText,
  record_id: z.union([z.literal(''), recordSchema.shape.id]).default(''),
  record_version: z.int().min(1).max(10000).default(1),
  project: z.union([z.literal(''), recordSchema.shape.project]).default(''),
  owners: optionalText,
  tags: z.string().max(1000).default(''),
  reuse: optionalText,
  project_status: z.enum(['active', 'maintenance', 'archived', 'unknown']).default('unknown'),
  issues: optionalUrl,
  contributing: optionalUrl,
  opportunities: optionalText,
  contents: optionalText.optional(),
  documentation: optionalUrl.optional(),
  setup: optionalText.optional(),
  evidence: optionalText,
  target_record: z.string().max(200).default(''),
});
export type Proposal = z.infer<typeof proposalSchema>;
export const blankProposal = proposalSchema.parse({
  title: 'Untitled contribution',
  kind: 'theorem',
});
export const states = [
  'draft',
  'submitted',
  'in_review',
  'changes_requested',
  'approved',
  'published',
  'rejected',
  'withdrawn',
] as const;
export type ContributionState = (typeof states)[number];
export const lines = (text: string) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

export function publicationRecord(proposal: Proposal, date: string) {
  return recordSchema.safeParse({
    schema_version: 1,
    id: proposal.record_id,
    record_version: proposal.record_version,
    kind: proposal.kind,
    title: proposal.title,
    summary: proposal.summary,
    tags: proposal.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    proof_system: proposal.proof_system,
    source: {
      repository: proposal.repository,
      revision: proposal.source_revision,
      path: proposal.path,
      symbol: proposal.symbol || null,
      statement: proposal.statement || null,
    },
    assumptions: lines(proposal.assumptions),
    limitations: lines(proposal.limitations),
    license: {
      spdx: proposal.license,
      url: proposal.license_url,
      attribution: proposal.attribution,
    },
    owners: lines(proposal.owners),
    project: proposal.project,
    updated: date,
    reuse: proposal.reuse,
    ...(proposal.kind === 'project'
      ? {
          project_details: {
            status: proposal.project_status,
            issues: proposal.issues,
            contributing: proposal.contributing,
            opportunities: lines(proposal.opportunities),
            ...(proposal.contents ? { contents: lines(proposal.contents) } : {}),
            ...(proposal.documentation ? { documentation: proposal.documentation } : {}),
            ...(proposal.setup ? { setup: proposal.setup } : {}),
          },
        }
      : {}),
  });
}

export const verificationSchema = z
  .strictObject({
    revision: z.string().regex(/^[a-f0-9]{64}$/),
    phase: z.enum(['request', 'offer', 'report']),
    scope: z.enum(['mechanical', 'semantic', 'implementation', 'freshness']),
    method: z.string().trim().min(1).max(6000),
    result: z.enum(['pending', 'pass', 'fail', 'inconclusive']),
    checker: z.string().max(200).default(''),
    evidence_url: optionalUrl,
    findings: optionalText,
    limitations: optionalText,
  })
  .superRefine((v, ctx) => {
    if (v.phase === 'report' && (v.result === 'pending' || !v.findings || !v.evidence_url))
      ctx.addIssue({
        code: 'custom',
        message: 'Reports need a result, findings and an HTTPS evidence link.',
      });
    if (v.phase !== 'report' && v.result !== 'pending')
      ctx.addIssue({ code: 'custom', message: 'Only a report can claim a result.' });
  });
export type Verification = z.infer<typeof verificationSchema>;
export type CommunityUser = { id: string; name: string; image?: string | null };
export type Contribution = {
  id: string;
  author_id: string;
  author: string;
  digest: string;
  revision: number;
  state: ContributionState;
  data: Proposal;
  created_at: string;
  updated_at: string;
  revision_created_at: string;
  publication_url: string | null;
  published_record: string | null;
};
export type VerificationEntry = Verification & {
  id: string;
  author_id: string;
  author: string;
  created_at: string;
  decision: 'pending' | 'accepted' | 'changes_requested';
  reviewer?: string;
  reason?: string;
};
export type Activity = {
  id: string;
  author_id: string;
  author: string;
  kind: string;
  body: string;
  revision: string;
  created_at: string;
  hidden: number;
};
export type ContributionDetail = {
  contribution: Contribution;
  revisions: { digest: string; revision: number; data: Proposal; created_at: string }[];
  verification: VerificationEntry[];
  activity: Activity[];
};
