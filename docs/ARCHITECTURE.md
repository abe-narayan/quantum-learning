# QuantumLearn — Platform Architecture

This document is the product/engineering blueprint for QuantumLearn: a free,
in-depth educational platform covering Quantum Mechanics, Quantum Computing,
Quantum Hardware, Quantum Software, Quantum Mastery, and Apex, taking a
student from strong high-school math through graduate-level, research-adjacent
material.

It exists so that as hundreds of lessons and dozens of simulators get built
over time, they get built *onto* a consistent structure instead of each
being a one-off decision. Update this document when the architecture
changes — it should stay the source of truth, not a snapshot.

---

## 1. Information Architecture

**Top-level navigation (current, `src/lib/nav.ts` /
`src/components/layout/Navbar.tsx`):** Learn · a grouped **Tracks** dropdown
(Mechanics · Computing · Hardware · Software · Mastery · Apex, in curriculum
order) · Simulators · Map · Glossary · Problems · Current Quantum · About.
The logo itself links home, so a separate "Home" text link was dropped as
pure duplication. `/map` (`src/components/map/`, an interactive
concept-dependency map) and `/glossary` (an alphabetical term reference
linked back into lessons) are both real, shipped pages not covered anywhere
else in this document.

**`/lessons` no longer has its own UI.** `src/app/lessons/page.tsx` is now a
5-line `permanentRedirect("/learn")` stub. The flat, catalog-style lesson
detail route (`/lessons/<pillar-slug>/<course-slug>/<lesson-slug>`) still
exists and is what lesson links resolve to — only the `/lessons` *index*
page was collapsed into `/learn`, once having both stopped pulling their
weight as two separate entry points into the same `CourseList` view. Learn
(`/learn`) is now the single guided entry point — all six pillars (Quantum
Mechanics, Quantum Computing, Quantum Hardware, Quantum Software, Quantum
Mastery, and Apex) presented with framing, so a new visitor understands the
shape of the whole curriculum and where to start — backed by the one
curriculum registry (`src/lib/content/curriculum.ts`), so there remains
exactly one source of truth for "what courses exist."

**Hardware** and **Software** are full pillars in the curriculum registry
(on equal footing with Mechanics and Computing), and also get their own
routes (`/hardware`, `/software`) for direct linkability and SEO, since a
student searching "how do superconducting qubits work" shouldn't have to go
through `/learn` first — reachable today via the Tracks dropdown rather than
as flat top-level items.

Individual lessons live at a **flat, catalog-style URL**:
`/lessons/<pillar-slug>/<course-slug>/<lesson-slug>`, e.g.
`/lessons/quantum-computing/qubits-and-quantum-states/what-is-a-qubit`. The
path segments happen to mirror the pillar/course structure (for readability
and to avoid slug collisions across pillars), but the route itself is a
single catch-all (`app/lessons/[...slug]/page.tsx`) — a lesson's URL is
just wherever its `.mdx` file sits in `src/content/lessons/`.

