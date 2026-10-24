# Operate the beta

Ohara is published at https://ohara.mugizer.workers.dev from https://github.com/MugiZer/ohara. Consult `STATUS.md` for observed publication, protection and monitoring evidence. Configuration alone does not establish enabled account controls.

## Establish publication authority

Create a public GitHub repository for this project and push the dedicated repository. Set `main` as the published branch. Enable a ruleset with pull requests, at least one approval, code owner review, dismissal of stale approvals, required `Validate registry and build` checks, and blocked force-push / deletion. Include administrators where the account supports it. Read the actual ruleset back; a CODEOWNERS file alone has no enforcement.

The single owner cannot supply an independent approval of their own PR. Recruit another maintainer for the ongoing review loop. Public-beta bootstrap metadata is explicitly automated and semantic-unreviewed; it must not be presented as a human expert review.

Create the `production` GitHub Environment, restrict it to `main`, and require an identified deployment reviewer. Store a scoped Cloudflare API token and the account ID as environment secrets named `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Use the minimum Worker deployment permissions documented in Cloudflare's current dashboard; do not commit credentials. Confirm the account's free-plan status before deployment; do not activate paid upgrades without owner approval.

`Publish approved snapshot` builds and validates without deploy secrets, uploads the already-built Worker and static assets, then deploys that exact artifact only from the production environment. It never uses `pull_request_target`. Proof checks are a separate manual main-only workflow with a time limit and no deploy secrets.

## Deploy and verify

For an operator already authenticated with Wrangler:

```sh
npm ci
npm run schema
npm run registry:build
npm run check
npm test
npm run build
npx wrangler deploy --dry-run --outdir release/worker
npm run deploy
```

Set `PUBLIC_REPOSITORY_URL` to the actual public repository URL for a local deployment. CI sets it from the real GitHub repository. On deployment, record the returned Worker URL, version ID, source commit and snapshot ID. Then run the independent HTTP client against the returned `/mcp` URL:

```sh
npm run smoke -- ACTUAL_DEPLOYED_MCP_URL
```

Read `/health`, `/registry.json` and the website footer and confirm identical snapshot IDs. Browse an artifact, its assumptions and exact source links; open a real proposal form without submitting synthetic public content. Test from an external Codex or Claude Code client. Only claim deployment and client integration after observing successful responses.

## Failure and rollback rehearsal

`npm test` injects a malformed record into a temporary registry, asserts that snapshot generation fails without changing the last good file, then restores the source and checks byte-for-byte recovery. It also tests stale/withdrawn suppression while exact historical retrieval remains available.

A build failure in the publishing job prevents deployment. After a defective successful release, use the actual Cloudflare version history:

```sh
npx wrangler deployments list
npx wrangler versions list
npx wrangler rollback ACTUAL_PRIOR_VERSION_ID --message "Reason for rollback"
```

Read health and smoke the endpoint again. Worker code and assets are versioned together. Never replace a snapshot pointer before validation; this beta has no mutable external pointer. Keep GitHub build artifacts (30-day retention) and Git history for provenance. A local failed-build rehearsal is not a live Cloudflare rollback rehearsal; record each separately in the delivery status.

## Monitor

The Worker emits structured path, response status, duration and error-code logs with 10% platform sampling. Check Cloudflare request errors / latency and GitHub failed validation, publication and trusted-proof runs. The `Public health` workflow runs every 30 minutes and on manual dispatch, checking `/health`, `/registry.json` and the site for matching source/snapshot identifiers and Ohara branding. GitHub reports failed runs through the owner's existing notification preferences; a separate paging integration is not configured. Record a successful workflow run before claiming the monitor operational. Application logs omit queries and source code; platform metadata retention is controlled by the hosting account.

Rate limiting is 60 requests per minute per IP per Cloudflare location. It is approximate and can group users behind the same NAT. The five-second body deadline and 16 KiB body limit bound parsing; search runs against bundled data with no network requests. Observe traffic before adjusting limits. There is no availability SLA or certification in this public beta.

## Add or correct knowledge

Follow `CONTRIBUTING.md`. Run live link checks only after reviewing the records; the command fetches only fixed raw GitHub paths with timeouts, not arbitrary contribution-provided hosts. Review semantic scope independently of mechanical CI. Rerun the trusted Lean workflow only for reviewed main-branch sample changes and retain its log, toolchain and package digest.
