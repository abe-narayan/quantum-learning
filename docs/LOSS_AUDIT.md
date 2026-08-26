# Content-Loss Audit — post-redesign verification

**Scope.** `docs/SCIENCE_AUDIT.md` verified, by exhaustive LaTeX multiset comparison, that the
visual redesign corrupted no equation. That audit ran *before* two later passes:

1. a **de-duplication pass** that deleted prose sentences from `## Motivation` sections where a
   `<LessonHook>` had been created by lifting those same sentences near-verbatim;
2. a **component-adoption pass** that replaced hand-rolled inline `<svg>` diagrams with real
   components and converted derivations into `<DerivationSteps>` / `<EquationReveal>` /
   `<HistoricalMoment>` / `<ResearchConnection>`.

Deleting prose is the one edit type that can silently drop a unique claim, so both passes were
re-audited here against `git HEAD`.

**Verdict: no scientific or pedagogical content was lost. Zero files required restoration, and
zero lesson files were edited.** Three cosmetic side-effects were found and are reported (not
fixed) at the end.

---

## Method

A mechanical detector (`loss-audit-tool.py`, since deleted — it was a scratch tool, not a repo
artifact) compared, per lesson, the multiset of mathematical spans (`$…$`, `$$…$$`) and of prose
numerals between `git HEAD` and the working tree. It flagged **54 files** (the sprint brief said
53; the tool's own count at audit time was 54, and all 54 are adjudicated below).

The detector is a **screen, not a verdict**. Its known imprecision:

- a derivation split into `<DerivationStep>`s no longer contains the original single large
  `$$…$$` span, though all the mathematics survives across the new steps;
- a replaced inline SVG legitimately drops dozens of coordinate numerals that were never physics;
- a bare single-token span (`$X$`, `$N$`, `$U$`) is flagged whenever its *count* changes — e.g.
  prose reworded from "the $X$ gate" to "the X gate", or the symbol moved into a component prop;
- LaTeX rewritten as unicode inside an `annotation="…"` (e.g. `[a,a^\dagger]` becomes `[a,a†]`)
  reads as a lost span though it is on screen;
- a line with an odd number of `$` breaks its single-line inline regex, emitting garbled tokens
  (`,theproduct`, `isin`) and phantom numerals.

Every flagged item was therefore traced individually through `git diff HEAD -- <path>` and
`git show HEAD:<path>`, and classified:

| Class | Meaning |
|---|---|
| **RESTRUCTURED** | content still present, different form (derivation steps, component prop, reformatted). Not a loss. |
| **INTENTIONAL** | legitimately removed — SVG/CSS coordinates, a duplicated restatement whose content survives in the `<LessonHook>`, a hand-rolled diagram replaced by an equivalent component. |
| **LOST** | a claim, equation, number, unit, bound, or qualification a reader could previously learn here and now cannot. |

---

## Results by file

All 54 flagged files, with every flagged item accounted for. **No item in any file classified as
LOST.**

### apex (11 files)

| # | File | Flagged items | Class | Evidence |
|---|---|---|---|---|
| 1 | `algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries.mdx` | 2 display spans (PREPARE⊗I then SELECT; final amplitude sum); `PREPARE†⊗I`; `⟨0|_anc`; `⟨0|PREPARE†|i⟩` | RESTRUCTURED | LCU proof split into a 3-step `<DerivationSteps>`; `⟨0|PREPARE†|i⟩=√(αᵢ/‖α‖₁)` is now its own step-2 equation. Worked-example values `a=0.5, d=-0.5, b=0.5` unchanged. |
| 2 | `algorithmic-frontiers/quantum-signal-processing.mdx` | 3 display spans (Uϕ₀ϕ₁ definition; W(x)e^{iϕ₁Z}; final matrix); `W(x)` | RESTRUCTURED | d=1 derivation split into 3 `<DerivationStep>`s; `W(x)` moved into `<EquationReveal>` term glosses. |
| 3 | `algorithmic-frontiers/the-quantum-singular-value-transformation.mdx` | `U`×4; `\|vᵢ⁰⟩`; `\|uᵢ⁰⟩:=\|0⟩^⊗a\|uᵢ⟩`; `σᵢ≤1`; `√(1-σᵢ²)`; NUM 2019, 2018 | RESTRUCTURED | Proof split into 3 steps; definitions preserved in the step-2 annotation. "2018-2019" survives verbatim in Key Takeaways; both paper titles preserved as `<ResearchConnection title=…>` **with arXiv URLs added**. The "None of this is a claim that QSVT proves new physics" hedge is retained in full. |
| 4 | `fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm.mdx` | `ln(p/p_th)=ln(0.1)<0` | RESTRUCTURED | Now inside a `<DerivationStep annotation="ln(p/p_th) = ln(0.1) is negative…">`; both steps intact. |
| 5 | `fault-tolerance-frontiers/lattice-surgery.mdx` | `X^{m₁}Z^{m₀}`; NUM ×73 (1, 2, 3, 4, 5, 0, 40, 780) | RESTRUCTURED / INTENTIONAL | Every numeral traces to the removed hand-rolled `<svg width={780} height={320}>` three-panel merge/split diagram, replaced by `<SurfaceCodePatchExplorer variant="merge-split">` with an equivalent `ariaLabel`. No code distance or physical-qubit count left prose; the 5-step CNOT gadget survives in `<DerivationSteps>`. |
| 6 | `fault-tolerance-frontiers/the-threshold-theorem.mdx` | `p₁=cp₀²`; `cp₁=(cp₀)²`; `cp₂=(cp₁)²=(cp₀)⁴`; `cp_k=(cp₀)^{2^k}`; `p_L` | RESTRUCTURED | Full recursion-unrolling derivation intact as 4 steps, ending `p_L≈(1/c)(cp₀)^{2^L}`. The 1996–1998 discovery history moved intact into `<HistoricalMoment>`. |
| 7 | `quantum-complexity-theory/capstone-what-we-know-and-dont.mdx` | NUM 4, 6 | RESTRUCTURED | The "Step 4"/"Step 6" *labels* of the 6-step Sycamore example became implicit ordering inside `<DerivationSteps>`; all six step bodies are verbatim. "## Interactive Visualization" renamed to "## The Three-Tier Map", content unchanged. |
| 8 | `quantum-complexity-theory/complexity-classes-p-np-and-bqp.mdx` | `NP`×2; `BQP`; `NP∩coNP`; `NP⊄BQP`; NUM ×14 | RESTRUCTURED / INTENTIONAL | `$\mathsf{NP}\cap\mathsf{coNP}$` and `$\mathsf{NP}\not\subseteq\mathsf{BQP}$` are both still present verbatim elsewhere in the file. Numerals are the removed Venn-diagram SVG (`viewBox="0 0 440 320"`), replaced by `<ComplexityClassDiagram>`, plus "Step 1…5" labels. |
| 9 | `quantum-complexity-theory/query-complexity-and-lower-bounds.mdx` | `Γ`; `D_i`; `i`×3; `1`×4; `N` | RESTRUCTURED | Full OR_N adversary-bound calculation (Γ definition, ‖Γ‖=√N, maxᵢ‖Γ∘Dᵢ‖=1, ADV=√N) intact across `<DerivationStep>`s; `Γ` and `D_i` also glossed in `<EquationReveal>`. |
| 10 | `research-methods-and-synthesis/reproducing-and-designing-experiments.mdx` | `N`; `k`; `p`; `k∼Binomial(N,p)`; `Np` | RESTRUCTURED | Binomial estimator derivation split into 4 steps; the new step **adds** an explicit `Var(k)=Np(1-p)`. Content gained, none dropped. |
| 11 | `simulation-and-compilation-frontiers/when-classical-simulation-works.mdx` | NUM ×17 (0, 70, 4, 40, 480, 380, 160, 30) | INTENTIONAL | All are `x=`/`y=`/`width=`/`r=`/`viewBox="0 0 480 380"` values of the hand-rolled "Two Boundaries" diagram, now `<ClassicalSimulabilityMap>`. The physics (Circuit A reaches 3 ebits; Circuit B capped at 1 ebit; Gottesman–Knill and bond-dimension criteria) is unchanged in prose and tables. |

### quantum-computing (15 files)

| # | File | Flagged items | Class | Evidence |
|---|---|---|---|---|
| 12 | `entanglement-and-measurement/convex-combinations-and-physical-mixtures.mdx` | `\|0⟩,\|1⟩`; `\|+⟩,\|-⟩`; `I/2` | INTENTIONAL | Sentence lifted verbatim into `<LessonHook>`; the mixture-of-`\|0⟩,\|1⟩` = mixture-of-`\|+⟩,\|−⟩` = `I/2` fact is stated there. |
| 13 | `entanglement-and-measurement/pure-states-and-mixed-states.mdx` | `\|ψ⟩`×2; `ρ` | INTENTIONAL | Moved into `<LessonHook>` ("The last lesson's ρ=\|ψ⟩⟨ψ\| agreed with \|ψ⟩ on every prediction…"). |
| 14 | `entanglement-and-measurement/purity-entropy-and-information.mdx` | `Tr(ρ²)` | INTENTIONAL | Moved into `<LessonHook>`; the dropped qualifier "(for 2-qubit pure states)" is preserved one sentence later in Motivation. |
| 15 | `entanglement-and-measurement/why-entangled-subsystems-are-mixed.mdx` | `\|Φ⁺⟩` | INTENTIONAL | Moved verbatim into `<LessonHook>`; `ρ_A=I/2` retained in the next Motivation sentence. |
| 16 | `error-correction-and-fault-tolerance/the-shor-code-combining-both.mdx` | `X`; `Z` | INTENTIONAL | "an $X$ error and a $Z$ error at once" moved verbatim into `<LessonHook>`. |
| 17 | `error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code.mdx` | `\|0⟩`; `\|1⟩` | INTENTIONAL | "flips a qubit's \|0⟩ to \|1⟩ or back" moved verbatim into `<LessonHook>`. |
| 18 | `quantum-algorithms-i/capstone-comparing-quantum-advantage.mdx` | `√N`; `N` | INTENTIONAL | "Grover needs roughly √N queries where a classical computer needs N" now appears in both a `<LessonHook>` and a `<Question>`. |
| 19 | `quantum-algorithms-i/phase-kickback.mdx` | `f(x)`×2; `\|x⟩` | RESTRUCTURED | Both occurrences present verbatim in the `<LessonHook>` (unicode, no `$`). |
| 20 | `quantum-algorithms-ii/the-quantum-period-finding-circuit.mdx` | `f(x)=a^x mod N` | RESTRUCTURED | Present in `<LessonHook>`: "the period of the function f(x)=aˣ mod N". |
| 21 | `quantum-gates-and-circuits/bell-states-and-entanglement.mdx` | `a₀b₁=0`; `a₀=0`; `b₁=0` | RESTRUCTURED | Product-state impossibility proof split into `<DerivationStep>`s: all four coefficient equations, both contradiction branches, and the conclusion are intact. |
| 22 | `quantum-gates-and-circuits/interference-in-quantum-circuits.mdx` | `H\|+⟩=\|0⟩`; `H` | RESTRUCTURED | Present in `<LessonHook>` ("…H\|+⟩=\|0⟩ was a small, striking fact… through a second H…"). |
| 23 | `quantum-gates-and-circuits/multi-qubit-state-vectors.mdx` | `⊗` | RESTRUCTURED | Present in `<LessonHook>` ("built multi-qubit states out of single-qubit ones, via ⊗"). |
| 24 | `quantum-gates-and-circuits/quantum-teleportation.mdx` | `\|ψ⟩`; `α`; `β` | RESTRUCTURED | `\|ψ⟩` in `<LessonHook>` and `<InsightBlock>`; α and β still used throughout (e.g. "since α=0.6 and β=0.8i here"). |
| 25 | `qubits-and-quantum-states/complex-numbers-for-quantum-mechanics.mdx` | `Z`; `S` | RESTRUCTURED | "the difference between a Z gate and an S gate" in `<LessonHook>`; `$S$` still used in the body. |
| 26 | `qubits-and-quantum-states/global-and-relative-phase.mdx` | `Y\|0⟩=i\|1⟩`; `X\|0⟩=\|1⟩`; `R_z(2π)=-I` | RESTRUCTURED | All three present in the `<LessonHook>`. |

### quantum-hardware (1 file)

| # | File | Flagged items | Class | Evidence |
|---|---|---|---|---|
| 27 | `control-and-readout/control-electronics.mdx` | `X`; `H`; `R_z(θ)` | RESTRUCTURED | All three in the `<LessonHook>` gate list. The platform-dependent pulse qualification survives as a new standalone sentence ("The control pulse can equally be a laser pulse rather than a microwave one…"). |

### quantum-mastery (12 files)

| # | File | Flagged items | Class | Evidence |
|---|---|---|---|---|
| 28 | `advanced-algorithms-and-complexity/bqp-and-oracle-complexity.mdx` | `T=Ω(√N)` | RESTRUCTURED | BBBV hybrid-method sketch split into 4 steps; the `T=Ω(√N)` conclusion is the last step. |
| 29 | `advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth.mdx` | 2 `\boxed{}` display spans (P(m); P(b)≥4/π²≈0.4053); `r=e^{2πiε}`; `1-e^{iθ}=-2ie^{iθ/2}sin(θ/2)`; `1-r^N` | RESTRUCTURED | Both boxed results present verbatim as `<DerivationStep>` content; only the `\boxed{}` wrapper was dropped. The "rounding to the wrong period" motivation was condensed into the hook; its substance is explicit at the `4/π²` explanation ("how confident you are in landing on it"). |
| 30 | `hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space.mdx` | `⟨p\|p⟩` | INTENTIONAL | "its own overlap with itself, ⟨p\|p⟩, is formally δ(0)" lifted into `<LessonHook>`. |
| 31 | `hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness.mdx` | `ψ∈H¹(ℝ)`×2; the d/dx\|ψ\|² identity; `,theproduct`; `isin`; the Cauchy–Schwarz bound; NUM 2×2, 1 | RESTRUCTURED / tool artifact | Verified by direct reading: the 4-step vanishing-at-infinity derivation is intact (product rule; `∫\|ψ'ψ*\|dx ≤ ‖ψ'‖_{L²}‖ψ‖_{L²} < ∞`; the integral form; `ψ(x)→0 … for every ψ∈H¹(ℝ)`). The integration-by-parts boundary term moved into an `<EquationReveal>` with glosses. `,theproduct` and `isin` are the odd-`$` regex artifact; the `L¹` claim survives as unicode "L¹" in a step annotation. |
| 32 | `hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators.mdx` | `λᵢ`; `λ`; `‖Pᵢψ‖²`; `×`; `ψ`; NUM 2 | RESTRUCTURED | Staircase measure, Riemann–Stieltjes sum, and `A=∫λdE(λ)=ΣᵢλᵢPᵢ` intact across 3 steps; "(integrand value) × (jump size)" is now step-2 annotation prose. |
| 33 | `quantum-information-theory/quantum-channels-kraus-and-choi.mdx` | `ℰ`; `\|i⟩⟨j\|`×2; `(i,ℓ)`; `J`×2; `K_k` | RESTRUCTURED | Choi-existence proof split into 4 steps; reshaping definition `(K_k)_{ℓi}≡√μ_k(v_k)_{iℓ}` verbatim in step 2; `J(ℰ)` glossed in `<EquationReveal>`. |
| 34 | `quantum-information-theory/relative-entropy-and-mixed-state-entanglement.mdx` | `σ`; `ρ`; `ρ=Σᵢpᵢ\|i⟩⟨i\|`; `σ=Σⱼqⱼ\|j⟩⟨j\|`; `Tr(ρlog₂σ)=…` | RESTRUCTURED | Klein's-inequality proof preserved across 5 steps, including the doubly-stochastic `c_{ij}` expansion and the ρ=σ equality condition. |
| 35 | `quantum-information-theory/schmidt-decomposition-and-purification.mdx` | `B`; `U`×2; `V`×2; `\|u_k⟩_A=Σᵢ U_{ik}\|i⟩_A`; `k`×2; NUM 2, 4, 0×6, 500 | RESTRUCTURED / INTENTIONAL | Purification proof and SVD substitution split into steps. Numerals are a removed hand-rolled CSS radio-toggle widget (`opacity: 0`, `font-weight: 500`, `gap-2`, `space-y-4`); its three panels (product state, Bell state, worked example) are now all shown at once with byte-identical prose. |
| 36 | `quantum-information-theory/trace-distance-and-fidelity.mdx` | `Δ`; `Δ₊`×2; `P=PΔ₊/Δ₊+PΔ₋/Δ₋`; `Π₊`×2; `Tr[PΔ₋]≥0` | RESTRUCTURED / INTENTIONAL | Helstrom proof split into 3 steps; `Tr[PΔ₋]≥0` and its justification are the step-1 annotation. The `P=PΔ₊/Δ₊+…` span was an **abandoned false start in the original text itself** ("…*more directly*: decompose using the projector Π₊…") — the author discarded it mid-sentence; the Π₊ route is fully preserved. |
| 37 | `quantum-shannon-theory/stinespring-dilation-and-channel-purification.mdx` | `d`; `E`; `V`×3; `\|φ⟩,\|ψ⟩`; `⟨i\|j⟩=δ_{ij}` | RESTRUCTURED | Verified by direct reading: the isometry check `⟨φ\|V†V\|ψ⟩=…=⟨φ\|ψ⟩` is step 1, with `⟨i\|j⟩=δ_ij` and Kraus completeness named in its annotation; unitary extension and partial-trace recovery are steps 2–4. |
| 38 | `quantum-shannon-theory/the-data-processing-inequality.mdx` | `B`; `A`; `𝒩`; `ρ_{AB}`; `B'`; NUM 1, 2, 3 | RESTRUCTURED | Verified by direct reading: all three steps present in order — mutual information as relative entropy; pushing both states through `id_A⊗𝒩`; monotonicity giving `\boxed{I(A:B') ≤ I(A:B)}` (this box **was** kept). NUM 1/2/3 are the old bold "**Step N—**" labels. |
| 39 | `symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx` | CG recursion display span; `\|j₁,m₁⟩\|j₂,m₂⟩`; `\|3/2,3/2⟩=\|1,1⟩\|1/2,1/2⟩`; `J₋=L₋+S₋`; `√(3/2·5/2-3/2·1/2)=√3` | RESTRUCTURED | Verified by direct reading: the l=1⊗s=1/2 worked example is now 4 `<DerivationStep>`s containing every equation, including `√3` and the final `\|3/2,1/2⟩=√(2/3)…+√(1/3)…`. `J₋=L₋+S₋` is unicode in the step-2 annotation. |

### quantum-mechanics (15 files)

| # | File | Flagged items | Class | Evidence |
|---|---|---|---|---|
| 40 | `approximation-methods/the-variational-method.mdx` | `H`; `E₀`; `\|ψ_trial⟩=Σc_n\|n⟩`; `Σ\|c_n\|²=1`; the `≥E₀` chain | RESTRUCTURED | Verified by direct reading: expansion, normalization, and the full chain `⟨ψ\|H\|ψ⟩=Σ\|c_n\|²E_n ≥ Σ\|c_n\|²E₀ = E₀` all present across steps. |
| 41 | `classical-to-quantum/expectation-values-and-uncertainty.mdx` | `\boxed{ΔA ΔB ≥ ½\|⟨[A,B]⟩\|}`; `ÃB̃`; `{·,·}`; `{Ã,B̃}`; `[Ã,B̃]` | RESTRUCTURED | Verified by direct reading: the bound is present unboxed; the `{·,·}` **anticommutator** naming survives in a step annotation; the bound is restated in Key Takeaways. |
| 42 | `classical-to-quantum/position-and-momentum.mdx` | `[a,a†]-[a†,a]=1-(-1)=2` | RESTRUCTURED | Verified by direct reading: now the step-2 annotation, verbatim in unicode, with `[x̂,p̂]=i(ℏ/2)·2=iℏ ✓` as the step equation. |
| 43 | `classical-to-quantum/time-evolution-and-the-schrodinger-equation.mdx` | `\boxed{iℏ d/dt\|ψ(t)⟩=H\|ψ(t)⟩}` | RESTRUCTURED | Verified by direct reading: the Schrödinger equation is present inside an `<EquationReveal>`; only the `\boxed{}` wrapper was dropped. Also restated in Key Takeaways. |
| 44 | `mathematical-foundations/bra-ket-formalism.mdx` | `\|ψ⟩`×2; `\|ψ⟩=Σⱼcⱼ\|eⱼ⟩`; `{eᵢ}`; `j=i`; `Σᵢcᵢ\|eᵢ⟩` | RESTRUCTURED | Verified by direct reading: completeness proof is 3 steps ending `Σᵢcᵢ\|eᵢ⟩=\|ψ⟩`; the orthonormality argument including "every term but j=i vanishes" is the step-2 annotation. |
| 45 | `mathematical-foundations/complex-numbers-for-physics.mdx` | `i²=-1, i³=-i, i⁴=1, i⁵=i, …`; `iθ`; `cosθ`; `sinθ` | RESTRUCTURED | Verified by direct reading: the power cycle and "the pattern repeats every four powers" are the step-2 annotation; the cos/sin Maclaurin split and the `\|e^{iθ}\|=1` consequence are intact. |
| 46 | `mathematical-foundations/hermitian-operators.mdx` | `v≠0`; `⟨v\|Av⟩`×2; `u=v`; `A†=A`; conjugate-symmetry fragment | RESTRUCTURED | Real-eigenvalue proof across 3 steps; adjoint-definition and conjugate-symmetry reasoning moved into annotations. |
| 47 | `mathematical-foundations/inner-products-and-orthogonality.mdx` | `v=0`; `v≠0`; `c=⟨v,u⟩/⟨v,v⟩`; `w=u-cv`; `⟨w,w⟩≥0`; NUM 2 | RESTRUCTURED / tool artifact | Cauchy–Schwarz proof split into steps; the `v=0` triviality is in an annotation. The NUM 2 came from a two-line inline `$…$` the tool could not strip — a redundant restatement of the equation shown immediately above it. |
| 48 | `mathematical-foundations/linear-operators.mdx` | `⟨eᵢ\|AB\|e_k⟩=…`; `A`; `B`; `Σⱼ\|eⱼ⟩⟨eⱼ\|=I` | RESTRUCTURED | Matrix-product derivation split into 3 steps; the resolution of identity is inside step 1. |
| 49 | `mathematical-foundations/probability-and-quantum-states.mdx` | `ΣᵢP(λᵢ)=…`; `‖ψ‖=1` | RESTRUCTURED | Normalization derivation split into 4 steps, ending with an explicit `⟨ψ\|ψ⟩=1`; "Postulate 1 requires ‖ψ‖=1" is an annotation. |
| 50 | `one-dimensional-systems/scattering-off-a-step-potential.mdx` | `1+r=t`; `ik₁(1-r)=ik₂t`; `\boxed{r=(k₁-k₂)/(k₁+k₂), t=2k₁/(k₁+k₂)}`; `t=1+r` | RESTRUCTURED | Verified by direct reading: both continuity conditions are steps 1–2, and the r, t result is present verbatim (unboxed). It is immediately used to derive `R` and `T` and to check `R+T=1`. |
| 51 | `operators-observables-measurement/sequential-measurements-and-incompatibility.mdx` | `Z`; `X` | INTENTIONAL | "For Z and X on a qubit, yes…" moved into `<LessonHook>` as plain text. |
| 52 | `operators-observables-measurement/the-energy-time-uncertainty-relation.mdx` | `\boxed{ΔE Δt_A ≥ ℏ/2}`; `A`; `H`; `\|d⟨A⟩/dt\|` | RESTRUCTURED | Verified by direct reading: the bound is present unboxed, plus restated in Key Takeaways (`ΔE Δt_A ≥ ℏ/2`) and in the `Δt_A ≥ ℏ/(2ΔE)` rearrangement. All four derivation equations survive as steps. |
| 53 | `wave-mechanics/numerically-evolving-quantum-states.mdx` | BCH-error display span; `Δt¹`; `Δt²` | RESTRUCTURED | Split into 3 steps (true exponential, split product, commutator difference); the "agree through Δt¹, differ at Δt² by the commutator" claim is an annotation. |
| 54 | `wave-mechanics/wave-packet-dynamics-and-dispersion.mdx` | `[p̂,x̂]=-iℏ`; NUM 2 | RESTRUCTURED / tool artifact | `[p̂,x̂]=−iℏ` present as unicode in an annotation ("the antisymmetric partner of the commutator derived two lessons ago"); `p̂²` and `−2iℏp̂` verified present in the step-2 display block. The NUM 2 is the two-line inline-math artifact. |

**Totals: 54 files — 0 LOST; all 54 fully accounted for as RESTRUCTURED and/or INTENTIONAL.**

---

## Supplementary screen: prose words, whole corpus

The math/numeral detector is structurally blind to a deleted prose sentence containing **neither
math nor numerals** — precisely the de-duplication pass's risk profile. A second, independent
screen was therefore run over **all 219 lessons**: it compared the multiset of ordinary
alphabetic words (export block, code fences, LaTeX and math stripped; JSX *attribute* text such
as `annotation=`, `ariaLabel=`, `caption=` deliberately retained, since it is reader-visible) and
reported words whose count dropped to **zero**.

This caught content the first detector could not see — including a paragraph in
`apex/fault-tolerance-frontiers/decoding-surface-codes.mdx`, a file **not among the 54**. Every
such case was traced and resolved:

| Finding | Class | Evidence |
|---|---|---|
| `decoding-surface-codes.mdx` — Google Willow paragraph (distance-3/5/7; error rate halving per distance; "below its own threshold") | RESTRUCTURED | Moved intact into `<HistoricalMoment date="December 2024" place="Google Quantum AI">`; every clause preserved. |
| `the-quantum-singular-value-transformation.mdx` — paper titles | INTENTIONAL | Both titles kept as `<ResearchConnection title=…>`; arXiv URLs **added**. Only the subtitle after the colon ("exponential improvements for quantum matrix arithmetic") is no longer displayed — more than compensated by the canonical URL. |
| `type="mistake"` → `type="warning"` on `<Callout>`, ~20 files | INTENTIONAL | Variant/prop rename only; callout bodies are byte-identical. |
| `spin-qubits` / `trapped-ions` / `global-and-relative-phase` image credits | Not a change | `credit`, `creditUrl`, `license` strings are byte-identical; `<ExternalFigure>` was upgraded to `<AnnotatedFigure>` with added `pins`. The flag was a quote-pairing artifact of the screen itself. |
| CSS/SVG class tokens (`fill-brand`, `font-semibold`, `viewBox` values, widget ids) | INTENTIONAL | Hand-rolled markup replaced by components. |
| Connective/derivation words (`therefore`, `leaving`, `substituting`, `second`, …) | RESTRUCTURED | Absorbed into `<DerivationStep annotation="…">` rewording. |
| `phase-estimation-precision-and-qft-depth.mdx` — "confidence that the register didn't just round to the wrong period" | INTENTIONAL | Condensed on the way into the `<LessonHook>`; the substance is explicit in the lesson body's `4/π²` explanation ("how confident you are in landing on it") and in the `b=round(φN)` treatment. |

No word-level finding resolved to a lost claim.

---

## Cosmetic side-effects found (reported, not fixed)

These are **not** content losses — nothing a reader could learn has disappeared — but they are
real artifacts of the two passes. Fixing them would be editing rather than restoring, so they
were deliberately left alone.

1. **Seven orphaned `## Motivation` openers.** The de-duplication pass lifted a section's opening
   sentence(s) into the `<LessonHook>` but left a dependent follow-on behind, so the section now
   opens with a dangling reference:
   - `quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables.mdx` — opens "It was a reasonable position, held by one of the greatest physicists who ever lived." (the Einstein sentence it refers back to now lives only in the hook)
   - `quantum-computing/qubits-and-quantum-states/quantum-gates.mdx` — opens "These are quantum gates, …"
   - `quantum-computing/qubits-and-quantum-states/building-qubit-circuits.mdx` — opens "Those nine lessons' pieces …"
   - `quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures.mdx` — opens "That's not a coincidence specific to those four states …"
   - `quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits.mdx` — opens "That was interference on a single qubit."
   - `quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge.mdx` — opens "That's the real payoff …"
   - `quantum-mechanics/wave-mechanics/expectation-values-in-position-space.mdx` — opens "That's the same continuum-limit move …"

   In every case the lifted sentences are present verbatim in the hook, so no claim is lost; the
   prose simply reads as though it starts mid-thought.

2. **Stale "boxed" references.** `quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential.mdx`
   still says "the boxed formula" (twice, in Practice Questions) although `\boxed{}` was dropped
   when the result moved into a `<DerivationStep>`. The formula is present and adjacent.

3. **Stale "Step N" references.** `quantum-mastery/quantum-shannon-theory/the-data-processing-inequality.mdx`
   refers to "Step 1's identity" and "in Step 2" although the bold "**Step N—**" labels became
   implicit `<DerivationSteps>` ordering. The steps still appear in the referenced order.

---

## Coverage and confidence

**What was checked.** All 54 detector-flagged files, every flagged item individually (298 math
spans and 465 prose numerals in aggregate), traced through `git diff` / `git show`. Plus an
independent whole-corpus prose-word screen over all 219 lessons, covering the first detector's
structural blind spot.

**Verification.** `npx vitest run src/lib/content` passes (exit 0), which compiles **and renders**
all 219 lessons. No lesson file was modified by this audit, so this reflects the corpus as the
sprint left it. Note that two other agents were editing
`src/content/lessons/{quantum-mechanics,quantum-computing,quantum-software}/**` and
`{quantum-hardware,quantum-mastery,apex}/**` concurrently with this audit.

**Honest limits.**

- Files 37–45 above, both boxed-equation files (50, 52), the self-adjointness file (31), and every
  supplementary-screen finding were verified by direct reading in this session. The remainder were
  adjudicated by parallel per-file analysis; spot checks of that analysis — including the one case
  where a raw `grep` initially appeared to contradict it (`L^1` in file 31, which turned out to be
  rendered as unicode "L¹") — confirmed it each time, but not every one of the ~180 individual
  items was independently re-read.
- Both screens are **lexical**. Neither can detect a claim reworded into something subtly weaker or
  wrong while keeping the same symbols and numbers. `docs/SCIENCE_AUDIT.md`'s LaTeX multiset
  comparison covers equations against that risk; connective prose rewritten into `annotation=` text
  has no equivalent protection.
- The prose screen counts a word as surviving if it appears **anywhere** in the file, so a sentence
  deleted from one section whose words happen to occur elsewhere would not be flagged.
  Sentence-level deletions of this kind were checked directly in the de-duplication files, but not
  exhaustively across all 219 lessons.

**Confidence.** High that no equation, number, unit, bound, or qualification was lost: the two
highest-risk categories — boxed final results, and de-duplicated Motivation prose — were each
verified by direct reading, and every instance survived. Moderate-to-high on the fine detail of
individual annotation rewordings, for the reasons above.

**Verdict: no restorations were necessary, and no lesson file was edited by this audit.**
