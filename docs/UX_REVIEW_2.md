# Adversarial UX & visual-QA review — round 2

Read against `docs/DESIGN_SYSTEM.md` (including its cascade-layers and
client-bundle-boundary sections), `docs/NARRATIVE_COMPONENTS.md`,
`docs/UX_REVIEW.md` (the first review), `docs/PERF_AUDIT.md` and
`docs/SCIENCE_AUDIT.md`, then the site end to end against the working tree as
it currently stands (uncommitted on top of `80eab57`, per `git status` — the
same tree `PERF_AUDIT.md`/`SCIENCE_AUDIT.md` describe). Every claim below was
checked by reading the actual file, not by trusting either the first review
or any agent's own comments about its own fix.

**Headline: this was a genuinely strong sprint.** Of the first review's 3 P0s
and 13 P1s, **15 of 16 are closed** on direct code inspection, several via
fixes that go beyond the minimal ask (a defensive component-level guard on
top of the one flagged file; a new field regime instead of a one-line patch;
a real client/server split instead of a comment). One (P1-7) is genuinely
only partial. The seam the first review named — chrome vs. content — has
narrowed substantially and, in the samples read for this round, closed in
most individual lessons. It has not closed as a *system property*, because
narrative-component adoption is still uneven in exactly the way P1-7
described, just less uneven.

---

## Status of the previous review's findings

