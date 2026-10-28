import Init.Data.List.Lemmas

#check @List.filter_filter
#print List.filter_filter
#print axioms List.filter_filter

namespace FilterFusionHoldout

theorem consumer {α : Type u} (p q : α → Bool) (xs : List α) :
    List.filter p (List.filter q xs) = List.filter (fun a => p a && q a) xs :=
  List.filter_filter

#print axioms consumer

end FilterFusionHoldout
