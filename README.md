# QuantumLearn

QuantumLearn is a from-scratch quantum physics and quantum computing
curriculum: 158 lessons across four pillars (Quantum Mechanics, Quantum
Computing, Quantum Hardware, Quantum Software), 411 practice problems, and a
dozen standalone interactive simulators — Bloch spheres, density matrices,
circuit builders, wavefunction evolution, Grover's algorithm, and more.

The defining constraint of the whole project: every number a visualization
shows is *computed*, not decorative. A Bloch sphere point comes from a real
`StateVector` run through real gate matrices; a Grover's-algorithm bar chart
comes from a real diffusion operator applied the real number of times; a
"probability" label is only ever shown for a value that's actually a
probability. If a lesson's interactive can't honestly compute something, it
doesn't get one.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19 with the React Compiler
  enabled) — pure static site generation. No backend, no database, no auth,
  no API routes, no environment variables.
- **MDX** (`@next/mdx`, `remark-gfm`, `remark-math`, `rehype-katex`) for
  lesson content — prose and interactive components live in the same file.
- **TypeScript**, strict mode, throughout — including the quantum-mechanics
  engine itself (`src/lib/quantum/`), which is plain typed math with no
  external linear-algebra dependency.
- **Tailwind CSS v4**.
- **Vitest** for the test suite (`src/lib/**/__tests__/`, ~590 tests) —
  mostly correctness checks on the quantum engine and content-integrity
  checks (every lesson loads, every problem resolves to a real lesson, no
  duplicate slugs).

## Architecture, briefly

- **`src/lib/quantum/`** — the actual math: state vectors, gates, measurement,
  density matrices, entanglement/entropy, Fourier transforms, time evolution,
  error correction, and more. Every simulator and every in-lesson interactive
  reads from here; nothing is hand-typed or faked.
- **`src/content/lessons/<pillar>/<course>/<lesson>.mdx`** — one file per
  lesson. Discovered by walking the filesystem
  (`src/lib/content/lessons.ts`), not registered by hand. Each file exports a
  `lessonMeta` object (title, course, module, objectives, etc. — no YAML
  frontmatter) followed by markdown prose that can embed real interactive
  components directly.
- **`src/lib/content/curriculum.ts`** — the hand-authored pillar → course →
  module tree that gives lessons their reading order, prerequisites, and
  navigation structure. A lesson's own `course`/`module` fields must agree
  with this file, or it silently falls out of navigation — an automated test
  (`src/lib/content/__tests__/lessons.test.ts`) now checks every lesson
  against it.
- **`src/lib/problems/registry.ts`** — all 411 practice problems, registered
  by hand (one import + one array entry per problem, mirroring
  `src/content/problems/<pillar>/<course>/<problem>.ts`). Most numeric
  problems compute their own correct answer by calling the real quantum
  engine at module-load time rather than a hand-typed decimal.
- **`src/components/simulators/`** — the standalone tools on `/simulators`
  (Bloch sphere, density matrix, two-qubit, circuit builder, Grover,
  wavefunction, Rabi, noise/decoherence, syndrome/error-correction, period
  finding, QAOA, complex-amplitude explorers). Each ships a `Lazy*` wrapper
  (`next/dynamic(..., { ssr: false })`) so the client-only canvas/quantum
  code stays out of pages that don't need it.
- **`src/components/visualizations/`** — shared, reusable primitives
  (`MatrixGrid`, `BarChart`, `VectorDiagram`, `ParametricCurve`,
  `FrameSlider`, `PresetToggle`, …) used across lesson interactives.
- **Progress tracking** (`src/lib/content/progress/`,
  `src/lib/problems/progress/`) is `localStorage`-only, on purpose — there's
  no backend to put it in. It degrades gracefully to "no progress" for a
  first-time or private-browsing visitor.

For a much deeper, chronological account of how this was built — including
design decisions and their reasoning, what was deliberately deferred, and
session-by-session notes — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Dev workflow

```bash
npm run dev         # start the dev server at localhost:3000
npm run build        # production build (also runs typechecking)
npm run start         # serve the production build
npm test               # run the Vitest suite
npm run typecheck       # tsc --noEmit
npm run lint              # eslint
```

Before considering any nontrivial change done, run `build`, `test`,
`typecheck`, and `lint` — a green `next build` alone does not guarantee a
lesson actually renders (see the MDX hazard below, which produced a page
that built successfully and still 404'd).

## Constraints and hazards worth knowing before editing content

- **This is intentionally not a normal Next.js app.** `next.config.ts`
  passes MDX plugins as *strings*, not function references, because
  Turbopack can't serialize the latter — don't "simplify" that.
- **`.mdx` top-level export blocks are acorn-parsed, and stricter than they
  look.** Two hazards, both confirmed by real production bugs:
  1. A top-level arrow function must use implicit return only — never a
     braced block body.
  2. **Never write a `//` JS comment anywhere in an .mdx file's top-level
     export block** (the code before the first `##` heading). Any such
     comment can corrupt the parse so that `export const` statements
     declared after it become unbound, throwing a silent `ReferenceError` at
     render time that `loadLesson()` turns into an ordinary-looking 404 —
     with `next build` still reporting success. If a const needs
     explanation, either use a descriptive name or put the explanation in
     markdown prose below the code block, never in a `//` comment inside it.
- **`dynamicParams = false`** on the lesson and problem routes — only slugs
  returned by `generateStaticParams()` are servable at all; there's no
  on-demand fallback.
- **`curriculum.ts` is effectively append-only in normal use.** Reordering
  existing entries changes lesson numbering and prerequisite chains
  site-wide; add new courses/modules at the end of their array instead.
- **`src/lib/problems/registry.ts` is manually registered, not
  auto-discovered**, unlike lessons. A new problem file needs both an
  import and an array entry, or it silently doesn't exist anywhere on the
  site.
- No backend means no accounts, no server-side progress, no email, no
  payments — anything that needs one is out of scope by design, not an
  oversight.