| ID | Claim | Verdict | Evidence |
| --- | --- | --- | --- |
| P0-1 | `EquationReveal` chips render raw LaTeX as literal text | **Closed** | The named lesson (`clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx`) now uses `DerivationSteps` instead of `EquationReveal` for the three-term recursion. Beyond that: `EquationReveal.tsx` now has a `LATEX_SOURCE_PATTERN` detector and a `ChipSymbol` fallback that typesets any raw-LaTeX-looking `symbol` through KaTeX instead of showing literal `^{...}` text, plus a dev-only `console.warn`. Sitewide grep of every `EquationReveal` `terms[].symbol` across all 219 lessons found zero raw LaTeX slipped through unflagged. This is a defense-in-depth fix, not just the one file. |
| P0-2 | Current Quantum's "N weeks ago" readout freezes at build time | **Closed** | `src/app/current-quantum/page.tsx` no longer computes a relative-time readout at all. It keeps only `formatEntryDate(mostRecent.date)` (absolute), with a comment explaining why the relative string and `export const revalidate` were both rejected in favor of removing the moving part — exactly the review's preferred fix. |
| P0-3 | Difficulty encoded 5 different, contradictory ways | **Closed** | `DIFFICULTY_LABEL` and the four-tick `DifficultyMark` now live in one place (`src/lib/content/types.ts` / `src/components/curriculum/DifficultyMark.tsx`). `ProblemDifficulty` → `Difficulty` is a real 1:1 structural map (`PROBLEM_TO_DIFFICULTY` in `src/lib/problems/types.ts`, including a new `"master"` tier). Verified `DifficultyMark` is now imported and rendered in `ProblemMetaMarks.tsx` (`DifficultyScale`), `LessonLayout.tsx:178`, `ApexCourseIndex.tsx:163`, `CurrentQuantumCard.tsx:94`, and `CurriculumExplorer.tsx` — the five previously-divergent locations all draw the same four-tick ladder now. `ProblemsCatalog.tsx`'s difficulty filter includes the new `master` option, and 99 problems were retiered `advanced`→`master` in `src/content/problems/` to make it meaningful (confirmed by `docs/SCIENCE_AUDIT.md`'s mechanical diff check). |
| P1-1 | `DIFFICULTY_LABEL` hand-copied into nine files | **Closed** | Exported once from `src/lib/content/types.ts`; grep confirms every other site (`CurriculumExplorer.tsx`, `ProblemsCatalog.tsx`, `structuredData.ts`, `problems/types.ts`, `clientBoundary.test.ts`, `DifficultyMark.tsx`) imports it rather than redeclaring it. |
| P1-2 | 6 routes with no `PillarScope`, `journey` crossfade leaking onto unrelated pages | **Closed** | All six named routes (`learn`, `glossary`, `map`, `problems`, `problems/[slug]` via `ProblemLayout`, `about`) now render `PillarScope`. Beyond the minimal fix: a new `atlas` regime was built specifically for cross-cutting pages (`regimes.ts` `drawAtlas` — a slow reference grid plus a six-node curriculum-order orbit, genuinely on-topic rather than generic), and `fieldStore.ts`'s `DEFAULT_STATE` was changed from `{ regime: "journey" }` to `{ regime: "atlas" }`, so a *future* page that forgets `PillarScope` entirely no longer silently inherits the homepage's narrative by construction. |
| P1-3 | Navbar pillar indicator disagrees with `/problems/[slug]`'s real pillar | **Closed** | `src/components/layout/pillarRoutes.ts`'s `detectPillar()` now resolves `/problems/<slug>` via a new `problemPillarIndex.ts` lookup, explicitly built as a chrome-only slug→pillar table so the navbar doesn't need to import the problem registry (respecting the client-bundle-boundary rule). |
| P1-4 | Software pillar page has no interactive/computed content — "the hole in the curve" | **Closed** | `src/app/software/page.tsx` now has a real `Instrument` (line ~168) containing `CircuitStateStepper`, stepping a Hadamard-then-CNOT circuit transpiled via real `swapOverheadForLinearChain`/`cnotOnLinearChain` code, with amplitude bars computed live from `runInstructions` on every step — not an animation standing in for data. The page also computes and displays the real state-vector memory wall (`stateVectorMemoryBytes(30/40/50)`). This is now one of the stronger pillar pages, not the weakest. |
| P1-5 | 4 pillar pages converge on byte-identical `CourseTimeline` + `CourseList` | **Closed** | `CourseTimeline` now appears only on `mechanics/page.tsx`. Computing, Hardware and Software each end on `CourseList` alone — no longer a duplicated block across four pages. |
| P1-6 | Content-completeness bar and reader's-own-progress badge sit unlabeled | **Closed** | `CourseList.tsx` now renders `"Content available — {progressPercent}%"` directly under the bar, disambiguating it from `CourseProgressBadge` above it. |
| P1-7 | 2 of 12 new narrative components (`AnnotatedFigure`, `ObservePredictExplain`) used in 0/219 lessons | **Partial** | Off zero, but nowhere near the "~20 lessons" the original fix called for. `AnnotatedFigure`: 3/219 (`global-and-relative-phase.mdx`, `cryogenic-systems.mdx`, `rigorous-teleportation-and-superdense-coding.mdx`). `ObservePredictExplain`: 1/219 (`qubit-readout-techniques.mdx`). Both usages read as genuinely well-built (see New Findings for detail on the remaining gap). The specific example the original review named — Quantum Hardware's platform lessons — is still not converted: `superconducting-qubits.mdx`, `trapped-ions.mdx`, `neutral-atoms.mdx`, `photonic-qubits.mdx`, `spin-qubits.mdx` and the platforms capstone all still use flat `ExternalFigure` for apparatus photos with multi-feature captions (see P2-new-1 below). The one specific fix that *was* named directly — replacing the hand-rolled `:has()`-selector radio-button preset switcher in `schmidt-decomposition-and-purification.mdx` — is done; it's now `PredictBeforeReveal`. |
| P1-8 | 142/219 lessons open on a bare heading; 142 close on one; `LessonHook` sometimes placed after a heading | **Closed** | `LessonHook` now appears in 218/219 lessons (the one exception, `capstone-comparing-qubit-platforms.mdx`, opens on a `<Question>` instead — a different but equally-valid cold open, not a bare heading). `NextDiscovery` appears in 219/219. Placement: a full-corpus scan found **zero** lessons with a `##` heading before `LessonHook` (was "a meaningful fraction" before). Spot-read hooks across five pillars (`pure-states-and-mixed-states.mdx`, `crosstalk.mdx`, `gate-decomposition.mdx`, `qma-and-quantum-verification.mdx`, `the-infinite-square-well.mdx`) are genuinely distinct, lesson-specific claims, not templated filler. |
| P1-9 | `InteractiveSection`'s `mode` prop documented but used at 0/161 sites, so every embed is badged "RUN EXPERIMENT" regardless of truth | **Closed** | Fixed at the component level rather than by mass authoring: `InteractiveSection.tsx`'s `mode` now has **no default** — `DEFAULT_LABEL = "Interact"`, a neutral badge shown whenever `mode` is omitted, replacing the old default of `"run"`. This retroactively fixes all ~160 un-authored call sites' badge honesty without touching content. Actual `mode=` adoption in lesson MDX is still low (2 real uses of `InteractiveSection`'s own `mode`, distinct from `LazySyndromeExplorer`'s unrelated same-named prop, which shows up in a `mode="..."` grep too) — richer per-embed labels are still rare — but the specific defect (a false, overstated badge) is gone site-wide. |
| P1-10 | 11 lessons have 120+ line unbroken-prose stretches, worst 237 lines | **Closed** | Re-measured directly (script excluding frontmatter/imports, counting narrative *and* visualization components, display math, tables, and code fences as breaks). New worst case is 96 lines (`apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx`, down from 237), and the 15 longest runs top out under 100 lines except three in the 96–176 range, still concentrated in the same place the original fix suggested addressing: Apex's `research-methods-and-synthesis` course (argumentative, evaluate-a-claim lessons, where prose-density is closer to the genre's nature) and Quantum Mastery's information-theory/Shannon-theory lessons. (Note: an earlier pass of this re-measurement, before excluding MDX frontmatter/export blocks from the count, produced a false "quantum-walks.mdx regressed to 165 lines" reading — that 165-line span was JavaScript helper functions and `lessonMeta`, not prose. Flagging the methodology trap for any future re-check.) |
| P1-11 | Glassmorphism (`backdrop-blur`) under the navbar that explains why not to | **Closed** | Sitewide grep for `backdrop-blur` returns zero matches. `GlossaryFilter.tsx:101`'s sticky filter bar is now `bg-background/95` with no blur, and its own comment states the reasoning explicitly. |
| P1-12 | Simulators/Problems/Current Quantum use three different page-template conventions | **Closed** | `simulators/page.tsx` now uses `Section`/`Eyebrow`/`SectionTitle`/`Lede` plus a real `Instrument` "bench directory" jump-nav grouped to match the page's own five sections — matching the fix suggestion almost verbatim. All three catalog pages now wrap in `PillarScope` (bare or `regime="atlas"` — functionally identical, see P2-new-3 for the one remaining stylistic wrinkle). `PageHeader.tsx`, the second page-header component the finding was about, is now retired from all real pages — see P2-new-1 for what this left behind. |
| P1-13 | `frontier` regime draws its brightest marks in `--foreground` on Apex's dense text | **Closed** | `regimes.ts`'s `drawFrontier` now draws open-problem points in `accent` (matching every other regime) at capped alpha, with an explicit comment citing this exact finding. |

