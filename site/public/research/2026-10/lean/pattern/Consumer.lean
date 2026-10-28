import Concrete

open OharaPattern

example (xs : List Bool) :
    (List.reverse ∘ List.map Bool.not) ((List.reverse ∘ List.map Bool.not) xs) = xs :=
  reverse_map_not_involutive xs

example :
    (List.reverse ∘ List.map Bool.not) [true, false, false] = [true, true, false] :=
  rfl

example :
    (List.reverse ∘ List.map Bool.not)
      ((List.reverse ∘ List.map Bool.not) [true, false, false]) = [true, false, false] :=
  reverse_map_not_involutive _
