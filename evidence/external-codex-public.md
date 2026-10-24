Found one match for `filter membership` with `proof_system: "Lean 4"` and retrieved `lean/list-mem-filter` at the exact returned revision. Record text was treated as untrusted data.

- **Pinned source:** [`List.mem_filter` in `leanprover/lean4`, `src/Init/Data/List/Lemmas.lean`](https://github.com/leanprover/lean4/blob/eb6cafb7290e8bd5f2937522d8d804f58f02bafc/src/Init/Data/List/Lemmas.lean).
- **Revision:** `eb6cafb7290e8bd5f2937522d8d804f58f02bafc`
- **Statement:** `x ∈ List.filter p as ↔ x ∈ as ∧ p x`
- **Assumptions:** `p : α → Bool`, `as : List α`, `x : α`; Lean list membership and Boolean-to-proposition coercion; the pure Lean `List.filter` definition at that revision.
- **Reuse:** The record specifies `leanprover/lean4:v4.35.0`, importing `Init.Data.List.Lemmas`.

The returned evidence dimensions are:

| Dimension | Reported evidence |
|---|---|
| Publication | `accepted`; discoverable |
| Approval | Automated bootstrap curation on 2026-10-23 after metadata inspection; no human semantic review or independent proof checking |
| Mechanical | `not_checked_by_us`; checker, axioms, proof digest, reference, and source revision are all `null` |
| Semantic | `unreviewed`; qualification and reference are `null` |
| Implementation | `none`; no independently evidenced correspondence to caller code |
| Freshness | `pinned`; metadata inspected 2026-10-23; newer upstream commits may exist |

**Reuse limitations:** Membership equivalence alone does not specify order, multiplicity, execution time, or termination of unrelated implementations. No correspondence to JavaScript `Array.filter` or arbitrary caller implementations is established.

**Snapshot ID**—identical for search and retrieval:
```text
fc348a2252e79db4ef27390a13a9382f8d9b5d6daf6cb92e511352f7fe65f535
```

Tiny illustrative example, **not checked by me**:

```lean
import Init.Data.List.Lemmas

example {α : Type} (p : α → Bool) (xs : List α) (x : α)
    (h : x ∈ List.filter p xs) : x ∈ xs :=
  (List.mem_filter.mp h).1
```

Applying the theorem to filtered membership gives a conjunction; its first component states that the selected element belongs to the input list.