---
title: Research results
description: Proofs, finite model checks and reusable patterns collected for Ohara.
---

Published 28 October 2026. The catalogue includes twelve new capabilities and their project sources. Each record links its exact statement, hypotheses and check evidence.

## Lean proofs and consumers

| Capability | Recorded result |
| --- | --- |
| [List mapping fusion](/records/lean/list-map-map/45eac37a7c6ef3a9583d1eb625d15ab1e327712f81c625d192574e175f782e09/) | Lean 4.35.0 consumer passed; selected axioms include propext. |
| [List filter fusion](/records/lean/list-filter-fusion/a137b5a721fb12fe7545c572a0278e5b6fc802c3227783498e7a1174a4a7de19/) | Fresh consumer passed with propext. The version probe was corrected separately. |
| [HashMap insert and lookup](/records/lean/hashmap-insert-lookup/b03c7f6eb1fb2349db1f0db599272c3dd133a07e025ae9df87e64044bd3ec75c/) | Wrapper and consumers passed. Axiom inspection recorded propext, Classical.choice and Quot.sound. |
| [Commuting involutions](/records/lean/commuting-involutions-compose/f2670e226054969b30addd2d7211288ac6de8de4da1e8057b865b8eb1cad4431/) | Abstract proof passed without axiom dependencies. The Boolean-list instance passed with propext. |

A [second consumer](/research/2026-10/lean/reuse/Use.lean) combines HashMap updates and applies the involution theorem to swapping and flipping Boolean-pair state. Its [retained check](/research/2026-10/lean/reuse/check.json) passed against the previously checked source/object pairs after a package correction. The Boolean-pair proof has no axiom dependencies.

[Download the Lean source instructions](/research/2026-10/lean/README.md) and [source/check digest manifest](/research/2026-10/manifest.json). Public log derivatives redact local machine paths; the manifest retains original and public digests.

## Patterns from upstream projects

| Project and capability | Recorded evidence |
| --- | --- |
| [Authorization is preserved by a sound policy slice](/records/cedar-policy/sound-policy-slice/38ab9a44246ef0a722bdd405bda9f89c99c0bd4502cc1edc9767ca4f10c21d36/) | Upstream compilation at exact SHA covers the selected policy-slicing modules. |
| [Word-by-word Montgomery addition preserves validity and modular sum](/records/fiat-crypto/wordbyword-addmod-validity/abe3f756cf8c2df91510efd15ee9cc15cac856215c00fa9842df306fae749d56/) | Matching CI build step summaries; selected job log unavailable, target/configuration coverage inconclusive. |
| [Carried limb multiplication preserves the modular product](/records/fiat-crypto/carry-mulmod-congruence/e2825d9712e6622a83592f4725454d849ff63371cfa809498138eaa69f7ab376/) | Matching CI build step summaries; selected job log unavailable, target/configuration coverage inconclusive. |
| [CapybaraKV persistent list append](/records/microsoft/capybara-list-append/e0a321d058dc98aced7d4966f342e5bea86bacaf0b0e9f07dcd6ac7502841a13/) | Matching CodeQL analysis succeeded; no selected Verus check is established. |
| [Perennial mutex ownership transfer](/records/tchajed/perennial-mutex-ownership/1e6f60cd1f0d26271c9dde5b1034fbf3b7cedd077c0f5557bad9af7c6d9cafc4/) | Both build jobs succeeded in an overall failed run; empty step arrays and missing logs leave theorem coverage inconclusive. |
| [Perennial crash-aware locked critical section](/records/tchajed/perennial-crash-critical-section/118e9930b558a724d1aabcd72e18c70caef64c94c84b82ecf9b4fae5c2aba941/) | Both build jobs succeeded in an overall failed run; empty step arrays and missing logs leave theorem coverage inconclusive. |
| [Dependent-length parser composition](/records/project-everest/lowparse-dependent-length/d3b1da1639f7510ae11b6037dff5cb604b165618fe690b1d349aea1626f35de5/) | Upstream non-admitted F* check discharged the selected LowParse module obligations; separate admitted build retained as compilation-only. |
| [Dijkstra mutual exclusion safety model](/records/tlaplus/dijkstra-mutex-safety/8bc153e7e712c66a74b4fe495400f7fe0c42162b331dfaf703d9365083fb0fbc/) | Local complete two-process and independent three-process finite safety checks. Current four-process CI smoke exploration is incomplete; historical output remains unmatched. |

## Completed finite model checks

The [Dijkstra mutual-exclusion model](/records/tlaplus/dijkstra-mutex-safety/8bc153e7e712c66a74b4fe495400f7fe0c42162b331dfaf703d9365083fb0fbc/) completed the following TLC 2.19 checks with the retained 1.7.4 checker distribution.

| Instance | Generated states | Distinct states | Queued at completion | Evidence |
| --- | ---: | ---: | ---: | --- |
| Two workers | 1,322 | 660 | 0 | [Result](/research/2026-10/tla/two-process/check.json), [output](/research/2026-10/tla/two-process/stdout.txt) |
| Three workers | 282,810 | 90,882 | 0 | [Result](/research/2026-10/tla/three-process/check.json), [output](/research/2026-10/tla/three-process/stdout.txt) |

Both checks completed without an error. Their exact models and configurations are downloadable beside each result. The four-process CI smoke observation remains incomplete.

## Pending research and evaluation

| Work | Current result |
| --- | --- |
| Mathlib Finset insertion/erasure | Source indexed. Selected-module coverage and replay remain open. |
| Dafny mutable map | Source specification retained. No matching run or local replay is recorded. |
| Concrete Cedar application | Required concrete request, policies, entities and slice premise remain open. |
| ResearchCommit application | Fixture prepared. Reference and fresh isolated consumer checks remain unrun. |
| Workflow comparison | Earlier pilot exposed setup and budget overruns. No controlled comparison or winner has been established. |

The new results reuse retained checks. This publication adds no new compiler or model-checker execution.
