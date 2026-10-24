# Optional stronger rechecking

The actual pinned Lean build and axiom inspection succeeded; see `lean-check.json`.

Optional bundled Windows recheckers were investigated. A command-line help probe of `leanchecker` and `leanchecker-paranoid` did not complete within 20 seconds. The bundled `lean4lean` reported incompatible `.olean` headers for the shipped core library. No successful independent recheck is claimed. These attempts do not change the scope or outcome of the ordinary Lean compiler check.