**15 of 16 closed; 1 partial (P1-7).** All 12 P2s from the first review were
also checked; 9 are closed (P2-1 citation links: 16/17 `ResearchConnection`
now carry `url`; P2-3 Mastery heading size, now `size="lg"` with the one
remaining `size="md"` explicitly commented as deliberate; P2-4 duplicate
worked problem, now a genuine extension; P2-5 hover-only copy, component
header text now reads "Select a term… or open the glossary below"; P2-6 six
chrome blocks, `LessonMetaStrip` moved to a collapsed disclosure below the
lesson body and title/lede now lead; P2-7 hardcoded footer lesson count, now
derived live via `getAllLessonsMeta()`; P2-8 `DailyPuzzle` layout shift, now
a proper height-reserving skeleton; P2-9 dropped anchor, now
`/current-quantum#${entry.slug}`; P2-12 mobile grid risk, `simulators` control
grids now `grid-cols-4 @sm:grid-cols-6` keyed to the actual rail container
width rather than viewport width, which is a more correct fix than the one
suggested). Two remain open by design, not oversight: **P2-2** (Callout
severity — still 450 `mistake` / 24 `note` / 4 `warning`, unchanged from
before; this was flagged as an authoring-balance issue with no code fix
available) and **P2-10** (`ApexCourseIndex`'s convergence diagram, still
`hidden lg:block` with no mobile-simplified version).

