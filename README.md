# Ohara

[Live catalogue](https://ohara.mugizer.workers.dev) · [Public MCP](https://ohara.mugizer.workers.dev/mcp)

[Public repository](https://github.com/MugiZer/ohara) · [Delivery status](STATUS.md)

An open formal knowledge catalogue for coding agents and people. Discover a precise statement, inspect its pinned evidence and assumptions, then establish applicability to your own implementation.

The beta has three read-only MCP tools, an Astro and React site, a strict GitHub registry, digest-bound publication decisions, contribution forms, and a small actual Lean reuse example. It does not adapt proofs to arbitrary code, certify semantic intent, or independently verify whole upstream projects. Community accounts and submissions are not enabled; contributions remain available through GitHub.

## Run locally

Requires Node 24.11 or later and npm. All direct dependencies and the lockfile are pinned.

```sh
npm ci
npm run build
npm run check
npm test
npm run dev
```

The Worker serves the site at `http://localhost:8787`, MCP at `/mcp`, health at `/health`, and the identical registry snapshot at `/registry.json`.

In a second terminal:

```sh
npm run smoke -- http://localhost:8787/mcp
```

The smoke client uses the separately maintained MCP client SDK over HTTP. It checks the real handshake, three tools, exact retrieval, assumptions, snapshot parity, malformed inputs, payload limits and browser origin rejection.

## Actual formal reuse

`examples/lean-contracts/Contracts.lean` imports the pinned core theorem `List.mem_filter`. It proves that members of a filtered list came from the input. `Consumer.lean` imports that contract and proves the property for selected job IDs. This is a pure Lean implementation; correspondence to a JavaScript or other external implementation is not claimed.

Install Lean using its [official instructions](https://lean-lang.org/install/), with `leanprover/lean4:v4.35.0` available. Then:

```sh
npm run lean:check
```

For a portable toolchain, set `LEAN_BIN` to its `bin` directory. The script requires the pinned version, builds both modules, rejects proof placeholders, inspects every listed theorem's axioms, and writes `evidence/lean-check.json`. Current reports and historical check scope are described in [evidence](evidence/README.md). Core `List.mem_filter` is imported and its axioms inspected; the whole upstream core was not independently rebuilt. Normal Lean logical axioms are explicitly allowlisted. No semantic or expert label follows from this check.

## Registry and authority

`registry/records/*.json` contains contributor metadata. `registry/schema.ts` is the authoritative strict validator; generated versioned JSON Schemas live in `schemas/`. JSON Schema captures structural constraints; additional cross-record and evidence checks run in TypeScript.

`reviews/decisions.json` is maintainer-controlled authority. Each decision binds an exact record digest to its publication, mechanical, semantic, implementation and freshness dimensions. Contributors cannot grant themselves a status by adding fields to a record. Changes to records invalidate prior approvals. Bootstrap decisions explicitly identify automated curation and leave semantic review unreviewed.

The deterministic builder excludes proposals and under-review records. Search uses the latest published version, excluding withdrawals and stale entries. Exact retrieval and static record permalinks preserve historical records. CI checks that previously published record files are not edited or removed.

```sh
npm run registry:build
npm run schema
npm run links:check
```

Link checks are an explicit operator step restricted to pinned GitHub sources. They are not live requests made by the public MCP. Ranking uses deterministic behavior keywords with title, tag and symbol weighting; there is no embedding service or claim of semantic equivalence.

## Publish

See [operations](docs/OPERATIONS.md) for real account setup, protected-branch requirements, publication, health checks and rollback. The site and MCP are deployed as one Cloudflare Worker with static assets. Validation finishes before deployment; a failed build preserves the previous release. No paid service, database, custom login, or live GitHub dependency is required by the implementation.

`PUBLIC_REPOSITORY_URL` enables real GitHub contribution links during a site build; CI derives it from the actual repository. Without it the local preview explicitly reports publication pending. The running site's agent page derives its endpoint from its own origin.

Do not mistake checked-in workflow or CODEOWNERS files for enabled protection. Branch rules, production-environment approval, Cloudflare credentials and monitoring must be configured and read back in the real accounts. See [delivery status](STATUS.md) for observed results and remaining blockers.

## Trust boundaries

- Public tools read an immutable bundled snapshot. They cannot execute proof code, mutate records, run shell commands, fetch arbitrary URLs, or read deployment credentials.
- Tool schemas reject unknown fields. Queries are capped at 256 characters, pages at 25 records, bodies at 16 KiB, and body reads at five seconds.
- The Worker applies Cloudflare's approximate per-location rate limiter: 60 MCP requests per minute per IP. Browser origins are validated by the maintained Cloudflare handler.
- Contributed text is rendered as escaped text. Returned contributor fields are marked as untrusted data; they never become authoritative tool-use instructions.
- Fork PRs receive read-only jobs without deployment secrets or proof execution. Trusted Lean checks are manually dispatched on `main`, separately from deployment credentials.
- Logs contain paths, status, duration and error codes. Queries and source code are not logged by application code. Cloudflare may retain platform request metadata under the operator's account settings.

The founder is a beginner in formal methods, not the default expert certifier. Semantic review requires identified human judgment. Expert review requires a qualified reviewer. Retrieval never establishes applicability to arbitrary caller code.

## Layout

```text
registry/       canonical metadata and validator
reviews/        protected digest-bound publication decisions
schemas/        generated record and decision JSON Schemas
scripts/        validation, snapshot, review, Lean and smoke commands
mcp/            Cloudflare stateless MCP service and shared search
site/           Astro and React catalogue and guides
examples/       pinned Lean contract and importing consumer
evidence/       observed checks and preserved historical reports
.github/        proposal forms, review ownership and safe workflows
```

## Attribution and prior art

The service follows the maintained [Cloudflare MCP Worker example](https://github.com/cloudflare/agents/tree/main/examples/mcp-worker). Interface attribution is recorded in [THIRD-PARTY.md](THIRD-PARTY.md). MCP v2 server and legacy-compatible client versions match the Agents release's peer requirements. The Lean action and GitHub Actions are pinned to inspected commit SHAs.

CSLib, Mathlib, LeanExplore, proof archives, and verified software communities already provide shared formal knowledge. This project adds curated discovery, evidence scope, and a community registry; it does not claim to invent proof libraries or theorem search. Large developments remain upstream. Every record carries source attribution and licensing; seL4's documentation and proof files have different licenses.

Project code and original sample content: MIT. Upstream material remains under its recorded licenses. This is separate from the Lean-only judged hackathon submission.
