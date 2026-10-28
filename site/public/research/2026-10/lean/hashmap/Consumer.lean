import HashMapInsert

namespace Consumer

theorem inserted (m : Std.HashMap Nat String) : (m.insert 7 "new")[7]? = some "new" := by
  rw [OharaHashMap.lookup_insert]
  rfl

theorem other_key (m : Std.HashMap Nat String) : (m.insert 7 "new")[8]? = m[8]? := by
  rw [OharaHashMap.lookup_insert]
  rfl

theorem replacement (m : Std.HashMap Nat String) :
    ((m.insert 7 "old").insert 7 "new")[7]? = some "new" := by
  rw [OharaHashMap.lookup_insert]
  rfl

end Consumer
