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

`Qubits & Quantum States → Quantum Gates & Circuits → Measurement,
Superposition & Entanglement → Quantum Algorithms I: Foundations → Quantum
Algorithms II: Advanced → Quantum Error Correction & Fault Tolerance`

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

**Loading (`src/lib/content/lessons.ts`)** — two functions, both
server-only:

- `getAllLessonSlugs()` — walks `src/content/lessons/` at request/build
  time (`node:fs`) and returns every authored slug. This is what
  `generateStaticParams` uses, so every deploy picks up newly authored
  lessons automatically — no registry to hand-update per lesson.
- `loadLesson(slug)` — a dynamic `import(`@/content/lessons/${slug}.mdx`)`,
  returning `{ default: Component, lessonMeta }`. This is the pattern
  Next's own docs recommend for slug-driven MDX content outside `app/`, and
  it means content isn't bundled into every page's JS — each lesson is its
  own chunk, loaded only when its route is hit.

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
| `state.ts` | `StateVector` — an n-qubit pure state, normalization, measurement probabilities, inner product, tensor composition |
| `gates.ts` | Standard gate matrices (`I, X, Y, Z, H, S, T`, parametrized `Rx/Ry/Rz`, `phase(θ)`) plus `applySingleQubitGate` / `applyControlledGate` / `applyCNOT` / `applyCZ` / `applySwap`, which apply a gate to specific qubit(s) within a larger register |
| `measurement.ts` | `measurementDistribution` (Born-rule probabilities) and `measure` (samples an outcome and returns the collapsed state) |

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

**Rendering stays fully separate.** `BlochSpherePreview` (today, a static
SVG under `src/components/simulators/bloch-sphere/`) has zero dependency on
`lib/quantum/` — it's decorative. When it becomes real, it will read a
`StateVector` and render the corresponding point on the sphere; the gate
math, circuit state, and UI will not be entangled with each other. The
convention going forward: `src/components/simulators/<name>/` for
rendering, `src/lib/quantum/` for math, never mixed in one file.

**What's deliberately not built yet:** density matrices, partial trace,
von Neumann entropy, and Hamiltonian time evolution. Those are real
requirements (entanglement visualizer, error-correction simulator, noise
simulation, wavefunction time evolution all need them eventually) but
aren't needed for the first simulators (Bloch sphere, circuit builder,
measurement) and would have roughly doubled the size of this pass. Next
addition to this library, when a simulator needs it.

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
  breadcrumb (`Learn / <Pillar> / <Course>`), difficulty + time badges, the
  "by the end of this lesson" objectives box, then the MDX body inside a
  `prose` wrapper. Every future lesson gets this for free just by having
  correct `lessonMeta`.
- **`components/mdx/Callout`** — the one content-authoring primitive
  content needs today (see §5).

This is intentionally minimal. A "Problems/Quiz" UI system (question types,
scoring, review state) and a "Simulator chrome" system (controls, playback,
reset) are real, separate design problems — building them now, with zero
real quizzes or simulators to design against, would mean guessing. They're
first in the roadmap below.

---

## 8. Changes Made to the Existing Architecture

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
- **Nothing was removed or restructured** — `/simulators`, `/problems`,
  `/about`, and the entire homepage are untouched.

---

## 9. Implementation Roadmap

**Stage 0 — Foundation (this pass).** Curriculum data model, MDX content
pipeline, quantum math engine, IA/nav update, one real reference lesson.

**Stage 1 — Prove the simulator pattern.** Build one real, interactive
simulator end to end — the Bloch sphere is the natural first choice, since
its static preview and the exact lesson that should embed it already exist.
This is the first simulator built on `lib/quantum/`, and it'll surface
whatever the `StateVector` → rendering interface actually needs to look
like before more simulators copy the pattern.

**Stage 2 — Write real lesson content.** With the pipeline proven by one
lesson, author the rest of `Qubits & Quantum States` (the first course) for
real, at full depth (all 10 sections, no shortening). Doing one full course
before moving on tests whether the data model and `LessonLayout` hold up
across lessons with real variety (worked examples, multiple callouts,
multiple visualizations), not just one example.

**Stage 3 — Problems/Quiz system design.** A real content and UI model for
practice questions and quizzes — question types, an answer/grading
representation, and how a lesson's "Practice Questions" section relates to
the standalone `/problems` catalog. Needs its own design pass; not
speculatively built now.

**Stage 4 — Progress & personalization groundwork.** Still no auth/database
per the brief, but the *shape* of progress data (completed lessons,
bookmarks, recently viewed) should be designed as a typed interface now,
backed by `localStorage` initially, so swapping in real accounts later is a
storage-layer change, not a rewrite. Also the point to revisit the
"IA tension" flagged in §1 if the nav has grown further by then.

**Stage 5 — Testing infrastructure.** Add Vitest (small, fast, zero-config
with TS) specifically for `lib/quantum/` — the seven checks run manually
this pass should become permanent, committed tests, and grow alongside the
math engine (density matrices, partial trace, etc. in Stage 6 should ship
with tests, not after).

**Stage 6 — Expand the math engine.** Density matrices, partial trace, von
Neumann entropy, basic Hamiltonian time evolution — driven by whichever
simulator needs them first (entanglement visualizer is the likely trigger).

**Stage 7 — Hardware & Software content.** Lowest priority pillars content-
wise; their architecture is already identical to Mechanics/Computing, so
this is purely a content-writing stage, not an engineering one.

Recommended immediate next step: **Stage 1**, the real Bloch sphere
simulator — it's small, it's already anchored to real content, and
building it now (rather than writing more lessons first) will validate or
correct the `lib/quantum/` API before a dozen lessons come to depend on it.