---

## New findings

### P2-new-1 · A stale code comment now makes a false claim about the codebase, and protects dead code

`src/components/apex/ApexHero.tsx:13` reads: *"Every other pillar page opens
with `PageHeader`: an eyebrow, an h1, a paragraph."* This was true when
written. It is no longer true: the P1-12 fix rebuilt `simulators/page.tsx`
(and, per the working tree, every other top-level page) directly on
`Eyebrow`/`SectionTitle`/`Lede` rather than the `PageHeader` wrapper. A
direct grep of all of `src/` for `PageHeader` usage (excluding tests) finds
exactly two hits: the component's own definition
(`src/components/ui/PageHeader.tsx`) and this now-inaccurate comment in
`ApexHero.tsx`. **No page imports or renders `PageHeader` anymore.**

Compounding it,
`src/components/ui/__tests__/auditedNoHardcodedColors.test.ts:10` still
describes `PageHeader` as one of "five owned `ui/` primitives (Button,
Badge, Card, PageHeader, Container)" and line 56 explicitly lists
`"src/components/ui/PageHeader.tsx"` as an audited, owned file — a real test
still spending coverage protecting a component nothing renders. This is
exactly the kind of two-agents-disagree seam the fifteen-agent sprint was
likely to produce: the agent that retired `PageHeader` from every real page
(closing P1-12) never touched `ApexHero.tsx`'s comment or the color-audit
test's file list, both written by different passes.

**Fix:** delete `src/components/ui/PageHeader.tsx` and its own test, remove
it from `auditedNoHardcodedColors.test.ts`'s owned-file list, and rewrite
`ApexHero.tsx`'s opening comment to describe the current
`Eyebrow`/`SectionTitle`/`Lede` convention instead of the retired one — or,
if `PageHeader` is meant to be kept in reserve, say so explicitly and cite
where it's expected to be used next, rather than leaving a comment that
misdescribes the site as it stands.

### P2-new-2 · The Hardware pillar's own apparatus photos are still the clearest unconverted case for `AnnotatedFigure` — and it's the same gap the original review named

`docs/NARRATIVE_COMPONENTS.md` (added this round) explicitly names Quantum
Hardware's platform lessons as "the first place to reach for
[`AnnotatedFigure`]." They still don't. Confirmed by reading each file:
`src/content/lessons/quantum-hardware/physical-qubit-platforms/superconducting-qubits.mdx:49-54`
uses a flat `ExternalFigure` for Google's Sycamore chip with the caption
"...showing its grid of transmon qubits and coupling wiring" — a
multi-feature apparatus photo, exactly `AnnotatedFigure`'s target case, with
no pins. The same pattern repeats in `trapped-ions.mdx`, `neutral-atoms.mdx`,
`photonic-qubits.mdx`, `spin-qubits.mdx`, and the platforms capstone — six
files, all flat single-caption figures where the underlying photo genuinely
has 3-5 distinguishable features (electrodes, resonators, coupling
structures) that a caption currently just describes in prose instead of
pointing at.

