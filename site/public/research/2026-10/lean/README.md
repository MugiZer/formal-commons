# Ohara Lean proof examples

Use leanprover/lean4:v4.35.0, commit eb6cafb7290e8bd5f2937522d8d804f58f02bafc. Source files preserve the checked bytes. The public digest manifest maps original logs to their path-redacted derivatives; original receipts describe the original bytes. No compiled object files are distributed.

## Pattern and list consumer

From pattern/, with Lean 4.35.0 activated:

```sh
LEAN_PATH=. lean -o Pattern.olean Pattern.lean
LEAN_PATH=. lean -o Concrete.olean Concrete.lean
LEAN_PATH=. lean Consumer.lean
LEAN_PATH=. lean NegativePremises.lean
```

Negative.lean is a separate expected-failure case that removes the commutation premise. SETUP.historical.md preserves the original local setup record; its old helper paths are historical.

## HashMap consumer

From hashmap/:

```sh
LEAN_PATH=. lean -o HashMapInsert.olean HashMapInsert.lean
LEAN_PATH=. lean Consumer.lean
```

From reuse/:

```sh
LEAN_PATH=. lean -o Pattern.olean Pattern.lean
LEAN_PATH=. lean -o HashMapInsert.olean HashMapInsert.lean
LEAN_PATH=. lean Use.lean
```

The retained reuse check used the previously checked source/object pairs after a package correction. The commands above describe source compilation; they are not a new recorded run. map/Consumer.lean and filter/Consumer.lean import Init.Data.List.Lemmas directly.

Original Ohara pattern sources use the repository MIT license. Upstream Lean material and HashMap wrapper notices retain Apache-2.0 attribution; LICENSE.upstream contains the complete notice.
