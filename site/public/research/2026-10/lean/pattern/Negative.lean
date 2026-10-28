import NegativePremises

open OharaPattern OharaPattern.NegativeControl

#check swapAB_involutive
#check swapBC_involutive
#check noncommuting
#check composition_not_involutive

-- Removing commutation from the general contract would imply this false instance.
example : (swapAB ∘ swapBC) ((swapAB ∘ swapBC) Three.a) = Three.a := by
  rfl
