# Lesson corpus enrichment plan

Survey of all 219 MDX lessons in `src/content/lessons/`, done by shell/Python
census (word counts, component tags, `$$` blocks) plus close reading of a
sample across all six pillars. Read `docs/DESIGN_SYSTEM.md` §8 ("Visuals
must teach") and `docs/NARRATIVE_COMPONENTS.md` before acting on this.

**State as of this survey (2026-08-26):** the narrative-component pass
(`src/components/narrative/`, 11 components) is fully built AND wired into
`src/mdx-components.tsx` — imported and registered. **Zero lessons use any
of them.** This is the single biggest lever available: the infrastructure
this doc would otherwise be recommending you build already exists and is
sitting unused. Don't rebuild it — apply it.

## MDX hazards — read before editing any lesson file

Repeating verbatim, per instructions, because whoever acts on this plan will
touch every file below and both are silent-failure traps:

1. **`//` comments inside an `.mdx` top-level export block break every
   subsequent export in that file, causing silent 404s.** (Checked: none
   currently in the corpus — grep for `^\s*//` before the first `##` heading
   before you add one.)
2. **A `$$` display-math delimiter sharing a line with formula content
   *inside a custom JSX component* breaks closing-tag detection.** (Checked:
   none currently in the corpus. The 8 same-line `$$...$$` instances that do
   exist, e.g. `decoding-surface-codes.mdx:232`, are plain top-level Markdown
   math, not inside JSX children, so they're fine — but don't move one of
   those blocks inside a `<Callout>`/`<DerivationStep>` without splitting the
   delimiters onto their own lines.)

---

## Headline numbers

| Metric | Value |
| --- | --- |
| Lessons | 219 |
| Total words (prose, math/JSX stripped) | ~257,800 |
| `<ExternalFigure>` uses | 200 (197 Wikimedia, 3 NIST) |
| Named visualization-component uses | 369 (47 distinct components) |
| `<InteractiveSection>` uses | 204 |
| `<PredictBeforeReveal>` uses | 194 |
| Display-math (`$$…$$`) blocks | 724 |
| Narrative component (`LessonHook`, `ChallengePrompt`, etc.) uses | **0** |
| Lessons with genuinely zero visual content (no figure, no component, no inline SVG) | 1 |
| Lessons with zero *reusable-component* visuals (raw inline SVG instead) | 4 (all Apex) |
| Lessons with zero interactive element of any kind | 10 (all Apex) |
| CSP `img-src` violations found | 0 |

## Top 5 recommendations

1. **Apply the narrative components to content — this is the #1 lever.** 11
   components exist and are registered; 0 lessons use them. Start with the
   10 zero-interactive Apex lessons in §B and the "mislabeled interactive"
   list in §C — every one of them opens with a backward-reference
   ("The previous lesson showed…") instead of a hook, which is exactly what
   `LessonHook` + `NextDiscovery` fix.
2. **Fix Apex, specifically `research-methods-and-synthesis` and
   `algorithmic-frontiers`.** Apex is 2.7–6x more visual-starved than every
   other pillar by words-per-visual (1,335 vs. 219–404) and has 75% of its
   lessons with zero `<InteractiveSection>`.
3. **Replace the six "Interactive Visualization" sections that are static,
   non-interactive divs/SVGs mislabeled as interactive** (§C, table 1) —
   this is a naming-integrity problem a reader will notice immediately.
4. **`apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx`** is
   the only lesson in the entire corpus with zero visual content of any
   kind (2,790 words, 3 `PredictBeforeReveal`, nothing else) despite having
   the single most diagram-friendly content in the course (a P/NP/BQP/QMA/
   PSPACE containment map that four other lessons also describe in prose
   only — build one nested-set diagram, reuse it five times).
5. **Build one new component:** a complexity-class containment/Venn diagram.
   No existing component in `src/components/visualizations/` fits it, and
   five Apex lessons (§C) currently render `P ⊆ BQP ⊆ PSPACE`-style
   containments as prose or a static three-column div.

---

## A. Visual density

### A1. Words-per-visual by pillar (visual = ExternalFigure + named viz component; higher = more starved)

| Pillar | Lessons | Avg words | ExtFig | Viz components | Words/visual |
| --- | --- | --- | --- | --- | --- |
| **Apex** | 28 | 2,337 | 14 | 35 | **1,335** |
| Quantum Mastery | 31 | 1,473 | 29 | 84 | 404 |
| Quantum Computing | 60 | 995 | 60 | 79 | 328 |
| Quantum Mechanics | 72 | 847 | 70 | 102 | 299 |
| Quantum Software | 13 | 893 | 12 | 27 | 276 |
| Quantum Hardware | 15 | 963 | 15 | 42 | 219 |

**Apex is the most visually starved pillar by a wide margin** — 3-6x worse
than every other pillar, and it also has the highest average word count per
lesson, compounding the problem.

### A2. Lessons with ZERO visuals of any kind

Only one lesson in the whole corpus has no `<ExternalFigure>`, no named
visualization component, and no inline `<svg>`:

- **`apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx`**
  (2,790 words). Its "Interactive Visualization" section (line 299) is a
  static three-column `<div>` tier list (Proven / Conjectured / Open) — no
  chart, no figure, no interactivity.

Three more render a one-off hand-rolled `<svg>` directly in the MDX instead
of a reusable component (these are the "zero named-component visual"
lessons — real diagrams exist, but they're dead-end, non-interactive, and
duplicate work rather than reusing anything):

| Lesson | Words | Notes |
| --- | --- | --- |
| `apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx` | 3,526 | Inline `<svg>` under "Interactive Visualization" — not actually interactive |
| `apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx` | 3,479 | Same pattern |
| `apex/fault-tolerance-frontiers/lattice-surgery.mdx` | 2,266 | Hand-rolled 3-panel merge/split `<svg>` (lines 250–316) with no controls; `SurfaceCodePatchExplorer` (used one lesson earlier, in `surface-codes-in-depth.mdx`) draws the exact same lattice convention and would be the natural base to extend with a merge/split mode instead of a static SVG |

### A3. Worst text-to-visual ratio (words > 600, fewest visuals first)

| Words | Visuals | Lesson |
| --- | --- | --- |
| 3,526 | 0 | `apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx` |
| 3,479 | 0 | `apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx` |
| 2,790 | 0 | `apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx` |
| 2,266 | 0 | `apex/fault-tolerance-frontiers/lattice-surgery.mdx` |
| 2,951 | 1 | `apex/quantum-complexity-theory/the-local-hamiltonian-problem.mdx` |
| 2,897 | 1 | `apex/simulation-and-compilation-frontiers/when-classical-simulation-works.mdx` |
| 2,687 | 1 | `apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper.mdx` |
| 2,645 | 1 | `apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims.mdx` |
| 2,517 | 1 | `apex/fault-tolerance-frontiers/decoding-surface-codes.mdx` |
| 2,354 | 1 | `apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp.mdx` |
| 1,935 | 1 | `apex/fault-tolerance-frontiers/magic-states-and-distillation.mdx` |
| 1,905 | 1 | `apex/research-methods-and-synthesis/reproducing-and-designing-experiments.mdx` |
| 1,844 | 1 | `apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm.mdx` |
| 1,117 | 1 | `quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically.mdx` |
| 820 | 1 | `quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge.mdx` |

Every lesson in this list past the top 4 is Apex except the last two. This
is a pillar problem, not scattered noise.

### A4. Most-used visualization components (of 47 distinct ones used at least once)

`ParametricCurve` (69), `BarChartExplorer` (48), `BarChart` (43),
`MatrixGridExplorer` (26), `MatrixGrid` (23), `PipelineDiagram` (15),
`StaticCircuitDiagram` (13), `GraphDiagram`/`EnergyLevelDiagram`/
`VectorDiagram` (12 each). The long tail (30 of 47 components) is used
**once**, which suggests several were purpose-built for a single lesson
rather than designed for reuse — `SurfaceCodePatchExplorer`,
`RydbergBlockadeDiagram`, `BB84RoundTable`, `LogicalQubitPatchDiagram` are
good candidates for a second use site rather than a fresh one-off diagram
per lesson.

---

## B. Interaction density

### B1. Lessons with no interactive element at all (no `InteractiveSection`, no `PredictBeforeReveal`) — all 10 are Apex

| Words | Lesson |
| --- | --- |
| 3,526 | `apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx` |
| 3,479 | `apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx` |
| 2,687 | `apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper.mdx` |
| 2,645 | `apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims.mdx` |
| 2,456 | `apex/algorithmic-frontiers/the-quantum-singular-value-transformation.mdx` |
| 2,316 | `apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms.mdx` |
| 2,129 | `apex/algorithmic-frontiers/quantum-signal-processing.mdx` |
| 2,084 | `apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries.mdx` |
| 1,921 | `apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems.mdx` |
| 1,849 | `apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation.mdx` |

Two units account for all 10: `research-methods-and-synthesis` (5 of 6
lessons in that unit) and `algorithmic-frontiers` (5 lessons, the QSVT/QSP/
block-encoding sequence).

### B2. Interaction coverage by pillar

| Pillar | Zero `InteractiveSection` | Zero `PredictBeforeReveal` |
| --- | --- | --- |
| Apex | 21/28 (75%) | 10/28 (36%) |
| Quantum Mastery | 24/31 (77%) | 0/31 (0%) |
| Quantum Mechanics | 9/72 (12%) | 14/72 (19%) |
| Quantum Software | 2/13 (15%) | 0/13 (0%) |
| Quantum Computing | 2/60 (3%) | 0/60 (0%) |
| Quantum Hardware | 0/15 (0%) | 3/15 (20%) |

Quantum Mastery has almost as high a zero-`InteractiveSection` rate as
Apex (77% vs 75%), but is rescued by near-universal `PredictBeforeReveal`
use — Apex has neither safety net.

### B3. Recurring concepts with no interactive treatment anywhere

- **Complexity-class containment** (`P ⊆ BQP ⊆ PSPACE`, `NP ⊆ QMA ⊆ PSPACE`,
  etc.) appears as prose/inline-math in at least 5 lessons —
  `complexity-classes-p-np-and-bqp.mdx`, `qma-and-quantum-verification.mdx`,
  `the-local-hamiltonian-problem.mdx`, `query-complexity-and-lower-bounds.mdx`,
  `capstone-what-we-know-and-dont.mdx` — and **never once** as an actual
  diagram. No existing component in `src/components/visualizations/` is a
  nested-set/Venn diagram. See §C recommendation.
- **Resource estimation** (T-count, physical-qubit overhead, distillation
  yield) recurs across `magic-states-and-distillation.mdx`,
  `clifford-t-synthesis-and-resource-counting.mdx`,
  `capstone-resource-estimation-for-a-real-algorithm.mdx`,
  `capstone-from-algorithm-to-qubit-count.mdx`,
  `noise-aware-compilation-and-resource-estimation.mdx` — `CostLandscapeHeatmap`
  exists and is used exactly once elsewhere in the corpus; none of these
  five use it despite being the most natural fit for the concept.
- **"Entropy"-titled lessons**: 4 in the corpus
  (`entanglement-entropy-for-pure-states.mdx`, `purity-entropy-and-information.mdx`
  — both have sims — vs. `relative-entropy-and-mixed-state-entanglement.mdx`
  and `quantum-entropy-and-information-measures.mdx`, both Quantum
  Mastery, neither has an interactive simulator, only static
  `ParametricCurve`/`BarChart`). `DensityMatrixExplorer` (already built, used
  6x elsewhere) would fit both directly.

---

## C. Concrete opportunities — top 30 lessons

Every suggestion below is grounded in that lesson's actual content (read in
full or via its `lessonMeta.description` + section headings + relevant
excerpt). "Existing component" means literally usable via the registered
name in `src/mdx-components.tsx`; "new component" means nothing in
`src/components/visualizations/` or `src/components/simulators/` fits.

