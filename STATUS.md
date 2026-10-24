# Delivery status — 24 October 2026

The beta implementation is published at https://github.com/MugiZer/formal-commons and its GitHub checks pass. Public hosting is pending Cloudflare sign-in; this is not a claim that all public-beta acceptance tests have passed.

Local site: `http://127.0.0.1:8787/` while the development Worker is running. MCP: `http://127.0.0.1:8787/mcp`. Shared snapshot: `/registry.json`. Health: `/health`.

Snapshot: `fc348a2252e79db4ef27390a13a9382f8d9b5d6daf6cb92e511352f7fe65f535` — one precise Lean theorem and three pinned upstream projects. Bootstrap publication is explicitly automated curation; all upstream entries retain `not_checked_by_us`, `unreviewed`, and no implementation correspondence.

## Observed validation

- Ten automated registry/evidence tests pass: strict schema rejection, contributor evidence forgery, draft exclusion, digest-bound approval, unsupported check/expert claims, deterministic snapshots, bounded pagination, stale/withdrawn suppression and historical retrieval, failed publication preserving prior bytes, and restoration.
- TypeScript checking and Starlight static builds pass. The production Worker bundles successfully in Wrangler dry run. The real GitHub validation job also passed schema drift, TypeScript, all ten tests, Starlight build and Worker bundling; its release artifact was downloaded and passed the exact prebuilt deployment dry run. See evidence/github-validation.json.
- The actual HTTP MCP SDK client passed handshake, tool listing, behavioral search, exact retrieval, assumptions and limitations, snapshot parity, malformed/oversized/unknown inputs, unsupported methods and origin rejection.
- The actual local Worker returned 408 for an unfinished body and 429 on the 61st bounded rate-limit probe, with `Retry-After: 60`. See `evidence/runtime-boundaries.json`; this is not a production load test.
- Lean 4.35.0 built the maintained contract and importing consumer. Generated axiom inspection found only `propext` in the listed declarations. See `evidence/lean-check.json` for exact scope and package digest. The trusted GitHub Lean workflow also passed on Linux with the identical package digest and axiom sets; see evidence/lean-check-linux.json. No semantic judgment follows from these results.
- Official Codex CLI 0.164.0, GPT-6.1 Sol at max effort, searched the live local MCP and retrieved the exact pinned theorem with evidence caveats. Its returned Lean reuse example was then checked successfully with Lean 4.35.0. See `evidence/external-codex.md` and `evidence/external-client.json`. The older app-bundled CLI rejected that model; the workspace-local current release resolved it.
- Every curated pinned source, license and contribution link returned HTTP 200. The seL4 entry distinguishes CC-BY-SA documentation from per-file proof/tool licenses.
- Browser checks covered catalogue navigation, live empty-result announcements, checked-only evidence filtering, visible statements/assumptions/provenance, correct connection URLs, and reflow at 320 CSS pixels without page overflow. Desktop and mobile preview images are saved in `evidence/`. A full assistive-technology audit has not been performed.
- npm reports zero vulnerabilities after a compatible pinned override for the development server's undici dependency. GitHub YAML parsed successfully and workflows declare read-only repository permissions.
- The required ponytail review was applied to the current diff and its findings addressed; see `evidence/ponytail-review.md`.

## Acceptance tests that still require real account / human participation

1. A public newcomer opening and submitting the real GitHub proposal form. The proposal and correction forms and contribution guide are published in the real GitHub repository; an independent newcomer walkthrough has not been observed.
2. Observing a fork PR fail checks, then an identified maintainer approve and merge a valid proposal through enforced branch protection. The deliberately malformed owner-run draft PR #1 failed real GitHub metadata validation and skipped publication; it was closed without merging. A fork-based contribution and independent human approval/merge have not been observed.
3. A public deployment with the same site/MCP snapshot, an external client against that public URL, production monitoring, and an actual Cloudflare version rollback. The local failed-build / restoration rehearsal passed; live rollback has not been performed.
4. Human semantic review, any qualified expert review, or independent rebuilding of entire external projects. No such status is asserted. Optional stronger bundled Windows recheckers did not succeed; see `evidence/rechecker-notes.md`.

## Publication setup

The user explicitly approved public repository creation and Cloudflare sign-in on 24 October 2026. The public repository was created, read back, and the reviewed source pushed: https://github.com/MugiZer/formal-commons. GitHub CLI access is authenticated as MugiZer. The earlier automatic approval rejection is resolved by that explicit authorization.

The production GitHub Environment was configured and read back: only main may deploy, and MugiZer must approve the deployment. The successful validation run is waiting at that gate. No Cloudflare deployment secrets have been configured. Main must retain required validation, a pull request, a code-owner approval and protections against force pushes/deletion; inspect live branch settings for current enforcement. A second identified maintainer is needed to independently approve owner-authored PRs.

Cloudflare CLI authorization has not completed. Device sign-in attempts expired while the browser remained at sign-in. Browser controls recovered, and the actual screen offers the saved Google profile with a notice that continuing accepts Cloudflare terms. Specific confirmation or completion of that sign-in was requested; no new terms were accepted by the agent. Account free-plan status, durable deployment credentials, public hosting and live rollback remain unobserved. No paid plan or broader service permissions have been requested.

All code, proof packages, templates, operating instructions and observed check evidence are in this dedicated repository. The negative-test fixture exists only on its closed, unmerged rehearsal branch. README.md, CONTRIBUTING.md and docs/OPERATIONS.md contain the runnable commands and review/publication process.
