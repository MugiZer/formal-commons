/-
Reuse wrapper for Lean 4.35.0 at eb6cafb7290e8bd5f2937522d8d804f58f02bafc.
Original theorem: Std.HashMap.getElem?_insert, by Markus Himmel.
Copyright (c) 2024 Lean FRO, LLC. Apache-2.0; see LICENSE.
New wrapper and name added for this intake pilot; upstream implementation is imported.
-/
import Std.Data.HashMap.Lemmas

set_option autoImplicit false

namespace OharaHashMap

universe u v
variable {α : Type u} {β : Type v} [BEq α] [Hashable α]

theorem lookup_insert [EquivBEq α] [LawfulHashable α]
    (m : Std.HashMap α β) (k a : α) (v : β) :
    (m.insert k v)[a]? = if k == a then some v else m[a]? :=
  Std.HashMap.getElem?_insert

end OharaHashMap
