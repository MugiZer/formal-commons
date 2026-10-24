# Delivery status — 24 October 2026

The complete local beta implementation is working. Public launch is pending account setup; this is not a claim that all public-beta acceptance tests have passed.

Local site: `http://127.0.0.1:8787/` while the development Worker is running. MCP: `http://127.0.0.1:8787/mcp`. Shared snapshot: `/registry.json`. Health: `/health`.

Snapshot: `fc348a2252e79db4ef27390a13a9382f8d9b5d6daf6cb92e511352f7fe65f535` — one precise Lean theorem and three pinned upstream projects. Bootstrap publication is explicitly automated curation; all upstream entries retain `not_checked_by_us`, `unreviewed`, and no implementation correspondence.

## Observed validation

- Ten automated registry/evidence tests pass: strict schema rejection, contributor evidence forgery, draft exclusion, digest-bound approval, unsupported check/expert claims, deterministic snapshots, bounded pagination, stale/withdrawn suppression and historical retrieval, failed publication preserving prior bytes, and restoration.
- TypeScript checking and Starlight static builds pass. The production Worker bundles successfully in Wrangler dry run. These are local checks, not completed GitHub Actions runs.
- The actual HTTP MCP SDK client passed handshake, tool listing, behavioral search, exact retrieval, assumptions and limitations, snapshot parity, malformed/oversized/unknown inputs, unsupported methods and origin rejection.
- The actual local Worker returned 408 for an unfinished body and 429 on the 61st bounded rate-limit probe, with `Retry-After: 60`. See `evidence/runtime-boundaries.json`; this is not a production load test.
- Lean 4.35.0 built the maintained contract and importing consumer. Generated axiom inspection found only `propext` in the listed declarations. See `evidence/lean-check.json` for exact scope and package digest. No semantic judgment follows from that result.
- Official Codex CLI 0.164.0, GPT-6.1 Sol at max effort, searched the live local MCP and retrieved the exact pinned theorem with evidence caveats. Its returned Lean reuse example was then checked successfully with Lean 4.35.0. See `evidence/external-codex.md` and `evidence/external-client.json`. The older app-bundled CLI rejected that model; the workspace-local current release resolved it.
- Every curated pinned source, license and contribution link returned HTTP 200. The seL4 entry distinguishes CC-BY-SA documentation from per-file proof/tool licenses.
- Browser checks covered catalogue navigation, live empty-result announcements, checked-only evidence filtering, visible statements/assumptions/provenance, correct connection URLs, and reflow at 320 CSS pixels without page overflow. Desktop and mobile preview images are saved in `evidence/`. A full assistive-technology audit has not been performed.
- npm reports zero vulnerabilities after a compatible pinned override for the development server's undici dependency. GitHub YAML parsed successfully and workflows declare read-only repository permissions.
- The required ponytail review was applied to the current diff and its findings addressed; see `evidence/ponytail-review.md`.

## Acceptance tests that still require real account / human participation

1. A public newcomer opening and submitting the real GitHub proposal form. Forms and the local contribution guide are implemented; no public repository URL is claimed.
2. Observing a fork PR fail checks, then an identified maintainer approve and merge a valid proposal through enforced branch protection. Local equivalents pass; GitHub protection and review have not been enabled or observed.
3. A public deployment with the same site/MCP snapshot, an external client against that public URL, production monitoring, and an actual Cloudflare version rollback. The local failed-build / restoration rehearsal passed; live rollback has not been performed.
4. Human semantic review, any qualified expert review, or independent rebuilding of entire external projects. No such status is asserted. Optional stronger bundled Windows recheckers did not succeed; see `evidence/rechecker-notes.md`.

## Publication setup

The user explicitly approved public repository creation and Cloudflare sign-in on 24 October 2026. The public repository was created and read back successfully: https://github.com/MugiZer/formal-commons. GitHub CLI access is authenticated as MugiZer. The earlier automatic approval rejection is resolved by that explicit authorization.

Cloudflare is not yet authenticated. A Wrangler device sign-in was started with account/user read access, Worker script deployment and Worker log access. Browser controls are unavailable in the resumed session, so the owner was given the official device authorization link and temporary code. No paid plan or broader service permissions have been requested.

The initial reviewed source still needs pushing, real branch and production-environment protections must be read back, and GitHub CI must be observed. Public deployment, public MCP smoke checks, and live Cloudflare rollback remain pending Cloudflare access. An independent human reviewer is still needed for the complete community acceptance rehearsal; automated bootstrap curation is not human semantic or expert review.

All code, proof packages, templates, operating instructions and local evidence are in this dedicated repository. No unrelated repository was overwritten. README.md, CONTRIBUTING.md and docs/OPERATIONS.md contain the runnable commands and review/publication process.
