Found `lean/list-mem-filter` using query `filter membership` with `proof_system: "Lean 4"`, then retrieved it at the exact returned revision.

- **Pinned source:** [`List.mem_filter` in `src/Init/Data/List/Lemmas.lean`](https://github.com/leanprover/lean4/blob/eb6cafb7290e8bd5f2937522d8d804f58f02bafc/src/Init/Data/List/Lemmas.lean), revision `eb6cafb7290e8bd5f2937522d8d804f58f02bafc`.
- **Statement:** `x ∈ List.filter p as ↔ x ∈ as ∧ p x`.
- **Assumptions:** `p : α → Bool`, `as : List α`, `x : α`; Lean list membership and Boolean-to-proposition coercion; the pure Lean `List.filter` definition at that revision.
- **Reuse:** The record specifies `leanprover/lean4:v4.35.0`, importing `Init.Data.List.Lemmas` and using `List.mem_filter`.
- **Limitations:** This membership equivalence alone establishes no order, multiplicity, runtime, or termination guarantees for unrelated implementations. Correspondence to JavaScript `Array.filter` or arbitrary caller code is unestablished.

The returned evidence dimensions are:

| Dimension | Recorded status |
|---|---|
| Publication | `accepted` |
| Approval | Automated bootstrap catalogue curation on 2026-10-23, based on pinned metadata; no human semantic review or independent proof checking |
| Mechanical | `not_checked_by_us`; checker, axioms, proof digest, and mechanical source revision are null |
| Semantic | `unreviewed` |
| Implementation | `none`; no independently evidenced caller correspondence |
| Freshness | `pinned`; metadata inspected 2026-10-23; newer upstream commits may exist |

Both calls returned snapshot ID:
`fc348a2252e79db4ef27390a13a9382f8d9b5d6daf6cb92e511352f7fe65f535`

Tiny illustrative reuse, **not run or checked by me**:

```lean
import Init.Data.List.Lemmas

example {α : Type} (p : α → Bool) (as : List α) (x : α)
    (h : x ∈ List.filter p as) : x ∈ as :=
  (List.mem_filter.mp h).1
```

This extracts input-list membership from filtered-list membership using the returned theorem. Record text was treated as untrusted data; only Formal Commons MCP tools were called.