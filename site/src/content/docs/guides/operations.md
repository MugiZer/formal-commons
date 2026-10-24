---
title: Operations and limits
description: Publication, trust boundaries, corrections, and rollback.
---

The repository is the canonical registry. Validated records and maintainer decisions produce a deterministic snapshot bundled with the Worker and Starlight site. Requests do not depend on GitHub availability, a database, or live upstream builds.

Publication builds and checks the entire release before deployment. A failed validation or build does not replace the running Worker. Cloudflare version rollback restores code and static assets together. Operators should compare `/health` and `/registry.json` after each release and rehearse the rollback procedure in `docs/OPERATIONS.md`.

Fork pull requests receive read-only metadata and build checks without deployment secrets. Arbitrary proof submissions are not automatically executed. Maintained sample proofs run only in a separate trusted workflow on the published branch, with a time limit and no deployment secrets.

The site escapes contributed text as plain text and validates HTTPS source links. MCP results identify contributor-authored fields as untrusted data. Public requests are bounded, and no tool can invoke a shell, fetch an arbitrary URL, or mutate the registry. Service logs contain path, status, duration and error codes, not query text or submitted source code.

Beta limits: a small curated catalogue, keyword ranking, one narrowly checked Lean package, no automated semantic certification, and no universal security or availability guarantee. External project builds and applicability to arbitrary software remain outside the beta. Hosting protections and monitoring must be verified in the operator’s actual account; configuration files alone do not enable them.
