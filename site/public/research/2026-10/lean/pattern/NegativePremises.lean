import Pattern

namespace OharaPattern.NegativeControl

inductive Three where
  | a | b | c
  deriving DecidableEq

def swapAB : Three → Three
  | .a => .b
  | .b => .a
  | .c => .c

def swapBC : Three → Three
  | .a => .a
  | .b => .c
  | .c => .b

theorem swapAB_involutive : Involutive swapAB := by
  intro x
  cases x <;> rfl

theorem swapBC_involutive : Involutive swapBC := by
  intro x
  cases x <;> rfl

theorem noncommuting : swapBC (swapAB .a) ≠ swapAB (swapBC .a) := by
  decide

theorem composition_not_involutive : ¬ Involutive (swapAB ∘ swapBC) := by
  intro h
  have falseEquality := h Three.a
  cases falseEquality

#print axioms composition_not_involutive

end OharaPattern.NegativeControl
