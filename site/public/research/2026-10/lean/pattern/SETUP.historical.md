Use the installed Lean 4.35.0 release at commit
eb6cafb7290e8bd5f2937522d8d804f58f02bafc. No Mathlib or other package is required.
Run from this directory in PowerShell:

```powershell
rtk proxy <user-home>/Documents/Codex/2026-10-23/ohara/work/toolchains/lean-4.35.0-windows/bin/lean.exe -o Pattern.olean Pattern.lean
rtk proxy node check.mjs
rtk proxy node identity.mjs
rtk proxy node ../../../../../ohara-ui/ohara-ui/node_modules/tsx/dist/cli.mjs validate.ts
```

The runner supplies LEAN_PATH as this directory for local imports. Its successful
exit means Concrete, Consumer and NegativePremises returned zero and Negative
returned one; inspect the negative error to ensure it is the false equality.
The retained logs describe the actual first run, not a clean rebuild of Lean's
upstream standard library. The runner expects Pattern.olean from the first
command and has a bounded compiler timeout.

A consumer writes:

```lean
import Concrete

example (xs : List Bool) :
    (List.reverse ∘ List.map Bool.not) ((List.reverse ∘ List.map Bool.not) xs) = xs :=
  OharaPattern.reverse_map_not_involutive xs
```

To reuse the abstract theorem, import Pattern and supply f, g, both involution
proofs and the pointwise commutation proof to OharaPattern.comp_involutive.
Consumer.lean contains checked use and a concrete value example.