### Table 1 — mislabeled "Interactive Visualization" sections (fix first, cheap)

These six lessons have a heading that promises interactivity but deliver a
static div or SVG with no state, no controls, no `InteractiveSection`
wrapper. A reader who clicks around and finds nothing interactive under an
"Interactive Visualization" heading loses trust in the label everywhere
else on the site.

| Lesson | What's there now | Fix |
| --- | --- | --- |
| `apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx:299` | Static 3-column tier-list `<div>` (Proven/Conjectured/Open) | Keep the content, drop "Interactive" from the heading, OR make the tiers a filterable `BarChart`-style component — see new-component recommendation below |
| `apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper.mdx:240` | Static paper-anatomy mockup (`<div>` skeleton bars per section) | Wrap in `InteractiveSection`; add a `PredictBeforeReveal` per paper section ("which of these is most often oversold?") |
| `apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx` | Inline `<svg>` | Rename heading or make it a real component |
| `apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx` | Inline `<svg>` | Same |
| `apex/quantum-complexity-theory/the-local-hamiltonian-problem.mdx` | Inline `<svg>` | Same |
| `apex/simulation-and-compilation-frontiers/when-classical-simulation-works.mdx` | Inline `<svg>` ("Visualizing the Two Boundaries") | Same — this one is a genuinely good diagram concept (stabilizer-tableau vs. bond-dimension boundary), worth making a real `TensorNetworkDiagram`-adjacent component since `TensorNetworkDiagram` already exists and is used only twice |

