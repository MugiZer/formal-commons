import Init.Data.List.Lemmas

namespace OharaPattern

def Involutive {α : Sort u} (f : α → α) : Prop := ∀ x, f (f x) = x

theorem comp_involutive {α : Sort u} (f g : α → α)
    (hf : Involutive f) (hg : Involutive g)
    (commute : ∀ x, g (f x) = f (g x)) :
    Involutive (f ∘ g) := by
  intro x
  change f (g (f (g x))) = x
  rw [commute (g x), hg x, hf x]

#print comp_involutive
#print axioms comp_involutive

end OharaPattern
