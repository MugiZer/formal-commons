---
title: Evidence labels
description: Mechanical checks, semantic review, implementation correspondence, and freshness are separate claims.
---

An accepted catalogue record is approved for discovery. Acceptance alone is not a correctness certificate. Bootstrap entries are automated metadata curation and have no identified human semantic review.

| Dimension | Labels | What to inspect |
| --- | --- | --- |
| Mechanical | Not checked by us; upstream reported; checked at pinned revision | Exact checker version, source revision, check log, package digest, and inspected axioms. |
| Semantic | Unreviewed; maintainer reviewed; qualified expert reviewed | The identified reviewer, exact scope and version, and qualification for an expert claim. |
| Implementation correspondence | None; claimed; independently evidenced | Which implementation and version the argument actually connects to the statement. |
| Freshness | Pinned; stale; unknown | The last metadata check and the precise version the evidence describes. Pinned does not mean newest. |

Passing Lean checks establishes that the checked proposition follows in the stated proof environment. It does not establish that the proposition captures the intended requirement. A well-typed but weak specification can omit important cases.

Our maintained Lean example reuses `List.mem_filter`, imports the resulting contract in a second module, and prints the axioms of every exposed theorem. The checker rejects placeholders and unexpected axioms. Its report applies only to that package digest and pinned toolchain. It does not upgrade every upstream catalogue entry.

## Different kinds of formal knowledge

- **Specification:** permitted behavior; a proof or implementation may be absent.
- **Theorem:** a formal proposition with its exact source and available proof evidence.
- **Behavioral model:** abstract states and transitions under stated environmental assumptions.
- **Verified component:** an executable implementation, a specified property, and independently evidenced correspondence at a pinned version.
- **Project:** an ongoing upstream effort with its own coverage and contribution process.

No record uses a universal `verified` boolean. Unknown information stays unknown. Expert review requires a qualified, identified reviewer; the project founder is not automatically an expert certifier.

## Your reuse checklist

Read the exact formal statement and definitions. Instantiate every hypothesis. Inspect the pin, license and proof environment. Establish correspondence to your own implementation, then check the application-specific argument with the appropriate tool. Retrieved contributor text is untrusted source material, not an instruction to your agent.