### Table 2 — Apex lessons needing a real intervention

| Lesson | Component to use | What it teaches |
| --- | --- | --- |
| `apex/quantum-complexity-theory/capstone-what-we-know-and-dont.mdx` | **New: `ComplexityClassDiagram`** (nested-set/Venn, P/BPP/BQP/NP/QMA/PSPACE) | Makes the actual containment structure ($P\subseteq BQP\subseteq PSPACE$, $NP\subseteq QMA\subseteq PSPACE$) visually checkable instead of read as a string of symbols; reuse across the 4 other complexity lessons below |
| `apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp.mdx` | Same new `ComplexityClassDiagram` | Same containment map, this is where it's first introduced — build it here |
| `apex/quantum-complexity-theory/the-local-hamiltonian-problem.mdx` | Same `ComplexityClassDiagram` (QMA-complete highlighted) + existing `MeasurementTree` for the history-state clock construction | Shows Local Hamiltonian sitting exactly at the QMA-complete boundary; the clock-register history state (line ~284, $|\eta\rangle=\sum_t|t\rangle\otimes(\cdots)$) is a sequential construction `MeasurementTree` or `DerivationSteps` (narrative) fits well |
| `apex/quantum-complexity-theory/query-complexity-and-lower-bounds.mdx` | Existing `BarChart` already present (1) + **narrative `DerivationSteps`** for the adversary-method inequality chain | The lesson already has one `BarChart`; the missing piece is walking $\lVert\Gamma\rVert=\sqrt N$ → $\max_i\lVert\Gamma\circ D_i\rVert=1$ → $\mathrm{ADV}\ge\sqrt N$ as discrete, numbered steps instead of a wall of consecutive `$$` blocks |
| `apex/fault-tolerance-frontiers/lattice-surgery.mdx` | Extend `SurfaceCodePatchExplorer` with a merge/split toggle (replaces the hand-rolled `<svg>`, lines 250–316) | Lets a learner actually toggle "before / merging / after" instead of reading three static frozen panels; the lattice convention is already shared with `surface-codes-in-depth.mdx` so this is a genuine extension, not a new build |
| `apex/fault-tolerance-frontiers/decoding-surface-codes.mdx` | Its existing "Visualizing the Decode" section (1 component) — check whether it's `GraphDiagram`; if not, swap to `GraphDiagram` (already built, 12 uses) | Minimum-weight perfect matching *is* a graph algorithm on a defect graph — `GraphDiagram` is a direct fit; add `PredictBeforeReveal` before the "deliberately fails" case for the miscorrection outcome |
| `apex/fault-tolerance-frontiers/magic-states-and-distillation.mdx` | Existing `CostLandscapeHeatmap` (used once elsewhere) | The 15-to-1 distillation protocol's whole point is a cost/yield tradeoff — this is exactly what `CostLandscapeHeatmap` is for and it's sitting unused here |
| `apex/fault-tolerance-frontiers/the-threshold-theorem.mdx` | Existing `ParametricCurve` | Plot logical error rate vs. physical error rate on both sides of $p_{th}$ — the entire lesson is about a single crossing point, currently described only in prose |
| `apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm.mdx` | Existing `CostLandscapeHeatmap` or `PipelineDiagram` | Chains code-distance scaling → distillation cost → lattice-surgery overhead into one number; `PipelineDiagram` (15 uses elsewhere) already exists for exactly this "stages compose into one total" shape |
| `apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules.mdx` | Existing `MatrixGridExplorer` (Jordan-Wigner mapping is built from Matrix/Complex primitives per its own description) | The lesson already builds and numerically verifies $\{a_1,a_2^\dagger\}=0$ against explicit matrices — `MatrixGridExplorer` would let the learner watch the anticommutator vanish interactively instead of trusting the printed check |
| `apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting.mdx` | Existing `BarChart` | Compare T-count across synthesis algorithms — a direct bar-chart comparison, which is the lesson's actual claim ("the algorithm, not just the length, decides the count") |
| `apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation.mdx` | Already has `GraphDiagram` (1) — extend to show the noise-aware remapping, not just the routing graph | The lesson's real content is a *before/after* comparison (uniform routing vs. noise-aware remapping on the same 4-qubit example); currently only the routing graph is shown |
| `apex/algorithmic-frontiers/the-quantum-singular-value-transformation.mdx` | Existing `ParametricCurve` (has 1) — extend/pair with `PhaseWindingCircle` | QSVT's core mechanism is alternating phase rotations on ancilla-controlled subspaces — `PhaseWindingCircle` (built for phase-winding visualization, used once elsewhere) is a near-exact conceptual fit |
| `apex/algorithmic-frontiers/quantum-signal-processing.mdx` | **New: a Chebyshev-polynomial plot** — `ParametricCurve` can likely be reused directly (it's generic) | The lesson's central verified claim is "an all-zero-phase sequence produces exactly a Chebyshev polynomial" — plot the polynomial the phases produce, don't just assert it numerically matches |
| `apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries.mdx` | Existing `StaticCircuitDiagram` or `CircuitDiagramExplorer` | LCU's post-selection-on-ancilla construction is a circuit; the lesson already verifies it on "a real two-qubit circuit" per its own description but doesn't show the circuit |
| `apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems.mdx` | Existing `VectorDiagram` | Solving $Ax=b$ via a block-encoded inverse ends in a state proportional to the solution vector — show that vector, and what "proportional to" costs (normalization factor), visually |
| `apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation.mdx` | Has a "Visualizing the Schedule" section already (1 viz) — verify it's a real component vs. inline SVG; if inline, swap to `BarChart` | The lesson's claim is a scaling comparison (QPE-based vs. maximum-likelihood schedule) — directly chartable |
| `apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms.mdx` | Has `BarChart` already (old-framing vs. QSVT-framing query complexity) — good, keep; add narrative `InsightBlock` | This is the strongest-visualized Apex capstone in the list; the gap is narrative, not visual — a single `InsightBlock` stating "one polynomial now produces four algorithms" would land the capstone's whole point |
| `apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims.mdx` | **New/reuse: a 5-question checklist component** (the lesson's own description calls it "a five-question checklist") | Currently prose; a `PredictBeforeReveal`-style walk-through of the checklist against a real claim (the lesson already does this for 4 claims elsewhere in the pillar) would make the checklist actionable rather than read-only |
| `apex/research-methods-and-synthesis/reproducing-and-designing-experiments.mdx` | Already has `InteractiveSection` + `ParametricCurve` (1 each) — reasonably visualized; the gap is the missing forward hook (no `Further Exploration`/`Next:`) | Add `NextDiscovery` |
| `apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper.mdx` | See Table 1 | — |
| `apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx` | See Table 1; also **New: `ComplexityClassDiagram`** reuse (checklist is applied to complexity claims) | — |
| `apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx` | See Table 1 | — |

### Table 3 — Quantum Mastery / Quantum Mechanics selections

| Lesson | Component | What it teaches |
| --- | --- | --- |
| `quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures.mdx` | Existing `DensityMatrixExplorer` (simulator, 6 uses elsewhere) | Lesson's own climax is "conditional entropy can be negative" — an interactive density-matrix explorer where the learner can watch $S(A|B)$ go negative on an entangled state is far stronger than the current static `ParametricCurve` |
| `quantum-mastery/quantum-shannon-theory/the-data-processing-inequality.mdx` | Already has `InteractiveSection` + `ParametricCurve` — reasonably covered | Gap is narrative (`LessonHook`) more than visual |
| `quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification.mdx` | Existing `MatrixGridExplorer` | Lesson builds "the explicit two-qubit unitary that reproduces amplitude damping's $K_0,K_1$" — show that unitary matrix and the resulting Kraus operators side by side |
| `quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces.mdx` | Existing `BarChart` (has 1) already present for the typical subspace — reasonable; consider `PhaseSpacePanel` alternative if a probability-mass view would land better | Adequate; lower priority than the above |
| `quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically.mdx` | Existing `PotentialDiagram` (has 1) — extend to show the actual bisection root-finder converging live | The lesson's own hook is "a real, tested numerical root-finder" — showing the bisection interval shrinking on the transcendental-equation plot would make the numerics tangible instead of narrated |
| `quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge.mdx` | Existing `PotentialDiagram`/`ScatteringStandingWave` (has 2) | Synthesis capstone — a single comparative `PotentialDiagram` showing bound vs. scattering regimes side by side would tie its "every 1D system" claim together visually |

---

## D. Narrative structure

**Structural finding:** all 219 lessons already open with a `## Motivation`
heading — the template is universal. The real variation is in *what kind*
of Motivation section it is.

### D1. Hook-style openings (question, historical anecdote, surprising claim) — sampled, strong in Quantum Mechanics/Hardware

- `quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment.mdx` — "In 1922, nothing in physics predicted what was about to happen…"
- `quantum-mechanics/classical-to-quantum/position-and-momentum.mdx` — laser-diffraction hook
- `quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels.mdx` — "Heat hydrogen gas and it doesn't glow across a smooth rainbow…"
- `quantum-mechanics/identical-particles/the-pauli-exclusion-principle.mdx` — "Push your hand against a table and something stops it…"
- `quantum-mechanics/identical-particles/multi-electron-atoms-introduction.mdx` — periodic-table shape question
- `quantum-hardware/noise-decoherence-and-scaling/crosstalk.mdx` — "Ask a hardware team what limits their two-qubit gate fidelity…"
- `quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence.mdx` — press-release hook
- `quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation.mdx` — "Ask a quantum particle how it got from A to B…"

These read as genuine hooks already; `LessonHook` would formalize/emphasize
the existing sentence rather than requiring new writing.

### D2. Pure continuity-recap openings ("The previous/last lesson showed…") — dominant pattern in Apex and Quantum Mastery

Sampled and confirmed as the dominant Motivation pattern in both pillars —
**every Apex lesson sampled** opened this way, including
`quantum-signal-processing.mdx`, `amplitude-estimation-without-phase-estimation.mdx`,
`the-threshold-theorem.mdx` (this one does open with a real hook — Shor's
algorithm vs. decoherence — but is the exception), `complexity-classes-p-np-and-bqp.mdx`,
`the-local-hamiltonian-problem.mdx`, `qma-and-quantum-verification.mdx`,
`tensor-networks-and-matrix-product-states.mdx`, and nearly every Quantum
Mastery lesson sampled (`phase-estimation-precision-and-qft-depth.mdx`,
`hilbert-spaces-and-self-adjointness.mdx`, `povms-and-generalized-measurement.mdx`,
`the-data-processing-inequality.mdx`, `clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx`).

This is not wrong — it's a deliberate continuity device for an advanced,
sequential curriculum — but it means these pillars have **no actual hook
moment**, just a recap-then-pivot. `LessonHook` is the direct fix: keep the
continuity sentence, add one striking claim/question in the display voice
before it.

### D3. Forward hook (a `Further Exploration` section that ends with `Next: [...]`)

55 of 219 lessons lack this pattern entirely — either no `Further
Exploration` section, or one that doesn't point forward. Notable
concentrations: most Apex capstones (`capstone-what-we-know-and-dont.mdx`,
`capstone-resource-estimation-for-a-real-algorithm.mdx`,
`capstone-from-algorithm-to-qubit-count.mdx`, `capstone-what-scale-actually-requires.mdx`,
`capstone-what-rigor-buys-you.mdx`), which makes sense structurally (a
capstone ends a unit) but is exactly where `NextDiscovery` pointing to the
*next unit* would help retention most. Also: `bb84-quantum-key-distribution.mdx`,
`quantum-teleportation.mdx`, `superdense-coding.mdx`, `the-bloch-sphere.mdx`,
`what-is-a-qubit.mdx`, `trapped-ions.mdx`, `t1-and-t2-decoherence.mdx` — all
high-traffic, early-course lessons that currently just stop.

### D4. Where the new components help most

- **`LessonHook`**: every Apex and Quantum Mastery lesson in D2's list (≈40+
  lessons) — add one sentence before the existing recap paragraph.
- **`NextDiscovery`**: all 55 lessons in D3, prioritize the 5 Apex/Mastery
  capstones plus the 7 early Quantum Computing lessons named above (highest
  traffic).
- **`ChallengePrompt`**: pairs naturally with `NextDiscovery` at the same
  end-of-lesson beat; none of the 219 lessons currently use it, but the
  existing "Practice Questions" sections in nearly every lesson are already
  doing this job in a less inviting register — don't duplicate, consider
  whether `ChallengePrompt` should *replace* the first practice question
  rather than add a 12th component to an already-long lesson.
- **`ResearchConnection`**: best fit is Apex (`research-methods-and-synthesis`,
  `fault-tolerance-frontiers`) where real citable results already exist in
  prose (e.g. `the-threshold-theorem.mdx`'s Shor's-algorithm framing,
  `magic-states-and-distillation.mdx`) but aren't set off from the
  surrounding derivation.
- **`HistoricalMoment`**: `the-stern-gerlach-experiment.mdx` (1922),
  `hydrogen-energy-levels.mdx` (Balmer 1885), `bells-theorem-and-local-hidden-variables.mdx`,
  and `computational-cost-and-scaling.mdx` (Feynman's 1981 MIT/IBM keynote,
  already narrated in prose) are direct fits already sitting in the text.

---

## E. Existing imagery audit

**Clean.** Every `<ExternalFigure src="...">` in the corpus resolves to an
allow-listed host:

| Host | Count |
| --- | --- |
| `upload.wikimedia.org` | 197 |
| `www.nist.gov` | 3 |

Zero violations of `next.config.ts`'s CSP `img-src`. Every `<ExternalFigure>`
block has non-empty `alt`, `caption`, `credit`, `creditUrl`, and `license`
props — no missing-attribution cases found. A handful of `credit="NIST"`
values are short (4 characters) but that's a legitimate credit string, not
weak attribution — no genuine quality issues found in alt/caption/credit
text on manual spot-check of the shortest ones.

If new external images are added: **the only two allow-listed hosts are
`upload.wikimedia.org` and `www.nist.gov`**, enforced by
`src/lib/content/__tests__/lessonImages.test.ts`, which parses
`next.config.ts`'s CSP directly. A new host requires updating both files
together or the image silently 404s with no build error.

---

## F. Risks — reported, not fixed

1. **Six "Interactive Visualization" headings are not interactive** (§C
   Table 1) — a labeling/trust problem, not a bug, but worth fixing before
   a reader notices the pattern: `capstone-what-we-know-and-dont.mdx:299`,
   `how-to-read-a-quantum-computing-paper.mdx:240`,
   `capstone-the-quantum-computing-landscape-today.mdx`,
   `distinguishing-theorem-from-heuristic.mdx`,
   `the-local-hamiltonian-problem.mdx`,
   `when-classical-simulation-works.mdx`.
2. **`lattice-surgery.mdx` (lines 250–316) hand-rolls a 3-panel static SVG**
   duplicating `SurfaceCodePatchExplorer`'s lattice convention (used one
   lesson earlier in `surface-codes-in-depth.mdx`) instead of extending that
   component — a maintenance fork risk if the lattice-drawing convention
   ever changes, since it would need to change in two places by hand.
