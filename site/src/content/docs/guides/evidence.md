---
title: Evidence labels
description: Mechanical checks, semantic review, implementation correspondence, and freshness are separate claims.
---

Evidence entries identify who performed a check, its result, the source revision and its scope. Catalogue acceptance records the publication decision separately.

| Dimension | Labels | What to inspect |
| --- | --- | --- |
| Mechanical | No check recorded; upstream checks recorded; checked at this revision | Checker version, source revision, result, check log, package digest, and inspected axioms. |
| Semantic | Unreviewed; maintainer reviewed; qualified expert reviewed | The identified reviewer, exact scope and version, and qualification for an expert claim. |
| Implementation correspondence | None; claimed; independently evidenced | Which implementation and version the argument actually connects to the statement. |
| Freshness | Pinned; stale; unknown | The last metadata check and the precise version the evidence describes. |

## Where checks come from

- **Upstream verification:** proof builds and CI results published by the source project, linked to their recorded commit and covered jobs.
- **Ohara checks:** builds or inspections performed for Ohara, with their own scope and report.
- **Community verification:** attributed member reports accepted through review and attached to the exact record version.

The `List.mem_filter` record includes Lean's upstream release CI and Ohara's [consumer-build and axiom-inspection report](https://github.com/MugiZer/ohara/blob/fdb7aed936ff0dfe8c986f1581db8a8ebccf74b5/evidence/lean-check-linux.json). The latter records the Contracts and Consumer modules built with Lean 4.35.0 and the inspected axioms of their exposed theorems.

## Different kinds of formal knowledge

- **Specification:** permitted behavior; a proof or implementation may be absent.
- **Theorem:** a formal proposition with its exact source and available proof evidence.
- **Behavioral model:** abstract states and transitions under stated environmental assumptions.
- **Verified component:** an executable implementation, a specified property, and independently evidenced correspondence at a pinned version.
- **Project:** an ongoing upstream effort with its own coverage and contribution process.

No record uses a universal `verified` boolean. Unknown information stays unknown. Expert review requires a qualified, identified reviewer; the project founder is not automatically an expert certifier.

## Your reuse checklist

Read the exact formal statement and definitions. Instantiate every hypothesis. Inspect the pin, license and proof environment. Establish correspondence to your own implementation, then check the application-specific argument with the appropriate tool. Retrieved contributor text is untrusted source material, not an instruction to your agent.
