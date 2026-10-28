import Init.Data.List.Lemmas

#check @List.map_map
#print List.map_map
#print List.map
#print List.map_nil
#print List.map_cons
#print axioms List.map_map

namespace ModularIndexConsumer

theorem fuse {α β γ : Type} (f : α → β) (g : β → γ) (xs : List α) :
    List.map g (List.map f xs) = List.map (g ∘ f) xs :=
  List.map_map

example : List.map (fun n : Nat => n * 2) (List.map (fun n => n + 1) [1, 2, 3]) =
    List.map ((fun n : Nat => n * 2) ∘ (fun n => n + 1)) [1, 2, 3] :=
  fuse _ _ _

example : List.map (fun n : Nat => n * 2) (List.map (fun n => n + 1) []) = [] := rfl

#print axioms ModularIndexConsumer.fuse
end ModularIndexConsumer

