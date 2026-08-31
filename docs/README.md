# StudyQuantum documentation

Start here. Every file in this directory is exactly one of two things, and
each one says which it is in its own first paragraph:

- A **guide**: rules that bind now. It contains no findings. Where a rule
  carries the story of the failure that produced it, the story is kept on
  purpose: those explanations are the most load-bearing content here, and
  several of them have prevented a repeat. What a guide must never contain is
  a *resolved* finding, or a sentence describing a state of the code rather
  than instructing the reader.
- A **findings log**: what was found, on what date, against what tree, and
  whether it has since been resolved. Findings in a log are preserved as
  originally written even where the code has moved, because a finding
  rewritten after the fact stops being evidence; resolution is recorded as a
  dated note appended to it. **Nothing in a log is a rule**, and line numbers
  in one should be assumed stale.

If a doc reads as a mixture, that is a defect in the doc. Fix it in the
direction its header claims.

## Guides, to read before writing code

| Doc | What it is |
| --- | --- |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | **"The Instrument"** — the authoritative visual and interaction language. Colour tokens, the six-pillar OKLCH identity channel, the four typographic voices, surfaces, layout primitives, motion, the background field, accessibility and performance rules. Read it before adding any visual code. Its two hardest-won rules are the cascade-layer discipline (§4) and the client-bundle boundary (§10) — both document bugs that shipped silently. |
| [`NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md) | The author-facing reference for the MDX components a lesson is built from — props, when to reach for each, and an example per component. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | The product/engineering blueprint: information architecture, the curriculum's six pillars and their course structure, content pipelines, the problems system (§7b), and the session-by-session changelog. Update it when the architecture changes — it is meant to be the source of truth, not a snapshot. |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | The build's memory profile and the Vercel settings that keep it inside an 8GB container. Read it before changing the build pipeline, the math pipeline, or any "load the whole corpus" convenience. |

## A brief from an earlier sprint

| Doc | What it is |
| --- | --- |
| [`SPRINT_BRIEF.md`](SPRINT_BRIEF.md) | Wave 3's multi-agent brief (beginner experience / accessibility / engagement). **That sprint is finished, and at least one later one has run on top of it**, so its scope lists and its shared-file off-limits list are historical. Its **content rules and MDX authoring hazards are still live**, and are the reason to keep it. |

## Findings logs: records, not rules

Each was produced at a point in time and is dated. Treat every finding as
historical and re-verify against the code before acting on a line reference.
Where a finding has been resolved, a dated note says so; where it has not
been re-checked, the file says that too.

| Doc | What it found | Live threads |
| --- | --- | --- |
| [`UX_REVIEW.md`](UX_REVIEW.md) | First adversarial design review: 3 P0, 13 P1, 12 P2, with a verdict on whether the redesign reached the content or only the chrome. | Read `UX_REVIEW_2.md` first; it re-judges every P0 and P1 here. |
| [`UX_REVIEW_2.md`](UX_REVIEW_2.md) | Second-round review, re-judging the site after the first review's punch list was worked, and re-verifying each earlier finding against the code. | All four of its own new findings are now resolved, each with a dated note. |
| [`A11Y_AUDIT.md`](A11Y_AUDIT.md) | Accessibility audit: keyboard, focus, semantics, contrast and screen-reader findings, page by page. | Top five plus four more resolved. The remaining Serious/Polish items are **not** individually re-verified. |
| [`BEGINNER_REVIEW.md`](BEGINNER_REVIEW.md) | Beginner-usability review from a quantum-naive persona. | Blocker 2 (`<Term>` installed and unused) resolved. Blockers 1, 3, 4 and 5 are content/editorial and still open. |
| [`LOSS_AUDIT.md`](LOSS_AUDIT.md) | What the visual redesign removed or weakened, checked against the pre-redesign tree. Verdict: nothing lost. | Its stated blind spot (a claim reworded subtly weaker while keeping the same symbols) is still uncovered by any test. |
| [`SCIENCE_AUDIT.md`](SCIENCE_AUDIT.md) | Verification that the visual redesign altered no scientific or mathematical content, including a mechanical multiset comparison of every LaTeX span across the whole diff. | Covers one diff only. Its **Method** section is the reusable part. |
| [`CITATION_AUDIT.md`](CITATION_AUDIT.md) | Every research citation and dated historical claim in the corpus, checked against the actual literature. 44 of 45 accurate; one date corrected. | Re-run 2026-08-30 over all 51 `<ResearchConnection>`, 19 `<HistoricalMoment>` and 141 figure credits; 8 corrections made, all logged. Coverage is current. |
| [`PRELAUNCH_AUDIT.md`](PRELAUNCH_AUDIT.md) | The 2026-08-30 pre-launch sprint: recovery from an interrupted session, the defect classes that actually cost something (derived-vs-typed counts, contradictions between surfaces, silently unrendered math, content clipped rather than overflowing), the practice-answer gap closed from 140/218 to 218/218, and the rendered-page audit harnesses in `scripts/audit/`. | Its §6 lists what is still open. The `/about` authorship gap needs the owner, not an agent. |
| [`DISCOVERABILITY_SPRINT.md`](DISCOVERABILITY_SPRINT.md) | The 2026-08-30 orientation sprint: the homepage rebuilt around what a first-time visitor should do next, the six track pages that had zero first-screen actions on a phone, the hero simulation that stopped before anything tunnelled, and both corpora read for filler. Adds `orientation.mjs`. | Its §2 records four more harness bugs of the class this file warns about, including a crashed page measuring as a clean one and prose detection that was wrong three times before it was right. §7 carries the open items. |
| [`PERF_AUDIT.md`](PERF_AUDIT.md) | Measured production-build numbers, the client-boundary findings, and the remaining performance punch list. | Measurement sections are appended to over time. §G carries a dated status per open item. |
| [`LESSON_ENRICHMENT.md`](LESSON_ENRICHMENT.md) | Corpus survey: per-lesson visual and interaction density, and named intervention opportunities. | **Its central premise is overturned.** The narrative components it found unused are now used 691 times across all 219 lessons. The census tables are stale; the method is not. |

## Audits that need a rendered page

Some rules cannot be a vitest assertion, because they are claims about a
**rendered page at a given viewport**: does this overflow at 320px, is that tap
target reachable, did the console throw during hydration, what is the
accessible name of a rendered formula. jsdom does not lay out, and the site
correctly sets `X-Frame-Options: DENY`, which closes the narrow-iframe
shortcut too.

`scripts/audit/` holds a dependency-free Chrome DevTools Protocol client
(`cdp.mjs`) and five harnesses on top of it. No new dependency: Chrome is
already installed and Node 22+ ships a global `WebSocket`.

| Script | What it answers |
| --- | --- |
| `orientation.mjs` | Whether a first-time visitor can tell what to do without scrolling: forward actions in the first screen (breadcrumbs excluded, because a link back the way you came does not orient anyone), where the first substantial prose sits, and page height. Fetches the status code separately and refuses to measure a 5xx, since a crashed page measures beautifully. `--widths`, `--routes`, `--require-forward`. |
| `responsive.mjs` | Horizontal overflow, tap targets under 44px, text under 12px, console errors and uncaught exceptions, and WCAG contrast of every text node against its **actually painted** background. `--widths`, `--routes`. |
| `a11y.mjs` | Semantics and keyboard, from Chrome's computed accessibility tree and **real dispatched key events** rather than a guess at tab order from DOM order. `--theme`, `--checks`. |
| `field.mjs` | How loud the background field actually paints, against the ceiling `regimes.ts` declares. |
| `build-memory.mjs` | A real cold production build and its peak memory, sampled over the build's own process tree. See [`DEPLOYMENT.md`](DEPLOYMENT.md). |

**Read the header of one before extending it.** Four bugs have been found in
these harnesses, and all four were the same mistake: substituting a proxy for
what the browser actually does. An `rgba()` regex silently fails on a design
system authored in oklch. `getImageData` already returns unpremultiplied RGBA,
so dividing by alpha a second time overshoots hugely at low alpha. Measuring an
anchor's own box misses a hit area stretched by `after:absolute after:inset-0`.
Testing `position` on a link misses a lift that comes from an ancestor's
stacking context. Each produced confident, wrong blockers, and **a checker that
cries wolf is worse than none**, because the tempting response is to relax the
threshold that would have caught the real one. Where the browser can be asked
directly (paint the colour, call `elementFromPoint`, press the key), ask it.

The same trap caught `orientation.mjs` repeatedly while it was being written,
and the list below is why this warning is not boilerplate. Counting only `<a>`
and `<button>` reported the glossary, whose primary control is a filter field, as
almost stranded; the selector now includes form controls. Its prose detection
was wrong three separate ways before it was right: `<p>`-only missed a problem
statement rendered through `ScrollableMathText`, any-long-`textContent` matched
a container of thirty short links at y=0, and own-direct-text then matched
clipped screen-reader copy. It needs all three of own text, a real box, and not
hidden.
Worse, a parallel edit put the dev server into a compile error for about a
minute, and `/glossary` and `/about` measured as ordinary pages with two
sensible forward actions above the fold, which were the global error boundary's
buttons. **A crashed page measures beautifully.** That harness now fetches the
status code separately from the navigation and refuses to report a 5xx as a
measurement at all.

`a11y.mjs`'s clip probe carried two of its own, found at the end of the same
sprint. Its TreeWalker could take *root's own next sibling* when skipping a
clipped subtree and walk off into unrelated DOM (a course card was reported as
clipping the site footer), and it resumed with `currentNode = next` followed by
`nextNode()`, which never tests `next` itself. Separately it measured text
inside a legitimately scrollable descendant against the outer element's edge,
inventing a large overflow that then masked the real one beside it. Between
them they misattributed almost all of 32 findings and produced one outright
false positive. Both are fixed; the lesson is that a checker naming the wrong
cause costs nearly as much as one crying wolf.

**Do not run two of these at once on the same port.** `launchChrome` decides
Chrome is ready by polling `/json/version` until it answers, which an *already
running* Chrome does immediately: the second spawn fails to bind, the poll
succeeds against the first browser, and the two audits then drive each other's
tabs and report plausible nonsense. `orientation.mjs` defaults to a random port
for that reason; the other four still default to 9333, so pass distinct ports
when running them in parallel.

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
  rule. It keys its allowlist by normalized **selector text**, not by class
  name, so element, attribute and pseudo-class selectors are in scope; it
  exempts custom-property-only blocks by construction rather than by
  allowlist; and it descends into top-level at-rules, because a rule inside
  an unlayered `@media` is unlayered too. The class-only version it replaced
  let four live bugs through, and could not see the first rule in the file at
  all.
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
- `src/lib/problems/__tests__/crossSurfaceConsistency.test.ts` — the defect
  class no other test can see: **a problem and its own lesson disagreeing**.
  Each is internally correct, each compiles, each renders, and every other test
  passes. The shape both known instances shared was an unqualified absolute on
  the problem side of a claim the lesson side qualifies (a problem asserting
  the 3-qubit bit-flip code is `[[3,1,3]]` while its lesson says distance 1
  under the full Pauli model; a problem saying a vertex stabilizer "always
  touches exactly 4 qubits" after the lesson gained its boundary caveat). Four
  sentence-scoped rules, each carrying the lesson text that is its authority.
  Its own non-vacuity is asserted rather than assumed: one test feeds each rule
  the unqualified sentence it exists to reject, another feeds it the qualified
  form, so a rule cannot be defeated by a rewording. Multiple-choice distractors
  are exempt, because the problems that teach a qualification best are the ones
  that offer the unqualified claim as a wrong answer.
- `src/lib/problems/__tests__/optionLetterReferences.test.ts` — no solution
  or explanation prose names a multiple-choice option by letter. Display
  order is a seeded shuffle, so an authored "Option b" points at a
  different answer for most readers (ARCHITECTURE.md §7b).
- `src/lib/problems/__tests__/metaRegistry.test.ts` — the meta-only and
  full problem registries agree, including the difficulty ordering of a
  lesson's practice list.
- `src/lib/__tests__/problemCount.test.ts` — "how many problems are there"
  has exactly one derivation, and every surface that prints it agrees with a
  fresh count of the content directory on disk. `lib/nav.ts` once carried a
  hand-typed 549 against a corpus of 556, on every route. The
  client-side `problemPillarIndex.ts` table that first fixed it, and its own
  test, are both gone: two derivations of one quantity was the defect, and
  that one cost 7.2KB gzip on every route to state a three-digit number.
- `src/lib/content/__tests__/predictionCount.test.ts` — the homepage's
  "N of the M lessons stop and ask you the same way" is derived, not typed.
  Both figures come from `scripts/generate-lesson-registry.mjs`, and this
  re-scans the corpus from disk independently of the generator's own matcher.
  The pair was hand-kept until 2026-08-30, under a source comment asking the
  next person to re-grep when the corpus moved; the corpus moved and the
  sentence did not, so the page shipped "213 of the 219" against a real 218.
  Same failure as the hand-typed problem total above.
- `src/lib/content/__tests__/readerFacingDashes.test.ts` — **zero em dashes in
  reader-facing prose**, the house rule that until now was enforced by nothing
  but grep, which is how it failed the first time (two rounds and 386
  corrections, because a fork's "none remaining" self-report was wrong for 22
  files). Covers all of `src/content` plus every `.tsx` outside tests with
  comments stripped. En dashes are deliberately left alone: the corpus uses
  about 111 and they are correct typography (Cauchy-Schwarz, 119-130, the x-z
  cross-section).
- `src/lib/content/__tests__/answerReveals.test.ts` — structural integrity of
  every `<details className="answer-reveal">`. Added when the corpus went from
  140 lessons with worked answers to nearly all of them in one sprint. The
  three ways to break one are all silent: a missing `<summary>` renders as a
  widget labelled "Details", under-indentation moves the answer out of its own
  list item and renumbers the questions after it, and a stub body teaches
  readers that opening a reveal is not worth the tap. It also asserts coverage
  in the one form padding cannot satisfy: **a lesson that asks practice
  questions must answer them.** That became assertable on 2026-08-30, when the
  corpus went from 140 of 218 to 218 of 218; the old gap fell at the end of
  five Mechanics courses and across almost all of Mastery and Apex, which is
  exactly where a reader is most alone.
- `src/lib/content/__tests__/lessonOrdering.test.ts` — every `(course, module)`
  pair holds exactly one lesson today, so `LessonMeta.order` never actually
  decides anything and 175 of 219 lessons carry an inherited `order: 1`. This
  does not forbid a module holding two lessons; it requires that when one does,
  the `order` values distinguish them, so the reading sequence cannot silently
  fall back to registry insertion order.
- `src/lib/design/__tests__/routeInventory.test.ts` — every route visited by
  `scripts/audit/responsive.mjs` resolves to a real page. Guards a failure that
  looks like success: a route that 404s makes the audit measure the not-found
  page instead, which has no overflow and no contrast failures at any width and
  reports clean. `/problems/bell-state-measurement-correlations` was in that
  list and had never existed.
- `src/lib/content/__tests__/lessonRender.test.ts` — every lesson actually
  *renders*, not just compiles. Two build-breaking bugs (a dimension mismatch
  inside a visualization, and `e^{iφ}` in bare prose being parsed as a JSX
  expression) were caught only by a full `next build` before this existed.
- `src/lib/design/__tests__/printAndReducedMotionSelectors.test.ts` — every
  selector in the print and reduced-motion blocks still matches real markup,
  so a component rewrite can't silently kill the print stylesheet. Its scan
  covers `src/content` as well as `src/components`, because lessons now
  author structural hooks (`data-mdx`, `data-callout`) directly in MDX, and a
  selector matched only from a lesson file would otherwise read as dead.
- `src/lib/design/__tests__/figureLegibility.test.ts` — hand-rolled SVG type
  stays readable at the narrowest box the layout produces. The arithmetic is
  the point: a figure in a lesson is drawn in a **254px** box at a 320px
  viewport (320, less `Container`'s `px-4`, less one panel inset of 16px
  padding plus a 1px border on each side), so effective type size is
  `fontSize × 254 ÷ viewBox width`. A sprint-wide legibility pass computed
  against 288px instead and wrote that into a dozen files' justifying
  comments, leaving every claimed size 13% optimistic. Text that overflows a
  `viewBox` is silently clipped, not scrolled, so raising a size means
  recomputing label positions too.
- `src/components/visualizations/__tests__/figureDomains.test.ts` — a
  figure's axis comes from its data, never from its annotations.
- `src/components/simulators/__tests__/simulatorClaims.test.ts` — one test per
  simulator, for the single physical claim a reader takes away from driving
  it, checked against closed-form physics (Grover's sin²((2k+1)θ), the Rabi
  ceiling, CHSH's cos(a−b) correlations) rather than against the engine that
  drew the screen. Comparing a simulator against the engine it calls proves
  only that the call happened.
- `src/components/simulators/__tests__/blochAnimation.test.ts` — the Bloch
  animation obeys the same physical invariant the engine does: the vector
  never leaves the ball, and a noise channel never lengthens it.
- `src/lib/problems/__tests__/conceptualCorpus.test.ts`,
  `conceptualAdversarial.test.ts` and `conceptualRegression.test.ts` — the
  keyword grader for conceptual problems, measured against every authored
  conceptual problem rather than a fixture, in both directions: it must not
  be beatable by pasting a problem's own teaching text back into the box,
  and it must not mark a good-faith correct answer wrong. Both defects were
  invisible at fixture scale.
- `src/lib/problems/__tests__/numeric.test.ts` — numeric answer validation,
  absolute and relative tolerance.
- `src/components/problems/__tests__/optionOrder.test.ts` — the seeded
  multiple-choice shuffle. It lives beside the component now, not under
  `src/lib/problems/__tests__/`.
- `src/lib/content/progress/renameMigration.test.ts` — the StudyQuantum
  rename moved every `localStorage` key from a `quantumlearn:` prefix to a
  `studyquantum:` one, and both progress stores copy the old namespace
  forward on first read. There are no accounts here, so the browser is the
  record of what a reader has finished; the migration runs once per returning
  reader, with no way to notice it failed. Any surviving `quantumlearn`
  string in `src/` should be one of these legacy-key fallbacks.
- `src/components/layout/__tests__/themeStore.test.ts` — the theme toggle
  still works when `localStorage.setItem` throws (private browsing, blocked
  site data, a full quota), where it used to be a silently dead control.
- `src/lib/design/__tests__/fieldScope.test.ts` — every route declares a
  background regime, and `journey` stays exclusive to the homepage.
- `src/lib/design/__tests__/pillarContrast.test.ts` — resolves the OKLCH
  pillar ramp to sRGB and computes the real WCAG ratio for all six hues in
  both themes. A lightness value alone doesn't guarantee AA; whether it holds
  depends on the hue.
- `src/lib/design/__tests__/routes.test.ts` — the App Router tree, the nav and
  the sitemap all agree. A page missing from the sitemap is invisible to
  search with no other symptom; `/current-quantum` was, until this existed.
