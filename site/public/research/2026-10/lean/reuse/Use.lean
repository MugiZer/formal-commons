import HashMapInsert
import Pattern

set_option autoImplicit false

namespace IndependentConsumer

theorem two_updates_same (m : Std.HashMap Nat Nat) (k first second : Nat) :
    ((m.insert k first).insert k second)[k]? = some second := by
  rw [OharaHashMap.lookup_insert]
  simp

theorem two_updates_other (m : Std.HashMap Nat Nat)
    (k other first second : Nat) (different : k ≠ other) :
    ((m.insert k first).insert k second)[other]? = m[other]? := by
  rw [OharaHashMap.lookup_insert, OharaHashMap.lookup_insert]
  simp [different]

abbrev State := Bool × Bool

def flipBoth (s : State) : State := (!s.1, !s.2)

theorem swap_involutive : OharaPattern.Involutive (Prod.swap : State → State) := by
  intro s
  cases s
  rfl

theorem flip_involutive : OharaPattern.Involutive flipBoth := by
  intro s
  rcases s with ⟨a, b⟩
  cases a <;> cases b <;> rfl

theorem swap_flip_commute (s : State) :
    flipBoth (Prod.swap s) = Prod.swap (flipBoth s) := by
  rfl

def step : State → State := Prod.swap ∘ flipBoth

theorem step_involutive : OharaPattern.Involutive step :=
  OharaPattern.comp_involutive Prod.swap flipBoth
    swap_involutive flip_involutive swap_flip_commute

theorem restored (s : State) : step (step s) = s :=
  step_involutive s

example : step (step (true, false)) = (true, false) := restored (true, false)

#print axioms OharaHashMap.lookup_insert
#print axioms OharaPattern.comp_involutive
#print axioms two_updates_same
#print axioms two_updates_other
#print axioms swap_involutive
#print axioms flip_involutive
#print axioms swap_flip_commute
#print axioms step_involutive
#print axioms restored

end IndependentConsumer
