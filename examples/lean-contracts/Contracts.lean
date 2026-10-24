import Init.Data.List.Lemmas

namespace FormalCommons

def keep {α : Type} (predicate : α → Bool) (input : List α) : List α :=
  input.filter predicate

theorem keep_mem {α : Type} (predicate : α → Bool) (input : List α) (item : α) :
    item ∈ keep predicate input ↔ item ∈ input ∧ predicate item := by
  exact List.mem_filter

theorem keep_origin {α : Type} (predicate : α → Bool) (input : List α) (item : α)
    (member : item ∈ keep predicate input) : item ∈ input :=
  ((keep_mem predicate input item).mp member).1

end FormalCommons
