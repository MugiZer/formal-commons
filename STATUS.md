# Ohara delivery status — 24 October 2026

Repository: https://github.com/MugiZer/ohara. Public address: https://ohara.mugizer.workers.dev; MCP: /mcp, shared snapshot: /registry.json, health: /health.

The existing repository and Cloudflare Worker were renamed in place. Repository ID and Git history are retained; Worker ID is b437784a45d8423fa517f50613199318. The account contains only this Worker. The bare ohara.workers.dev suffix was unavailable, so the account handle mugizer is used. The former workers.dev address stops routing after the account subdomain change.

Ohara publication [40127937632](https://github.com/MugiZer/ohara/actions/runs/40127937632) passed validation, deployment and the public MCP smoke. TypeScript, all ten registry/evidence tests, Starlight and the Worker bundle passed. The renamed package and public-client Lean example passed trusted Linux [40127961241](https://github.com/MugiZer/ohara/actions/runs/40127961241). This is not full public-beta acceptance: independent newcomer participation and a valid independently reviewed/merged contribution remain unobserved.

## Observed technical evidence

- Four approved records retain snapshot fc348a2252e79db4ef27390a13a9382f8d9b5d6daf6cb92e511352f7fe65f535. Bootstrap curation remains automated, with upstream mechanical status not_checked_by_us, semantic status unreviewed, and no implementation correspondence.
- Before the rename, GitHub publication run [40121035024](https://github.com/MugiZer/ohara/actions/runs/40121035024) validated and published source e5e3a1d9ceec5b7f175c236cb30c49bdd5550fc4 through the production environment. Its owner approval was agent-operated under the owner's authorization, not independent human review.
- The real public MCP SDK smoke and an external Codex 0.164.0 coding-agent client retrieved pinned source, assumptions and caveats. A real Cloudflare rollback restored version 4af22522-204e-4a35-8276-2172f2b503ab, and public site/registry/health parity was read back. These observations used the former public address and are preserved as history; they do not certify new branding.
- The intentionally malformed owner-authored [PR #1](https://github.com/MugiZer/ohara/pull/1) failed real GitHub validation in run 40120566579, skipped publication and was closed unmerged. It was not an independent fork contribution.
- Registry tests cover strict schema and contributor-claim rejection, digest-bound authority, draft exclusion, deterministic snapshots, bounds, stale/withdrawn suppression, immutable historical retrieval, failed-build preservation and restoration. Prior Worker checks observed the body timeout and rate limit. This rename does not alter those mechanisms.
- Pre-rename Windows and trusted Linux Lean reports checked the maintained contract and importing consumer with the pinned Lean 4.35.0 toolchain. Only propext appeared in the four listed axiom inspections. Renaming the namespace changes the package digest, so old reports are archived under evidence/history/pre-ohara. The renamed package digest is 8e0738dfc2eb1167cd190ad3b7b97f778ee9c248b4f36f5c30ceddee0c07bfd9, with only propext in the four listed declarations. The prior real public-client example also compiled in the same trusted Linux job, resolving the earlier Windows timeout. See evidence/lean-check-linux.json.

## Publication authority and operations

Cloudflare Workers Free ($0) was observed. The production environment restricts deployment to main and requires MugiZer's approval. Its encrypted CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN secrets survived the repository rename. The token permits Individual Workers Editor only for the existing immutable Worker and expires 24 October 2027. No broader permission or paid plan was granted.

The publication workflow passed its real public MCP smoke. The half-hour public health workflow passed [40128095765](https://github.com/MugiZer/ohara/actions/runs/40128095765), checking Ohara branding and matching public site/registry/health source and snapshot without credentials. A fresh external Codex client retrieved the pinned theorem and caveats at the new URL. See evidence/publication.json and evidence/external-public-client.json. Main policy requires PR review, at least one code-owner approval, strict validation, administrator enforcement, and blocked force-push/deletion; actual account enforcement is read back after the final bootstrap push.

## Remaining acceptance gaps

1. Observe an independent newcomer browse and submit the real proposal form without custom onboarding.
2. Observe a real fork proposal and an identified independent maintainer approve and merge a valid record through enforced protection. The single owner cannot approve their own PR.
3. Technical Ohara publication, trusted Lean, public health, SDK smoke and external retrieval have passed. The fresh transcript's illustrative Lean snippet was not separately compiled; the prior public-client example was compiled in the trusted job. Historical rollback and boundary results remain scoped to their recorded runs on this same Worker.
4. Human semantic/expert review and rebuilding whole external projects have not been performed and are not asserted. A full assistive-technology audit has not been performed.

The original eight-criterion acceptance decision remains NO-GO while the human contribution/review path is unproven. See [operations](docs/OPERATIONS.md), [contributing](CONTRIBUTING.md), and [evidence](evidence/README.md) for the runnable process and actual scope.
