import Pattern

namespace OharaPattern

theorem reverse_involutive {α : Type u} : Involutive (@List.reverse α) :=
  List.reverse_reverse

theorem map_not_involutive : Involutive (List.map Bool.not) := by
  intro xs
  induction xs with
  | nil => rfl
  | cons x xs ih => simp [ih]

theorem reverse_map_not_involutive :
    Involutive (List.reverse ∘ List.map Bool.not) :=
  comp_involutive List.reverse (List.map Bool.not)
    reverse_involutive map_not_involutive (fun _ => List.map_reverse)

#check List.reverse
#check List.reverse_reverse
#print List.reverse
#print List.reverseAux
#print List.reverse_reverse
#print List.reverseAux_reverseAux_nil
#print List.map_reverse
#print List.map_map
#print axioms List.reverse_reverse
#print axioms reverse_involutive
#print axioms map_not_involutive
#print axioms reverse_map_not_involutive

end OharaPattern
