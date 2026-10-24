import Contracts

namespace Consumer

def selectJobs (eligible : Nat → Bool) (submitted : List Nat) : List Nat :=
  FormalCommons.keep eligible submitted

theorem selected_was_submitted (eligible : Nat → Bool) (submitted : List Nat)
    (job : Nat) (selected : job ∈ selectJobs eligible submitted) : job ∈ submitted :=
  FormalCommons.keep_origin eligible submitted job selected

example : selectJobs (fun n => n % 2 == 0) [1, 2, 3, 4] = [2, 4] := by decide

end Consumer