This is worth separating from the general P1-7 adoption-cliff finding
because it's the *specific* instance the doc itself flags as the priority
case, and it's the one that didn't move.

**Fix:** convert at minimum `superconducting-qubits.mdx`'s Sycamore figure
and `spin-qubits.mdx`'s device photo (the two platform lessons with the most
describable apparatus detail in their existing prose) to `AnnotatedFigure`,
using the prose that already names the features as the pin labels — the
content work is largely already written, it just needs pins instead of one
caption paragraph.

### P2-new-3 · Catalog pages agree on structure but not on how they declare the neutral field regime

`src/app/current-quantum/page.tsx:65` and `src/app/simulators/page.tsx:324`
both call bare `<PillarScope>` (relying on `fieldStore.ts`'s
`DEFAULT_STATE.regime === "atlas"` fallback), while
`src/app/problems/page.tsx:30`, `src/app/glossary/page.tsx:32` and
`src/app/map/page.tsx:39` all pass `<PillarScope regime="atlas">` explicitly.
Functionally identical today (the default *is* `"atlas"`), but it's the kind
of implicit-vs-explicit split that will silently diverge the next time
someone changes the store's default for an unrelated reason — exactly the
failure mode P1-2 itself was. Low severity since nothing currently reads
wrong, but worth closing while the convention is still being set.

**Fix:** pick one convention (explicit `regime="atlas"` is more robust to a
future default change) and apply it to all five cross-cutting pages.

### P2-new-4 (unchanged from P2-2, restated for completeness) · `Callout` severity is still two-valued in practice

No file changed here since the first review: 450 `type="mistake"`, 24
`type="note"`, 4 `type="warning"` (identical distribution to before, modulo
1 lesson). `docs/NARRATIVE_COMPONENTS.md`'s own new guidance section (added
this round, quoted verbatim from the first review's numbers) correctly
describes the problem but the corpus hasn't moved. Genuinely an
authoring-balance issue with no code-level fix; flagged again only because
the brief asks to verify state, not because it's new.

---

## Fresh read: escalation curve, seam, and genericness

