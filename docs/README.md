# QuantumLearn documentation

Start here. Two of these are **standards you must follow**; the rest are
records of what was checked and what was found.

## Standards — read before writing code

| Doc | What it is |
| --- | --- |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | **"The Instrument"** — the authoritative visual and interaction language. Colour tokens, the six-pillar OKLCH identity channel, the four typographic voices, surfaces, layout primitives, motion, the background field, accessibility and performance rules. Read it before adding any visual code. Its two hardest-won rules are the cascade-layer discipline (§4) and the client-bundle boundary (§10) — both document bugs that shipped silently. |
| [`NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md) | The author-facing reference for the MDX components a lesson is built from — props, when to reach for each, and an example per component. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | The product/engineering blueprint: information architecture, the curriculum's six pillars and their course structure, content pipelines, the problems system (§7b), and the session-by-session changelog. Update it when the architecture changes — it is meant to be the source of truth, not a snapshot. |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | The build's memory profile and the Vercel settings that keep it inside an 8GB container. Read it before changing the build pipeline, the math pipeline, or any "load the whole corpus" convenience. |

## Working documents

| Doc | What it is |
| --- | --- |
| [`SPRINT_BRIEF.md`](SPRINT_BRIEF.md) | The multi-agent sprint brief: scope discipline, the shared-file off-limits list, and the MDX authoring hazards that have bitten this repo. Point-in-time, but its content rules and hazard list are still current. |

## Audits and reviews — records, not standards

These were produced at a point in time. Treat their *findings* as historical
and re-verify against the code before acting on any specific line reference.

| Doc | What it found |
| --- | --- |
| [`UX_REVIEW.md`](UX_REVIEW.md) | First adversarial design review: 3 P0, 13 P1, 12 P2, with a verdict on whether the redesign reached the content or only the chrome. |
| [`A11Y_AUDIT.md`](A11Y_AUDIT.md) | Accessibility audit — keyboard, focus, semantics, contrast and screen-reader findings, page by page. |
| [`BEGINNER_REVIEW.md`](BEGINNER_REVIEW.md) | Beginner-usability review from a quantum-naive persona. Its Blocker 2 (`<Term>` installed and unused) has since been fixed; the note in place records that. |
| [`LOSS_AUDIT.md`](LOSS_AUDIT.md) | What the visual redesign removed or weakened, checked against the pre-redesign tree. |
| [`UX_REVIEW_2.md`](UX_REVIEW_2.md) | Second-round review, re-judging the site after the first review's punch list was worked, and re-verifying each earlier finding against the code. |
| [`SCIENCE_AUDIT.md`](SCIENCE_AUDIT.md) | Verification that the visual redesign altered no scientific or mathematical content — including a mechanical multiset comparison of every LaTeX span across the whole diff. |
| [`CITATION_AUDIT.md`](CITATION_AUDIT.md) | Every research citation and dated historical claim in the corpus, checked against the actual literature. |
| [`PERF_AUDIT.md`](PERF_AUDIT.md) | Measured production-build numbers, the client-boundary findings, and the remaining performance punch list. |
| [`LESSON_ENRICHMENT.md`](LESSON_ENRICHMENT.md) | Corpus survey: per-lesson visual and interaction density, and named intervention opportunities. |

## The checks that enforce all of this

Several of the rules above are not left to review — they are tests, and they
fail loudly:

- `src/lib/design/__tests__/pillars.test.ts` — the pillar identity table in
  TypeScript and the one in `globals.css` must agree, and every pillar route
  must be backed by a real page and appear in the nav in curriculum order.
- `src/lib/design/__tests__/contrast.test.ts` — WCAG contrast for every
  text-bearing token, in both themes, parsed from the real stylesheet, plus
  the figure axis channel: `--axis` above the non-text floor on all three
  panel depths and `--axis-grid` strictly quieter than it, so nobody can
  swap the two and leave both individually passing.
- `src/lib/design/__tests__/compositedContrast.test.ts` — the case a flat
  token check cannot see: text over the pillar wash *and* the atmosphere
  layer at once, sampled across a grid of viewports and scroll positions.
  A token that clears 4.5:1 on the bare page colour can fall to 4.13:1
  where the glow pool is densest, which is exactly where a hero's readouts
  sit.
- `src/lib/design/__tests__/cascadeLayers.test.ts` — no unreviewed unlayered
  class rule.
- `src/lib/design/__tests__/utilitySyntax.test.ts` — no utility class that
  compiles to nothing: Tailwind v3's `rounded-[--var]` (v4 wants
  `rounded-(--var)`) and `*-pillar-accent` (the registered color is
  `pillar`). 85 dead classes across 37 files, plus ten dead
  `pillar-accent` call sites, shipped invisibly before this existed.
- `src/components/ui/__tests__/ownedNoHardcodedColors.test.ts` and
  `auditedNoHardcodedColors.test.ts` — every color flows through a design
  token, so both themes resolve. No literal hex/rgb, no raw Tailwind
  palette class.
- `src/lib/design/__tests__/clientBoundary.test.ts` — no `"use client"`
  component may reach a content registry; client-importable data modules
  carry a gzipped **payload** budget (comments stripped first — they ship
  nowhere, and budgeting them taxed the documentation this repo runs on),
  plus a ceiling on the *sum* of all of them, and a `katex`-in-the-eager-
  graph map that is empty and meant to stay that way.
- `src/lib/design/__tests__/mdxMapping.test.ts` — the global MDX component
  mapping stays small. Everything in `src/mdx-components.tsx` is eagerly
  imported into all 219 lesson graphs, so a narrowly-used component mapped
  there is paid for by every lesson page.
- `src/lib/design/__tests__/scrollRegions.test.ts` — every horizontally
  scrollable container is reachable by keyboard. `overflow-x: auto` is
  focusable by default only in Firefox, so a wide table or matrix is
  otherwise a silent WCAG 2.1.1 failure; the scan is over-inclusive on
  purpose and the judgement lives in two dated, ratcheted lists (audited-
  and-cannot-overflow, versus untriaged backlog) rather than in the scan.
- `src/lib/content/__tests__/linkIntegrity.test.ts` — 33 assertions over
  eleven families of cross-reference: every `/lessons/…` link and `#anchor` in
  the MDX corpus, every hand-written literal path in TS/TSX, every
  `simulatorId`, every `lessonSlugs` entry in the glossary and concept map,
  every `lessonMeta.related` slug, the concept graph's own edges (including
  a cycle check), every lesson a problem points at, the hand-kept
  course/module tables in the chrome, every Current Quantum entry, every
  ordinal "the Nth lesson of this course" reference in prose, prose that
  promises a photograph, and the committed `public/search-index.json`.
  Several of its `it` blocks exist only to *guard the guard* — asserting the
  scan found something to check, so a regex that stops matching fails
  instead of passing vacuously.
