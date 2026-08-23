# QuantumLearn — Platform Architecture

This document is the product/engineering blueprint for QuantumLearn: a free,
in-depth educational platform covering Quantum Mechanics, Quantum Computing,
Quantum Hardware, and Quantum Software, taking a student from strong
high-school math through advanced undergraduate material.

It exists so that as hundreds of lessons and dozens of simulators get built
over time, they get built *onto* a consistent structure instead of each
being a one-off decision. Update this document when the architecture
changes — it should stay the source of truth, not a snapshot.

---

## 1. Information Architecture

**Top-level navigation:** Home · Learn · Lessons · Simulators · Problems ·
Hardware · Software · About.

These map to two different jobs, which is why both "Learn" and "Lessons"
exist:

- **Learn** (`/learn`) is the *guided* entry point — the four pillars
  (Quantum Mechanics, Quantum Computing, Quantum Hardware, Quantum Software)
  presented with framing, so a new visitor understands the shape of the
  whole curriculum and where to start.
- **Lessons** (`/lessons`) is the *complete catalog* — the same underlying
  course/module data, presented densely for someone who already knows what
  they're looking for.

Both pages currently render from the same `CourseList` component and the
same curriculum registry (`src/lib/content/curriculum.ts`), so they can
never drift out of sync with each other — there is exactly one source of
truth for "what courses exist."

**Hardware** and **Software** are full pillars in the curriculum registry
(on equal footing with Mechanics and Computing), and also get their own
top-level nav entries and routes (`/hardware`, `/software`) for direct
linkability and SEO, since a student searching "how do superconducting
qubits work" shouldn't have to go through `/learn` first.

Individual lessons live at a **flat, catalog-style URL**:
`/lessons/<pillar-slug>/<course-slug>/<lesson-slug>`, e.g.
`/lessons/quantum-computing/qubits-and-quantum-states/what-is-a-qubit`. The
path segments happen to mirror the pillar/course structure (for readability
and to avoid slug collisions across pillars), but the route itself is a
single catch-all (`app/lessons/[...slug]/page.tsx`) — a lesson's URL is
just wherever its `.mdx` file sits in `src/content/lessons/`.

**A known tension, called out on purpose:** eight items is a lot for a flat
navbar. It fits today (the navbar switches to a hamburger menu below the
`lg` breakpoint, and item labels are short), but if the four pillars grow
much further, or the nav needs more than a linear list, group them under a
single "Curriculum" dropdown (Learn / Lessons / Hardware / Software) rather
than keep adding flat items. Not doing that now, per the "keep it simple"
brief — flagging it as the obvious next evolution.

**Homepage** was explicitly kept untouched this round — no changes to
`src/app/page.tsx` or `src/components/home/*`.

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
description) — at ~100 modules across 22 courses, module-level prose would
either be padding or drift out of sync with the actual lesson. Descriptions
live at the course level (22 of them, one sentence each — genuinely useful
copy) and at the lesson level (`LessonMeta.description`, written by whoever
authors that lesson).

**Prerequisites are a graph, not a list position** — `Course.prerequisites`
is an array of course slugs, so a course can require multiple prior courses,
and courses from different pillars can reference each other (as
`quantum-computing/qubits-and-quantum-states` does). This is what will
eventually power "you're missing a prerequisite" warnings without any
rewrite.

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

## 5. Content / Lesson Data Model

**Format decision: MDX**, via `@next/mdx`. Reasoning:

- It's the officially supported Next.js content path, works with Server
  Components and Turbopack out of the box, and needs no external CMS or
  database.
- Lesson prose can embed real interactive components directly
  (`<BlochSpherePreview />` today, `<CircuitBuilder />` etc. later) — this
  is non-negotiable given "interactive experimentation" is a stated core
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

- `getAllLessonSlugs()` — walks `src/content/lessons/` at request/build
  time (`node:fs`) and returns every authored slug. This is what
  `generateStaticParams` uses, so every deploy picks up newly authored
  lessons automatically — no registry to hand-update per lesson.
- `loadLesson(slug)` — a dynamic `import(`@/content/lessons/${slug}.mdx`)`,
  returning `{ default: Component, lessonMeta }`. This is the pattern
  Next's own docs recommend for slug-driven MDX content outside `app/`, and
  it means content isn't bundled into every page's JS — each lesson is its
  own chunk, loaded only when its route is hit.