**The flat-navbar tension flagged in earlier revisions of this document is
resolved.** The six pillar/track pages now live under one grouped **Tracks**
dropdown (`TRACK_NAV_ITEMS` in `src/lib/nav.ts`, rendered by
`Navbar.tsx`'s `TracksDropdown`) rather than as flat top-level items — the
fix this section used to describe as "the obvious next evolution."
`nav.ts`'s own comment records why: a flat bar mixing Learn/Lessons and four
individually-named pillar pages was flagged repeatedly as real, user-facing
redundancy, since a first-time visitor had no way to tell "Learn" from
"Mechanics" from the labels alone. The dropdown renders as a two-column grid
once there are six entries (an instrument-panel grid, not a scrolling list)
and closes on Escape, outside click, and blur — see the long comment on
`TracksDropdown` for the accessibility reasoning. The desktop nav still
switches to a hamburger menu below the `lg` breakpoint; **Quantum Mastery**
was, for a long stretch, the one pillar with no landing page of its own
(the pillar-route table pointed it at `/learn` and the Tracks nav simply
omitted it) — it now has a real page at `/mastery`, and
`src/lib/design/__tests__/pillars.test.ts` asserts every pillar in
`PILLAR_ORDER` both has a page file and appears in `TRACK_NAV_ITEMS`, so this
particular drift can't recur silently.

**Homepage.** `src/app/page.tsx` is a `PillarScope`-wrapped descent through
the curriculum: a real, manipulable hero simulation, then one section per
pillar in learning order (`src/components/home/{Mechanics,Computing,
Hardware,Software,Mastery,Apex}Section.tsx`), ending on Apex's closing call
to action. See §7c for the background-field and motion architecture this
composition is built on.

---

## 2 & 3. Curriculum Architecture — Quantum Mechanics & Quantum Computing

The full registry lives in `src/lib/content/curriculum.ts` as plain,
statically-typed data (`PILLARS` and `COURSES`) — **not** hardcoded into any
page component. This is metadata/taxonomy, not lesson content: course
titles, one-line descriptions, difficulty, estimated hours, and prerequisite
edges. No lesson bodies are declared here.

**Quantum Mechanics** — 10 courses, sequential, each gated by the last:

`Mathematical Foundations → From Classical to Quantum → Wave Mechanics &
the Schrödinger Equation → Operators, Observables & Measurement →
One-Dimensional Quantum Systems → Angular Momentum & Spin → The Hydrogen
Atom → Approximation Methods → Identical Particles & Many-Body Systems →
Advanced Topics in Quantum Mechanics`

This is the standard undergraduate QM sequence (comparable to a two-semester
Griffiths-style course), reorganized into courses sized so each has a clear
prerequisite chain and a coherent set of ~4-5 modules.

**Quantum Computing** — 6 courses, deliberately able to **start in
parallel** with Quantum Mechanics: `Qubits & Quantum States` only requires
`Mathematical Foundations` (linear algebra + probability), not the full QM
sequence. This matches how quantum computing is actually taught — you don't
need the Schrödinger equation to understand a Bloch sphere.

`Qubits & Quantum States → Quantum Gates & Circuits → Entanglement, Mixed
States & Bell Tests → Quantum Algorithms I: Foundations → Quantum
Algorithms II: Advanced → Quantum Error Correction & Fault Tolerance`

The first two are fully authored (10 lessons each); the third was
originally scoped as "Measurement, Superposition & Entanglement" with
placeholder modules (`bell-states`, `the-no-cloning-theorem`,
`quantum-teleportation`) that turned out to duplicate what Quantum Gates &
Circuits ended up teaching in depth once it was actually written — a
placeholder module list is a guess made before the adjacent course exists,
and guesses need revisiting once reality catches up. It was renamed and
rescoped (still a placeholder) to build *past* single-pair entanglement —
multipartite states, mixed states, Bell inequalities — rather than repeat
it. See the changelog at the end of this document.

**Modules are intentionally lean** (`{ slug, title }` only, no per-module
description) — at 219 modules across 32 courses (platform-wide, once
Quantum Mastery and Apex are counted — see §4b/§4c), module-level prose
would either be padding or drift out of sync with the actual lesson.
Descriptions live at the course level (32 of them, one sentence each —
genuinely useful copy) and at the lesson level (`LessonMeta.description`,
written by whoever authors that lesson).

**Prerequisites are a graph, not a list position** — `Course.prerequisites`
is an array of course slugs, so a course can require multiple prior courses,
and courses from different pillars can reference each other (as
`quantum-computing/qubits-and-quantum-states` does). This is what will
eventually power "you're missing a prerequisite" warnings without any
rewrite. Quantum Mastery is where this graph structure stops being a
convenience and becomes load-bearing: courses like
`quantum-information-theory` (prerequisites: the *last* course of Quantum
Mechanics **and** the *last* course of Quantum Computing) or
`advanced-algorithms-and-complexity` (the last Quantum Computing algorithms
course **and** the last Quantum Software course) genuinely cannot be
expressed as a single list position in any one pillar — see §4b.

---

## 4. Hardware & Software in the Overall Platform

Hardware and Software are treated as **full pillars**, structurally
identical to Mechanics and Computing (same `Course`/`Module` shape, same
`CourseList` rendering, same prerequisite-graph mechanism) — just smaller
for now (3 courses each) because they're more specialized and lower-priority
initially than the two theory pillars.

Both cross-reference into Quantum Computing rather than duplicating it:
`Physical Qubit Platforms` (Hardware) and `Programming Quantum Computers`
(Software) both list a Quantum Computing course as a prerequisite. The
intent is that a student typically arrives at Hardware/Software *after*
building a computing foundation, but nothing stops direct entry — the
`/hardware` and `/software` pages work as standalone landing pages, prereqs
are shown as information, not an access gate (there's no auth to gate
anything with yet — see §9).

---

## 4b. Quantum Mastery in the Overall Platform

Quantum Mastery is a **fifth full pillar** — same `Course`/`Module` shape,
same `CourseList` rendering, same prerequisite-graph mechanism as every
other pillar — sized between Hardware/Software and the two founding theory
pillars: 5 courses, 31 modules, 56 estimated hours. It is also the first
pillar to use `difficulty: "master"`, a tier that appears nowhere in
Mechanics, Computing, Hardware, or Software, all of which top out at
`"advanced"`.

Its `PILLARS` entry describes it plainly: "Graduate-level mathematical
physics and rigorous quantum information theory for those who've completed
the core curriculum — proofs, not just results, drawing on and extending
every earlier pillar." That "extending every earlier pillar" is the literal
shape of its `prerequisites` arrays, not marketing copy. Unlike
Mechanics/Computing/Hardware/Software, where all but each pillar's entry
course chain linearly off one predecessor, Mastery's five courses reach
back into specific, sometimes-plural completion points scattered across the
whole prior curriculum rather than off each other:

- `Hilbert Space & Spectral Theory` requires `Operators, Observables &
  Measurement` and `One-Dimensional Quantum Systems` (courses 4 and 5 of
  Quantum Mechanics's ten) — it opens as soon as those two are done, without
  waiting for the rest of Mechanics.
- `Symmetry, Scattering & Semiclassical Methods` requires only
  `Approximation Methods` (course 8 of 10) — another early-entry course
  relative to the rest of Mechanics.
- `Rigorous Quantum Information Theory` requires `Advanced Topics in
  Quantum Mechanics` **and** `Quantum Error Correction & Fault Tolerance` —
  literally the last course of Mechanics and the last course of Computing,
  so both entire theory pillars must be finished first.
- `Quantum Algorithms, Complexity & Simulation at Scale` requires `Quantum
  Algorithms II: Advanced` **and** `Compilation & Hybrid Algorithms` — the
  last algorithms course of Computing plus the last course of Software.
- `Quantum Shannon Theory` requires `Rigorous Quantum Information Theory` —
  the only course-to-course edge that stays inside Mastery itself, making
  it the pillar's genuine capstone course.

So Mastery is not a single linear track the way Mechanics is: two courses
open up mid-way through Mechanics and can run in parallel with the rest of
the core curriculum, while three courses gate on nearly the entire
four-pillar core being complete, ending in one course that gates on the
pillar's own prior course. `/mastery` (§1) presents it as the graduate-level
fifth pillar; nothing in the routing enforces this graph as an access gate
(the same "prereqs as information, not access control" policy as the rest
of this section).

The lessons bear out the "proofs, not just results" framing rather than
merely asserting it.
`hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness.mdx`
opens by showing that the momentum operator on a half-line passes the naive
$A=A^\dagger$ Hermiticity check used throughout Wave Mechanics and
Operators, Observables & Measurement, and still turns out to have no
self-adjoint extension at all — a genuine deficiency-index calculation, not
a rehash of earlier material under new vocabulary.
`symmetry-scattering-and-semiclassical-methods` explicitly finishes work
its own course description says Fine Structure (Introduction), in The
Hydrogen Atom, "explicitly declined to do," carrying degenerate
perturbation theory through to real spin-orbit splitting.
`quantum-information-theory` proves the Schmidt decomposition that
Entanglement, Mixed States & Bell Tests only asserted, and derives the
Lindblad master equation as the actual continuous-time origin of the T1/T2
decoherence rates Quantum Hardware's Noise, Decoherence & Scaling course
used as given constants. `quantum-shannon-theory`'s capstone
(`capstone-what-can-be-sent-through-noise.mdx`) computes both the classical
(Holevo) and quantum (coherent-information) capacity of a concrete
depolarizing channel and shows they can diverge — one positive, one zero —
the kind of quantitative result the pillar's earlier lessons build toward
rather than merely gesture at.

Every module the registry declares for this pillar has a matching `.mdx`
file under `src/content/lessons/quantum-mastery/` (31 files, one per
module) and a matching problem set under
`src/content/problems/quantum-mastery/` — there is no placeholder gap in
this pillar the way Quantum Computing's `entanglement-and-measurement`
course once had (§2 & 3).

---

## 4c. Apex in the Overall Platform

Apex is the sixth and, per §7c, the curriculum's **terminal pillar**: 5
courses, 28 modules, 48 estimated hours, every course again at the
`"master"` difficulty tier. Its `PILLARS` description calls it "the summit
of QuantumLearn: research-depth algorithms, fault tolerance, complexity
theory, large-scale simulation and compilation, and a final course in
reading and evaluating real quantum-computing research — the point where a
motivated student can approach the literature without being lost."

Structurally, Apex sits strictly after Quantum Mastery: every one of its
five courses' `prerequisites` arrays resolves back into a Mastery course
(never directly into Mechanics, Computing, Hardware, or Software), so there
is no way to reach Apex without going through Mastery first:

- `Algorithmic Frontiers` requires `Quantum Algorithms, Complexity &
  Simulation at Scale`.
- `Fault Tolerance Frontiers` requires `Rigorous Quantum Information
  Theory`.
- `Quantum Complexity Theory` requires `Quantum Algorithms, Complexity &
  Simulation at Scale` (the same Mastery course as Algorithmic Frontiers —
  the two can be taken in either order, or in parallel).
- `Simulation & Compilation Frontiers` requires `Quantum Algorithms,
  Complexity & Simulation at Scale` **and** `Compilation & Hybrid
  Algorithms` — reaching one hop further back, into Software.
- `Research Methods and Synthesis` requires all **four** other Apex courses
  simultaneously — the only course in the entire 32-course curriculum with
  four prerequisites, making it a genuine capstone-of-capstones rather than
  another parallel track.

That structure matches what each course actually teaches.
`Algorithmic Frontiers` covers block encodings, quantum signal processing,
and the quantum singular value transformation (QSVT) that, per its own
course description, "unifies Grover's algorithm, Hamiltonian simulation,
and linear-systems solving as one construction" — borne out in the lesson
content itself, e.g. `the-quantum-singular-value-transformation.mdx`, which
runs a concrete degree-4 QSP polynomial against $\cos x$ numerically rather
than only stating the theorem. `Fault Tolerance Frontiers` goes past
Quantum Error Correction & Fault Tolerance's conceptual introduction to
surface codes into a real 2D lattice, decoding, lattice surgery, and
magic-state distillation, ending in a worked resource estimate.
`Quantum Complexity Theory` extends `advanced-algorithms-and-complexity`'s
BQP/oracle-complexity material to QMA and the Local Hamiltonian problem —
real complexity-theoretic machinery, not an algorithms course under a new
name. `Simulation & Compilation Frontiers` picks up Quantum Software's
tensor-network and transpilation material and pushes it to the question of
exactly which circuits are classically simulable, and to a real
molecule-to-qubit-count worked example.

The final course, `Research Methods and Synthesis`, is deliberately not new
physics — its own lesson content says so directly.
`how-to-read-a-quantum-computing-paper.mdx` opens "Not a new law of
physics, not a new algorithm — a reading strategy," and states plainly that
"the final course of QuantumLearn opens not with new physics but with a
practical skill." It teaches how to read a real paper's precise claim
against its abstract's framing, how to distinguish a proven theorem from a
numerical experiment from a heuristic, and how to spot a "quantum
advantage" claim measured against a weak classical baseline — the explicit
intent being that by the end, a motivated student "can approach the
literature without being lost" (the pillar's own description, quoted
above). Its capstone lesson,
`capstone-the-quantum-computing-landscape-today.mdx`, is the platform's own
closing synthesis, matching the homepage's "Apex's closing call to action"
(§1).

As with Mastery, every module the registry declares for Apex has a matching
`.mdx` file under `src/content/lessons/apex/` and a matching problem set
under `src/content/problems/apex/`.

---

## 5. Content / Lesson Data Model

**Format decision: MDX**, via `@next/mdx`. Reasoning:

- It's the officially supported Next.js content path, works with Server
  Components and Turbopack out of the box, and needs no external CMS or
  database.
- Lesson prose can embed real interactive components directly
  (`<BlochSphereExplorer />`, `<CircuitBuilder />`, etc.) — this is
  non-negotiable given "interactive experimentation" is a stated core
  requirement, and plain Markdown can't do it.
- Metadata lives as a JS export from the file itself
  (`export const lessonMeta = {...}`) rather than YAML frontmatter.
  `@next/mdx` doesn't parse frontmatter by default, and the export approach
  avoids adding a frontmatter-parsing dependency (`gray-matter` or similar)
  — one fewer package, and the metadata is type-checked as regular JS/TS
  wherever it's consumed.

**Directory layout:**

```
src/content/lessons/<pillar-slug>/<course-slug>/<lesson-slug>.mdx
```

**`LessonMeta` shape** (`src/lib/content/types.ts`) — covers exactly the
fields requested: `title`, `description`, `course`, `module`, `order`,
`difficulty`, `estimatedMinutes`, `prerequisites` (lesson slugs), and
`objectives`. `slug` is *not* part of the exported object — it's derived
from the file's path by the loader, so there's no way for a lesson's
metadata and its actual URL to disagree.

**Loading (`src/lib/content/lessons.ts`)** — server-only:

- `getAllLessonSlugs()` — returns every authored slug, sourced from
  `lessonMeta.generated.ts` (see below). This is what
  `generateStaticParams` uses; `scripts/generate-lesson-registry.mjs` runs
  before every dev/build/test, so every deploy picks up newly authored
  lessons automatically — no registry to hand-update per lesson.
- `loadLesson(slug)` — a dynamic `import(`@/content/lessons/${slug}.mdx`)`,
  returning `{ default: Component, lessonMeta }`. This is the pattern
  Next's own docs recommend for slug-driven MDX content outside `app/`, and
  it means content isn't bundled into every page's JS — each lesson is its
  own chunk, loaded only when its route is hit.
- `getAllLessonsMeta()` — every lesson's metadata plus its slug
  (`LessonMetaWithSlug`), used for catalog pages and for resolving
  prerequisites (next paragraph). Served from
  `src/lib/content/lessonMeta.generated.ts`, a plain-data registry that
  `scripts/generate-lesson-registry.mjs` text-extracts from the MDX sources
  (the same brace-scan technique the search-index generator uses). It used
  to dynamically import all 219 *compiled* MDX modules just to read their
  `lessonMeta` exports — since the root-layout Footer calls this, every
  static-generation worker held the whole compiled corpus (~36MB of
  KaTeX-heavy JS) in memory for the entire build, which OOM'd Vercel's 8GB
  build container. Registry↔module drift is caught by a deep-equality test
  in `src/lib/content/__tests__/lessons.test.ts`.

**Lesson identity and cross-course prerequisites.** A lesson's *identity*
is its file-path-derived slug — there is no separate ID field. This is a
deliberate "smallest clean" choice: introducing a decoupled ID (and an
alias/redirect map for renames) is a real future improvement once lesson
URLs are live and stable, but would have been premature architecture for
content that's still being authored. `LessonMeta.prerequisites` is an
array of these slugs, and — critically — they are **not** scoped to the
current course: a Quantum Gates & Circuits lesson can (and does) list a
Qubits & Quantum States lesson as a prerequisite, with no special-casing
anywhere in the loader or the curriculum registry.

The route (`app/lessons/[...slug]/page.tsx`) fetches `getAllLessonsMeta()`
**once** and passes the full list into `LessonLayout` as `allLessons`.
`LessonLayout` then does two different things with the same list:
prerequisites resolve by scanning *all* of `allLessons` (so cross-course
links just work), while previous/next navigation and the "Lesson X of Y"
progress indicator filter that same list down to the current lesson's own
course before computing position (so course-local nav stays course-local).
One fetch, one array, two different scopes derived from it — this is the
fix for what was previously a bug: an earlier version fetched only the
current course's lessons, so a cross-course prerequisite would silently
fail to resolve into a link. If a prerequisite slug doesn't resolve to any
authored lesson (typo, or the target hasn't been written yet), it's
silently dropped from the display rather than crashing the page.

Catalog pages (`/learn`, `/lessons`, `/hardware`, `/software`) call
`getAllLessonsMeta()` once, and cross-reference the result against
`curriculum.ts`'s module list to show "View →" for authored lessons and
"Coming soon" for everything else. Nothing about this breaks at 5, 50, or
500 lessons — it's a filesystem walk plus a `Map` lookup, not something
that needs restructuring as content grows.

**Global MDX styling:** `@tailwindcss/typography`'s `prose` classes handle
lesson body typography (headings, lists, code, math spacing) without
hand-styling every element per lesson. `src/mdx-components.tsx` (the
required Next.js file for App Router MDX) currently exposes one custom
shortcode, `<Callout type="note" | "warning" | "mistake">`, matching the
"common mistakes" section of the required 10-part lesson structure — usable
in any `.mdx` file with no per-file import.

**Math rendering:** `remark-math` + `rehype-katex` + `katex`. KaTeX was
chosen over MathJax because it renders to static HTML/CSS at *build time*
(via the rehype pipeline) — a lesson page needs zero client-side JS to
display correct, accessible math, which matters a lot once there are
hundreds of math-heavy pages. `remark-gfm` is also enabled for tables
(needed for things like quantum-number tables, gate truth tables).

---

## 6. Simulator Architecture

`src/lib/quantum/` is a **pure, framework-free TypeScript math engine** — no
React, no DOM, nothing UI-related. It's the foundation every simulator
(Bloch sphere, circuit builder, entanglement visualizer, etc.) will sit on
top of, so the math is written and verified exactly once.

| File | Contents |
|---|---|
| `complex.ts` | Immutable `Complex` number class — arithmetic, polar form, magnitude, phase |
| `matrix.ts` | Immutable complex `Matrix` — add, scale, multiply, Kronecker/tensor product, conjugate transpose, apply-to-vector |
| `state.ts` | `StateVector` — an n-qubit pure state, normalization (`isNormalized`), measurement probabilities, inner product, tensor composition (`.tensor()`, plus the module-level `tensorStates()` for combining more than two at once) |
| `gates.ts` | Standard gate matrices (`I, X, Y, Z, H, S, T`, parametrized `Rx/Ry/Rz`, `phase(θ)`) plus `applySingleQubitGate` / `applyControlledGate` / `applyCNOT` / `applyCZ` / `applySwap`, which apply a gate to specific qubit(s) within a larger register |
| `measurement.ts` | `measurementDistribution` / `measure` (full-register Born-rule probabilities and collapse) plus `qubitMeasurementProbabilities` / `measureQubit` (partial measurement of one qubit within a multi-qubit state, added for Quantum Gates & Circuits — see below) |
| `twoQubit.ts` | `testSeparability` and `twoQubitJointProbabilities` — the two genuinely 2-qubit-specific math functions (see below); deliberately its own file rather than folded into `state.ts`, since the separability test doesn't generalize past 2 qubits the way everything else in the engine does |
| `format.ts` | `formatAmplitudeLatex` — the one formatting helper shared between the Bloch sphere simulator and lesson-embedded state displays, kept here (not under `components/`) since multiple, otherwise-unrelated UI pieces consume it |
| `observables.ts` | `expectationValue`, `variance`, `uncertainty`, `commutator`, `commutatorExpectation` — added for the "From Classical to Quantum" course's Expectation Values and Uncertainty lesson; kept separate from `measurement.ts` since these describe the *statistics* of an observable's outcome distribution (a property of state + operator), not the act of sampling/collapsing one |
| `harmonicOscillator.ts` | `annihilationOperator`, `creationOperator`, `numberOperator`, `harmonicOscillatorEnergyLevels`, `positionOperator` (added for Approximation Methods' perturbation-theory lesson — $x=\sqrt{1/2m\omega}(a+a^\dagger)$ in the truncated Fock basis) — the harmonic oscillator's ladder operators as finite, truncated `dimension`×`dimension` matrices on the Fock basis, letting the existing `Matrix` engine represent them exactly like every other operator, with the truncation's one honest approximation (documented in the file and tested directly) confined to the single boundary case where `a†` would need a level past the cutoff |
| `amplitude.ts` | `normalizedTwoLevelAmplitudes`, `interferenceProbability`, `classicalSumProbability` — built for the Complex Amplitude Explorer's two-amplitude interference mode (see §6b); deliberately thin wrappers around `Complex`, not a parallel state-vector abstraction |
| `fourier.ts` | A hand-written, iterative, in-place radix-2 Cooley-Tukey `fft`/`ifft` pair (grid sizes must be a power of 2), plus `momentumGrid` and the physically-normalized `positionToMomentum`/`momentumToPosition` wrappers. Built for Wave Mechanics — see below for why hand-written rather than a dependency, and why iterative rather than the initially-simpler recursive form |
| `wavefunction.ts` | `Grid1D` (a centered, power-of-two position grid) and `Wavefunction1D` — a discretized ψ(x) with normalization, probability density, inner product/overlap, position and momentum expectation values/variances, potential/kinetic/total energy expectation values, and `superposition()` for combining eigenstates. The continuous-position analogue of `state.ts`'s `StateVector`, but for an infinite-dimensional (grid-discretized) Hilbert space instead of a finite qubit register |
| `potentials.ts` | Potential-energy functions (`freeParticlePotential`, `infiniteSquareWellPotential`, `harmonicOscillatorPotential`, `finiteSquareWellPotential`, `barrierPotential`) plus, for the two closed-form-solvable ones, analytical energy-level formulas and eigenstate constructors (`infiniteSquareWellEigenstate`, `harmonicOscillatorEigenstate`, the latter via Hermite polynomials for $n=0..3$) — deliberately *not* a numerical eigensolver; see below |
| `timeEvolution.ts` | `SplitOperatorEvolver` — genuine numerical time evolution under the time-dependent Schrödinger equation via the symmetric (Strang) split-operator Fourier method, plus `probabilityLeftAndRightOf` for the tunneling preset's transmission/reflection accounting |
| `densityMatrix.ts` | `pureStateDensityMatrix`, `computationalBasisDensityMatrix`, `maximallyMixedState`, `convexCombination` (mixtures), `purity`/`isPureState`, `validateDensityMatrix` (Hermiticity/trace/positivity, the last exact only for $2\times2$), `eigenvaluesHermitian2x2` (closed-form quadratic-formula solver, **not** a general eigensolver), `vonNeumannEntropy`, `densityMatrixExpectationValue`/`densityMatrixMeasurementProbability`/`densityMatrixCollapse` (the generalized Born rule and collapse), `evolveDensityMatrix` ($\rho'=U\rho U^\dagger$) — built for `entanglement-and-measurement`; see below for scope |
| `partialTrace.ts` | `partialTrace(rho, totalQubits, tracedOutQubits)` — a general $n$-qubit partial trace via bitmask index summation (not hardcoded to 2 qubits), plus `reducedDensityMatrixQubit0`/`reducedDensityMatrixQubit1` convenience wrappers for the 2-qubit case this course actually uses |
| `entanglement.ts` | `entanglementEntropy` (reduced-state von Neumann entropy — valid **only** for a globally pure state, and typed to take a `StateVector` accordingly) and `concurrenceOfPureState` (pure two-qubit concurrence $C=2|ad-bc|$, reusing `twoQubit.ts`'s `testSeparability` determinant directly rather than reimplementing it) plus `isEntangled`; deliberately does **not** implement general mixed-state entanglement measures (see below) |
| `chsh.ts` | `spinObservableInXZPlane`, `correlationExpectation`, `chshValue`, and the `CHSH_CLASSICAL_BOUND`/`CHSH_QUANTUM_BOUND` constants — the CHSH inequality machinery for `entanglement-and-measurement`'s Bell-test lessons |
| `bloch.ts` | Gained `densityMatrixToBlochVector` this session (`stateToBlochVector`/`stateToBlochAngles`/`blochStateFromAngles` predate it) — the Bloch vector of a single-qubit density matrix via $\langle X\rangle,\langle Y\rangle,\langle Z\rangle$, letting the existing `BlochSphereCanvas` render mixed states (strictly inside the sphere) with zero new rendering code |
| `oracles.ts` | `applyBitOracle`, `applyPhaseOracle`, `constantFunction`, `balancedFunction` — the oracle-construction primitives for Quantum Algorithms I |
| `qft.ts` | `quantumFourierTransform`/`inverseQuantumFourierTransform`, `phaseEstimation` (restricted to 2×2 unitaries) |
| `grover.ts` | `uniformSuperposition`, `groverDiffusion` (built from an explicit `reflectAboutZero` helper, not a phase-oracle reuse — see §8 Session 11 for the bug this avoided), `groverIteration`, `optimalGroverIterations`, `runGrover` |
| `shor.ts` | `classicalOrder`, `periodFindingState` (exact closed-form joint-state construction, not a gate-level modular-exponentiation circuit — an explicit scope choice), `quantumFourierTransformOnQubits`, `periodFindingMeasurementDistribution` |
| `vqe.ts` | `ansatzState`, `costFunction`, `exactGroundStateEnergy` ($2\times2$ closed form), `runVqe` (direct coordinate-wise pattern search — the smallest correct optimizer, not a general-purpose gradient descent implementation) |
| `qaoa.ts` | `uniformSuperposition`, `applyCostUnitary`, `applyMixerUnitary`, `qaoaCircuit`, `expectedCutSize`, `bruteForceMaxCut` |
| `errorCorrection.ts` | `encodeBitFlipCode`/`runBitFlipCorrectionCycle` and the phase-flip equivalents (real 3-qubit encoding, ancilla-based syndrome extraction via genuine CNOTs + partial measurement — not a shortcut), `applyBitFlipError`/`applyPhaseFlipError` (single-qubit) and `applyBitFlipErrors`/`applyPhaseFlipErrors` (a qubit-index array, for weight-2+ scenarios like `SyndromeExplorer`'s multi-select injection) |
| `angularMomentum.ts` | `angularMomentumZ`/`X`/`Y`, `angularMomentumRaising`/`Lowering`, `totalAngularMomentumSquared` — general (any half-integer or integer) $j$, built from ladder-operator matrix elements exactly like `harmonicOscillator.ts`'s truncated Fock basis |
| `sphericalHarmonics.ts` | `sphericalHarmonic` (explicit closed forms, $l=0,1,2$ only — throws for unsupported $l,m$, deliberately not a general Legendre-polynomial solver), `sphericalHarmonicNormSquared`/`InnerProduct` (numerical integration) |
| `hydrogenAtom.ts` | `hydrogenEnergyLevel`, explicit closed-form `radial1s`/`radial2s`/`radial2p` (not a general Laguerre-polynomial solver — the same truncation philosophy as `harmonicOscillator.ts` and `sphericalHarmonics.ts`), `radialNormSquared`/`InnerProduct`, `mostProbableRadius1s` |
| `approximationMethods.ts` | `firstOrderEnergyCorrection`/`secondOrderEnergyCorrection`/`firstOrderStateCorrection` (finite-dimensional perturbation theory), `gaussianTrialEnergy`/`minimizeGaussianTrialEnergy` (variational method, reusing `wavefunction.ts`'s `Wavefunction1D.expectationEnergy` directly), `wkbActionIntegral`/`wkbQuantizedEnergy` (semiclassical quantization), `firstOrderTransitionProbability`/`exactTwoLevelTransitionProbability` (time-dependent perturbation theory; the latter a general-purpose RK4 two-level integrator, reused unchanged in the Quantum Hardware pillar for Rabi-oscillation gate timing and calibration), `exactTwoLevelState` (Session 12: the same RK4 integration exposing the full complex two-level state, not just the final population, so a Bloch vector can be computed from it), `exactTwoLevelTrajectory` (Session 12: a single continuous RK4 pass recording evenly-spaced samples along the way, for the Rabi/Qubit Dynamics Explorer's scrubbable time slider, instead of re-integrating from t=0 for every requested sample) |
| `identicalParticles.ts` | `tensorProduct`, `symmetrize`/`antisymmetrize` (deliberately exactly-2-particle scope), `exchangeParticles`, `normalizeVector` — the Pauli exclusion principle falls directly out of `antisymmetrize(a,a)` throwing on a zero vector, not asserted separately |
| `openSystems.ts` | `applyKrausChannel`, `isTracePreserving`, `amplitudeDampingChannel`/`dephasingChannel`, `applyChannelRepeatedly`, `decayProbabilityForTimestep` (connects discrete Kraus-channel stepping to continuous $T_1$/$T_2$ exponential decay *exactly*, for any step count — not merely a fine-stepping approximation) |
| `pathIntegral.ts` | `euclideanFreeParticleAction`/`euclideanFreePropagator` (closed form) and `discretizedTwoSlicePropagator` (genuine discretized sum-over-paths, verified against the closed form to ~$10^{-15}$ relative error) — deliberately Euclidean-time only; see below for why |
| `thermalPhysics.ts` | `thermalPhotonOccupation` — the Bose-Einstein occupation formula behind why qubits need millikelvin cooling |
| `circuitBuilder.ts` | `QuantumCircuit` (chained gate-instruction builder) + `runCircuit` (dispatches to `gates.ts`, unchanged) + `sampleMeasurements` — the "circuit as data, executed later" pattern real SDKs use, distinct from `gates.ts`'s direct-application style; gained `runInstructions(numQubits, instructions)` in Session 12 (`runCircuit` now delegates to it), letting the Circuit Builder simulator replay an arbitrary *prefix* of a instruction list for its step-scrubbing feature without constructing a full `QuantumCircuit` per prefix |
| `simulationCost.ts` | `stateVectorAmplitudeCount`/`stateVectorMemoryBytes`/`estimatedGateFlops` — plain arithmetic, made into real (tested, problem-reusable) functions rather than only quoted as numbers in lesson prose |
| `noisyCircuitSimulation.ts` | `runNoisyCircuit` — interleaves `densityMatrix.ts`'s `evolveDensityMatrix` with `openSystems.ts`'s `applyKrausChannel` after every gate; deliberately single-qubit-scoped (see below) |
| `gateDecomposition.ts` | `matricesEqualUpToGlobalPhase` — the one reusable utility a decomposition-verification lesson needs; the specific decompositions themselves are just `rotationY`/`rotationZ` compositions, not separately wrapped |
| `transpilation.ts` | `cnotOnLinearChain` (SWAP-network CNOT for limited connectivity, verified to reproduce a direct `applyCNOT`'s result exactly) + `swapOverheadForLinearChain` |

### Qubit ordering convention

**Qubit 0 is the most significant (leftmost) bit of a multi-qubit basis
label**, everywhere: a 3-qubit state's basis states are written
$|q_0q_1q_2\rangle$, so `StateVector.basis(3, 0b100)` is $|100\rangle$ —
qubit 0 equal to 1, the others 0. This was already implicit in
`applySingleQubitGate`'s bitmask (`1 << (n - 1 - target)`) from the
Bloch-sphere-simulator pass, and is now used and *tested* explicitly (see
§Testing below) since Quantum Gates & Circuits is the first content that
actually has more than one qubit to get the order wrong on. Every lesson,
test, and the `QuantumStateDisplay` component all rely on this same
convention — there is exactly one place it's decided
(`gates.ts`'s bitmask math) and everything else is downstream of it.

### Multi-qubit support: mostly already there

The single-qubit-era engine turned out to already be qubit-count-agnostic
in almost every function that mattered: `applySingleQubitGate`,
`applyControlledGate`, `applyCNOT`, `applyCZ`, `applySwap`, and
`StateVector.tensor()` all operate correctly on a state of any
`numQubits` — they were written generally the first time, not
single-qubit-only. Building Quantum Gates & Circuits confirmed this by
using every one of them unchanged.

The one genuine gap was **partial measurement** — collapsing *one* qubit
within a multi-qubit state while leaving the others alone (needed for
"measure one half of a Bell pair" and for quantum teleportation, which
measures 2 of its 3 qubits). `measurement.ts` gained two functions for
this: `qubitMeasurementProbabilities(state, qubit)` sums $|c_i|^2$ over
every basis index consistent with each outcome, and `measureQubit(state,
qubit, random?)` samples an outcome and returns the correctly
renormalized collapsed state — zeroing every amplitude inconsistent with
the observed outcome and dividing survivors by $\sqrt{P(\text{outcome})}$.
Both are straightforward generalizations of the existing full-register
`measure`, not a new measurement model.

**Verified, not just written:** every new engine addition (partial
measurement, and the full teleportation protocol built from existing
primitives) has a corresponding Vitest test in
`src/lib/quantum/__tests__/multiQubit.test.ts` *before* the corresponding
lesson was written, including the teleportation protocol checked against
all 4 measurement outcomes for 4 different message states (16 exact-state
assertions) — the lesson's derivation was written to match what the
engine actually computes, not the other way around.

Two design choices worth calling out:

- **Gates act on the amplitude array directly** (via bitmask pairing on the
  target qubit index) rather than by constructing a full 2ⁿ×2ⁿ matrix and
  multiplying. This is the standard technique real simulators use — it's
  both faster and dramatically more memory-efficient as qubit count grows,
  and it's what will let a future circuit-builder simulator stay responsive
  well past 2-3 qubits.
- **Everything is immutable.** Every operation returns a new `StateVector`.
  This matters specifically for teaching: a "step through this circuit"
  animation needs to hold onto every intermediate state (for scrubbing
  backward, replaying, comparing before/after), which is trivial when
  states are immutable and painful when they're mutated in place.

**Verified, not just written:** before moving on, I ran the engine through
seven correctness checks (Hadamard superposition, Pauli-X flip, CNOT,
full Bell-state construction, SWAP, complex arithmetic, and measurement
collapse) via a throwaway script — all seven passed. That script wasn't
kept (see §9's testing recommendation for the durable version of this).

**Rendering stays fully separate.** `src/components/simulators/bloch-sphere/`
holds `BlochSphereExplorer` (the real interactive simulator, which reads and
writes `StateVector`s via `lib/quantum/` and renders the corresponding
point on the sphere) alongside `BlochSphereHeroExplorer`, a trimmed-down
variant embedding the same real math for the homepage hero. (An earlier,
purely decorative `BlochSpherePreview` — a static SVG with no `lib/quantum/`
dependency — was replaced by `BlochSphereHeroExplorer` in a later polish
pass once it became clear a homepage that opens on a labeled "static
illustration" undercuts the whole "real interactive experiments" pitch; see
the Session 13 entry below.) Neither the gate math nor the circuit state is
ever mixed into a rendering file. The convention going forward:
`src/components/simulators/<name>/` for rendering,
`src/lib/quantum/` for math, never mixed in one file.

**Density matrices, partial trace, and von Neumann entropy are now
built** (`densityMatrix.ts`, `partialTrace.ts`, `entanglement.ts`,
`chsh.ts` — see the table above), for `entanglement-and-measurement`.
Deliberately still **not** built: a **general** eigensolver (matrix
diagonalization for an arbitrary-dimensional Hermitian operator).
`eigenvaluesHermitian2x2` is an exact closed-form quadratic-formula
solver for exactly $2\times2$ Hermitian matrices — the one size this
course's reduced single-qubit density matrices ever need — not a general
eigensolver in a small disguise. This bounds three things explicitly,
each documented in its own module's doc comments and taught as an
explicit scope limit in the course itself rather than glossed over:
`vonNeumannEntropy` cannot be called on anything larger than $2\times2$
(throws, doesn't approximate); `validateDensityMatrix`'s positivity check
returns `null` — not `true`/`false` — above $2\times2$, since exact
positivity testing for a general (possibly rank-deficient) Hermitian
matrix needs machinery (Cholesky/LDL with zero-pivot handling) this
platform doesn't implement; and `entanglementEntropy`/
`concurrenceOfPureState` only accept a pure `StateVector`, since reduced
entropy stops being a valid entanglement measure the moment the global
state is mixed (proved with a concrete counterexample —
$\rho_{AB}=I/4$, a manifestly unentangled product of two mixed qubits,
whose reduced state nonetheless has entropy 1 bit — in the "Entanglement
Entropy for Pure Bipartite States" lesson). The general mixed-state
Wootters concurrence (needing eigenvalues of a non-Hermitian $4\times4$
matrix product) and multipartite (3+ qubit) entanglement measures remain
out of scope for the same underlying reason: no general eigensolver.
A general eigensolver remains deferred, next likely triggered by a
future course needing eigenstates of a potential with no closed form
(e.g. an arbitrary numerically-specified 1D potential) or a genuine
mixed-state/multipartite entanglement treatment (the
`advanced-quantum-mechanics` placeholder course, much later in the
Quantum Mechanics pillar, will need this eventually — its own
`density-matrices-and-mixed-states` and `entanglement-formal-treatment`
modules should build on top of, not duplicate, `entanglement-and-measurement`'s
two-qubit-scoped treatment when that course is eventually written).

Two-level finite-dimensional evolution (Course 4) and continuous-position
wave mechanics (Course 5) never needed a general eigensolver either:
two-level time evolution reused the *existing* `rotationAboutAxis`
function (any traceless $2\times2$ Hermitian $H=\frac{\hbar\omega}{2}(\hat
n\cdot\vec\sigma)$ has $e^{-iHt/\hbar}=$ `rotationAboutAxis(n, ωt)`
exactly), and continuous-position evolution needed a *numerical
time-integration* engine (the split-operator method, §6b) rather than a
diagonalization routine — the known-solvable systems' (infinite well,
harmonic oscillator) eigenstates are evaluated from their **closed-form
formulas** (`potentials.ts`), with the numerical time-evolution engine
then used to *verify* those formulas (confirming stationarity and
matching analytical energies), not to *discover* them.

---

## 6b. Interactive Visualization Architecture

The 2-qubit explorer (`TwoQubitExplorer`, `src/components/simulators/two-qubit-explorer/`)
is the first simulator built with an explicit five-layer separation, meant
to be the pattern every future visualization (circuit diagrams, density
matrices, wavefunctions, algorithm animations) follows rather than
reinvents:

1. **Quantum mathematics** — `src/lib/quantum/`. Zero React, zero DOM.
   `testSeparability` is the only genuinely new math this simulator needed;
   every gate/measurement operation it uses already existed.
2. **Simulation state** — owned entirely by the top-level orchestrator
   (`TwoQubitExplorer.tsx`) as a single `StateVector` plus small pieces of
   UI state (narration text, which preset is active, which qubit is the
   current gate target). No other component in the tree holds quantum
   state; they all receive it as props and call back up through handlers.
3. **Visualization** — `StatePanel` (ket + amplitude/probability table +
   entanglement badge) and `CorrelationView` (the Q0/Q1 joint-probability
   grid). Pure presentational components: given a `StateVector`, render it.
   Neither imports a gate function or touches `useState`.
4. **Controls** — `OperationControls` (init / gates / CNOT / SWAP /
   guided-preset buttons) and `MeasurementPanel` (measure / reset).
   Presentational too, except for the target-qubit toggle's own tiny local
   state; every action is a callback prop, not a direct engine call.
5. **Lesson integration** — `LazyTwoQubitExplorer.tsx`, the same
   `dynamic(..., { ssr: false })` pattern as the Bloch sphere, so an MDX
   lesson embeds the whole thing as `<LazyTwoQubitExplorer />` and pays
   its bundle cost only on routes that use it.

The reason this split matters beyond tidiness: the *next* visualization
(a circuit diagram, say) can reuse layers 1 and — if it also needs
per-basis-state probabilities or a separability check — parts of layer 3,
without reusing anything from layers 2 or 4, which are legitimately
different for a circuit builder. Nothing here is a shared abstract base
class or a plugin framework; it's a convention (these five concerns live
in separate files, math never appears in a `.tsx` file) that the next
simulator either follows or has a documented reason not to.

**Entanglement detection, done rigorously.** `testSeparability` is an
*exact* test, not a heuristic or a name-based lookup: a 2-qubit state
$a|00\rangle+b|01\rangle+c|10\rangle+d|11\rangle$ is separable iff
$ad-bc=0$ (the determinant of the amplitudes arranged as a 2×2 matrix,
which is zero exactly when that matrix has rank ≤ 1, i.e. is an outer
product of two vectors — necessary and sufficient, proven in the code
comment, not just asserted). The explorer computes this on every state
change and shows "Product state" or "Entangled" accordingly — a state is
never labeled entangled because it happens to be *called* a Bell state.
Tested directly against all four Bell states, several plain product
states (including ones that don't "look" simple), and a numerical-tolerance
boundary case in `src/lib/quantum/__tests__/twoQubit.test.ts`.

**Guided presets run through the same code path as manual clicks.**
`presets.ts` describes each guided walkthrough as a list of steps (reset /
apply a named gate to a qubit / CNOT / measure a qubit); the orchestrator's
`runPreset` sequences through them with a short delay between steps,
calling the exact same `applySingleQubitGate` / `applyCNOT` / `measureQubit`
functions a manual button click would. There is no separate "preset
engine" — presets are just pre-written scripts for the same actions.

**Animation is deliberately simple.** Unlike the Bloch sphere (which
needed a `requestAnimationFrame` loop to interpolate a 3D rotation path),
the 2-qubit explorer's state is tabular — probability bars and a
correlation grid — so ordinary CSS `transition-[width]` on value changes
is sufficient, with `motion-reduce:transition-none` handling reduced-motion
per element. No JS animation loop, no extra hook. Measurement is narrated
explicitly as a discrete event ("the state has collapsed — this was an
instantaneous event, not a smooth transition") rather than animated as if
it were continuous physical evolution.

### The Complex Amplitude Explorer

`src/components/simulators/complex-amplitude-explorer/` follows the same
five-layer split, and is the first simulator to use plain SVG (not the
Bloch sphere's canvas-style geometry or the 2-qubit explorer's tables) for
its visualization:

1. **Math** — the existing `Complex` class (magnitude/phase/`fromPolar`)
   plus the two genuinely new helpers in `lib/quantum/amplitude.ts`
   (two-level normalization and the quantum-vs-classical interference
   comparison). No new math for anything `Complex` already computed.
2. **State** — `ComplexAmplitudeExplorer.tsx` owns `re`/`im` as the single
   source of truth for single-amplitude mode (magnitude/phase are always
   *derived* from them, never stored separately, so the two control pairs
   in `AmplitudeControls` can't drift out of sync), plus
   `alphaMagnitude`/`alphaPhase`/`betaPhase` for two-amplitude mode.
3. **Visualization** — `ComplexPlaneCanvas.tsx`, a pure SVG function of
   `(re, im)`: axes, a unit-circle reference, the amplitude vector, and a
   phase arc — deliberately no drag-to-set interaction on the canvas
   itself (sliders and numeric inputs are the actual control surface, kept
   simpler than the Bloch sphere's pointer-drag handling since there's no
   3D camera to orbit here) — and `StatePanel.tsx` (the `a+bi`/magnitude/
   phase/`|z|²` readout, via `KatexMath` + `formatAmplitudeLatex`, reused
   rather than re-implemented).
4. **Controls** — `AmplitudeControls.tsx` (synced real/imaginary and
   magnitude/phase slider pairs) and `TwoAmplitudeMode.tsx` (the α/β
   interference view — an α-magnitude slider with β's magnitude *derived*
   to keep $|\alpha|^2+|\beta|^2=1$, and a relative-phase slider driving
   the quantum-vs-classical probability comparison).
5. **Lesson integration** — `LazyComplexAmplitudeExplorer.tsx`, the
   identical `dynamic(..., { ssr: false })` wrapper pattern as the other
   two simulators.

**No dependency on `StateVector` for the interference math.** Two bare
`Complex` amplitudes representing alternative *paths* (not a prepared
2-level quantum state) are a different concept from a `StateVector`, even
though the two-amplitude mode's *display* happens to coincide with a
single qubit's — `interferenceProbability`/`classicalSumProbability`
operate directly on `Complex` values, which is both the more honest
modeling choice and avoids a spurious dependency.

---

### The Wavefunction Explorer

`src/components/simulators/wavefunction-explorer/` is the first simulator
built around a genuinely running numerical simulation (a
`requestAnimationFrame` loop repeatedly advancing real physics) rather
than a deterministic function of slider state, which drove one
architectural decision the other three simulators didn't need:

1. **Math** — `wavefunction.ts`, `fourier.ts`, `potentials.ts`,
   `timeEvolution.ts` (§6), all framework-free.
2. **Presets, not free-form configuration** — `presets.ts` defines 7 named
   presets (free Gaussian packet, infinite-well ground/excited,
   harmonic-oscillator ground/excited, a two-eigenstate superposition,
   and tunneling), each a `build(params)` function returning a complete,
   consistent `{grid, potential, psi0, dt, stepsPerFrame, ...}` bundle
   from a small preset-specific parameter schema (`ParamSpec[]`), rendered
   generically by `PresetControls.tsx`. A fully general "pick any
   potential, any initial state" UI was deliberately rejected — it would
   allow physically inconsistent or unsupported combinations (e.g. a
   harmonic-oscillator eigenstate above the closed-form Hermite
   polynomials' $n=3$ cutoff), where a curated preset list keeps every
   reachable configuration honest.
3. **State ownership split for correctness, not just organization** —
   `WavefunctionExplorer.tsx` (config: which preset, which parameter
   values, view mode) mounts `WavefunctionSimulation.tsx` (the evolving
   `psi`/`t`/`isPlaying` state and the animation loop) **keyed on the
   config**. This isn't a stylistic choice: an early version reset the
   simulation state via a `useEffect` instead, which still renders once
   with the *previous* preset's `psi` next to the *new* preset's `setup`
   (different grids) before the effect runs — and `ComparisonPanel`'s
   fidelity calculation, reading both together, threw on exactly that
   render. Remounting via `key` makes the mismatch structurally
   impossible: `psi`'s initial state is always `setup.psi0` for the exact
   `setup` that instance was built with. `ComparisonPanel` additionally
   guards on grid equality before computing overlap, as defense in depth.
4. **Visualization** — `WavefunctionCanvas.tsx`, one SVG component with
   three modes (`|ψ(x)|²`+schematic $V(x)$ overlay, `Re/Im`, `|φ(k)|²`)
   selected by a small tab control, auto-scaled to each render's actual
   data range. The momentum-space mode has one non-obvious requirement:
   `k` comes back from `momentumGrid` in raw FFT bin order (0, increasing
   positive frequencies, then wrapped negative ones), which isn't
   monotonic — the mode sorts before plotting, and critically computes
   the x-axis scale (`scaleX`) from that *same sorted* array (an earlier
   version scaled from the unsorted array, taking min/max from bin 0 and
   the last raw bin — both near zero — which collapsed the entire curve
   off-screen; caught during browser verification, not by any unit test,
   since the engine-level math was correct and only the pixel-mapping was
   wrong).
5. **Playback and accessibility** — `PlaybackControls.tsx` plus
   `usePrefersReducedMotion.ts` (duplicated from the Bloch sphere
   simulator's identical hook, matching this codebase's per-simulator
   self-containment convention rather than introducing cross-simulator
   imports for one ~20-line hook). When reduced motion is preferred, the
   continuous Play button is replaced entirely by a manual Step button —
   no autonomous animation loop ever runs for those users, rather than
   merely skipping the *entry* animation as some simulators might.
6. **`StatePanel`/`ComparisonPanel` receive precomputed values, not raw
   `psi`.** Both originally called `psi.expectationMomentum()` and
   `psi.expectationEnergy()` independently — each internally performs its
   own momentum-space Fourier transform, so a single animation frame was
   silently computing that transform three times over. `Wavefunction1D`
   gained `momentumStatistics(mass)`, returning `{meanMomentum,
   kineticEnergy}` from one transform; `WavefunctionSimulation` calls it
   once per frame and passes the numbers down as props. Found via direct
   performance measurement during browser verification (a preset with
   only 4 lightweight evolution steps per frame was still rendering at a
   small fraction of 60fps), not by guessing — see the Session 9
   changelog entry for the numbers.

**Performance note on the FFT itself:** `fourier.ts`'s first
implementation was a textbook recursive Cooley-Tukey FFT, which slices
the input array with `.filter()` at every recursion level — clean and
easy to verify against a brute-force DFT, but its allocation overhead
made a heavier preset (150 split-operator steps/frame at grid size 512)
run roughly 60× slower than the same computation via an iterative,
in-place, bit-reversal-permutation FFT with cached twiddle factors (the
standard efficient form). Both implementations pass the identical test
suite (cross-checked against a brute-force DFT and Parseval's theorem);
only the second is fast enough for a real-time animation loop calling it
hundreds of times per second. No dependency was added either way — the
efficient form is still under 100 lines.

### The Density Matrix Explorer

`src/components/simulators/density-matrix-explorer/` is deliberately
**single-qubit-focused** — the task that produced it explicitly ruled out
a general circuit-builder-scale visualization, and the engine's own
$2\times2$-only closed-form pieces (`eigenvaluesHermitian2x2`,
`vonNeumannEntropy`) make a single qubit the natural, honest scope
anyway. It reuses far more than it builds:

1. **Math** — `densityMatrix.ts`, `bloch.ts`'s new
   `densityMatrixToBlochVector` (§6), all framework-free.
2. **Rendering — zero new 3D/SVG code.** The existing `BlochSphereCanvas`
   (built for the pure-state Bloch Sphere Explorer) draws *any* point
   inside or on the unit sphere; it never assumed the vector it's handed
   has length exactly 1. Feeding it a mixed state's Bloch vector (which
   the linearity of $\langle A\rangle=\text{Tr}(\rho A)$ guarantees has
   $|r|\le1$, with equality only for pure states) makes mixedness
   directly visible — the point sits strictly inside the wireframe sphere
   — with no rendering changes at all, only a new data source.
3. **State model** — two independently-adjustable Bloch-sphere points
   (`component1`, `component2`, each a `BlochAngles` reused from
   `bloch-sphere/presets.ts`'s existing angle-slider UI) plus a mixing
   weight $p$; the explorer composes
   $\rho=p\cdot\rho_1+(1-p)\cdot\rho_2$ live via `convexCombination`,
   then derives the Bloch vector, purity, entropy, and
   `validateDensityMatrix`'s checks from that single `rho` on every
   render — no separate "mixed state" data model parallel to the
   density-matrix one.
4. **Presets carry the pedagogy, not just convenience.** `presets.ts`'s
   two 50/50 presets — $\{|0\rangle,|1\rangle\}$ and
   $\{|+\rangle,|-\rangle\}$ — are chosen specifically so both land on
   the exact same $\rho=I/2$, making Pure States and Mixed States'
   "different ensembles, identical physical state" argument something a
   learner can click through and see directly, not just read.
5. **Lesson integration** — `LazyDensityMatrixExplorer.tsx`, the same
   `dynamic(..., { ssr: false })` pattern as every other simulator;
   embedded in "Pure States and Mixed States" (the lesson whose central
   distinction it visualizes) and added to `/simulators` as the platform's
   5th real, fully interactive entry, replacing the old "Entanglement
   visualizer" coming-soon placeholder it directly supersedes in scope
   (a single qubit's mixedness, not a full multi-qubit circuit view).

### The Circuit Builder (Session 12)

`src/components/simulators/circuit-builder/` is the first simulator to
render a genuine **circuit diagram** rather than a state readout, and the
first to need a **step-scrubbing timeline** (replaying an arbitrary
prefix of a gate sequence, not just "current state after everything so
far"):

1. **Math** — `circuitBuilder.ts`'s existing `GateInstruction`/`QuantumCircuit`,
   plus the new `runInstructions(numQubits, instructions)` (§6), which
   `runCircuit` now delegates to. The simulator computes
   `state = runInstructions(numQubits, instructions.slice(0, step))` on
   every render — the step slider is genuinely just an array-slice index,
   not a separate "replay" code path.
2. **State** — `numQubits` (2 or 3), the full `instructions: GateInstruction[]`
   built so far, and `step` (where in that list the display currently is).
   Adding a gate appends to `instructions` and auto-advances `step`.
3. **Visualization** — `CircuitDiagram.tsx`, a dependency-free SVG circuit
   diagram (fixed-pixel-math rows for qubits, columns for instructions):
   single-qubit gates as labeled boxes, two-qubit gates as a connector
   line between control and target with a symbol per gate (CNOT: dot +
   ⊕; CZ: dot + dot; SWAP: × + ×). Columns at or past the current `step`
   render at reduced opacity, so "what's been applied so far" is visually
   obvious without a separate legend. `StateInspector.tsx` is the
   N-qubit generalization of the 2-qubit explorer's `StatePanel` (a ket
   expression plus a per-basis-state amplitude/probability table).
4. **Controls** — `GateControls.tsx`: qubit-count toggle, a single-qubit
   gate palette with a target-qubit selector, and CNOT/CZ/SWAP buttons
   with control/target dropdowns (disabled with an inline warning when
   control equals target).
5. **Lesson integration** — `LazyCircuitBuilder.tsx`, the standard lazy
   wrapper; embedded in `/simulators`, in Quantum Gates & Circuits'
   capstone ("Building Quantum Circuits" — build and verify the lesson's
   own hand-designed circuits before checking the printed answer), and in
   Programming Quantum Computers' "Writing Your First Circuit" (replicate
   the lesson's exact GHZ circuit before reading its exact numbers) — this
   closes the long-pending circuit-builder gap flagged in the Session 11
   roadmap update.

### The Grover's Algorithm Explorer (Session 12)

`src/components/simulators/grover-explorer/` needed zero new engine math
— `grover.ts`'s `uniformSuperposition`/`groverIteration`/`optimalGroverIterations`
(§6, including the `reflectAboutZero` bug fix documented in Session 11)
were reused exactly as-is. `AmplitudeBars.tsx` renders every basis
state's signed real amplitude and probability as a bar chart (Grover's
amplitudes stay real throughout, starting from a real uniform
superposition), with the marked state highlighted; `GroverControls.tsx`
steps one full oracle-plus-diffusion iteration at a time and reports the
theoretical optimum alongside the current iteration count, so overshoot
past the optimum is directly visible as the marked bar shrinking back
down. Embedded in both Grover lessons in Quantum Algorithms I, with
instruction text asking the learner to predict the optimal iteration
count before stepping past it.

### The Rabi / Qubit Dynamics Explorer (Session 12)

`src/components/simulators/rabi-explorer/` required one genuine physics
verification step before any UI was written, per this session's explicit
instruction not to expose unreliable physics: `approximationMethods.ts`'s
existing `exactTwoLevelTransitionProbability` (an RK4 integrator, §6) was
refactored to share its stepping logic with two new exports,
`exactTwoLevelState` (the full complex two-level state, not just the
final population) and `exactTwoLevelTrajectory` (a single continuous RK4
pass recording evenly-spaced samples, avoiding re-integrating from t=0
for every point on a scrubbable timeline). Verified against three
independent checks before building the UI: Bloch-vector norm stays
exactly 1 at every sampled time, on and off resonance (unitarity,
confirmed numerically); the resonant case ($E_i=E_f$) matches the
closed-form $P_1(t)=\sin^2(Vt)$ exactly; and the off-resonant maximum
population matches the correctly-derived generalized-Rabi closed form
$P_{1,\max}=4V^2/(\Delta^2+4V^2)$ (for the platform's specific Hamiltonian
convention $H=\begin{pmatrix}E_i&V\\V&E_f\end{pmatrix}$, $\Delta=E_f-E_i$)
— all three are also permanent Vitest assertions, not just a one-off
scratch check. The Bloch-sphere half of the display reuses
`BlochSphereCanvas` and `stateToBlochVector` with zero new rendering
code, the same precedent the Density Matrix Explorer set.
`PopulationCurve.tsx` is a small dependency-free SVG line plot of
$P_1(t)$; `RabiControls.tsx` exposes coupling strength $V$, detuning
$\Delta$, and a time slider (indexing into the precomputed trajectory,
the same scrubbing pattern the Circuit Builder established) plus
play/pause. Embedded in Quantum Hardware's Control Electronics (predict
$P_1(t)=\sin^2(Vt)$ on resonance, then detune and watch the maximum
reachable population drop) and Calibration (run a Rabi-scan calibration
by hand against the simulator, then check the recovered $\Omega$).
Deliberately scoped to a fixed initial state $|0\rangle$ rather than an
arbitrary one, and to the exactly-solvable driven two-level Hamiltonian
already verified elsewhere in the platform — no rotating-wave-approximation
machinery or multi-level modeling was added.

### The Noise & Decoherence Explorer (Session 12)

`src/components/simulators/noise-explorer/` is the 4th and last new
simulator this session, chosen after checking the curriculum for actual
need: `amplitudeDampingChannel`/`dephasingChannel`/`applyKrausChannel`
(`openSystems.ts`, §6, already fully tested) are applied step by step to
a single-qubit density matrix, starting from any of the existing Bloch
sphere presets. It reuses almost everything: `BlochSphereCanvas` for the
shrinking Bloch vector, and the Density Matrix Explorer's own
`DensityMatrixStatePanel` component directly (no new state-readout UI at
all) for the $\rho$/purity/entropy/validation display. The only new
piece is `DecayCurve.tsx`, a small SVG line plot of purity across
successive channel applications (the step-indexed analogue of the Rabi
Explorer's continuous-time `PopulationCurve`). Embedded in Advanced
Topics in Quantum Mechanics' "Open Quantum Systems & Kraus Operators"
(watch the trace-preservation condition hold at every intermediate step,
not just algebraically) and Quantum Hardware's "T1 & T2 Decoherence"
(compare dephasing, which leaves z untouched, against amplitude damping,
which pulls the whole vector to the north pole, from the same starting
state). Two channel types only (amplitude damping, dephasing) — the two
this platform's engine actually implements; no continuous-time Lindblad
solver was added, consistent with `openSystems.ts`'s existing documented
scope limit.

---

## 7. UI System

Reused/extended, not rebuilt — everything here composes the primitives from
the previous session (`Button`, `Badge`, `Card`, `Container`, `PageHeader`)
plus a few new, purpose-built pieces:

- **`components/curriculum/CourseList`** — the single component that
  renders "a pillar's courses and their modules, with per-module
  view/coming-soon state." Used by `/learn`, `/lessons`, `/hardware`, and
  `/software`. One component, four call sites, one visual language for
  "here is a curriculum" anywhere on the site.
- **`components/lessons/LessonLayout`** — the chrome around every lesson:
  breadcrumb (`Learn / <Pillar> / <Course>`), a course-position indicator
  ("Lesson 5 of 10") with a progress bar, difficulty + time badges, a
  resolved prerequisites line (annotated with the source course's title
  when a prerequisite lives outside the current course), the "by the end
  of this lesson" objectives box, the MDX body inside a `prose` wrapper,
  and a previous/next footer nav. Every future lesson gets all of this for
  free just by having correct `lessonMeta` and being registered as a module
  in `curriculum.ts`.
- **`components/mdx/Callout`** — the one content-authoring primitive
  content needs today (see §5).
- **`components/quantum/QuantumStateDisplay`** — added for Quantum Gates &
  Circuits. Renders a computational-basis ket expression plus a
  probability bar per basis state, from a real `StateVector` a lesson
  computed via the actual engine (not hand-typed numbers) — so the
  rendered math can never drift from what the engine computes. It's a
  **pure Server Component**: `katex.renderToString` runs at build time
  (the same call `rehype-katex` itself makes internally), so this ships
  zero client-side JavaScript. Lessons compose several of these in a row
  to narrate a gate-by-gate sequence (a Bell-state or teleportation
  derivation) without needing a dedicated "stepper" component — deliberately
  choosing repetition of one small component over building a bigger one.

This is intentionally minimal. A "Simulator chrome" system (controls,
playback, reset) is a real, separate design problem — building it now, with
only two simulators to design against, would mean guessing; it's in the
roadmap below. A full circuit-diagram visualizer is a similar case: Quantum
Gates & Circuits teaches circuit notation and composition entirely through
prose, LaTeX, and `QuantumStateDisplay` step sequences, deliberately without
one — building a genuine circuit builder is its own project, not a
byproduct of writing lessons. The "Problems/Quiz" UI system, previously
listed here as future work, was designed and built this session — see §7b.

---

## 7b. Problems System Architecture

The problems system is the platform's first real content type that isn't
prose-plus-math (a lesson) or a hand-built interactive widget (a
simulator) — it's structured, gradeable exercise data. It follows the same
"math / state / UI" separation §6b established for simulators, adapted to
a system that also needs persistence and content authoring:

**Content format: TypeScript data files, not MDX.** A lesson is
long-form prose with embedded interactive components — MDX is the right
tool because most of a lesson *is* markdown. A problem is the opposite
shape: a handful of short, strictly-typed fields (a prompt, a few hints,
a multi-step solution, one canonical answer) with no free-form prose
structure to speak of. Authoring problems as plain `Problem` object
literals in `src/content/problems/<pillar>/<course>/<slug>.ts` gets full
compile-time checking of every field against the discriminated-union
schema in `lib/problems/types.ts` — an MDX file only gets that for its
`export const` values, not for its content shape — with zero MDX
compilation cost. Every demonstration problem computes its own canonical
answer by calling the real quantum engine at module load (the same
pattern lessons use for `QuantumStateDisplay` inputs), so an answer can
never silently drift from what the engine actually computes; the
multiple-choice `h-then-cnot-result` problem goes further and renders its
correct option's ket through the exact same `formatAmplitudeLatex` helper
`QuantumStateDisplay` uses, so it looks identical to what a student saw
in the lesson.

**Data model** (`lib/problems/types.ts`) keeps five concerns in separate
fields rather than one blob, per the brief's explicit requirement:
`meta` (slug, course, lesson, difficulty, tags — everything a catalog or
filter needs, with no question content in it), `question` (the prompt and
input shape — *no* correctness information), `answer` (the canonical
correct value plus validation parameters — tolerance, required concept
groups — kept entirely separate from `question` so a client can never
receive the answer alongside the question), `hints` (an ordered array,
revealed progressively by the UI, not the content), and
`solution`/`explanation` (a worked derivation plus why-correct/why-wrong
prose, not just the bare answer). `Problem` is a discriminated union over
`problemType`, so authoring a `numeric` problem with a `multiple-choice`
answer shape is a compile error, not a runtime surprise —
`registry.test.ts` additionally asserts this invariant holds for every
authored problem, since validator dispatch relies on it.

**Validators** (`lib/problems/validators/`) are one small pure function
per problem type — `validateMultipleChoice`, `validateNumeric`,
`validateConceptual` — dispatched by `validateAnswer(problem, rawAnswer)`.
Every submission reaches a validator as a plain `string`; no submission is
ever evaluated as code. Numeric answers are parsed with `Number(...)` and
compared with configurable absolute or relative tolerance (never a bare
`===`). Conceptual answers use case-insensitive substring matching against
author-supplied keyword groups — deliberately simple and fully
deterministic, not natural-language understanding; a correct answer
phrased with none of the listed synonyms will be marked incomplete, and
this is a documented Phase 1 limitation, not a stand-in for `eval`. The
abstraction (`Problem -> ValidationResult`) is what makes adding a fourth
validator later (symbolic, quantum-state-vector-with-global-phase,
circuit-structure) a matter of adding one file and one `case`, not
touching the UI.

**Progress persistence** (`lib/problems/progress/`) is a `ProgressStore`
interface — `getProblemProgress`, `recordAttempt`, `revealHint`,
`revealSolution` — with one implementation today
(`LocalStorageProgressStore`, plus a same-shaped in-memory fallback used
during SSR, where `window` doesn't exist). No component calls
`localStorage` directly. `useProblemProgress(slug)` — built on
`useSyncExternalStore`, not a `useEffect`-plus-`setState` hydration dance
— is the one hook `ProblemView` uses to both read and mutate progress;
swapping in an authenticated, server-backed store later means writing one
new class against the same interface, not touching `ProblemView`. (This
mattered in practice, not just in theory: an earlier version read
progress via `useEffect` + `setState` on mount, and a separate bug in the
localStorage read path — returning a freshly-parsed object on every call
instead of a cached one — combined with `useSyncExternalStore`'s
stable-snapshot requirement to produce a genuine infinite render loop,
caught by browser-testing the feature rather than by type-checking or unit
tests. See the Session 6 changelog entry and
`progress/__tests__/progressStore.test.ts`.)

**UI components** (`components/problems/`) split along the same lines as
§6b's simulator layering: `ProblemLayout` (server — breadcrumb, badges,
title, prompt, prerequisites, related-lesson link) wraps `ProblemView`
(client — the only part that needs state), which composes `AnswerInput`
(dispatches by question type), `Feedback`, `HintPanel`, and
`SolutionPanel`. The catalog (`/problems`) is `ProblemsCatalog` (client,
owns filter state) rendering `ProblemFilters` and `ProblemCard`.
`PracticeLinks` is the lesson-embed primitive — deliberately smaller and
plainer than a full `ProblemCard`, so a lesson's practice section reads as
part of the lesson rather than an inserted widget.

**Quiz** (`Quiz` type in `lib/problems/types.ts`, plus `getAllQuizzes` /
`getQuiz` in the registry) is architecture only this phase — the data
model and lookup functions exist, `QUIZZES` is an empty array, and there
is no quiz-taking UI. See §9.

---

## 7c. Visual & Motion System Architecture

The platform's whole visual language — "The Instrument," a research-console
aesthetic rather than a document/marketing-page one — is specified in
[`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md), which is the source of truth
for the visual *rules* (palette, type voices, surface vocabulary, layout
primitives, accessibility requirements). This section covers only the
architecture underneath those rules: why the pieces are shaped the way they
are, not what they look like.

**The pillar identity channel** (`src/lib/design/pillars.ts`) gives each of
the six pillars a color identity derived from exactly two numbers — an OKLCH
hue and chroma — rather than a hand-picked hex per surface. The same two
numbers are declared a second time in `src/app/globals.css` §2 (CSS has to
resolve the full ramp — `--pillar-accent`, `--pillar-edge`, `--pillar-wash`,
`--pillar-glow`, `--pillar-text`, and more — for every element under a
`[data-pillar="…"]` attribute, and can't read a TypeScript module to do it),
so the value genuinely exists in two files. `src/lib/design/__tests__/
pillars.test.ts` parses the shipped stylesheet back out and asserts it
matches `pillars.ts` exactly, rather than trusting the two to stay in sync
by convention — the kind of drift (one hue in a badge's text, a different
one in its background) that would otherwise ship silently. The same test
file pins `PILLAR_VISUALS` against `curriculum.ts`'s pillar list, asserts
every pillar route resolves to a real `page.tsx` on disk, and asserts every
pillar route appears in `TRACK_NAV_ITEMS` — the exact three-way drift
(engine says a pillar exists, nav doesn't list it, no page backs its route)
that left Quantum Mastery without a landing page for a long stretch (§1).
Setting `data-pillar="…"` on any wrapper is the entire integration surface:
every descendant token re-resolves, so a component never picks a pillar
color by hand.

**The background field** (`src/components/field/`) is a persistent,
scroll-driven canvas behind the whole site, painting whichever "regime"
(`regimes.ts`) the current pillar depicts — a dispersing wave packet for
Mechanics, Bloch precession for Computing, a control-pulse lattice for
Hardware, and so on; `journey` crossfades all six in curriculum order for
the homepage. Three architectural choices make it safe to have running on
every page of an otherwise almost entirely static, server-rendered site:

- **A module-level store (`fieldStore.ts`), not React context.** Context
  would require a client `Provider` wrapping the app in `src/app/layout.tsx`,
  which would opt every page's subtree into being a client-component
  boundary child — a real cost, paid on every route, for a decorative
  feature most of those routes don't even customize. A plain module store
  (`useSyncExternalStore`, the same shape as `ThemeToggle.tsx` and
  `useLessonProgress.ts`) keeps the client surface to exactly two leaf
  components: `<QuantumField>` (subscribes) and `<FieldRegimeSetter>`
  (publishes) — a page declares its regime without becoming a client
  component itself.
- **`PillarScope` is a Server Component.** It sets `data-pillar` directly in
  server-rendered HTML and paints a pure-CSS atmosphere layer, so there is
  no flash of default-pillar color before hydration, under
  `prefers-reduced-motion`, on a data-saver connection, or if JavaScript
  fails entirely — Apex looks like Apex in the very first painted frame.
  The canvas itself is strictly an enhancement on top of that: `PillarScope`
  only delegates *declaring* the regime to a one-line client component
  (`FieldRegimeSetter`), never the coloring itself.
- **The field is fully optional, by construction, not by convention.** Every
  page's actual colors come from CSS custom properties, never from the
  canvas — so "the canvas doesn't render" is a complete, correct render of
  any page, not a degraded one. `QuantumField` acts on this: it renders
  nothing under reduced motion or `saveData`, is `aria-hidden` with a
  separate `sr-only` text description of what it depicts, pauses its
  `requestAnimationFrame` loop when the tab is hidden, and scales its
  backing-store resolution and drawing detail down on small/low-core
  devices. `src/components/field/__tests__/regimes.test.ts` runs every
  regime's renderer against a recording canvas stub and asserts it never
  emits a non-finite coordinate, never leaks `globalAlpha` into the next
  frame, and never exceeds the alpha ceiling that keeps it from competing
  with body text.

**Motion infrastructure** (`src/components/motion/`) exists so that
scroll-linked and entrance effects don't each reinvent their own listener.
`Reveal.tsx` is the one shared entrance animation: one `IntersectionObserver`
for the whole page (not one per revealed element — a long lesson can have
60+), with the transition itself defined in CSS and only a `data-revealed`
attribute flipped from JS, degrading to visible (never to hidden) if JS
never runs. `useScrollProgress.ts` is one `rAF`-coalesced `scroll` listener
shared by every scroll-linked consumer site-wide — `useScrollSubscription`
for high-frequency consumers that write straight to a ref or canvas (the
background field, in particular, must never route scroll through
`useState`), `useScrollProgress` for the rare consumer that genuinely needs
to re-render, quantised so a full-page scroll causes at most a few hundred
re-renders instead of thousands. `usePrefersReducedMotion.ts` is now the
canonical location for that hook (`useSyncExternalStore`, matching
`ThemeToggle`'s pattern) — it originally lived under
`components/simulators/bloch-sphere/`, fine when only simulators needed it,
but the field, `Reveal`, and the narrative components all need it now; that
original file still exists and re-exports this one, so its ~17 prior import
sites keep working unmodified.

**Layout and typography primitives** (`src/components/ui/Section.tsx`,
`Typography.tsx`, `Panel.tsx`) give pages a composition vocabulary beyond
"another grid of cards": `Section`/`FullBleed`/`SplitFigure`/`Marginalia`
for alternating a measured reading column with full-bleed instruments and
asymmetric splits, `Eyebrow`/`SectionTitle`/`Lede`/`TechLabel`/`TechValue`/
`Readout(s)` for the four-voice typographic system, `Panel`/`Instrument`/
`FadeRule` for the "machined face" surface treatment. These are additive to
the pre-existing `Card`/`Button`/`Container`/`PageHeader` primitives from
§7, not a replacement for them — `Card` is still the right choice for a
plain, quiet box; `Instrument` is for anything containing a canvas,
simulator, or large diagram. Full usage rules live in
`docs/DESIGN_SYSTEM.md`.

**Apex's bespoke presentation** (`src/components/apex/` — `ApexHero`,
`ApexCourseIndex`, `ApexOpenProblems`, composed in `src/app/apex/page.tsx`)
deliberately does not use the shared `CourseList`/`CourseTimeline` every
other pillar page renders through. Apex is the curriculum's terminal pillar,
and the brief for it was to read as *crossing a boundary* — a
research-preprint title block instead of another instance of the standard
pillar-page template — while still exposing everything `CourseList`/
`CourseTimeline` do (title, description, difficulty, hours, prerequisites,
module list, completion state). `ApexCourseIndex` gets that parity by
importing `CourseProgressBadge`/`LessonCompletionMark` directly from the
shared components rather than reimplementing completion logic, so there is
still only one definition of "what counts as complete" anywhere on the
site; only the surrounding chrome (a numbered table of contents with dotted
leaders, hairline rules, no cards) is Apex-specific.

**Narrative MDX components** (`src/components/narrative/`, registered
globally in `src/mdx-components.tsx` alongside the pre-existing
`Callout`/`DefinitionBox`/`TheoremBox`/`ExternalFigure`/
`InteractiveSection`/`PredictBeforeReveal`) give lesson authors a vocabulary
for structuring a lesson as an experience — hook → question →
visualization → prediction → derivation → physical intuition → research
connection → challenge → next discovery — rather than undifferentiated
prose. `LessonHook`, `Question`, `InsightBlock`, `DerivationSteps`/
`DerivationStep`, `EquationReveal`, `AnnotatedFigure`, `ResearchConnection`,
`HistoricalMoment`, `ChallengePrompt`, and `NextDiscovery` are all plain,
mostly presentational components with no shared state between them — an
author opts into whichever beats a given lesson actually calls for. Full
prop-level documentation and usage examples for every one of these (and the
six pre-existing MDX shortcodes) live in
[`docs/NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md), which is the
author-facing reference; this section only covers where they sit
architecturally.

---

## 8. Changelog

### Session 1 — Foundation

- **Navigation** (`src/lib/nav.ts`, `Navbar.tsx`) — added Hardware and
  Software; the desktop nav breakpoint moved from `md` to `lg` because 8
  items no longer fit comfortably at `md` widths.
- **`/learn`** — rewritten from a static 4-step placeholder list to render
  the real 4-pillar curriculum from `curriculum.ts`.
- **`/lessons`** — rewritten from 6 hardcoded fake topics to the real,
  data-driven full catalog.
- **`next.config.ts`** — wrapped with `@next/mdx`, math/GFM remark-rehype
  plugins configured as strings (required for Turbopack compatibility,
  since it can't serialize JS plugin functions).
- **`globals.css`** — added the KaTeX stylesheet import and the
  `@tailwindcss/typography` plugin.

### Session 2 — Bloch sphere simulator

- Built `BlochSphereExplorer` (real, interactive) alongside the existing
  static `BlochSpherePreview`; added `lib/quantum/bloch.ts`
  (`StateVector` ⇄ Bloch angle/vector conversions) and
  `rotationAboutAxis` to `gates.ts`.
- Set up Vitest; wrote the first real test suite for `lib/quantum/`.
- Authored `what-is-a-qubit.mdx`, the first real lesson.

### Session 3 — Qubits & Quantum States (Course 1, complete)

- Authored the remaining 9 lessons of `qubits-and-quantum-states`.
- `LessonLayout` gained course progress, prerequisites, and prev/next nav
  (course-local only, at this point — see Session 4).

### Session 4 — Quantum Gates & Circuits (Course 2, complete)

- **Cross-course prerequisites fixed.** `LessonLayout` previously resolved
  `meta.prerequisites` only against the current course's lessons, so a
  prerequisite pointing at a different course silently failed to render as
  a link — Course 2 needed this on its very first lesson (its prerequisite
  is Course 1's capstone). Fixed by fetching `getAllLessonsMeta()` once in
  the route and passing the full list into `LessonLayout` as `allLessons`;
  prerequisites resolve against all of it, while prev/next and the
  progress indicator filter it down to the current course. See §5.
- **`lib/quantum/measurement.ts`** gained `qubitMeasurementProbabilities`
  and `measureQubit` — partial measurement of one qubit within a
  multi-qubit state, the one genuine gap in an engine that was otherwise
  already multi-qubit-capable. See §6.
- **`lib/quantum/state.ts`** gained `isNormalized()` and the module-level
  `tensorStates()`.
- **`lib/quantum/format.ts`** (new) — `formatAmplitudeLatex` promoted out
  of the Bloch-sphere-specific `format.ts` so both the simulator and the
  new `QuantumStateDisplay` component share one implementation;
  `bloch-sphere/format.ts` now just re-exports it alongside its own
  Bloch-specific helpers.
- **`components/quantum/QuantumStateDisplay`** (new) — see §7.
- **`src/lib/quantum/__tests__/multiQubit.test.ts`** (new) — 32 tests:
  qubit ordering, tensor products, two-qubit gates, Bell-state derivation
  and its entanglement proof, partial measurement (including on an
  entangled vs. an unentangled state), the full teleportation protocol
  (4 message states × 4 measurement branches, exact state equality), and
  a GHZ-state / multi-qubit-interference pair used as the capstone
  lesson's worked examples.
- **`curriculum.ts`** — replaced Quantum Gates & Circuits' 5 placeholder
  modules with the real 10-lesson sequence (bumped its difficulty to
  `intermediate`, hours to 8); moved `multi-qubit-states-and-tensor-products`
  out of it into the (still-placeholder) next course, since Course 2 is
  now scoped as "everything about a single qubit → many." Also **renamed
  and rescoped** `entanglement-and-measurement` (still all-placeholder) —
  its original modules (`bell-states`, `the-no-cloning-theorem`,
  `quantum-teleportation`) duplicated what Course 2 ended up teaching in
  depth; it now targets multipartite entanglement, mixed states, and Bell
  tests instead. See §2 & 3.
- **`package.json`** — added a `typecheck` script (`tsc --noEmit`).
- Nothing was removed from or restructured in the homepage,
  `/simulators`, `/problems`, `/about`, or Course 1's content.

### Session 5 — 2-Qubit State Explorer

- **`lib/quantum/twoQubit.ts`** (new) — `testSeparability` (the exact
  $ad-bc$ rank-≤1 test for 2-qubit separability) and
  `twoQubitJointProbabilities`. The only new math this simulator needed;
  every gate/measurement operation it uses already existed in the engine
  from Session 4. See §6b.
- **`src/lib/quantum/__tests__/twoQubit.test.ts`** (new) — 11 tests
  covering all four Bell states, several product states, a numerical-
  tolerance boundary case, and invalid-dimension guards. Total suite: 77
  tests (66 prior + 11 new), all passing.
- **`components/simulators/two-qubit-explorer/`** (new) — the explorer
  itself: `TwoQubitExplorer.tsx` (orchestrator), `StatePanel.tsx`,
  `CorrelationView.tsx` (presentational), `OperationControls.tsx`,
  `MeasurementPanel.tsx` (controls), `gateDefinitions.ts`, `presets.ts`
  (data), and `LazyTwoQubitExplorer.tsx` (lesson-embed wrapper, mirrors
  `LazyBlochSphereExplorer`). Built around an explicit five-layer split —
  math / simulation state / visualization / controls / lesson integration
  — documented in full in §6b, intended as the pattern future
  visualizations (circuit diagrams, density matrices, ...) follow.
- **Lesson integration** — embedded via `<LazyTwoQubitExplorer />` in
  `tensor-products.mdx`, `bell-states-and-entanglement.mdx`, and
  `multi-qubit-measurement.mdx`, each with lesson-specific "try it
  yourself" framing pointing at the exact interaction the surrounding math
  just derived (not inserted into every lesson in the course).
- **No new dependencies.** Everything is built on the existing engine, the
  existing `Button`/`Badge`/`KatexMath` UI primitives, and plain CSS
  transitions.
- Nothing was removed from or restructured in Course 1, Course 2's lesson
  prose, the homepage, `/simulators`, `/problems`, or `/about`.

### Session 6 — Problems System (Phase 1)

- **`lib/problems/`** (new) — the whole problems architecture: `types.ts`
  (the `Problem`/`Question`/`Answer`/`Hint`/`Solution`/`Explanation`/`Quiz`
  data model), `registry.ts` (statically-imported problem list plus
  lookups by slug/lesson/course), `validators/` (`multipleChoice.ts`,
  `numeric.ts`, `conceptual.ts`, dispatched by `validateAnswer`),
  `progress/` (`ProgressStore` interface, `LocalStorageProgressStore` +
  an in-memory SSR fallback, `useProblemProgress` built on
  `useSyncExternalStore`), and `hints.ts` (the pure hint-reveal-progression
  function). See §7b for the full design rationale.
- **`src/content/problems/quantum-computing/{qubits-and-quantum-states,quantum-gates-and-circuits}/`**
  (new) — 5 demonstration problems, each computing its canonical answer
  via the real engine at module load: `plus-state-measurement-probability`
  (numeric), `tensor-product-basis-label` (multiple-choice),
  `bell-state-separability` (conceptual), `bell-state-outcome-probability`
  (numeric), `h-then-cnot-result` (multiple-choice, whose correct option
  text is generated through the same `formatAmplitudeLatex` helper
  `QuantumStateDisplay` uses).
- **`components/problems/`** (new) — `ProblemLayout` (server),
  `ProblemView` (client orchestrator), `AnswerInput`, `Feedback`,
  `HintPanel`, `SolutionPanel`, `ProblemCard`, `ProblemFilters`,
  `ProblemsCatalog`, `PracticeLinks`. See §7b.
- **`components/ui/MathText.tsx`** (new) — renders plain text containing
  inline `$...$` LaTeX segments, for problem prompts/hints/solutions that
  are short structured strings rather than full MDX documents. A pure,
  hook-free function component, so — like `QuantumStateDisplay` — it works
  unmodified from both a Server Component (`ProblemLayout`) and a Client
  Component (`ProblemView`'s children).
- **`/problems`** rewritten from a 4-item hardcoded placeholder list to a
  real, filterable catalog of the 5 authored problems (topic + difficulty
  chip filters; an honest, live problem count — never a fabricated one).
  **`/problems/[slug]`** (new route) — statically generated, same
  `generateStaticParams` + `dynamicParams = false` pattern as
  `/lessons/[...slug]`.
- **Lesson integration** — `<PracticeLinks problems={...} />` added to
  `what-is-a-qubit.mdx`, `tensor-products.mdx`,
  `bell-states-and-entanglement.mdx`, and `multi-qubit-measurement.mdx`,
  each pulling its own lesson's problems via `getProblemsForLesson(slug)`
  computed at module load — the same "compute from real data, don't
  hand-type it" discipline as everything else these lessons import.
- **A real bug, caught by browser-testing rather than by type-checking or
  the unit suite:** the first working version of `useProblemProgress`
  hydrated progress via `useEffect` + `setState` on mount; separately,
  `LocalStorageProgressStore.getProblemProgress` returned a freshly
  `JSON.parse`'d object on every call. Switching the hook to
  `useSyncExternalStore` (the React-recommended primitive for an
  SSR-unsafe external store, and the fix for the `useEffect` pattern's own
  `react-hooks/set-state-in-effect` lint error) exposed the second bug:
  `useSyncExternalStore` requires `getSnapshot` to return a referentially
  *stable* value when nothing changed, and a fresh object every call
  doesn't satisfy that — React saw a "new" snapshot on every render and
  re-rendered forever (React error #185, a real crash reproduced in a
  live browser tab, not a lint warning). Fixed by caching reads in
  `localStorageStore.ts` until the next write. Pinned by
  `progressStore.test.ts`'s stable-reference assertions, added specifically
  because this class of bug is invisible to both `tsc` and a validator
  unit test — it only shows up when something actually calls the hook
  inside React's render loop.
- **`vitest.config.mts`** gained a `resolve.alias` for `"@/*"` (mirroring
  `tsconfig.json`), needed once problem content files started importing
  the engine and each other via `@/...` — no prior test file had used the
  alias. **Test suite: 115 tests, up from 77** (38 new: validators, hint
  progression, registry integrity, demonstration-problem answers checked
  against the engine, and the progress-store regression test above).
- **No new dependencies.**
- Nothing was removed from or restructured in Course 1 or Course 2's
  lesson prose (beyond the added `<PracticeLinks />` sections), the
  homepage, `/simulators`, or `/about`.

---

### Session 7 — Mathematical Foundations for Quantum Mechanics (Course 3, complete)

*(This entry documents work completed in an earlier session that was
never recorded here — added retroactively while auditing the platform,
since an undocumented gap in the changelog is itself a real
inconsistency worth fixing.)*

- **`curriculum.ts`** — replaced `mathematical-foundations`'s 4
  placeholder modules with the real 11-lesson sequence: Complex Numbers
  for Physics, Vector Spaces, Inner Products and Orthogonality, The
  Bra-Ket Formalism, Linear Operators, Eigenvalues and Eigenvectors,
  Hermitian Operators, Unitary Operators, Tensor Products and Composite
  Systems, Probability and Quantum States, and a Mathematical Foundations
  Challenge capstone.
- **`src/content/lessons/quantum-mechanics/mathematical-foundations/`**
  (new) — all 11 lessons, each with real derivations (Euler's formula
  from the Taylor series, the Cauchy-Schwarz proof, the completeness
  relation, matrix multiplication derived from it, the Hermitian
  real-eigenvalue and orthogonal-eigenvector proofs, the unitary
  norm-preservation proof, dimension-counting for why entanglement is
  generic, and the Born-rule normalization consistency check), explicitly
  cross-linked to (but not dependent on) the Quantum Computing pillar's
  parallel treatment of the same ideas applied to qubits.
- **`src/content/problems/quantum-mechanics/mathematical-foundations/`**
  (new) — 24 problems (numeric/multiple-choice/conceptual), 2–3 per
  lesson, registered in `lib/problems/registry.ts` and linked from every
  lesson via `<PracticeLinks />`.
- **`src/lib/quantum/__tests__/mathFoundations.test.ts`** (new) — 30
  tests verifying the lessons' mathematical claims against the engine
  (Euler's formula via a manual Taylor-series partial sum, Pauli
  eigenpairs, Hermitian/unitary checks, the spectral decomposition, the
  completeness relation for two different bases, tensor-product dimension
  and ordering for non-power-of-2 sizes, and global-phase invariance).
- **No engine or component changes** — every lesson's math was expressible
  with the existing `Complex`/`Matrix`/`StateVector` primitives and the
  existing Problems architecture from Session 6.

### Session 8 — From Classical to Quantum (Course 4) + Complex Amplitude Explorer

- **`curriculum.ts`** — replaced `classical-to-quantum`'s original 5
  historical-experiment placeholder modules with a real 11-lesson,
  postulates-first sequence: Classical States and Observables, From
  Classical to Quantum Probability, Why Complex Amplitudes?, The
  Postulates of Quantum Mechanics, Expectation Values and Uncertainty,
  Time Evolution and the Schrödinger Equation, Stationary States, The
  Quantum Harmonic Oscillator, Position and Momentum, Superposition
  Interference and Phase, and a capstone, From Postulates to Quantum
  Computing. This is a deliberate scope change from the original
  placeholder titles (blackbody radiation, the photoelectric effect,
  etc.) — those were never authored, so nothing was lost — reasoned
  through explicitly rather than blindly filled in: the historical/
  experimental motivation for quantum mechanics is real, valuable content
  that the *original* `classical-to-quantum` placeholder titles pointed
  at, but it's a different course in spirit from "bridge the linear
  algebra of Mathematical Foundations to the physical postulates," which
  is what was actually requested and what the course's own prerequisite
  (`mathematical-foundations`) and downstream courses (`wave-mechanics`,
  `operators-observables-measurement`) are structured to expect next. The
  historical-experiments content remains a real gap, noted in the roadmap
  below rather than silently dropped.
- **The course stays entirely finite-dimensional**, by design: time
  evolution, the harmonic oscillator, and even the uncertainty principle
  are all developed using only the existing finite-`Matrix`/`StateVector`
  engine — continuous position, momentum-as-differentiation, and the full
  wavefunction picture are explicitly previewed and deferred to the
  future Wave Mechanics course (stated honestly in the Position and
  Momentum lesson itself, not glossed over).
- **`src/lib/quantum/observables.ts`, `harmonicOscillator.ts`,
  `amplitude.ts`** (new) — see §6's engine table and §6b for what each
  contains and why each is its own file; no existing engine file was
  modified.
- **`src/content/lessons/quantum-mechanics/classical-to-quantum/`** (new)
  — all 11 lessons. Two genuinely new derivations worth calling out
  beyond what §6b/§9 already cover: the generalized uncertainty relation
  $\Delta A\Delta B\ge\tfrac12|\langle[A,B]\rangle|$, derived in full from
  Cauchy-Schwarz (not merely stated), and the harmonic oscillator's
  integer energy spectrum, derived entirely from the ladder-operator
  algebra $[a,a^\dagger]=1$ with zero calculus. The two-level time
  evolution worked example reuses `rotationAboutAxis` directly rather
  than introducing new matrix-exponential code (see §6's updated
  "deliberately not built yet" note).
- **`src/content/problems/quantum-mechanics/classical-to-quantum/`** (new)
  — 27 problems, 2–3 per lesson, registered and linked via
  `<PracticeLinks />` exactly as in Session 7.
- **`src/components/simulators/complex-amplitude-explorer/`** (new) — the
  **Complex Amplitude Explorer**, this session's one new interactive
  visualization; architecture documented in §6b. Embedded in "Why Complex
  Amplitudes?" and "Superposition, Interference, and Phase" (the two
  lessons whose content it directly illustrates), and added to
  `/simulators` as a real, fully interactive entry — not a "coming soon"
  placeholder.
- **`src/components/problems/ProblemsCatalog.tsx`** — no change needed
  this session (the "Quantum Mechanics" topic filter added in Session 7
  already covers the new course's problems automatically, since it
  filters by pillar rather than by course).
- **Test suite: 186 tests, up from 145** (32 new engine tests for
  `observables.ts`/`harmonicOscillator.ts`/`amplitude.ts`, plus 9 new
  registry tests verifying the new course's demonstration-problem answers
  against the engine — the Rabi/precession formula checked against
  `rotationAboutAxis` directly, the uncertainty-bound problems checked
  against `commutatorExpectation`, ladder-operator and energy-level
  problems checked against `harmonicOscillator.ts`, and more).
- **No new dependencies** — the Complex Amplitude Explorer is plain SVG,
  matching the "prefer SVG/HTML/CSS over WebGL" instruction directly.
- **A documentation gap found and fixed during this session's audit:**
  Session 7 (Mathematical Foundations) was completed but never recorded
  in this changelog — added retroactively above, since an inaccurate
  changelog is a real inconsistency, not a cosmetic one.
- Nothing was removed from or restructured in any existing course,
  simulator, or the Problems system beyond the additions above.

### Session 9 — Wave Mechanics (Course 5) + Wavefunction Explorer

- **`curriculum.ts`** — replaced `wave-mechanics`'s original 5 placeholder
  modules with a real 13-lesson sequence bridging finite-dimensional
  quantum mechanics (Course 4) to continuous position: What Is a
  Wavefunction?, Probability Density and Normalization, Expectation
  Values in Position Space, The Position and Momentum Operators, Momentum
  Space and the Fourier Transform, The Schrödinger Equation in Position
  Space, Free-Particle Wave Packets, The Infinite Square Well, The
  Harmonic Oscillator in Position Space, Wave Packet Dynamics and
  Dispersion, Tunneling and the Finite Barrier, Numerically Evolving
  Quantum States, and a Wave Mechanics Challenge capstone. Retitled from
  "Wave Mechanics & the Schrödinger Equation" to "Wave Mechanics" (the
  equation is one topic among several the course now covers, not the
  whole of it) and re-estimated at 9 hours (13 lessons at this course's
  actual depth, not the 5-module placeholder's guess).
- **New engine files** — `fourier.ts`, `wavefunction.ts`, `potentials.ts`,
  `timeEvolution.ts` (see §6's table and §6b's Wavefunction Explorer
  section for what each contains, the FFT performance story, and the
  state-management bug found and fixed during browser verification).
  `Wavefunction1D` gained a `superposition()` static method and a
  `momentumStatistics()` method (the latter added mid-session once
  profiling showed the naive per-panel FFT calls were the dominant cost —
  see §6b, point 6).
- **A genuine numerical correctness bug found and fixed, not just a UI
  bug:** the infinite-well presets' first working version used a wall
  height of `1e6` (matching the engine's default) with `dt=0.001` —
  norm-preserving exactly (as split-operator evolution always is,
  regardless of time step) but the *energy* expectation value, computed
  via the momentum-space kinetic term, drifted by over 3000% after a
  fraction of a second of simulated evolution, because `<p^2>` is
  disproportionately sensitive to poorly-resolved high-frequency content
  near an under-resolved (too-large `V*dt`) wall — even though `|ψ(x)|²`
  and the norm both looked completely correct. Fixed by rebalancing to
  `wallHeight=200`, `dt=0.0002` (product $0.04\ll1$) across the three
  affected presets (infinite-well ground/excited, superposition), with a
  new `timeEvolution.test.ts` regression test that *reproduces the bad
  combination* deliberately (asserting norm stays exact while energy error
  exceeds 1, i.e. explicitly documenting the failure mode) alongside a
  test confirming the corrected combination stays accurate. This exact
  incident is written up as this course's own worked example in the
  "Numerically Evolving Quantum States" lesson — a real engineering
  mistake made honest, rather than a hypothetical cautionary tale.
- **`src/content/lessons/quantum-mechanics/wave-mechanics/`** (new) — all
  13 lessons. Derivations worth calling out: $\hat p=-i\hbar\,d/dx$
  derived from requiring plane waves to be its eigenfunctions (not
  asserted, redeeming Course 4's explicit preview), $[\hat x,\hat
  p]=i\hbar$ re-derived directly by calculus (product rule on two lines),
  the position-space Schrödinger equation derived by substituting that
  operator into Course 4's already-proven $i\hbar\,d|\psi\rangle/dt=H
  |\psi\rangle$, the infinite well solved completely from boundary
  conditions, the harmonic oscillator's ground state verified by direct
  substitution to reproduce $E_0=\hbar\omega/2$ (cross-checking Course 4's
  independent ladder-operator derivation of the same number), Ehrenfest's
  theorem derived from the general $d\langle A\rangle/dt$ identity, the
  tunneling barrier solved via the sign flip in $\psi''=\kappa^2\psi$ for
  $E<V$, and the split-operator method's Trotter error derived via a
  direct Taylor-expansion comparison of $e^{(A+B)\Delta t}$ against
  $e^{A\Delta t}e^{B\Delta t}$.
- **`src/content/problems/quantum-mechanics/wave-mechanics/`** (new) — 30
  problems (numeric/multiple-choice/conceptual only, no new problem type),
  2–3 per lesson, registered and linked via `<PracticeLinks />`.
- **`src/components/simulators/wavefunction-explorer/`** (new) — the
  **Wavefunction Explorer**, this session's one new interactive
  visualization and the platform's first built around continuous physical
  simulation rather than deterministic slider-driven display; architecture
  documented in §6b. Embedded in the 8 lessons whose content it directly
  illustrates (Momentum Space, the Schrödinger Equation, Free-Particle
  Wave Packets, the Infinite Well, the Harmonic Oscillator, Wave Packet
  Dynamics, Tunneling, and Numerically Evolving Quantum States), and added
  to `/simulators` as the 4th real, fully interactive entry.
- **No new dependencies.** The FFT this course needed was hand-written
  (§6b explains why, and the resulting performance work) rather than a
  numerical-computing package pulled in for one operation, matching this
  platform's standing "smallest necessary footprint" default.
- **Test suite: 250 tests, up from 186** (57 new engine tests across
  `fourier.test.ts`, `wavefunction.test.ts`, `potentials.test.ts`,
  `timeEvolution.test.ts` — including the deliberate-failure regression
  test above — plus 8 new registry tests verifying the new course's
  demonstration-problem answers against `potentials.ts`'s analytical
  formulas and hand-derived formulas directly).
- Nothing was removed from or restructured in any existing course,
  simulator, or the Problems system beyond the additions above.

**A documentation gap between Session 9 and Session 10:** two courses —
`Operators, Observables & Measurement` (8 lessons) and `One-Dimensional
Quantum Systems` (5 lessons), both Quantum Mechanics pillar — were
designed and fully authored in the session between this changelog's
Session 9 and Session 10 entries, along with several `/learn` and
`/lessons` UI fixes (course completion badges, a derived "Start Here"
callout, corrected stale copy). That session's own changelog entry was
never written. Recorded here, retroactively, for the same reason
Session 8 recorded Session 7's own retroactive gap: an inaccurate
changelog is a real inconsistency, not a cosmetic one — not backfilled
in full narrative detail here since that isn't this session's work to
narrate accurately, but flagged so it isn't mistaken for undone work.

### Session 10 — Density-Matrix Engine + Entanglement, Mixed States & Bell Tests (Course, complete) + Density Matrix Explorer

- **New engine files** — `densityMatrix.ts`, `partialTrace.ts`,
  `entanglement.ts`, `chsh.ts` (see §6's table for what each contains and
  §6's updated "deliberately not built yet" note for the exact, tested
  scope boundaries — $2\times2$-only eigenvalues/entropy, `null`
  positivity above $2\times2$, pure-state-only entanglement measures).
  `matrix.ts` gained `trace()` and `isHermitian()`; `bloch.ts` gained
  `densityMatrixToBlochVector()`. No existing engine file's existing
  behavior was changed.
- **A key mathematical result derived and verified, not just asserted:**
  for any normalized 2-qubit pure state $a|00\rangle+b|01\rangle+c|10\rangle+d|11\rangle$,
  $1-\text{Tr}(\rho_A^2)=2|ad-bc|^2$ exactly — proven by direct expansion
  in "Why Entangled Subsystems Are Mixed," then reused to derive
  concurrence's exact relationship to reduced purity
  ($C=\sqrt{2(1-\text{Tr}(\rho_A^2))}$) in the next lesson, rather than
  presenting concurrence as an unrelated second formula.
- **A real content bug found via browser verification and fixed:** a
  numeric problem's hand-written solution steps (not the graded answer,
  which was already computed correctly via a real `chshValue` call)
  claimed $S=1$ for a specific CHSH configuration where Bob reuses
  Alice's settings; the correct value, confirmed by direct engine
  computation, is $S=0$ (a hand arithmetic slip:
  $\cos(\pi/2-\pi/2)=\cos(0)=1$, not $0$, was mis-simplified while
  writing the explanation text). Caught by testing the problem live in a
  browser and submitting the (wrong) hand-derived answer myself, which
  the grader correctly rejected — fixed in
  `same-settings-chsh-value.ts`'s hints/solution/explanation text; no
  engine code was involved in the bug or the fix.
- **`curriculum.ts`** — `entanglement-and-measurement`'s original
  4-module placeholder (which included "Multipartite Entanglement: GHZ
  and W States," out of scope for a two-qubit-only engine) redesigned to
  a real 12-lesson sequence; see §9's roadmap note for why. Re-estimated
  at 9 hours; slug and pillar unchanged (`quantum-algorithms-i`'s
  existing prerequisite reference stays valid).
- **`src/content/lessons/quantum-computing/entanglement-and-measurement/`**
  (new) — all 12 lessons. Derivations worth calling out beyond the purity
  identity above: $\langle A\rangle=\text{Tr}(\rho A)$ re-derived from
  $\langle\psi|A|\psi\rangle$ via the cyclic trace property (Lesson 1);
  the partial trace derived from a single defining requirement
  ($\text{Tr}[(A\otimes I)\rho_{AB}]=\text{Tr}(A\rho_A)$ for every local
  observable $A$), not presented as a formula to accept (Lesson 4); the
  CHSH inequality's $|S|\le2$ proven in full for every local
  hidden-variable model via the standard factoring argument (Lesson 10);
  $E(a,b)=\cos(\theta_a-\theta_b)$ derived by direct matrix-element
  calculation for $|\Phi^+\rangle$, then used to get $S=2\sqrt2$ exactly
  at the standard configuration (Lesson 11, cross-checked against
  `chshValue`'s numerical output to floating-point precision). The
  $\rho_{AB}=I/4$ counterexample (Lesson 7) is a genuine, engine-verified
  proof that reduced entropy fails as an entanglement measure once the
  global state is mixed, not an asserted caveat.
- **`src/content/problems/quantum-computing/entanglement-and-measurement/`**
  (new) — 32 problems, 2–3 per lesson, registered and linked via
  `<PracticeLinks />`.
- **`src/components/simulators/density-matrix-explorer/`** (new) — the
  **Density Matrix Explorer**, this session's one new interactive
  visualization, deliberately single-qubit-scoped; architecture
  documented in §6b (it reuses the existing `BlochSphereCanvas` with zero
  new rendering code — only a new density-matrix-to-Bloch-vector data
  source). Embedded in "Pure States and Mixed States," and added to
  `/simulators` as the platform's 5th real, fully interactive entry,
  replacing the "Entanglement visualizer" coming-soon placeholder it
  supersedes in scope.
- **No new dependencies.**
- **Test suite: 388 tests, up from 250** (95 new engine tests across
  `densityMatrix.test.ts`, `partialTrace.test.ts`, `entanglement.test.ts`,
  `chsh.test.ts`, `format.test.ts`, plus additions to `matrix.test.ts` and
  `bloch.test.ts` — including the CHSH standard-configuration angles
  verified to reach $2\sqrt2$ via a brute-force numerical search over the
  other observable, not merely asserted at one configuration).
- Nothing was removed from or restructured in any existing course,
  simulator, or the Problems system beyond the additions above.

### Session 11 — Full-Curriculum Completion Sprint (all 14 remaining courses)

An overnight sprint authoring every course that was still "Coming Soon":
5 more Quantum Mechanics courses (Quantum Algorithms I & II and Error
Correction & Fault Tolerance were Quantum Computing pillar and are listed
separately below; Angular Momentum & Spin, The Hydrogen Atom,
Approximation Methods, Identical Particles & Many-Body Systems, and
Advanced Topics in Quantum Mechanics complete the Quantum Mechanics
pillar), 3 Quantum Computing pillar courses (Quantum Algorithms I,
Quantum Algorithms II, Quantum Error Correction & Fault Tolerance), and
the entirety of the previously-empty Quantum Hardware pillar (Physical
Qubit Platforms, Control & Readout, Noise Decoherence & Scaling) and
Quantum Software pillar (Programming Quantum Computers, Simulating
Quantum Systems, Compilation & Hybrid Algorithms) — 14 courses, ~65
lessons, ~245 problems, 20 new engine files (table above), bringing the
platform to all 22 courses authored.

**Curriculum redesign, not blind placeholder-filling.** `curriculum.ts`'s
`advanced-quantum-mechanics` entry originally listed
`density-matrices-and-mixed-states`, `entanglement-formal-treatment`, and
`epr-and-bell-inequalities` as its first three modules — nearly identical
in scope to Session 10's already-complete `entanglement-and-measurement`
course. Redesigned before authoring (not after) to a genuinely
non-overlapping 4-lesson sequence: Open Quantum Systems & Kraus
Operators, Decoherence & the Quantum-to-Classical Transition, The Path
Integral Formulation, and a capstone — building on the density-matrix
foundation Session 10 already established rather than re-deriving it.
`quantum-algorithms-ii`, `error-correction-and-fault-tolerance`, and
`angular-momentum-and-spin` were each expanded from their original
4-5-module placeholder to a fuller (7-8-module) sequence where the
subject matter genuinely warranted it; `the-hydrogen-atom`,
`approximation-methods`, and `identical-particles` kept their original
module counts, since those were already right-sized. Every Quantum
Hardware and Quantum Software course shifted deliberately toward
architecture/engineering-tradeoff framing rather than the proof-heavy
style of the Quantum Mechanics pillar, per this session's own design
brief.

**Three real engine bugs found and fixed, each caught by a test that
checked an intermediate state rather than only a final outcome:**

- **`groverDiffusion`** originally reused `applyPhaseOracle(s,[0])` for
  "reflect about $|0\rangle$" — this implements $I-2|0\rangle\langle0|$,
  the *negative* of the needed $2|0\rangle\langle0|-I$. The sign error is
  a pure global phase, invisible to every probability-based test (Grover's
  own success-probability numbers looked correct even with the bug), and
  was only caught by testing `groverDiffusion(|s\rangle)===|s\rangle`
  directly. Fixed with an explicit `reflectAboutZero` helper; the bug and
  fix became the lesson's own worked Common Mistakes example.
- **`encodeBitFlipCode`** built its initial state as
  `[alpha, beta, 0,0,0,0,0,0]` — placing $\beta$ at basis index 1 (binary
  `001`), when the platform's qubit-0-is-MSB convention (§6) requires
  index 4 (binary `100`). The bug completely broke the encoding circuit
  (`CNOT(0,1)`'s control qubit never saw the $\beta$ term at all); caught
  by a step-by-step debug script printing intermediate amplitudes after
  each CNOT, not by the final recovery check alone. Fixed by correcting
  the initial-state array to `[alpha,0,0,0,beta,0,0,0]`.
- **A QAOA test** asserted one graph's good $(\gamma,\beta)$ parameters
  also worked for a different graph; a grid search showed they didn't
  (0.76 achieved cut vs. the required >0.95). Fixed by grid-searching
  per-graph optimal parameters rather than assuming portability — a test
  bug, not an engine bug, but the kind that would have silently validated
  a wrong claim in the lesson otherwise.

**Two production-build bugs found by running `npm run build`, not caught
by `tsc`/`lint`/`vitest`:** MDX/remark parses a bare `{...}` outside a
`$...$` math block as a JSX expression. Two lessons had this: a markdown
heading literally titled `### Verified decompositions into {Rz, Ry}`, and
bold prose containing `e^{-t/T}` outside math delimiters — both threw
`ReferenceError` at prerender time (`Rz`/`t` "not defined"), not at
typecheck or test time. Fixed by rewording the heading and wrapping the
formula in `$...$`. This is the same known MDX failure mode documented
earlier in this file (`{jsExpression}` inside lesson content isn't
evaluated the way it looks like it should be) — worth restating here
because it surfaces only at `next build` time, which is why that build is
a mandatory step, not an optional extra check.

**A related but distinct MDX/acorn module-scope hazard, discovered in the
visual-transformation session (Session 13) and worth its own entry
because it is silent at every check *except* `next build`'s prerender
step, and even then reports the wrong symptom (a `ReferenceError` on
some *later* line, not a parse error at the real fault site).** The
complete rule, found only after inspecting compiled Turbopack SSR chunks
directly (`.next/server/chunks/ssr/*.js` under `next dev`, or
`.next/server/chunks/ssr/*.js` after a `next build`) to see exactly how a
broken statement had been tokenized:

- **Every top-level statement in an `.mdx` file's JS frontmatter must be
  an `import` or `export` statement — nothing else.** `@next/mdx`'s
  parser groups module-scope code into contiguous blocks (any run of
  non-blank lines), and a block is only recognized as executable code if
  it is *entirely* import/export syntax. A block containing so much as a
  bare `//` comment line, or a bare expression statement
  (`someObject.method(x);`), or a plain (non-`export`) `const`/`let`, gets
  silently reparsed as markdown *prose* instead of JavaScript — the
  broken statement literally becomes the text content of a compiled `<p>`
  element (confirmed by grepping the compiled chunk for the swallowed
  variable name). This produces no error at parse time; it only surfaces
  as `ReferenceError: X is not defined` at prerender time, and only on
  whichever *later* line first references the swallowed name — which can
  be far from, and look unrelated to, the actual broken block.
- Concretely, all of the following must be avoided in `.mdx` frontmatter,
  each independently sufficient to trigger the swallow: (1) a plain
  `const`/`let` not marked `export`; (2) a `//` comment line adjacent (no
  blank-line separation) to a following `const`/`export const`, which
  drags the whole contiguous block — comment and code together — into the
  same misparsed prose run; (3) any bare expression statement, e.g.
  `circuit.h(0).cnot(0,1);` on its own line after `const circuit = ...` —
  fix by folding the whole chain into one expression
  (`new QuantumCircuit(3).h(0).cnot(0,1)`) assigned directly, since MDX
  literally only accepts import/export at this level, not "declare then
  mutate."
- Separately (a real, independently-necessary hazard, not the same
  mechanism): a **braced function/arrow body** (`(x) => { ...; return
  y; }`) anywhere in the frontmatter — including nested inside an
  otherwise-fine JSX prop expression, e.g.
  `frames={values.map((v) => { const y = f(v); return {...}; })}` inside
  a component tag — breaks the same pipeline, regardless of nesting depth
  or brace-body length. The fix is always the same: rewrite as an
  implicit-return arrow (`values.map((v) => ({ ... }))`), pulling any
  multi-step computation out into module-scope, brace-free
  `export const helper = (x) => expression;` functions called from
  inside the implicit-return expression instead of computed inline with
  intermediate `const`s.
- **The practical rule that avoids every variant above:** in `.mdx`
  frontmatter, mark every declaration `export const` (never plain
  `const`/`let`), never leave a bare `//` comment adjacent to code (delete
  it or separate it with a blank line so it forms its own inert
  single-line block), never write a bare expression statement (fold it
  into the preceding declaration), and never use a braced function body
  anywhere, including inside JSX — implicit-return arrows only, with
  named `export const` helpers for anything needing more than one step.
  None of this is caught by `tsc`, `lint`, or `vitest`; only a clean
  (`rm -rf .next`) `next build` exercises every static route and will
  surface it, and Turbopack's parallel static-generation workers stop at
  the *first* failure they hit, which can misleadingly suggest a fix
  worked when a different, still-broken file simply hadn't been reached
  yet by that particular build run — always re-run a full clean build
  after any such fix, not just spot-check the one file that errored.

**Content-quality corrections found during writing, before publishing:**
the 3-qubit bit-flip code's weight-2 error case was initially described
as "detected but miscorrected to the wrong qubit"; direct engine
verification showed the actual consequence is more specific — the
prescribed correction produces the code's own undetectable weight-3
logical flip, swapping $\alpha$ and $\beta$ exactly. The lesson, its
Common Mistakes callout, and a practice problem were rewritten to state
this precisely. A period-finding lesson's practice problem originally
used $a=2,N=21$ ($r=6$, and $2^6/6$ is not an integer, giving 10 smeared
peaks instead of a clean $r$), silently violating the lesson's own
"exactly $r$ clean peaks" claim; switched to $a=4,N=15$ ($r=2$,
$2^6/2=32$ exact) and added an explicit divisibility caveat to the
lesson.

**Verification discipline, unchanged from Session 10 but now applied
across 14 courses:** every new engine file's key formulas were checked
via a throwaway `vite-node` scratch script against an independent method
(direct enumeration, a known closed-form identity, a brute-force search)
*before* any lesson prose referencing specific numbers was written, then
the scratch script deleted and replaced with a permanent, leaner Vitest
suite. Every numeric problem's graded value is computed by calling the
real engine function, never hand-typed.

**Real-world reuse across pillar boundaries, not just within-course
reuse:** `approximationMethods.ts`'s `exactTwoLevelTransitionProbability`
(built for a Quantum Mechanics time-dependent-perturbation-theory lesson)
turns out to be *exactly* the resonant two-level Rabi formula
($P_1(t)=\sin^2(\Omega t)$ at $E_i=E_f$) — reused unchanged in the
Quantum Hardware pillar for gate-timing (`t_\pi=\pi/(2\Omega)`) and
calibration (recovering a hidden $\Omega$ from a scanned Rabi curve).
`openSystems.ts`'s Kraus channels (built for Advanced Topics in Quantum
Mechanics) are reused unchanged in Noise, Decoherence & Scaling ($T_1$/$T_2$,
connected via the new `decayProbabilityForTimestep`) and again in
Simulating Quantum Systems' `noisyCircuitSimulation.ts`. Quantum
Algorithms II's `vqe.ts` (`exactGroundStateEnergy`) is cross-checked
exactly against a completely independent, circuit-as-data VQE
implementation built in Compilation & Hybrid Algorithms using
`circuitBuilder.ts` — two different code paths computing the same
physics agree to floating-point precision, a genuine correctness check,
not a restated example.

**Two honest, explicitly-stated scope limitations, in the same spirit as
this file's existing "deliberately not built" notes:**
`pathIntegral.ts` uses Euclidean (imaginary) time only — the real-time
path integral's $e^{iS/\hbar}$ weight is a pure, undamped phase, which a
brute-force grid sum cannot reliably converge on without a regularization
scheme beyond this course's scope; Euclidean time's $e^{-S_E/\hbar}$
weight is a genuine, standard technique (Wick rotation, used throughout
statistical mechanics) that decays properly and integrates to
~$10^{-15}$ relative error against the closed form.
`noisyCircuitSimulation.ts`'s `runNoisyCircuit` is scoped to single-qubit
circuits — a correct multi-qubit version needs each gate expanded to a
full $2^n\times2^n$ unitary via tensor products with identity on every
untouched qubit, real and well-understood machinery, just not needed by
any lesson this session wrote.

**No new dependencies.** Every new engine file uses only `Complex`,
`Matrix`, `StateVector`, and plain arithmetic already in the codebase.

**Test suite: 574 tests across 48 files** (up from 388 at the end of
Session 10; the exact count immediately before this session's visible
portion began is not preserved, since work continued directly from an
earlier, separately-summarized part of the same sprint — 486 tests/38
files is the earliest number confirmed in this entry's own working
context, itself after 4 of the 14 courses were already done).
`npx tsc --noEmit`, `npm run lint`, and `npx vitest run` were run after
every single course, not batched to the end, so every reported number
above reflects a real, passing state at the time it was checked, not a
final cleanup pass papering over intermediate breakage.

**Production build verified, not assumed.** `npm run build` succeeded
after fixing the two MDX bugs above, generating all 522 static routes
(155 lesson pages, 356 problem pages, plus the fixed top-level/pillar/hub
pages) with no prerender errors. Real browser verification (Chrome,
against a locally running `next dev` server, restarted mid-session
specifically because a long-lived dev process from earlier in the
session predated most of this session's new content and was serving
stale 404s for it) confirmed: `/learn`, `/hardware`, and `/software`
render every course's correct, derived completion count; representative
lesson pages from the Quantum Mechanics, Quantum Hardware, and Quantum
Software pillars render LaTeX, code blocks, callouts, and
`<PracticeLinks>` correctly with zero console errors; the `/problems`
catalog renders; and one full problem page's numeric-answer grading was
exercised live (submitted `10`, correctly marked "Correct" against the
π-pulse-duration engine calculation) — an end-to-end check of engine →
authored problem → registry wiring → UI → grading, not just a visual
spot check.

**Nothing was removed from or restructured in any existing course,
simulator, or the Problems system beyond the additions above.** No new
simulators were built this session — Priority 3 in this sprint's own
brief ("simulations only after lessons and problems are complete") was
never reached within the session's scope; see the roadmap update below
for what a follow-up simulator pass should prioritize.

### Session 12 — Overnight Polish + Interactivity Sprint

An editorial, interactivity, and problem-coverage pass across the full
22-course, 155-lesson platform, run to a different brief than Session
11's content-authoring sprint: no new courses, but human-quality prose,
new simulators, and fixing a real, confirmed problem-coverage gap.

**Editorial pass, all 155 lessons.** 8 parallel forks read every lesson
against explicit criteria (no em dashes in prose, no banned AI-sounding
phrases, explains *why* before equations, natural transitions, assumes
only prerequisite-established knowledge) and rewrote where it genuinely
improved the lesson, leaving already-strong paragraphs alone. **A
self-report from that first pass turned out to be wrong for 22 files**
(entirely within Entanglement, Mixed States & Bell Tests and Quantum
Algorithms I, plus one file each in Quantum Algorithms II and Wave
Mechanics): a fresh, independent grep swept the *entire* lesson corpus
afterward and found 386 em dashes still present in files whose fork had
claimed zero remaining. A second round of 3 parallel forks fixed all 386
(genuine sentence-level rewrites, not mechanical deletion, including
occurrences hiding in `lessonMeta.title`/`description` string fields, not
just markdown prose), verified independently this time both by each
fork's own final grep and by a corpus-wide grep run directly, confirming
**zero em dashes remain across all 155 lesson files.** The lesson here:
a subagent's "0 remaining" self-report is a claim, not a fact, and is
worth independently re-verifying on a task like this rather than trusted
outright, even when the same instruction was followed. No math,
equations, or physics content was touched in either pass; both were
scoped to punctuation, sentence structure, and prose voice only.

**Four new simulators built** (Circuit Builder, Grover's Algorithm
Explorer, Rabi/Qubit Dynamics Explorer, Noise & Decoherence Explorer —
full architecture in §6b), bringing the platform to 9 real interactive
simulators. Each reused existing, already-tested engine code rather than
duplicating math: Circuit Builder is a thin UI over `circuitBuilder.ts`
(gaining one new export, `runInstructions`, for step-scrubbing); Grover's
Algorithm Explorer needed zero new engine code at all; the Rabi Explorer
required one genuine physics verification pass before any UI was
written (Bloch-vector unitarity, the exact resonant closed form, and the
correctly-derived generalized-Rabi closed form all checked and made
permanent Vitest assertions, not just a scratch-script sanity check) and
added `exactTwoLevelState`/`exactTwoLevelTrajectory` to
`approximationMethods.ts`; the Noise & Decoherence Explorer reuses
`openSystems.ts`'s existing Kraus channels and the Density Matrix
Explorer's own state-panel component directly, adding no new engine
math. All 4 are embedded with deliberate pedagogical framing (predict,
then check) in 8 lessons total across Quantum Gates & Circuits,
Programming Quantum Computers, Quantum Algorithms I, Quantum Hardware's
Control & Readout, and Advanced Topics in Quantum Mechanics — never
inserted merely because a simulator existed.

**A severe, confirmed problem-coverage gap fixed.** Qubits & Quantum
States (1 problem across 10 lessons, 9 lessons with zero) and Quantum
Gates & Circuits (4 problems across 10 lessons, 6-7 lessons with zero)
were exactly as under-covered as the user's own brief specifically
flagged as a concern — confirmed by direct inspection before writing
anything, not assumed. 4 parallel forks wrote 55 new problems (mixed
numeric/multiple-choice/conceptual, every numeric answer computed by a
genuine call into the tested quantum engine at module load time, never
hand-typed) bringing both courses to 3 problems per lesson, and wired
`<PracticeLinks>` into all 20 lesson files (several of which had no
problems-system wiring of any kind before this session). Every problem
was scoped to what its specific lesson (or an earlier prerequisite)
actually teaches, checked against the lesson's own text by each writing
fork before being authored.

**One real, load-bearing bug found and fixed via a programmatic
check, not a self-report.** A script cross-referencing every lesson's
`prerequisites` array against the actual set of authored lesson slugs
found `complex-numbers-for-quantum-mechanics.mdx` listing
`"...qubits-and-quantum-states/classical-bit-vs-qubit"` as a
prerequisite — a slug that has never existed as a lesson file (the
actual file is `what-is-a-qubit.mdx`; `classical-bit-vs-qubit` is that
lesson's *internal* `module` field, a different identifier used only for
`curriculum.ts`'s own course-ordering lookups, not for cross-lesson
links). `LessonLayout.tsx` resolves `prerequisites` entries via
`allLessons.find(lesson => lesson.slug === prereqSlug)` — a mismatched
reference doesn't throw, it silently fails the `.find()` and renders no
prerequisite link at all. Fixed by correcting the reference to the real
lesson slug; re-running the same check across all 155 lessons afterward
confirmed zero broken references and zero self-references remain.

**One accessibility gap fixed in newly-written code.** The Circuit
Builder's SVG circuit diagram made each gate a mouse-only click target
(no `tabIndex`, no keyboard handler, no `role`) to jump the state display
to that step — a real gap, even though the same functionality was also
reachable via the redundant step slider. Fixed with `role="button"`,
`tabIndex={0}`, a descriptive `aria-label` per gate, an `onKeyDown`
handler for Enter/Space, and a visible `focus-visible` outline.

**Test suite: 583 tests across 48 files** (up from the sprint's stated
574 baseline — 9 net new, all in `approximationMethods.test.ts` covering
`exactTwoLevelTrajectory`: resonant case matches $\sin^2(Vt)$ exactly at
every sample, normalization preserved on and off resonance, agreement
with an independently-run single-shot integration, the off-resonant
maximum matches the closed-form generalized-Rabi formula, correct
behavior at $t=0$, and rejection of invalid `tMax`/`samples`).
`npx tsc --noEmit`, `npm run lint`, and `npx vitest run` all pass clean
on the final state, run fresh after every fork's work landed, not just
once at the end.

**Production build verified against the final state, not an
intermediate one.** `npm run build` succeeded generating all 577 static
routes (155 lesson pages, 411 problem pages — up from 356, all 55 new
ones included — plus the fixed top-level/pillar/hub pages and the new
`/simulators` entries), with no prerender errors. Real browser
verification (Chrome, against a freshly-restarted `next dev` server —
the previous long-lived dev process, again like Session 11's note,
predated this session's newest routes and served a stale 404 for one
until restarted) exercised: the Rabi Explorer's coupling-strength,
detuning, and time-scrubbing controls with live KaTeX-rendered
$P(1)$/$\Omega_\text{eff}$ output and Bloch-sphere trajectory; the Noise
Explorer's channel switch (amplitude damping vs. dephasing) showing the
qualitatively different Bloch-vector shrinkage each channel produces,
with the density-matrix and purity-curve panels updating live; a
newly-authored problem's full interaction loop end to end — wrong
answer, custom incorrect-feedback text, "Try Again," correct answer,
"Correct," and the KaTeX-rendered step-by-step solution reveal — with
zero console errors throughout.

**Not done this session, stated honestly rather than glossed over:** a
dedicated, full manual terminology/redundancy/difficulty-progression
audit across all 22 courses (Priority 6) was not run as its own pass;
the prerequisite-graph integrity check above is real but narrower in
scope than that full audit. Problem coverage for the other 20 courses
was not re-audited here — Session 11's own fork survey (predating this
entry) found them adequately covered, and this session's work targeted
specifically the two courses that survey confirmed as gaps. UI/accessibility
polish was applied only to the Circuit Builder component this session
wrote, not swept across the platform's pre-existing simulators and pages.

## 9. Implementation Roadmap

**Update after Session 11:** all 22 courses across all 4 pillars are now
fully authored (see Session 11's changelog entry above for the complete
list). The items below this point are the roadmap as it stood through
Session 10 — kept as history rather than rewritten, since the "Also
pending" list's curriculum-content items are now done. **What's next,
concretely:**

- **Resolved in Session 12.** The platform now has 9 real interactive
  simulators: the 5 from before Session 11 (Bloch Sphere, 2-Qubit State,
  Complex Amplitude, Wavefunction, Density Matrix) plus 4 new ones built
  in Session 12 (Circuit Builder, Grover's Algorithm Explorer, Rabi/Qubit
  Dynamics Explorer, Noise & Decoherence Explorer — see §6b for each).
  The remaining long-standing "Coming soon" placeholder is the
  interference playground; picking a genuinely distinct next candidate
  (rather than something Session 12's 4 already substantially overlap in
  spirit with, e.g. QFT/phase visualizers) would be the natural next
  simulator-pass target, applying this file's own "prefer fewer excellent
  simulations" principle (§6b) rather than adding for its own sake.
- **A global redundancy/prerequisite re-audit** beyond the one
  redesign Session 11 already made (`advanced-quantum-mechanics` vs.
  `entanglement-and-measurement`) would be worth a dedicated pass now
  that all 22 courses exist simultaneously — Session 11 checked its own
  new courses against each other and against pre-existing courses as it
  went, but did not do a from-scratch cross-check of the full, final
  22-course prerequisite graph in one pass.
- **The quiz-taking UI** (below) and **general eigensolver** (below)
  remain exactly as deferred as they were at the end of Session 10 —
  neither was needed by any of Session 11's 14 courses either.

**Done (through Session 10):** foundation (data model, MDX pipeline, quantum engine, IA/nav);
the Bloch sphere simulator; Vitest infrastructure; `Qubits & Quantum
States` and `Quantum Gates & Circuits` (Quantum Computing pillar) fully
authored (20 lessons); `Mathematical Foundations for Quantum Mechanics`,
`From Classical to Quantum`, `Wave Mechanics`, `Operators, Observables &
Measurement`, and `One-Dimensional Quantum Systems` (Quantum Mechanics
pillar) fully authored (56 lessons); `Entanglement, Mixed States & Bell
Tests` (Quantum Computing pillar, 12 lessons) — density matrices, partial
trace, mixed states, purity, von Neumann entropy, two pure-state
entanglement measures, and the CHSH inequality, all built on a genuinely
new engine layer (`densityMatrix.ts`, `partialTrace.ts`, `entanglement.ts`,
`chsh.ts` — §6); cross-course prerequisites, exercised across eight
separate course boundaries now; the 2-qubit state explorer, the Complex
Amplitude Explorer, the Wavefunction Explorer, and the Density Matrix
Explorer, all embedded in real lessons; the Problems system (data model,
3 validator types, `localStorage`-backed progress behind a swappable
interface, catalog + detail UI, topic/difficulty filtering) with 153
problems across both pillars.

**`one-dimensional-systems` and `operators-observables-measurement` were
redesigned rather than filled in as originally placeholder-scoped**,
exactly as the architectural consideration previously flagged in this
section recommended (their own changelog write-ups are still pending —
a documentation gap, not a content one; the courses themselves are
complete and cross-referenced correctly against `wave-mechanics`).

**`entanglement-and-measurement`'s original 4-module placeholder
(Multipartite Entanglement, Quantifying Entanglement, Mixed States &
Density Matrices, CHSH & Bell Tests) was redesigned to 12 lessons before
being authored**, for the same reason as the two courses above: the
original "Multipartite Entanglement: GHZ and W States" module would have
needed 3+ qubit machinery this engine deliberately doesn't build (see
§6's updated "deliberately not built yet" note) — the redesigned sequence
stays honestly within two-qubit scope throughout, building density
matrices up from first principles (Lesson 1) through a full worked CHSH
violation and a synthesis capstone (Lessons 11–12).

**The math engine now has density matrices, partial trace, and von
Neumann entropy** (`densityMatrix.ts`, `partialTrace.ts`,
`entanglement.ts`, `chsh.ts` — §6), scoped to exactly what
`entanglement-and-measurement` needs: two-qubit density matrices, a
general-$n$-qubit partial trace, and a $2\times2$-only closed-form
entropy/eigenvalue solver. **A general eigensolver (matrix
diagonalization for an arbitrary-dimensional Hermitian operator) remains
deferred** — still not needed by any built course, next likely triggered
by a course needing eigenstates of a potential with no closed form, or a
genuine mixed-state/multipartite entanglement treatment.

**Next — the quiz-taking UI.** The `Quiz` data model and registry lookups
already exist (§7b) with zero authored quizzes; building the actual
navigation/scoring/review UI is real, separate design work best done
against a handful of real quizzes.

**Also pending (as of Session 10 — see the Session 11 update at the top
of this section for what's changed since):** the historical/experimental
motivation course (Session 8's gap — blackbody radiation, the
photoelectric effect, wave-particle duality — still has no home in the
curriculum); progress & personalization *beyond* single-problem state
(lesson completion, cross-problem streak-free progress summaries — still
no auth/database, same `ProgressStore`-interface discipline
`lib/problems/progress` already established); ~~revisiting the 8-item flat
navbar if it grows further~~ **done as of Session 14** — the six pillar
pages now live under a grouped Tracks dropdown, see §1 and the Session 14
changelog entry; ~~Hardware & Software pillar content
(architecture-complete, purely a writing task)~~ **done as of Session
11**; the still-unbuilt `/simulators` entries (circuit builder,
entanglement visualizer, interference playground) — **still unbuilt
after Session 11 too; see this section's Session 11 update above for
current priority order.**

### Session 13 — Fresh-review / repair sprint

A different shape of session: instead of authoring new content, this pass
ran a fresh-eyes quality audit (9 independent review agents, none of whom
had written any of the material they were reviewing, covering QM content,
QC content, Hardware+Software content, homepage first impressions,
simulator quality, the problem bank, accessibility/mobile, architecture at
3x scale, and SEO) followed by a repair pass (7 parallel agents fixing what
the review surfaced, each scoped to a disjoint set of files to avoid
conflicting edits).

**A real, previously-unknown MDX hazard was found and fixed first, before
the review wave.** Two new lessons (`bb84-quantum-key-distribution.mdx`,
`superdense-coding.mdx`) were silently 404ing in production despite
`next build` reporting success. Root cause, confirmed by temporarily
instrumenting `loadLesson()`'s catch block: a `//` JS comment *anywhere* in
an `.mdx` file's top-level export block corrupts MDX/acorn's parse such
that `export const` statements declared after it become unbound —
referencing them elsewhere in the same block throws a `ReferenceError` at
module-evaluation time, which `loadLesson()`'s blanket `catch { return
null }` silently turned into an ordinary-looking 404. The first hypothesis
(that it was specifically Dirac bra-ket pipe characters like `|+⟩` inside
the comments) was wrong — removing just the pipes didn't fix it; removing
the `//` comments entirely did, confirmed by a clean rebuild with zero
diagnostic errors. This is a stricter variant of the MDX/acorn hazards
already documented in `AGENTS.md`: **never write a `//` comment inside an
.mdx file's top-level export block**, full stop, regardless of content.

**The review wave's most consequential finding:** the homepage hero's
main visual was a static, non-interactive SVG that *literally said "This
is a static illustration"* with a button linking away to `/simulators` —
directly contradicting this platform's own "real interactive within 10
seconds" principle. Fixed by building `BlochSphereHeroExplorer`, a
trimmed-down (H/X/Z gates + Measure/Reset only) but genuinely real
instance of the Bloch sphere engine, replacing `BlochSpherePreview`
(deleted; see the updated §3/§6b notes above).

**Other confirmed fixes from the repair wave:** a factual arithmetic slip
in `multi-electron-atoms-introduction.mdx` (2p subshell fills at electron
10, not 8) plus a chart-scaling bug in the same file that was silently
undercutting its own pedagogical point (bars scaled to a shared
`maxValue` regardless of each subshell's actual capacity, so a *full* 1s
and a *2-of-6* 2p rendered at nearly the same height); a preset/prose
mismatch in `addition-of-angular-momentum.mdx` (the lesson told students
to "prepare |Ψ⁻⟩" via a preset that actually produces |Φ⁺⟩ — fixed with
the explicit X-then-Z gate recipe, verified by hand against the real
Pauli matrices); a broken plain-text (non-link) "Further Exploration"
pointer; one mis-attributed cross-reference; excess em-dash density
isolated to the newly-added `simons-algorithm.mdx`; thinner landing-page
copy on `/hardware` and `/software` versus the richer `/mechanics` and
`/computing` pages from an earlier session (extended to match, with every
named lesson/simulator verified against the actual codebase, not
invented); five accessibility fixes (a site-wide skip-to-content link; a
KaTeX `.katex-display` overflow rule, since KaTeX itself ships no
mobile-safe overflow handling and this is a math-dense site; darkened
`--accent`/`--warning` CSS tokens, which failed WCAG AA contrast — 3.68:1
and 3.19:1 respectively — while being used as real body/label text, not
just backgrounds; a fix to `Button.tsx` silently dropping `aria-pressed`
and other native attributes because `ButtonProps` didn't extend the DOM
attribute types; and a missed `role="radiogroup"` retrofit on
`WavefunctionExplorer`'s preset picker, the one simulator control group
the earlier accessibility pass hadn't reached); and three simulator bugs
(a Rabi Explorer population-curve marker dot that read the *last* sample
instead of the currently-scrubbed one; a missing keyboard focus ring on
Circuit Builder's two-qubit gate cells; an unclamped Complex Amplitude
Explorer slider that could display a "probability" greater than 1 — fixed
by conditionally relabeling rather than fighting the sliders' independent
ranges with a joint clamp).

**Architecture hardening, directly motivated by the MDX bug above.**
`src/lib/content/lessons.ts`'s `getAllLessonsMeta()`/`loadLesson()` had no
memoization at all — every one of ~7 catalog pages, plus the lesson page
itself (called once per lesson, for prev/next nav), re-walked the
filesystem and re-imported every lesson module, an O(N²) import cost that
would compound badly well before reaching a hypothetical 500-lesson
corpus. Fixed with plain module-level memoization (not React's `cache()`,
which is scoped per-request/render-pass and wouldn't survive across the
~155 separate static-generation passes this needs to persist through —
confirmed against Next's own docs before choosing the simpler primitive).
Separately, `loadLesson`'s blanket `catch { return null }` — the exact
mechanism that hid the bb84/superdense bug — now only swallows errors for
slugs *not* in the known-good set from `getAllLessonSlugs()`; since
`dynamicParams = false` gates routing to only that known set anyway, an
error on a known-good slug is always a real bug now and fails the build
loudly instead of silently 404ing. A new integrity test
(`src/lib/content/__tests__/lessons.test.ts`) asserts every lesson in the
corpus loads successfully and that its `course`/`module` fields resolve in
`curriculum.ts` — this is the automated guard against a repeat of exactly
this bug class, and against the unrelated-but-structurally-identical
"lesson frontmatter drifts from curriculum.ts" bug fixed in an earlier
session. (Getting this test runnable under Vitest required a small
`.mdx`-compiling transform plugin in `vitest.config.mts`, since Vite has
no built-in MDX loader the way webpack/Turbopack does via
`@mdx-js/loader`.)

**Deliberately not attempted this session** (documented here rather than
silently dropped): a codegen/auto-discovery replacement for
`src/lib/problems/registry.ts`'s hand-maintained one-import-plus-one-entry
pattern (872 lines today, flagged as a real but lower-urgency scaling risk
at 3x problem count); consolidating all twelve `/simulators` page
components onto the shared `PresetToggle`/`FrameSlider` primitives that
already exist (every one of the twelve currently hand-rolls its own
near-identical radiogroup/slider UI — a real, systemic consistency gap,
just not a functional bug); adding JSON-LD structured data (`Course`,
`BreadcrumbList`) for SEO; authoring practice problems for the three
lessons that currently have written "Practice Questions" prose but no
registered interactive problems (`bb84-quantum-key-distribution.mdx`,
`superdense-coding.mdx`, `simons-algorithm.mdx`); and restructuring the
now-10-item flat navbar (Learn/Lessons/Mechanics/Computing/Hardware/
Software substantially overlap in content, per the homepage review) into
something like a "Tracks" dropdown — a real UX finding, but a bigger
structural navigation change than felt safe to make unreviewed across
every one of the site's 580+ pages in the same pass as everything else
above.

### Session 14 — Visual reinvention: "The Instrument"

A large, mostly-parallel sprint that did what Session 13 flagged as a
bigger-than-safe-for-one-pass change: it replaced the site's visual
language wholesale rather than iterating on the prior one, and finally
carried out the flat-navbar restructure Session 13 explicitly deferred.
This entry documents the architecture that landed and was verified against
the actual code while it was written; it is not a full account of every
lesson/content edit made in the same sprint by other, parallel work.

- **A real design system** now exists —
  [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md), "The Instrument." The
  palette flipped **dark-first**: `:root` in `globals.css` is now the dark
  theme, and light ("laboratory notebook") is the `prefers-color-scheme:
  light` / `[data-theme="light"]` opt-in override — the inverse of the
  palette's previous arrangement. A four-voice typographic system (display/
  body/tech/math), a `--depth-0`…`--depth-3` elevation ladder, and
  instrument surfaces (`.panel`, `.panel-inset`, `.instrument`) replace the
  prior card-only vocabulary. See §7c for the architecture and
  `docs/DESIGN_SYSTEM.md` for the rules.
- **The pillar identity channel** (`src/lib/design/pillars.ts` +
  `globals.css` §2, §7c) gives all six pillars — Mechanics, Computing,
  Hardware, Software, Mastery, and Apex — a derived OKLCH color ramp,
  applied via one `data-pillar` attribute. **Quantum Mastery gained its
  first landing page**, `/mastery` — previously `PILLAR_VISUALS`
  (née `PILLAR_ROUTES`), `src/lib/nav.ts`, `src/lib/structuredData.ts`, and
  `src/lib/search/index.ts` all pointed it at `/learn` for lack of a
  dedicated page. `src/lib/design/__tests__/pillars.test.ts` (new) pins the
  CSS/TypeScript color tables together and checks every pillar route
  against the filesystem and the nav, specifically to prevent a repeat of
  that gap.
- **A persistent, scroll-driven background environment**
  (`src/components/field/` — `QuantumField.tsx`, `regimes.ts`,
  `PillarScope.tsx`, `fieldStore.ts`/`FieldRegimeSetter.tsx`) now sits
  behind the whole site, depicting each pillar's own physics. See §7c for
  why it's a module store rather than context, why `PillarScope` is a
  Server Component, and why the field is fully optional by construction.
  `src/components/field/__tests__/regimes.test.ts` (new) guards every
  regime's canvas output against non-finite coordinates, alpha leaks, and
  the alpha ceiling that keeps it from competing with text.
- **Shared motion infrastructure** (`src/components/motion/`) —
  `Reveal.tsx` (one shared `IntersectionObserver` entrance animation, CSS-
  driven), `useScrollProgress.ts` (one `rAF`-coalesced scroll listener
  site-wide), and `usePrefersReducedMotion.ts` promoted to a canonical,
  non-simulator-specific location (the original
  `simulators/bloch-sphere/usePrefersReducedMotion.ts` now re-exports it,
  so its ~17 prior import sites are untouched).
- **New layout/typography primitives** — `src/components/ui/Section.tsx`
  (`Section`, `FullBleed`, `SplitFigure`, `Marginalia`),
  `Typography.tsx` (`Eyebrow`, `SectionTitle`, `Lede`, `TechLabel`,
  `TechValue`, `Readout`/`Readouts`), and `Panel.tsx` (`Panel`,
  `Instrument`, `FadeRule`) — additive to, not a replacement for, the
  existing `Card`/`Button`/`Container`/`PageHeader` set from §7.
- **The homepage was rebuilt** as a `PillarScope`-wrapped descent through
  all six pillars in curriculum order (`src/app/page.tsx` +
  `src/components/home/*Section.tsx`); the seven prior homepage sections
  were removed in the same change. See §1.
- **Apex gained a bespoke presentation** (`src/components/apex/` —
  `ApexHero`, `ApexCourseIndex`, `ApexOpenProblems`) instead of the shared
  `CourseList`/`CourseTimeline` every other pillar page uses — see §7c for
  why, and how it still shares completion logic with the components it
  replaces visually.
- **New narrative MDX components** (`src/components/narrative/`, ten of
  them, registered in `src/mdx-components.tsx` alongside the six
  pre-existing MDX shortcodes) give lesson authors a hook →
  question → derivation → challenge vocabulary. Author-facing reference:
  [`docs/NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md) (new).
- **Navigation restructured**, finally carrying out what Session 13
  deferred: the six pillar pages moved out of the flat navbar into a
  grouped **Tracks** dropdown (`TRACK_NAV_ITEMS`, `TracksDropdown` in
  `Navbar.tsx`), closing on Escape/outside-click/blur. See §1.
- **New test coverage**: `src/lib/design/__tests__/pillars.test.ts`,
  `src/lib/design/__tests__/contrast.test.ts` (a WCAG AA guard that parses
  the real stylesheet rather than a restated fixture), and
  `src/components/field/__tests__/regimes.test.ts`.
