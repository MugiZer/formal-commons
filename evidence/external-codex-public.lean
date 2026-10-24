import Init.Data.List.Lemmas

example {α : Type} (p : α → Bool) (as : List α) (x : α)
    (h : x ∈ List.filter p as) : x ∈ as :=
  (List.mem_filter.mp h).1
