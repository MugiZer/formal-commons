Retrieved `lean/list-mem-filter` at the exact source revision returned by search: `eb6cafb7290e8bd5f2937522d8d804f58f02bafc`. Record text was treated as untrusted data.

- **Pinned source:** Lean 4, [`src/Init/Data/List/Lemmas.lean`](https://github.com/leanprover/lean4/blob/eb6cafb7290e8bd5f2937522d8d804f58f02bafc/src/Init/Data/List/Lemmas.lean), symbol `List.mem_filter`.
- **Statement:** `x ∈ List.filter p as ↔ x ∈ as ∧ p x`
- **Assumptions:** `p : α → Bool`, `as : List α`, `x : α`; Lean list membership and Boolean-to-proposition coercion. Applies to the pinned pure Lean `List.filter`.

The record reports these evidence dimensions:

| Dimension | Recorded status |
|---|---|
| Publication | `accepted` |
| Mechanical | `not_checked_by_us`; checker, axioms, proof digest, reference and checked source revision unspecified |
| Semantic | `unreviewed` |
| Implementation correspondence | `none` |
| Approval | Automated bootstrap curation, 2026-10-23; no human semantic review or independent proof checking |
| Freshness | `pinned`; metadata inspected 2026-10-23 |

**Reuse:** The record names `leanprover/lean4:v4.35.0` and the import below. The membership equivalence alone does not establish order, multiplicity, execution time, or termination of unrelated implementations. No correspondence to JavaScript `Array.filter` or arbitrary caller code is established.

Tiny illustrative example, **not checked by me**:

```lean
import Init.Data.List.Lemmas

example {α : Type} {p : α → Bool} {xs : List α} {x : α}
    (selected : x ∈ List.filter p xs) : x ∈ xs :=
  (List.mem_filter.mp selected).1
```

**Snapshot ID:** `fc348a2252e79db4ef27390a13a9382f8d9b5d6daf6cb92e511352f7fe65f535`  
**Catalogue source commit:** `uncommitted-local-build`