3. **Narrative-component/content gap**: `docs/NARRATIVE_COMPONENTS.md` and
   `src/mdx-components.tsx` are fully current (11 components, all
   registered) but zero lessons use any of them. Not a bug, but flagged
   because it means the "narrative structure" half of the redesign has
   shipped infrastructure with no visible effect on any page yet — worth
   confirming this is understood as WIP rather than assuming it's finished.
4. **30 of 47 visualization components are used exactly once** (§A4) —
   several read as purpose-built for one lesson (`RydbergBlockadeDiagram`,
   `BB84RoundTable`, `SurfaceCodePatchExplorer`, `LogicalQubitPatchDiagram`).
   Not wrong, but worth checking each one for a second legitimate use site
   before building something new for a similar concept (see `lattice-surgery.mdx`
   above, which built new instead of reusing).
5. No broken internal `/lessons/...` links found (checked every
   `](/lessons/...)` reference against the actual corpus — all resolve).
6. No encoding/mojibake issues found in the corpus.
7. No instances of either known MDX hazard found in the current corpus
   (checked above) — this is a clean baseline, not a guarantee for future
   edits.

I did not evaluate the physics/math content itself for correctness beyond
spot-checking the lessons read in full (`position-and-momentum.mdx`,
`lattice-surgery.mdx`) — both were internally consistent and appropriately
hedged about what's derived vs. asserted. A dedicated scientific-accuracy
pass was out of scope for this visual/structural survey.