- `scripts/__tests__/extract.test.ts` and `crossGenerator.test.ts` —
  `vitest.config.mts` includes `scripts/**/*.test.ts` as well as `src/`,
  because the three `generate-*.mjs` scripts and their shared brace-scanner
  (`scripts/lib/extract.mjs`) are the only thing between a malformed meta
  block and a silently truncated registry. `extract.test.ts` covers the
  scanner against the hazards the corpus can plausibly grow (LaTeX
  backslashes, braces in prose, template literals, apostrophes in
  comments); `crossGenerator.test.ts` checks the invariants that span two
  generators — the problem registry and the search index extract the same
  `meta: {…}` block, and used to hold separate copies of the pattern with a
  comment saying they must stay identical.
- `src/components/problems/__tests__/renderedMath.test.ts` — the
  server-rendered problem math is markup-identical to what `MathText`
  produced in the browser, across the whole problem corpus. This is what
  makes "not one rendered pixel moves" checkable rather than asserted.
- `src/components/field/__tests__/regimes.test.ts` — every background regime
  draws something, stays under its alpha ceiling, restores canvas state, and
  emits only finite coordinates at every viewport and scroll extreme.
- `src/lib/content/__tests__/mdxHazards.test.ts` — the MDX authoring hazards
  that produce a silently broken lesson rather than a build error.
- `src/lib/content/__tests__/lessonImages.test.ts` — every external image
  host is allow-listed in the CSP.
- `src/lib/content/__tests__/lessons.test.ts` — the whole corpus compiles,
  and its course/module/prerequisite references all resolve.
- `src/lib/content/__tests__/curriculumCoverage.test.ts` — the reverse
  direction: every curriculum module actually contains a lesson, so an
  empty module can't ship silently.
- `src/lib/content/__tests__/glossary.test.ts` and
  `src/lib/mdx/__tests__/termIds.test.ts` — every glossary id is unique and
  kebab-case, every cross-reference resolves *and is mutual*, every entry
  carries a level and a real lesson slug, the foundational tier stays
  populated, and every `<Term id>` in the corpus resolves. `Term` throws at
  render on an unknown id, so one typo otherwise breaks `next build` for
  the whole site.
- `src/lib/problems/__tests__/optionLetterReferences.test.ts` — no solution
  or explanation prose names a multiple-choice option by letter. Display
  order is a seeded shuffle, so an authored "Option b" points at a
  different answer for most readers (ARCHITECTURE.md §7b).
- `src/lib/problems/__tests__/metaRegistry.test.ts` — the meta-only and
  full problem registries agree, including the difficulty ordering of a
  lesson's practice list.
- `src/components/layout/__tests__/problemPillarIndex.test.ts` — the
  hand-regenerated problem→pillar table still matches the real problem
  tree, so the navbar can't quietly lose a pillar badge.
- `src/lib/content/__tests__/lessonRender.test.ts` — every lesson actually
  *renders*, not just compiles. Two build-breaking bugs (a dimension mismatch
  inside a visualization, and `e^{iφ}` in bare prose being parsed as a JSX
  expression) were caught only by a full `next build` before this existed.
- `src/lib/design/__tests__/printAndReducedMotionSelectors.test.ts` — every
  selector in the print and reduced-motion blocks still matches real markup,
  so a component rewrite can't silently kill the print stylesheet.
- `src/lib/design/__tests__/fieldScope.test.ts` — every route declares a
  background regime, and `journey` stays exclusive to the homepage.
- `src/lib/design/__tests__/pillarContrast.test.ts` — resolves the OKLCH
  pillar ramp to sRGB and computes the real WCAG ratio for all six hues in
  both themes. A lightness value alone doesn't guarantee AA; whether it holds
  depends on the hue.
- `src/lib/design/__tests__/routes.test.ts` — the App Router tree, the nav and
  the sitemap all agree. A page missing from the sitemap is invisible to
  search with no other symptom; `/current-quantum` was, until this existed.