- `getAllLessonsMeta()` — loads every lesson's metadata plus its slug
  (`LessonMetaWithSlug`), used for catalog pages and for resolving
  prerequisites (next paragraph).

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
| `harmonicOscillator.ts` | `annihilationOperator`, `creationOperator`, `numberOperator`, `harmonicOscillatorEnergyLevels` — the harmonic oscillator's ladder operators as finite, truncated `dimension`×`dimension` matrices on the Fock basis, letting the existing `Matrix` engine represent them exactly like every other operator, with the truncation's one honest approximation (documented in the file and tested directly) confined to the single boundary case where `a†` would need a level past the cutoff |
| `amplitude.ts` | `normalizedTwoLevelAmplitudes`, `interferenceProbability`, `classicalSumProbability` — built for the Complex Amplitude Explorer's two-amplitude interference mode (see §6b); deliberately thin wrappers around `Complex`, not a parallel state-vector abstraction |

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
holds two things deliberately: `BlochSpherePreview` (a static, decorative
SVG used only on the homepage hero — no `lib/quantum/` dependency at all)
and `BlochSphereExplorer` (the real interactive simulator, which reads and
writes `StateVector`s via `lib/quantum/` and renders the corresponding
point on the sphere). Neither the gate math nor the circuit state is ever
mixed into a rendering file. The convention going forward:
`src/components/simulators/<name>/` for rendering,
`src/lib/quantum/` for math, never mixed in one file.

**What's deliberately not built yet:** density matrices, partial trace,
von Neumann entropy, and *general* Hamiltonian time evolution (an
eigendecomposition-based matrix exponential for an arbitrary-dimensional
Hermitian operator). Those are real requirements (a future
multipartite-entanglement course, an error-correction simulator, noise
simulation, and continuous-position wavefunction evolution all need them
eventually) but weren't needed to teach pure-state entanglement,
measurement, no-cloning, teleportation, or (as of the "From Classical to
Quantum" course) two-level time evolution and the harmonic oscillator —
all of which are expressible with pure `StateVector`s, partial
measurement, and (for two-level evolution specifically) the *existing*
`rotationAboutAxis` function, reused rather than duplicated: any traceless
$2\times2$ Hermitian Hamiltonian is $H=\frac{\hbar\omega}{2}(\hat n\cdot
\vec\sigma)$, and $e^{-iHt/\hbar}$ is exactly `rotationAboutAxis(n, ωt)`
— no new matrix-exponential code was needed for the Time Evolution and
the Schrödinger Equation lesson. General-dimension time evolution
(needing a real eigensolver) remains deferred, next likely triggered by
the future Wave Mechanics course or a multipartite-entanglement
simulator.

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

## 9. Implementation Roadmap

**Done:** foundation (data model, MDX pipeline, quantum engine, IA/nav);
the Bloch sphere simulator; Vitest infrastructure; `Qubits & Quantum
States` and `Quantum Gates & Circuits` (Quantum Computing pillar) fully
authored (20 lessons); `Mathematical Foundations for Quantum Mechanics`
and `From Classical to Quantum` (Quantum Mechanics pillar) fully authored
(22 lessons); cross-course prerequisites, exercised across four separate
course boundaries now; the 2-qubit state explorer and the Complex
Amplitude Explorer, both embedded in real lessons; the Problems system
(data model, 3 validator types, `localStorage`-backed progress behind a
swappable interface, catalog + detail UI, topic/difficulty filtering) with
56 problems across both pillars.

**Next — Wave Mechanics, the natural continuation.** `classical-to-quantum`
ends by explicitly previewing continuous position/momentum and deferring
their full development; `wave-mechanics` (already scaffolded in
`curriculum.ts` with 5 placeholder modules, prerequisite already pointing
at `classical-to-quantum`) is the course that redeems that preview —
wavefunctions, the position representation, and the time-dependent/
time-independent Schrödinger equation in the continuous setting. This is
also the first course that will genuinely need engine additions this
platform doesn't have yet (see below).

**Then — the historical/experimental motivation course.** The original
`classical-to-quantum` placeholder titles (blackbody radiation, the
photoelectric effect, wave-particle duality, de Broglie) were real,
valuable content that this session's course redesign deliberately
replaced rather than kept — see the Session 8 changelog entry for the
reasoning. That content doesn't have a home in the curriculum right now;
it's a real gap, not a silently dropped requirement, and the cleanest fix
is likely a new early course in the Quantum Mechanics pillar (before or
alongside `mathematical-foundations`) rather than trying to fold it back
into `classical-to-quantum`.

**Then — expand the math engine for continuous systems.** A real
eigensolver (needed for general, not just 2-level, time evolution), plus
density matrices, partial trace, and von Neumann entropy — needed once
`wave-mechanics` or the renamed `entanglement-and-measurement` course
(multipartite entanglement, mixed states, Bell tests) get written for
real, or once any simulator needs to show a reduced/mixed state. Deferred
again this session for the same reason as before: two-level time evolution
and the harmonic oscillator's spectrum didn't need either one.

**Then — the quiz-taking UI.** The `Quiz` data model and registry lookups
already exist (§7b) with zero authored quizzes; building the actual
navigation/scoring/review UI is real, separate design work best done
against a handful of real quizzes.

**Also pending:** progress & personalization *beyond* single-problem
state (lesson completion, cross-problem streak-free progress summaries —
still no auth/database, same `ProgressStore`-interface discipline
`lib/problems/progress` already established); revisiting the 8-item flat
navbar if it grows further; Hardware & Software pillar content
(architecture-complete, purely a writing task); the still-unbuilt
`/simulators` entries (circuit builder, entanglement visualizer,
interference playground), each a genuine separate project rather than a
quick follow-on to the Complex Amplitude Explorer.
