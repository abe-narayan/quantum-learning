# Deploying StudyQuantum (Vercel build notes)

This site is pure SSG: `next build` prerenders every route — 219 lessons,
556 problems, 32 courses and 15 catalog/landing pages, which is 822
addressable pages and exactly the length `sitemap.ts` emits, plus
`/_not-found` and the metadata routes (favicon, apple-icon, manifest,
opengraph-image, robots, sitemap) — and `next start` serves them. Every one
of those figures is derived, not typed: the page count and the sitemap length
come from the same arrays (`src/lib/design/__tests__/routes.test.ts` fails if
a real page is missing from the sitemap or vice versa), and the problem count
has exactly one derivation, pinned to disk by
`src/lib/__tests__/problemCount.test.ts`. Re-derive rather than copy. The
notes
below exist because the build's memory profile has bitten us on Vercel before
— read them before changing the build pipeline, the math pipeline, or any
"load the whole corpus" convenience.

## The 2026-08 cold-build OOM, and why it can't quietly return

Vercel builds died (SIGKILL / silent stall, then 45-min timeout) during
"Creating an optimized production build". Root cause, established by
controlled measurements (details in the git history and
`src/lib/mdx/rehypeKatexHtml.mjs`'s header):

- **KaTeX-inflated compile graph.** With `rehype-katex`, 3.4MB of MDX source
  compiled to ~82MB of JS (24× average, 61× worst) because every equation
  became hundreds of JSX calls. Turbopack's single build process held that
  whole graph: **~6.3GB peak** on a cold cache. Vercel's Standard build
  machine is a hard-capped 8GB container — the kernel OOM-killer produced
  either the SIGKILL or a "hidden OOM" (child killed, build stalls silently).
- **Vercel builds are effectively ALWAYS cold on the Standard machine.** The
  Standard tier's build-cache cap (1GB as of 2026-01) cannot round-trip
  `node_modules` + `.next/cache/turbopack` for a corpus this size, so the
  warm-build numbers you see locally never happen there.
- Fix: `src/lib/mdx/rehypeKatexHtml.mjs` renders each equation to ONE
  KaTeX-HTML string attribute (`<KatexHtml/>`) instead of an element tree —
  ~50× fewer AST nodes. Fidelity verified equation-count-identical across
  all 219 built pages (not byte-identical: the plugin renders with the root
  `katex` 0.18.4, where `rehype-katex` had silently used its own nested
  katex 0.16.47 — so lesson math markup previously MISMATCHED the 0.18
  stylesheet `globals.css` ships; the new markup aligns with it and with the
  client-side `KatexMath` components, fixing unstyled `.katex-strut`
  metrics). Cold compile dropped **3.4min → ~21s** and peak build memory from
  **~6.6GB** to under half the 8GB Standard container, with real headroom.
  For the peak itself, read the dated runs in `PERF_AUDIT.md` §J.1 and §K.1
  rather than a number here: cold builds measured hours apart on the same
  contended workstation gave 3451 MB, 2875 MB and 2544 MB, so any single
  figure quoted out of its run overstates its own precision. The band, not
  the reading, is the fact.
- Guard rails that keep it fixed, and the invariant each one protects:
  - `src/lib/mdx/__tests__/rehypeKatexHtml.test.ts`: fidelity against
    `rehype-katex` as a parity oracle, plus the folded-in `.katex-display`
    keyboard-scroll tab stop.
  - The corpus render tests: every lesson *renders*, not just compiles.
  - The generated metadata registries (`lessonMeta.generated.ts`,
    `problemMeta.generated.ts`) keep compiled MDX out of every non-lesson
    page. **They are text-extracted, never imported or executed.** The three
    `generate-*.mjs` scripts run under plain Node outside the bundler and
    read source as strings. Anything that reintroduces "just import the
    corpus to read its metadata" reintroduces the OOM.
  - `src/lib/design/__tests__/mdxMapping.test.ts`: the global MDX component
    mapping in `src/mdx-components.tsx` is capped at **30 entries** and
    currently holds 27. Every entry is eagerly imported into all 219 compiled
    lesson graphs, so each one is paid for by every static-generation worker
    and by every lesson page's client bundle. When that assertion fails, move
    the component out and import it in the few lessons that use it; do not
    raise the limit.

  See docs/ARCHITECTURE.md §5 for the fuller account.
- **`rehype-katex` is still in `devDependencies`, and must stay there.** It
  is imported by exactly one file — that fidelity test — which compiles the
  same source through both pipelines and asserts the equation structure
  matches. Removing the package does not shrink the build (it is not in the
  pipeline any more); it deletes the only check that can tell you the
  replacement still renders the same math. An earlier dependency audit
  recommended dropping it as unused. That recommendation was wrong.

## Measuring the peak, rather than trusting the guard rails

Every guard rail above protects the *shape* of the fix: the 30-entry cap on
the MDX component mapping, the generated registries, the client-bundle
ceiling. None of them measures the thing that actually killed the build, which
is peak resident memory, and none of them notices **the corpus simply getting
bigger**.

That gap is not theoretical. On 2026-08-30 a sprint that added worked answers
to practice questions took the lesson corpus from 3.59MB to 5.50MB of MDX
source, a 53% increase in a few hours. MDX source size is the direct input to
the compile graph that caused the original OOM, and not one test in the repo
would have mentioned it.

```
node scripts/audit/build-memory.mjs --cold [--budget-mb 5000]
```

runs a real production build and reports its peak memory, exiting non-zero
over budget. Two things about it are deliberate and worth keeping if you edit
it:

- **`--cold` clears `.next/cache` first.** Vercel's Standard build-cache cap
  cannot round-trip `node_modules` plus the Turbopack cache for a corpus this
  size, so Vercel builds are effectively always cold and the warm number you
  get locally never happens there. Any figure you intend to act on should come
  from a cold run.
- **It samples the build's own process tree, not every `node.exe` on the
  machine.** This repo is developed with several agents running vitest and
  audit scripts at once, each a few hundred MB. A machine-wide sum attributes
  all of them to the build; an early version of this script reported 8412MB
  across 34 processes for a build that was nowhere near that, which is worse
  than no measurement, because relaxing the budget to accommodate it would
  hide a real regression behind a padded threshold.

Treat one run as a smoke alarm, not a benchmark. The three cold runs recorded
above (3451MB, 2875MB, 2544MB) were the same build hours apart on the same
contended workstation. The band is the fact.

**Measured again 2026-08-30, after the corpus grew from 3.59MB to 5.50MB of
MDX: 4546MB and 4408MB on two cold runs.** That is a real move, it tracks the
corpus growth, and the old 2.5-3.5GB band should be considered superseded.
Still inside the 8GB container with about 43% headroom, and inside this
script's 5000MB budget, but the margin is now smaller than the earlier numbers
suggest.

**And a methodological trap in the same measurement.** A third run the same day
reported 3016MB, and it was the *least* trustworthy of the three despite
looking the healthiest: its wall clock was 202.7s against 109-114s for the
other two, because eight other node processes and 28 Chrome processes were
competing for the machine. Contention **lowers** the reported peak, by
serialising work that would otherwise run concurrently across Next's 7 static
generation workers. Vercel's builder is not contended, so **the quiet-machine
number is the one that predicts production**, and a low reading taken on a busy
laptop is the reading to distrust. Check the wall clock before believing a
peak.

## The other place math meets the client boundary: problem pages

Lesson math is rendered at compile time by the plugin above. Problem content
is not MDX at all — it is plain TypeScript data — so it never meets that
plugin, and until 2026-08 it paid the KaTeX runtime in the browser instead:
`ProblemView` was a client component, and `AnswerInput`/`HintPanel`/
`SolutionPanel` reached `katex` through `ScrollableMathText` → `MathText`.
None of those four files declares `"use client"` itself, so nothing about
the source made the boundary visible.

The same trick was applied: `ProblemView` is now a Server Component that
renders the math to KaTeX HTML strings and hands them across, and the client
subtree only injects strings. **The general rule this is the second instance
of: if a string's math is known at build time, render it on the server; ship
markup, never the renderer.** The renderer belongs in the browser only where
the LaTeX itself changes with live state — a simulator's readout — which is
why `KatexMath` still exists. Details in docs/ARCHITECTURE.md §7b; the
boundary is enforced by `src/lib/design/__tests__/clientBoundary.test.ts`.

## Recommended Vercel project settings

- **Environment variable `VERCEL_BUILD_SYSTEM_REPORT=1`** — makes every build
  emit Vercel's memory/disk Build System Report, so a future memory
  regression shows up as a diagnosable OOM record instead of a silent stall.
- Machine type: Standard (8GB/4vCPU) is now sufficient. If the corpus grows
  several-fold, Enhanced (16GB) is the escape hatch — and pairs with the
  larger build-cache cap that lets `.next/cache/turbopack` actually persist.
- `NODE_OPTIONS=--max-old-space-size=…` is NOT a fix for compile-phase
  memory: Turbopack's allocations are native (outside V8), and Next strips
  the flag from static-generation workers anyway.
- Node: `package.json` pins `engines >= 22.18` (the generator scripts need
  `module.registerHooks` + native TS imports); Vercel's default 22.x works.

## Escape hatch

`next build --webpack` still works in Next 16 (deprecated, may go away in
17) and measured **~5.3GB** peak on this corpus (pre-fix) — it was the
community's standard workaround for Turbopack cold-build OOMs. With the
KaTeX fix, Turbopack is both smaller and much faster; only reach for
`--webpack` if a future Turbopack regression appears. Note
`experimental.turbopackRustReactCompiler` / `turbopackFileSystemCacheForBuild`
must be removed from `next.config.ts` for a `--webpack` run — the webpack
path hard-errors on Turbopack-only keys.

## Measuring honestly

Warm builds hide everything (compile is seconds and small). To reproduce the
real Vercel profile: `rm -rf .next` first, then `npm run build`, and sample
`node` process working sets while it runs. The numbers above were collected
that way.
