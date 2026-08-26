# QuantumLearn documentation

Start here. Two of these are **standards you must follow**; the rest are
records of what was checked and what was found.

## Standards — read before writing code

| Doc | What it is |
| --- | --- |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | **"The Instrument"** — the authoritative visual and interaction language. Colour tokens, the six-pillar OKLCH identity channel, the four typographic voices, surfaces, layout primitives, motion, the background field, accessibility and performance rules. Read it before adding any visual code. Its two hardest-won rules are the cascade-layer discipline (§4) and the client-bundle boundary (§10) — both document bugs that shipped silently. |
| [`NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md) | The author-facing reference for the MDX components a lesson is built from — props, when to reach for each, and an example per component. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | The product/engineering blueprint: information architecture, the curriculum's six pillars and their course structure, content pipelines, and the session-by-session changelog. Update it when the architecture changes — it is meant to be the source of truth, not a snapshot. |

## Audits and reviews — records, not standards

These were produced at a point in time. Treat their *findings* as historical
and re-verify against the code before acting on any specific line reference.

| Doc | What it found |
| --- | --- |
| [`UX_REVIEW.md`](UX_REVIEW.md) | First adversarial design review: 3 P0, 13 P1, 12 P2, with a verdict on whether the redesign reached the content or only the chrome. |
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
  text-bearing token, in both themes, parsed from the real stylesheet.
- `src/lib/design/__tests__/cascadeLayers.test.ts` — no unreviewed unlayered
  class rule.
- `src/lib/design/__tests__/clientBoundary.test.ts` — no `"use client"`
  component may reach a content registry; client-importable data modules
  carry a gzipped size budget.
- `src/components/field/__tests__/regimes.test.ts` — every background regime
  draws something, stays under its alpha ceiling, restores canvas state, and
  emits only finite coordinates at every viewport and scroll extreme.
- `src/lib/content/__tests__/mdxHazards.test.ts` — the MDX authoring hazards
  that produce a silently broken lesson rather than a build error.
- `src/lib/content/__tests__/lessonImages.test.ts` — every external image
  host is allow-listed in the CSP.
- `src/lib/content/__tests__/lessons.test.ts` — the whole corpus compiles,
  and its course/module/prerequisite references all resolve.
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
