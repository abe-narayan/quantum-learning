# Deploying QuantumLearn (Vercel build notes)

This site is pure SSG: `next build` prerenders all 821 routes (219 lessons,
547 problems, 32 courses, catalogs) and `next start` serves them. The notes
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
  metrics). Cold compile dropped **3.4min → ~21s** and peak build memory
  **~6.6GB → ~3.1GB total** (single process ~1.9GB), which fits the 8GB
  Standard container with real headroom.
- Guard rails that keep it fixed: `src/lib/mdx/__tests__/rehypeKatexHtml.test.ts`
  (fidelity + the folded-in `.katex-display` keyboard-scroll tab stop),
  the corpus render tests, and the generated metadata registries
  (`lessonMeta.generated.ts` / `problemMeta.generated.ts`) that keep compiled
  MDX out of every non-lesson page (see docs/ARCHITECTURE.md).

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