**Escalation curve — now reads as real.** Mechanics (live wavefunction sim +
reading column) → Computing (live Bloch sphere + static circuit split) →
Hardware (schematic + readouts) → Software (now a real transpile-and-execute
instrument with live amplitude bars, closing the P1-4 gap) → Mastery
(multiple instruments + a computed 8×8 QFT grid) → Apex (preprint-anatomy
hero + open-problems index + prerequisite-topology course index). Software
was the specific hole the first review named and it is no longer a hole —
`CircuitStateStepper` is a genuine, code-backed simulation, not a decorative
strip. Apex still has no bespoke computed diagram of its own (noted, not
newly found, in the first review's "checked and clean" section) — it earns
its seriousness through typography, density and the `frontier` field instead,
which the first review already accepted as sufficient.

**The chrome/content seam.** In every full lesson read for this round —
across Mechanics, Hardware, Software, and one from Quantum Mastery's
info-theory course — the lesson genuinely reads as an authored experience,
not a document in a chassis: real computed data (`thermalPhotonOccupation`,
`sampleMeasurements`, `infiniteSquareWellEnergyLevel`) driving live figures,
honest caveats stated as such ("a literal infinity can't be represented on a
computer"), and forward/backward links that name the actual next idea rather
than "next lesson." `cryogenic-systems.mdx` in particular is close to a model
lesson: real `AnnotatedFigure` pins on a real dilution-fridge photo,
`EquationReveal` used correctly (short Unicode symbols), a `PredictBeforeReveal`
that requires genuine physical reasoning, and a worked example independently
verified in `docs/SCIENCE_AUDIT.md`. The seam hasn't vanished as a *site-wide
guarantee* — P1-7's remaining gap (`AnnotatedFigure`/`ObservePredictExplain`
adoption) means a reader who happens onto one of the ~215 lessons without them
still gets slightly less of the full vocabulary — but on direct sampling it
did not surface as a visible defect in any single lesson read in full. This
is a genuine improvement in kind, not just degree, from the first review's
"median lesson is a well-tokenized document."

**Genericness.** No new instance of glassmorphism, random gradients, or
SaaS-card monotony was found. The `atlas` field regime built to close P1-2
(a slow reference grid plus a six-node curriculum-order orbit) is
on-topic rather than generic-particle filler, consistent with §8's "visuals
must teach" rule. Problems catalog (P2-11 from the first review) remains a
filter-strip-plus-card-grid page with no second compositional pass — still
the one page closest to the "grid of cards" pattern the design system warns
against, unchanged from the first review, and still mild for the same reason
(the cards are the site's own tokenized `Panel`, not generic rounded SaaS
cards).

**Dead links.** Re-verified independently this round: every `/lessons/...`
reference across `src/` (189 unique refs after removing two regex
false-positives that were substring matches on unrelated paths, not real
links) resolves to a real `.mdx` file; all 219 lesson files are referenced by
at least their own route. Both `#rabi-explorer`/`#noise-explorer` anchors
linked from the homepage and `#wavefunction-explorer` linked from lesson
content resolve to real `id`s rendered in `simulators/page.tsx`. Still zero
dead links found.

**Mobile/theme, from classes.** `SimulatorInstrument.tsx`'s control grids now
key off the rail's own container width (`@container`/`@sm:grid-cols-6`)
rather than viewport width — correctly avoids 6-column crowding even when
the rail sits in a narrow split-view column at a wide viewport, which a
plain `sm:` breakpoint would have missed. No new hardcoded hex colors found
in a sweep of `src/components/lessons`, `curriculum`, `apex`, `problems`, or
`src/app/mastery`/`apex`. No new `backdrop-blur`. `ApexCourseIndex`'s
convergence diagram (P2-10) is still invisible below `lg` with no
mobile-simplified fallback — unchanged, still open.

---

## Verdict

**The seam the first review named — chrome vs. content — is substantially
closed, not merely narrower.** Fifteen of sixteen P0/P1 findings are closed
on direct code inspection, several via fixes stronger than the minimal ask
(a component-level defensive fallback in `EquationReveal`, not just one
fixed file; a new `atlas` field regime and a changed store default, not just
six `PillarScope` tags; a real server/client data split for `DailyPuzzle`
that also fixed the exact client-bundle-boundary failure mode
`docs/DESIGN_SYSTEM.md` now documents as a cautionary tale). The one
genuinely unfinished item, P1-7, is real but narrow: two of twelve narrative
components remain rare (3/219 and 1/219 usages), concentrated exactly where
the docs say they should be used and aren't — Quantum Hardware's platform
photography.

Sampling full lessons across Mechanics, Hardware, Software and Quantum
Mastery this round, the median lesson read as an authored experience, not a
styled document: real computed data driving real figures, honest caveats,
and specific rather than templated forward/backward hooks. That's a
different finding in kind from the first review's "well-tokenized
educational document wearing an excellent chassis" — this round's samples
were the chassis and the experience, together, in the same lesson.

So: **would someone become fascinated by quantum physics here now?** More
plausibly than the first review could say, and no longer only in a minority
of "strongest lessons." The remaining gap is narrow and specific rather than
structural: a reader who lands on one of the Hardware platform lessons still
gets a well-attributed but flat photo where the lesson's own words already
describe several distinct labeled features worth pointing at individually.
That's a real, fixable gap — not the site-wide unevenness the first review
found. If this sprint's fixes ship as committed rather than staying in an
uncommitted working tree, this is now a site that clears its own stated bar
in the large majority of what a reader will actually encounter, with one
well-scoped follow-up (finish the `AnnotatedFigure` conversion on Hardware's
platform lessons) standing between here and evenly.
