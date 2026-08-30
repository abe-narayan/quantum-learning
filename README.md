# StudyQuantum

StudyQuantum is a from-scratch quantum physics and quantum computing
curriculum: 219 lessons across six pillars (Quantum Mechanics, Quantum
Computing, Quantum Hardware, Quantum Software, Quantum Mastery, and Apex)
spanning 32 courses, 556 practice problems, and 14 standalone interactive
simulators — Bloch spheres, density matrices, circuit builders, wavefunction
evolution, Grover's algorithm, and more.

Visually, the site is styled as a research console rather than a document —
a persistent, scroll-driven background environment depicting the physics of
whichever pillar you're in, a pillar-specific color identity, and a small set
of shared layout/typography primitives. See
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) ("The Instrument") before
touching any visual code.

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
- **MDX** (`@next/mdx`, `remark-gfm`, `remark-math`, `rehype-slug`, and this
  repo's own `rehypeKatexHtml.mjs`) for lesson content — prose and
  interactive components live in the same file. `rehype-katex` was replaced
  by `rehypeKatexHtml` for build-memory reasons and demoted to a
  devDependency, where it survives as the parity oracle the replacement's
  test compares against (see `docs/DEPLOYMENT.md`).
- **TypeScript**, strict mode, throughout — including the quantum-mechanics
  engine itself (`src/lib/quantum/`), which is plain typed math with no
  external linear-algebra dependency.
- **Tailwind CSS v4**.
- **Vitest** for the test suite (`src/**/*.test.ts` and `scripts/**/*.test.ts`;
  re-derive the count with `npx vitest run` rather than trusting a number
  here, which has gone stale twice) — mostly
  correctness checks on the quantum engine and content-integrity checks
  (every lesson loads, every problem resolves to a real lesson, no duplicate
  slugs), plus design-system guards: every pillar's color channel agrees
  between `globals.css` and `src/lib/design/pillars.ts`, every pillar route
  has a real page, and the shipped palette clears WCAG AA contrast.

## Architecture, briefly

- **`src/lib/quantum/`** — the actual math: state vectors, gates, measurement,
  density matrices, entanglement/entropy, Fourier transforms, time evolution,
  error correction, and more. Every simulator and every in-lesson interactive
  reads from here; nothing is hand-typed or faked.
- **`src/content/lessons/<pillar>/<course>/<lesson>.mdx`** — one file per
  lesson, never registered by hand. Each file exports a `lessonMeta` object
  (title, course, module, objectives, etc. — no YAML frontmatter) followed by
  markdown prose that can embed real interactive components directly.
  `scripts/generate-lesson-registry.mjs` walks the tree before every
  `dev`/`build`/`test` and *text-extracts* each `lessonMeta` block into
  `src/lib/content/lessonMeta.generated.ts`. It never imports or compiles an
  MDX module. That distinction is the whole point: the registry used to
  dynamic-import all 219 compiled lessons to read their metadata, and because
  the root-layout footer calls it, every static-generation worker then held
  the entire compiled corpus in memory for the whole build. See
  [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
- **`src/lib/content/curriculum.ts`** — the hand-authored pillar → course →
  module tree that gives lessons their reading order, prerequisites, and
  navigation structure. A lesson's own `course`/`module` fields must agree
  with this file, or it silently falls out of navigation — an automated test
  (`src/lib/content/__tests__/lessons.test.ts`) now checks every lesson
  against it.
- **`src/lib/problems/registry.ts`** — all 556 practice problems (256 numeric,
  175 conceptual, 125 multiple-choice). The count is derived once, by
  `PROBLEM_COUNT` in `src/lib/structuredData.ts`, and re-counted from disk by
  `src/lib/__tests__/problemCount.test.ts`, which also pins every surface that
  renders it. Do not hand-type it anywhere else: a hand-typed 549 against a
  corpus of 556 shipped on every route once. A thin
  wrapper re-exporting `PROBLEMS` from the auto-generated
  `src/lib/problems/registry.generated.ts`, which
  `scripts/generate-problem-registry.mjs` produces by walking
  `src/content/problems/<pillar>/<course>/<problem>.ts`, regex-matching
  each file's single top-level `export const <name>: ...`, and failing
  loudly if a file has no such export or two files export the same
  identifier. Wired into the `predev`/`prebuild`/`pretest` npm lifecycle
  hooks, so the registry regenerates automatically before `dev`/`build`/
  `test` — a new problem just needs the file itself, no manual import or
  array entry. Most numeric problems compute their own correct answer by
  calling the real quantum engine at module-load time rather than a
  hand-typed decimal.
- **`src/components/simulators/`** — the standalone tools on `/simulators`
  (Bloch sphere, density matrix, two-qubit, circuit builder, Grover,
  wavefunction, Rabi, noise/decoherence, syndrome/error-correction, period
  finding, QAOA, CHSH Bell test, cross-simulator comparison, and
  complex-amplitude explorers). Each ships a `Lazy*` wrapper
  (`next/dynamic(..., { ssr: false })`) so the client-only canvas/quantum
  code stays out of pages that don't need it.
- **`src/components/visualizations/`** — shared, reusable primitives
  (`MatrixGrid`, `BarChart`, `VectorDiagram`, `ParametricCurve`,
  `FrameSlider`, `PresetToggle`, …) used across lesson interactives.
- **Progress tracking** (`src/lib/content/progress/`,
  `src/lib/problems/progress/`) is `localStorage`-only, on purpose — there's
  no backend to put it in. It degrades gracefully to "no progress" for a
  first-time or private-browsing visitor.
- **`src/lib/design/pillars.ts`** — the single source of truth for each
  pillar's visual identity (an OKLCH hue/chroma pair, a background "regime,"
  a route). Mirrored in `src/app/globals.css` §2 and pinned together by
  `src/lib/design/__tests__/pillars.test.ts`. Setting `data-pillar="…"` on
  any wrapper re-resolves an entire color ramp for that subtree.
- **`src/components/field/`** — the persistent, scroll-driven canvas
  background (`QuantumField.tsx`) that renders each pillar's own physics
  environment (`regimes.ts`), declared per-page by the server component
  `PillarScope.tsx`. Fully optional: disabled under reduced motion and
  data-saver, and every page reads its colors from CSS tokens rather than
  the canvas, so "no field" is a complete, correct render of any page.
- **`src/components/motion/`** and **`src/components/ui/`** — one shared
  scroll-reveal (`Reveal.tsx`), one coalesced scroll listener
  (`useScrollProgress.ts`), and the layout/typography/surface primitives
  (`Section.tsx`, `Typography.tsx`, `Panel.tsx`) the redesign is built from.
- **`src/components/narrative/`** — MDX components for structuring a lesson
  as a hook → question → derivation → challenge narrative rather than plain
  prose; author-facing reference at
  [`docs/NARRATIVE_COMPONENTS.md`](docs/NARRATIVE_COMPONENTS.md).

For a much deeper, chronological account of how this was built — including
design decisions and their reasoning, what was deliberately deferred, and
session-by-session notes — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
For an index of every design standard, audit and the tests that enforce
them, see [`docs/README.md`](docs/README.md).

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
lesson actually renders (see the MDX hazards below, one of which produced a
page that built successfully and still 404'd).

**Never pass `--reporter=basic` to Vitest.** The `basic` reporter was removed
in Vitest 3, so Vitest 4 treats the name as a custom reporter module, fails to
resolve it before any test runs, prints a stack trace, and **still exits 0**.
A run that executed zero tests then reads as a pass. Use the default reporter,
or `--reporter=dot` for the terse output `basic` used to give. When a Vitest
run prints a stack trace, check the reported test count, not just the exit
code.

## Constraints and hazards worth knowing before editing content

- **This is intentionally not a normal Next.js app.** `next.config.ts`
  passes MDX plugins as *strings*, not function references, because
  Turbopack can't serialize the latter — don't "simplify" that.
- **`.mdx` top-level export blocks are acorn-parsed, and stricter than they
  look.** Three hazards, all confirmed by real production bugs:
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
  3. **A JSDoc block comment in the same place fails outright**, with `Could
     not parse expression with acorn`. That is at least loud, unlike the `//`
     form, but both comment styles are banned in an export block. Only the
     `//` form is caught by a test
     (`src/lib/content/__tests__/mdxHazards.test.ts`).
- **Two more MDX failure modes render wrongly instead of failing.** Neither is
  visible to `tsc`, to ESLint, or to a source read:
  1. **`$$` must sit alone on its own line inside a custom JSX component.** A
     `$$` sharing a line with formula content inside `<TheoremBox>`,
     `<Callout>` and friends breaks closing-tag detection, and the component
     swallows the rest of the document. Guarded by `mdxHazards.test.ts`.
  2. **A JSX expression inside inline math is not evaluated.**
     `$\sigma \approx {value.toFixed(2)}$` typesets the literal text
     `{value.toFixed(2)}`, so the reader gets an italic identifier where a
     number should be. Close the math before the expression and reopen after
     it. This one has no test yet; grep a file you edited for `$` followed by
     `{` before calling it done.
- **A `<p className="…">` in MDX whose children start on the next line ends up
  styling an empty element.** MDX wraps those children in a second `<p>`, and
  the browser's HTML parser then closes the outer one at the nested open tag.
  Keep the children on the same line as the tag, or use a `<div>`.
- **Do not edit this corpus through a shell heredoc.** Backslash escapes are
  interpreted on the way in even when the heredoc delimiter is quoted:
  `\alpha` arrives as a BEL byte, `\rangle` as a lone CR, `\to` as a TAB. It
  has corrupted lesson LaTeX repeatedly, and once disabled a `.ts` regex guard
  by turning `\b` into a literal BACKSPACE. Nothing catches it, and the file
  reads back as correct. Use a literal-replacement edit, or write the script
  to a file first.
- **`dynamicParams = false`** on the lesson and problem routes — only slugs
  returned by `generateStaticParams()` are servable at all; there's no
  on-demand fallback.
- **`curriculum.ts` is effectively append-only in normal use.** Reordering
  existing entries changes lesson numbering and prerequisite chains
  site-wide; add new courses/modules at the end of their array instead.
- **Three generated registries, all build-time codegen, none hand-edited.**
  `npm run generate` runs all three before every `dev`/`build`/`test`
  (`predev`/`prebuild`/`pretest`; `pretypecheck` runs the first two):
  `generate-problem-registry.mjs` → `src/lib/problems/registry.generated.ts`,
  `generate-lesson-registry.mjs` → `src/lib/content/lessonMeta.generated.ts`,
  and `generate-search-index.mjs` → `public/search-index.json`. A new problem
  file just needs one top-level `export const <name>: <ProblemVariant> =
  {...}`; a missing export or a duplicate export identifier fails the
  generator loudly instead of silently dropping a problem. **The invariant
  all three share: they read source files as *text* and never import,
  compile, or execute them.** They run under plain Node outside the bundler,
  so they cannot resolve `@/…` aliases anyway, and executing the corpus is
  exactly the thing that used to exhaust the build container. Their shared
  brace-scanner is `scripts/lib/extract.mjs`, covered by
  `scripts/__tests__/extract.test.ts` and `crossGenerator.test.ts`.
- No backend means no accounts, no server-side progress, no email, no
  payments — anything that needs one is out of scope by design, not an
  oversight.
