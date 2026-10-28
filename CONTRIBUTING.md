# Contributing

Use the site's proposal forms or `.github/ISSUE_TEMPLATE/` for a specification, theorem, component, project, or correction. You may propose useful behavior without already having a proof. Share only public material you are entitled to publish.

## Prepare a record

Copy the shape of a record in `registry/records/` and consult `schemas/record.v1.schema.json`. Give it a stable `namespace/name` ID and `record_version: 1`. Pin the GitHub source to a full commit SHA. Include the exact symbol and formal statement for every artifact, behavior-oriented summary, assumptions, known limits, license and attribution, source owners and associated project. Project records include upstream contribution opportunities.

Records contain no `verified`, evidence or approval fields. A proposed record with no maintainer decision is valid metadata but will not enter the published snapshot. Keep unfamiliar optional information unknown; do not invent checker results or reviews.

```sh
npm ci
npm run registry:build
npm test
```

If modifying a previously published artifact, add a new file with a larger record version. Keep old files unchanged. Do not add executable code to a metadata submission. Original Lean additions receive a separate trusted review and check process; fork PRs do not execute arbitrary submitted proofs.

## Catalogue copy and evidence

Write overviews for people choosing and using a project. Explain its purpose, contents, setup and useful upstream links. Keep exact theorem hypotheses beside the formal statement.

Use Ohara in current copy. Empty assumptions, limitations and contribution-opportunity arrays are valid. Do not add generic cautions such as "a project link does not establish verification" or "we have not independently reproduced the build" to fill a section. Record check results and missing verification in Evidence, without repeating them in the overview or reuse instructions.

Attribute upstream results to their source commit, actual run, selected jobs and covered targets. Keep upstream verification, Ohara checks and community reports separate. A workflow definition records a method; a completed check records its actual scope. A consumer build records that consumer's scope. Human and expert review labels require the identified review.

People and agents use the same versioned catalogue data. Publish a new record version for changed facts or copy. Preserve historical files and digests.

## Maintainer publication review

1. Inspect the pinned source and license. Compare the formal statement with the summary, boundary cases, hypotheses and limitations.
2. Distinguish metadata curation, human semantic judgment, upstream reports, actual independent mechanical checks, and implementation correspondence. Passing CI is not semantic review. Keep all unsupported dimensions at their default status.
3. Record publication rationale and the exact PR/review URL. The helper writes an accepted discovery decision with conservative evidence defaults:

   ```sh
   npm run approve -- registry/records/namespace--name--1.json "Identified maintainer" https://github.com/OWNER/REPOSITORY/pull/NUMBER "Scope and approval rationale"
   ```

4. Any stronger evidence status must reference an actual check or identified review at the same version. Independently checked mechanical evidence requires a precise checker version, source revision, package digest, inspected axioms and log. A verified component requires independently evidenced implementation correspondence.
5. A qualified-expert semantic label requires an identified appropriately qualified reviewer and a stated qualification. The founder is not an expert reviewer by default. Automated curation must be labeled as automated.
6. Run validation, inspect the diff and protected decisions, and use the protected PR/review path. `CODEOWNERS` requires repository branch rules to have enforcement. Only merge approved records into the published branch.

The helper records a local decision; it does not bypass branch protection or independently prove the claim. Contributors must not modify protected decisions to approve themselves.

## Correction and withdrawal

Report the stable ID, digest/source revision and problem. Prefer a new record version with corrected assumptions or limits. A maintainer may mark the latest decision `withdrawn` or its freshness `stale`, with an identified reason in the decision notes. It then leaves default discovery; exact retrieval still exposes it with its warning. Old snapshots in Git history and release artifacts remain inspectable. Downstream downloaded results cannot be erased.
