# Adversarial UX & visual-QA review

Read against `docs/DESIGN_SYSTEM.md`, `docs/NARRATIVE_COMPONENTS.md` and
`src/app/globals.css`, then every page from home through lessons, simulators,
problems, current-quantum, glossary and map. Everything below is a defect.
Nothing below is praise; the verdict at the end is where the honest balance
goes.

Scope note: this reviews presentation, not physics. Where a physics claim is
named it is because the *presentation* of it is wrong, not the content.

---

## P0 — broken, wrong, or embarrassing

### P0-1 · `EquationReveal` term chips render raw LaTeX as literal text

`src/content/lessons/quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx:141-143`

`EquationReveal`'s `terms[].symbol` is documented (`docs/NARRATIVE_COMPONENTS.md`
§EquationReveal) as "a short **plain-text/Unicode** label for the chip … not
LaTeX source; it isn't passed through KaTeX." This call site passes entire raw
sub-expressions verbatim, confirmed in the file:

```
"√(j(j+1)−m(m−1)) C^{j,m−1}"
"C^{j,m}_{j1,m1+1;j2,m2}"
"√(j2(j2+1)−m2(m2+1))"
```

Because the component deliberately never typesets `symbol`, these render as
literal text with visible `^{...}_{...}` source syntax inside the chip
buttons — broken-looking math on a `master`-difficulty lesson whose entire
subject is a formal theorem. This is the single most embarrassing rendering
defect found.

**Fix:** replace with short Unicode-only chip labels (`"C(j,m−1)"`, `"C₊₁"`,
`"√(j₂…)"`) per the documented API. Better: a three-term recursion this dense
is not what `EquationReveal` is for — use `DerivationSteps` with `annotation`
glosses instead.

### P0-2 · "Current Quantum" freezes its own recency claim at build time

`src/app/current-quantum/page.tsx:78` — `relativeRecency(mostRecent.date, new Date())`.

`new Date()` is evaluated during static generation. Verified: no
`export const revalidate` exists anywhere in `src/app` (only two files declare
`export const dynamicParams = false`, which is unrelated). On this
statically-generated site the "That was" readout is baked in at build time and
then silently drifts — a page whose entire promise is currency will keep
asserting e.g. "3 weeks ago" for as long as the deployment lives, growing more
wrong every day with nothing to notice it.

**Fix:** either add `export const revalidate = 86400;` to this page, or drop
the relative "That was" readout and keep only the absolute
`formatEntryDate(mostRecent.date)` readout beside it, which is honest under
static generation. The second option is preferable — it removes a moving part
rather than adding a rebuild dependency.

### P0-3 · Difficulty is encoded five different ways on the site, and two of them contradict each other

| Where | File:line | Encoding |
| --- | --- | --- |
| Course rows, timeline, lesson search | `src/components/curriculum/DifficultyMark.tsx:26-37` (used at `CourseList.tsx`, `CourseTimeline.tsx`, `LessonSearch.tsx`) | **Four**-tick ladder + text, `foundational \| intermediate \| advanced \| master` |
| Problems (card, catalog, problem page) | `src/components/problems/problemDisplay.ts`, `ProblemMetaMarks.tsx` `DifficultyScale` | **Three**-tick ladder + text, `beginner \| intermediate \| advanced` |
| Learn hub, pillar level | `src/app/learn/CurriculumExplorer.tsx` | Synthesized text range, `"Foundational → Master"`, no ticks |
| Lesson page header | `src/components/lessons/LessonLayout.tsx:120` | Plain text in a `Readouts` item — no ticks at all, the one place a reader most needs the cue before committing to reading |
| Apex course index / Current Quantum | `ApexCourseIndex.tsx`, `CurrentQuantumCard.tsx` | Bare `TechLabel` text — no ticks |

The first two are the actual contradiction. Both render as filled-vs-hollow
ticks in the pillar accent with a `tech-label` beside them — they look like
the same instrument, and they are not. "Advanced" is the *top* of the problem
scale and the *third of four* on the lesson scale, and there is no `"master"`
tier for problems at all — an Apex or Mastery practice problem, the site's
own hardest material, is displayed identically to an intermediate Computing
problem. A student sees "Advanced ▮▮▮" on a problem and "Advanced ▮▮▮▯" on
the lesson it belongs to, and the shared visual language invites exactly the
wrong comparison.

The remaining three rows are the incoherence on top of the contradiction: the
same fact is a ladder here, a synthesized arrow-range there, and unadorned
text in two more places (including the lesson page itself), so difficulty
never becomes something the eye learns to read consistently anywhere on the
site.

**Fix:** map problem difficulty onto the curriculum's four-level `Difficulty`
type and render both through `DifficultyMark`. If the three-level problem
authoring vocabulary must survive, translate at the boundary
(`beginner→foundational`, `advanced→advanced`) so there is exactly one ladder
on screen. Then use `DifficultyMark` in `LessonLayout`'s header and the Apex
index too — it already renders text alongside the ticks, so nothing is lost.

---

## P1 — real incoherence, or a section the redesign did not reach

### P1-1 · `DIFFICULTY_LABEL` is hand-copied into nine files instead of exported once

`src/components/curriculum/DifficultyMark.tsx:33` carries a banner comment
reading "**The difficulty encoding — one definition, everywhere it
appears**." It does not export the map. Confirmed by grep — the identical
literal is independently redeclared in nine files: `DifficultyMark.tsx`
itself, `src/app/learn/CurriculumExplorer.tsx`, `src/app/learn/RecommendedNext.tsx`,
`src/components/apex/ApexCourseIndex.tsx`,
`src/components/currentQuantum/CurrentQuantumCard.tsx`,
`src/components/lessons/LessonLayout.tsx`, `src/components/problems/problemDisplay.ts`,
`src/components/problems/ProblemMetaMarks.tsx`, `src/lib/structuredData.ts`.

Nine independent copies of the thing the file's own comment says exists once.
This is the mechanism by which P0-3 happened, and it is how the next
divergence will happen too.

**Fix:** `export const DIFFICULTY_LABEL` from `DifficultyMark.tsx` (or move it
beside the `Difficulty` type in `src/lib/content/types.ts`) and import it in
all eight other sites.

### P1-2 · Six-plus routes declare no pillar scope, so the homepage's `journey` crossfade plays behind them by accident

`src/components/field/fieldStore.ts:32` sets `DEFAULT_STATE` to
`{ regime: "journey", pillar: null }`, and resets to it on unmount. These
pages never render `<PillarScope>` (verified: zero matches in each):
`src/app/learn/page.tsx`, `src/app/glossary/page.tsx`, `src/app/map/page.tsx`,
`src/app/problems/page.tsx`, `src/app/problems/[slug]/page.tsx`,
`src/app/about/page.tsx`. `src/app/current-quantum/page.tsx` gets this right
— a bare `<PillarScope>` with no `pillar` prop — so the correct pattern
already exists in the codebase and six other pages simply didn't use it.

Consequence: the `journey` regime — the six-pillar crossfade whose entire
design premise is "scrolling the homepage *is* descending the curriculum"
(`regimes.ts`'s own comment) — plays behind an alphabetical glossary, a
problem page, an about page, keyed to how far down *that page's* scroll
position happens to be. Scroll a glossary from *Amplitude* to *Zeeman* and the
background crossfades wave → state → lattice → graph → operator → frontier
for no reason connected to the content — decorative motion with no
educational payload, which the design system explicitly disallows. It also
means these pages get **no atmosphere layer at all** (`PillarScope` is what
paints `.atmosphere`), so they sit on flat `--depth-0` with no depth behind
them, unlike every other page on the site.

`/problems/[slug]/page.tsx` is a sharper case: `ProblemLayout.tsx` *does*
wrap the page content in `<PillarScope pillar={course?.pillar}>`, correctly
retinting the accent color and focus rings to the problem's real pillar — but
the page-level field/atmosphere declaration is missing regardless, and
separately (see P1-3) the navbar's pillar indicator doesn't know about this
scoping either, so three different layers of the same page (chrome, field,
content accent) can each believe a different thing about which pillar a
problem belongs to.

**Fix:** wrap each of the six pages in a bare `<PillarScope>` — that alone
restores the atmosphere layer. Give the cross-cutting pages a deliberate,
non-journey regime (e.g. `operator` suits the map/glossary's structure-and-relations
character); `/problems/[slug]` should pass the real pillar it already resolves
at render time. Longer-term, make `journey` an opt-in the homepage declares
explicitly rather than the store's silent default, so no future page can
inherit it by omission.

### P1-3 · The navbar's "you're in X" pillar indicator disagrees with the page underneath it on Problems

`src/components/layout/pillarRoutes.ts`'s `detectPillar()` only recognizes a
pillar's own landing route and `/lessons/<pillar>/...` — confirmed by grep, it
has no knowledge of `/problems/<slug>` at all. But `ProblemLayout.tsx` *does*
wrap every `/problems/<slug>` page in `<PillarScope pillar={course?.pillar}>`,
so the page's background atmosphere, accent color and focus rings are
correctly retinted to the problem's pillar. Net effect: on a problem page the
content visibly belongs to, say, Quantum Hardware (amber focus rings, amber
prose links), but the navbar's pillar indicator next to the wordmark stays
blank or shows the wrong thing, because chrome-level pillar detection and
content-level pillar scoping are two disconnected mechanisms that only one of
them was updated for.

**Fix:** extend `detectPillar` to resolve `/problems/<slug>` via the same
lightweight slug → course → pillar lookup `ProblemLayout` already performs at
render time, so the navbar and the page it's chrome for agree.

### P1-4 · The Software pillar is the hole in an otherwise-real escalation curve

The brief asks whether Mechanics → Computing → Hardware → Software → Mastery →
Apex reads as escalating. It does not — it dips hard at position four.

| Pillar | Page | Interactive/instrument content |
| --- | --- | --- |
| Mechanics | `src/app/mechanics/page.tsx` | Live `LazyWavefunctionHeroExplorer` in an `Instrument`, a `Marginalia` note, a `FullBleed` rule |
| Computing | `src/app/computing/page.tsx` | Live `LazyBlochSphereHeroExplorer` in a `SplitFigure`, plus a `StaticCircuitDiagram` `Instrument` |
| Hardware | `src/app/hardware/page.tsx` | Full-bleed `Instrument`, two schematic diagrams, `Readouts` |
| **Software** | `src/app/software/page.tsx` | **None.** No `Instrument`, no simulator, no computed figure |
| Mastery | `src/app/mastery/page.tsx` | Two `Instrument`s, a `SplitFigure`, `Readouts`, a computed 8×8 QFT magnitude/phase grid from real `quantumFourierTransform` code |
| Apex | `src/app/apex/page.tsx` + `src/components/apex/*` | Bespoke preprint-style hero, open-problems index, structural course index |

`src/app/software/page.tsx`'s entire original figure is a hand-rolled
four-box `CompilationPipeline` strip of static `<div>`s joined by `→`
arrows — no computed data behind it, no interactivity. This is the pillar
about *executable artifacts* — circuits as data, a state-vector engine,
transpilation — and it is the one pillar page with nothing running on it. It
reads as the page that ran out of budget, and it breaks the escalation the
brief asks about squarely in the middle.

**Fix:** the assets already exist elsewhere in the codebase. Drop
`LazyCircuitBuilder` (already built and used on `/simulators`) or a
`CircuitStateStepper`-style visualization into a real `<Instrument>` between
the lede and the curriculum, so the pipeline strip becomes a caption rather
than the pillar's entire visual argument.

### P1-5 · Four of six pillar pages converge on the identical curriculum block below the fold

`src/app/mechanics/page.tsx`, `computing/page.tsx`, `hardware/page.tsx`,
`software/page.tsx` are, below the fold, byte-for-byte the same composition:
a `Section` with an `Eyebrow`/`SectionTitle` pair, then `CourseTimeline`,
then `CourseList`. The page-file comments claim compositional distinctness
("each gets a structurally different" treatment) and that is true of the
*top half* of each page. It stops being true at the midpoint: four pillars
converge on one template, and since `CourseList` renders `Panel` cards
containing a module grid, the bottom half of four of six pillar pages is
exactly the "grid of cards" the design system's own §4 says means a page is
not finished.

**Fix:** the timeline and the list are redundant with each other — both
encode course order and completion. Drop `CourseTimeline` on the pillars
whose top half is already horizontal (Software's pipeline, Hardware's signal
chain) and let each pillar pick one. Mastery and Apex already prove this is
possible — `ApexCourseIndex` renders the pillar's real prerequisite topology
(four independent research threads converging on one synthesis course)
instead of a list.

### P1-6 · `CourseList`'s content-completeness bar and a reader's own progress badge sit unlabeled, inches apart

`src/components/curriculum/CourseList.tsx` renders, in immediate succession: a
`{authoredModules}/{totalModules} lessons` counter, a `CourseProgressBadge`
(the *visitor's own* completed-lesson count, shown once non-zero), and then
directly below both, a `bg-pillar` progress bar whose width is
`progressPercent` — which is **content-authoring** completeness (how much of
the course is written), not the reader's own progress. Nothing on screen
distinguishes "how much of this course exists" from "how much of it you've
done" — a returning reader who has completed several lessons sees a filled
bar and a "3/12 done" badge within the same few pixels and has no textual cue
that they mean different things.

**Fix:** add a `.tech-label` caption directly under or beside the bar
("Content available") so the two signals are visually disambiguated in the UI
itself, not only in code comments.

### P1-7 · Half the new narrative vocabulary never shipped into any lesson

Measured across all 219 `.mdx` lessons (verified directly):

| Component | Lessons using it |
| --- | --- |
| `AnnotatedFigure` | **0 / 219** |
| `ObservePredictExplain` | **0 / 219** |
| `Question` | 2 / 219 |
| `ResearchConnection` | 13 / 219 |
| `HistoricalMoment` | 13 / 219 |
| `ChallengePrompt` | 21 / 219 |
| `EquationReveal` | 32 / 219 |
| `DerivationSteps` | 38 / 219 |
| `InsightBlock` | 39 / 219 |
| `LessonHook` | 76 / 219 |
| `NextDiscovery` | 77 / 219 |
| `PredictBeforeReveal` | 194 / 219 |
| `InteractiveSection` | 161 / 219 |
| `Callout` | 219 / 219 |

`docs/DESIGN_SYSTEM.md` states as fact that these components "give a lesson
author a vocabulary for structuring a lesson as hook → question →
visualization → prediction → derivation → …". Two of the twelve are used
nowhere. Both are fully built and correct —
`src/components/narrative/AnnotatedFigure.tsx` (percentage-based pins,
mobile-safe, inline `sr-only` labels) and
`src/components/narrative/ObservePredictExplain.tsx` (three named slots) —
and both carry worked usage examples in the author reference. They are
documentation describing something that isn't there.

> **Largely resolved 2026-08-29.** The table above is the state at review
> time and is left as recorded. Re-measured against the current corpus (same
> 219 lessons): `AnnotatedFigure` **8**, `ObservePredictExplain` **1**,
> `Question` **4**, `HistoricalMoment` **17**, `EquationReveal` **32**,
> `ResearchConnection` **34**, `ChallengePrompt` **38**, `InsightBlock`
> **40**, `DerivationSteps` **47**, `InteractiveSection` **163**,
> `PredictBeforeReveal` **213**, `LessonHook` **218**, `NextDiscovery`
> **219**, `Callout` **219**. Nothing is at zero any more.
> `ObservePredictExplain`'s single call site is deliberate and is the
> blocker on retiring it — see `docs/NARRATIVE_COMPONENTS.md`, which
> recommends removing the component rather than growing its usage. The
> inline glossary `Term`, which did not exist when this table was measured,
> now stands at 559 calls across 191 lessons, and is still climbing.

The clearest case of the gap: `AnnotatedFigure` was built for exactly
multi-feature apparatus photos, and Quantum Hardware's platform/dilution-fridge
lessons (which have exactly that kind of figure) use a flat, single-caption
`ExternalFigure` instead — the component's own docstring example is a
dilution-refrigerator cutaway, the precise image type this pillar has and
doesn't use it for. Separately,
`src/content/lessons/quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification.mdx:429-457`
hand-rolls, from raw MDX, the exact interaction `ObservePredictExplain` exists
to standardize: a three-way preset switcher (Product state / Bell state /
Worked example) built as visually-hidden `<input type="radio">` elements and
a `<style>` block using `:has()` selectors to drive panel visibility. It is
the only place on the site that builds this pattern from scratch instead of
using the primitive built for it — `docs/DESIGN_SYSTEM.md` §1 opens with
"compose from these primitives rather than inventing a parallel system," and
this is exactly that.

The adoption cliff is the real finding underneath the numbers: the four
*pre-existing, restyled* components (`Callout`, `PredictBeforeReveal`,
`InteractiveSection`, `ExternalFigure`) are near-universal, while the *new*
ones cluster at 0–35%. What actually happened is that every lesson got the
restyle and only some lessons got the redesign.

**Fix:** pick ~20 lessons with a genuine multi-feature diagram (hardware
platform photos first) and convert `ExternalFigure` → `AnnotatedFigure`
there. Rebuild the Schmidt-decomposition widget as
`ObservePredictExplain`/`PredictBeforeReveal` panels, or promote its pattern
into a real reusable "preset switcher" if the interaction is worth
generalizing — either way it should not be hand-rolled CSS in a content file.
If `AnnotatedFigure`/`ObservePredictExplain` are intentionally deferred,
remove them and their doc sections rather than shipping documented, compiled,
unused vocabulary.

### P1-8 · 142 of 219 lessons open on a bare heading; 142 close on one too

`LessonHook` appears in 76/219 lessons; the other 143 drop straight from
frontmatter into an unstyled `## Motivation`-style heading — e.g.
`quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms.mdx:64`
and `quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows.mdx:25`.
Symmetrically, `## Further Exploration` is a near-universal section header but
`NextDiscovery` appears in only 77 lessons, so most lessons render the forward
hook as a plain paragraph under a heading instead of the styled teaser.

Whether a lesson feels authored or generic therefore depends on which agent
wrote it, not on the material — the most legible seam in the whole build. A
student moving Computing → Software → Mastery will feel the voice change
lesson to lesson.

Where `LessonHook` is used, its placement also drifts relative to the first
heading — in a meaningful fraction of the 76 lessons that have one, a
`## Motivation` heading appears *before* the hook (confirmed in e.g.
`apex/quantum-complexity-theory/the-local-hamiltonian-problem.mdx`, hook after
line 151's heading; contrast
`apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm.mdx:88-94`,
same pattern), so the "opening moment" (per the component's own doc comment)
actually renders nested inside a named section, after the ToC's first entry
has already appeared — not the cold open it's meant to be.

**Fix:** these two beats are cheap and mechanical. Add `LessonHook` and
`NextDiscovery` to the ~140 lessons missing them — the `## Motivation` first
paragraph is usually already the hook, just unstyled — and standardize on
hook-before-first-heading everywhere it's used.

### P1-9 · `InteractiveSection`'s `mode` prop is documented but used at zero of 161 call sites

`docs/NARRATIVE_COMPONENTS.md` documents `mode` (`"observe" | "predict" | "run" | "compare"`)
as the way an embed's label strip honestly names what kind of interaction it
is. Verified directly: 161 lessons use `InteractiveSection`; **zero** pass
`mode`. Every interactive embed on the site therefore renders the same
default badge, "RUN EXPERIMENT," regardless of whether the reader is actually
running anything. Concrete mismatch: lessons whose entire interaction is
"scrub a slider and watch a value trace" (a common pattern per P2-2) are
badged identically to lessons with a genuine multi-parameter simulator — the
one feature built to make the badge honest is unused, so the badge is
uniformly overstated.

**Fix:** either have authors adopt `mode` where it changes the label's
meaning (pure-observation embeds should say "OBSERVE," not "RUN EXPERIMENT"),
or remove the feature — as shipped it exists in the API and nowhere in the
content.

### P1-10 · 11 lessons contain 120+ line unbroken prose stretches, concentrated exactly where the material is hardest

Longest runs with no component, no display math, no table, no figure:

| Lines | Lesson |
| --- | --- |
| 237 | `apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today.mdx` |
| 182 | `quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms.mdx` |
| 145 | `apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic.mdx` |
| 140 | `quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification.mdx` |
| 139 | `apex/fault-tolerance-frontiers/lattice-surgery.mdx` |
| 135 | `quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement.mdx` |
| 132 | `apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper.mdx` |
| 131 | `quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity.mdx` |
| 129 | `apex/fault-tolerance-frontiers/decoding-surface-codes.mdx` |
| 124 | `quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness.mdx` |
| 123 | `quantum-mastery/advanced-algorithms-and-complexity/quantum-walks.mdx` |

The worst case is roughly half a lesson: the Apex landscape capstone runs
from around line 153 to the end (~390) with only headings and nothing else to
look at. These are almost all Mastery and Apex — the visual relief thins out
exactly where the material gets hardest and the reader needs it most.

**Fix:** these are the lessons that should carry `DerivationSteps`,
`ResearchConnection` and `HistoricalMoment` (the same unused budget as P1-7).
The Apex research-methods lessons in particular argue about claims and
evidence — `TheoremBox provenance="cited"` vs. `"derived"` exists precisely
for that and would break up the prose while carrying real meaning.

### P1-11 · Glassmorphism, explicitly forbidden, in exactly one place — directly under the navbar that explains why not to

`src/components/glossary/GlossaryFilter.tsx:101`:

```tsx
className="sticky top-16 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0"
```

`docs/DESIGN_SYSTEM.md` §4 ends "No glassmorphism. No blur stacks over the
canvas field." `src/components/layout/Navbar.tsx:232` carries a comment
explaining exactly why the sticky navbar deliberately uses solid `bg-surface`
and no blur, including that blurring over the repainting canvas field costs a
recomposite on every scroll frame. This is the only `backdrop-blur` in `src/`,
and it sits directly beneath that navbar, over the same global canvas.

**Fix:** `bg-surface` (opaque), drop `backdrop-blur` — matches the pattern
already sitting immediately above it in the DOM.

### P1-12 · Three sibling catalog pages (Simulators / Problems / Current Quantum) use three different structural conventions

- `src/app/simulators/page.tsx` uses a different, second page-header
  component (`src/components/ui/PageHeader.tsx`) instead of the
  `Eyebrow`/`SectionTitle`/`Lede` pattern every other top-level page uses
  directly — `PageHeader` is otherwise used nowhere else in the app except
  its own `error.tsx`. Its "Jump to a simulator" nav
  (`src/app/simulators/page.tsx`, ~lines 62-75) is a flat, ungrouped list of
  pill links for all 14 simulators, even though the page body below it is
  carefully organized into 5 named groups (Single-Qubit Fundamentals,
  Multi-Qubit & Entanglement, Dynamics & Noise, Algorithms, Error
  Correction) — the nav doesn't mirror that grouping, so it reads as a bag
  of 14 buttons rather than a map of the page.
- `src/app/problems/page.tsx` uses the documented `Section` +
  `Eyebrow`/`SectionTitle`/`Lede` pattern, and its filter bar is a real
  `.instrument` panel.
- `src/app/current-quantum/page.tsx` also uses `Section`/`Eyebrow`/`SectionTitle`/`Lede`,
  and additionally wraps in `PillarScope` with a `Readouts` instrument strip
  the other two catalog pages lack.

None of the three is wrong in isolation, but a reader moving between them
experiences three different page templates for what is functionally the same
kind of page (a filtered catalog).

**Fix:** rebuild `simulators/page.tsx` on `Section`/`Eyebrow`/`SectionTitle`/`Lede`
plus a real `.panel`/`Instrument` jump-nav grouped to match the page's own
five sections, and retire `PageHeader`. Decide once whether cross-cutting
catalog pages get `PillarScope` — either extend it to Simulators and Problems
for the atmosphere layer, or drop it from Current Quantum for consistency.

### P1-13 · `frontier` is the only field regime that draws its brightest marks in `--foreground`, on the pillar with the densest text

`src/components/field/regimes.ts` — every regime except `frontier` draws
exclusively in `accent`/`dim`. `frontier`'s open-problem points are drawn in
`--foreground` (the body text color) at up to `0.5 × intensity`. Compounding
it, `[data-pillar="apex"]` raises `--atmosphere-strength` to `1.35`
(`globals.css:165`) and pushes `--foreground` to `#f1f5fb` on a `#02040a`
ground — so the brightest marks anywhere in the background system are
near-white dots at half alpha, on the one pillar with the strongest
atmosphere, behind Apex's characteristically dense text. The design system's
rule is unambiguous (§7): "the field may never compete with text… If you
cannot comfortably read body copy over it, it is too strong."

**Fix:** draw `frontier`'s points in `accent` like every other regime, or cap
their alpha at ~0.25. The rising horizon and the sparse link structure already
carry the metaphor; point brightness isn't doing the teaching and is the one
place the field risks fighting Apex's own density.

---

## P2 — polish

### P2-1 · `ResearchConnection` cites but rarely connects

Of 15 usages, exactly one supplies a `url` (the Grover's-algorithm lesson).
The other 14 render as unlinked citation text for real, findable papers (Bell
1964, Dennis–Kitaev–Landahl–Preskill 2002, Gilyén–Su–Low–Wiebe/STOC 2019, Ewin
Tang 2018, Farhi–Goldstone–Gutmann 2014, Barenco et al. 1995, among others) —
a component whose stated premise is "this is live research," styled with a
currency indicator, that can't be clicked. Citation completeness is also
uneven: most carry author/venue/year, but
`apex/fault-tolerance-frontiers/magic-states-and-distillation.mdx` cites
"Bravyi & Kitaev" with no year or venue at all.

*(Checked and clean otherwise: every citation sampled resolves to a real,
correctly-attributed paper. No invented dates or fabricated sources found in
`ResearchConnection`, `HistoricalMoment`, or the Current Quantum data file.)*

**Fix:** add `url` to the 14 unlinked citations (the prop already exists) and
fill in the missing year/venue on the Bravyi & Kitaev citation.

### P2-2 · A third of "mounted lab equipment" moments are the same three widgets, and `Callout`'s severity system collapses to two tiers in practice

Of 161 `InteractiveSection` usages, the large majority wrap one of three
simple widgets (a single-slider bar chart, a parametric curve, a small matrix
grid) — individually apt, but for many lessons it's the *only* hands-on
moment, which undercuts the "mounted equipment" framing the wrapper implies.

Separately, `Callout` usage across the corpus is `type="mistake"`: 450 uses,
`type="note"`: 23, `type="warning"`: 4. `Callout.tsx`'s own documentation
frames `mistake` as escalated severity — the display-face treatment "most
likely to catch a scanning eye" — but with ~2 per lesson defaulting to
`mistake` and `warning` essentially unused, the three-tier system functions
as "mistake" vs. nothing in practice, which flattens the one severity signal
the component was built to carry.

**Fix:** no code change needed for either — both are authoring-balance
issues. Promote one-slider embeds to real simulators or demote them out of
`InteractiveSection` where they're the only interaction in a lesson; use
`warning` for lower-stakes cautions inside "Common Mistakes" sections instead
of defaulting everything to `mistake`.

### P2-3 · Mastery's section headings are one step smaller than every sibling pillar's

`src/app/mastery/page.tsx` uses `<SectionTitle level={2} size="md">` for its
equivalent section headings where Mechanics, Computing, Hardware, Software and
Apex all use `size="lg"`. Mastery's headings are visibly smaller than the same
heading on every other pillar page, with no comment explaining it as a
deliberate density choice (Apex's own files do comment their deliberate
choices).

**Fix:** `size="lg"` to match, unless the density is intentional — in which
case, comment it the way Apex does.

### P2-4 · Duplicate worked problem inside one lesson

`src/content/lessons/quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics.mdx` —
the `<ChallengePrompt>` near the end repeats Practice Question #1 verbatim:
same numbers, same wording. A reader who does the practice set then reaches
"Further Exploration" is handed the same problem again as though it were new.

**Fix:** replace the `ChallengePrompt` with a genuine extension (same well at
a different width, or a superposition of two eigenstates).

### P2-5 · `EquationReveal` advertises only its mouse affordance

`src/components/narrative/EquationReveal.tsx` — the header reads "Hover a
term for its meaning." The component correctly also supports click, keyboard
focus, and a permanently-visible `<details>` glossary underneath (the whole
reason nothing is hover-only), but the copy undersells the implementation and
is actively misleading on a touch device, where hover doesn't exist.

**Fix:** "Select a term for its meaning — or open the glossary below."

### P2-6 · Six chrome blocks before the first sentence of content on a typical lesson

`src/components/lessons/LessonLayout.tsx` renders, in order: breadcrumb →
`Readouts` (module/difficulty/duration) → progress rule → title → lede →
objectives list (up to 3) → `LessonMetaStrip` lineage `Instrument`
(prerequisites/resurfaces-in/related-elsewhere) → mobile ToC button — and only
then the MDX body. Each block is individually well-built, but combined with
P1-8 (no `LessonHook` in 65% of lessons), the reader's first actual content in
the majority case is a bare `## Motivation` heading arriving after six
distinct chrome blocks — on a lesson with several prerequisites, that's often
a full screen or more of scrolling before anything narratively differentiated
appears.

**Fix:** largely resolves itself once `LessonHook` is universal (P1-8). If
more is needed, collapse `LessonMetaStrip` to a disclosure below the fold —
prerequisites matter before starting, but not more than the first sentence
does.

### P2-7 · Homepage lesson-count stat is hardcoded and can drift from the live count it duplicates

`src/components/layout/Footer.tsx:20` — `const LESSON_COUNT = 219;`, rendered
in the footer's "{pillars} pillars · {LESSON_COUNT} lessons" line on every
page. `src/components/home/Hero.tsx` computes the same fact live via
`getAllLessonsMeta().length`. They agree today, but nothing keeps them in
sync — the next lesson added or removed makes the footer (present on every
page) silently wrong while the hero stays correct.

**Fix:** derive the footer's count the same way, or pass it down from one
shared server call.

### P2-8 · A homepage figure slot is empty on first paint, then pops in after hydration

`src/components/home/DailyPuzzle.tsx` intentionally renders `null` until
client mount (`useSyncExternalStore` with a null server snapshot, to avoid
baking the build day's date into static HTML) and is embedded as the `figure`
side of the Software section's `SplitFigure`. The figure column is empty on
first paint and appears after hydration — a layout shift in an otherwise
carefully no-CLS design system.

**Fix:** reserve the instrument's height with a skeleton, or accept the shift
as an intentional, documented tradeoff for the date-freshness requirement.

### P2-9 · A linked "Connected to real research" card drops its own anchor

`src/components/map/ConceptDetailPanel.tsx` — cards showing a related Current
Quantum entry (title, date, category) link with `href="/current-quantum"`,
dropping the anchor. `CurrentQuantumCatalog.tsx` already sets `id={entry.slug}`
on each entry, so the fix is one line: `href={`/current-quantum#${entry.slug}`}`
would land the reader on the specific item they clicked instead of the top of
the full list.

### P2-10 · Apex's own structure diagram is invisible below `lg`

`src/components/apex/ApexCourseIndex.tsx` wraps the only visual explanation of
how the four Apex research threads converge into the closing capstone course
in `hidden lg:block`. Below `lg` — the majority of mobile/tablet visitors —
the diagram disappears entirely and is replaced only by an `sr-only`
paragraph: accessible, but not a design choice made for sighted mobile
readers, just the fallback path standing in as the only path.

**Fix:** a simplified stacked version (four labeled rows converging into one)
would fit `sm`/`md` widths without the 4-column grid.

### P2-11 · Problems catalog is, by the design system's own test, the one page that didn't get a second pass

`docs/DESIGN_SYSTEM.md` §4: "if a page is *only* cards, it is not finished."
`src/app/problems/page.tsx` + `ProblemsCatalog.tsx` is exactly that: one
filter `Instrument` strip, then a grid of `ProblemCard`s, with no split, no
timeline, no reading column. The cards are the site's own `Panel` primitive
with tech-voice metadata, not generic rounded SaaS cards, so this is mild —
but by the design system's own stated bar, this page hasn't had the
composition-variety pass the pillar pages got.

### P2-12 · 320px risks

- `src/components/simulators/bloch-sphere/BlochSphereControls.tsx`,
  `circuit-builder/GateControls.tsx`, `two-qubit-explorer/OperationControls.tsx`
  use `grid grid-cols-6` with no responsive prefix. At 320px, after container
  and panel padding, this leaves roughly 36px per button — workable for
  single-letter gate labels, tight for `S†`/`CNOT`. **Fix:** `grid-cols-4 sm:grid-cols-6`.
- `src/app/software/page.tsx` uses `min-w-[10.5rem]` boxes inside
  `flex-nowrap overflow-x-auto` for the pipeline strip. This scrolls
  correctly, but it's the only horizontally-scrolling content on any pillar
  page and has no scroll affordance. **Fix:** a fade mask on the trailing
  edge, matching `.rule-fade`'s treatment elsewhere.
- `src/components/apex/ApexCourseIndex.tsx`'s `grid-cols-4` (P2-10) has no
  responsive prefix, but it's already `hidden lg:block` — not a mobile-overflow
  bug on its own, just the underlying cause of P2-10.

---

## Checked and clean

Recorded so these are not re-investigated:

- **Zero dead links, site-wide.** All markdown links to `/lessons/…` inside
  lesson MDX, every static `href="/lessons/…"` in components, and every
  top-level route (`/mechanics`, `/computing`, `/hardware`, `/software`,
  `/mastery`, `/apex`, `/learn`, `/simulators`, `/problems`, `/glossary`,
  `/map`, `/current-quantum`, `/about`) resolve to real files. All 219
  curriculum modules have a matching `.mdx` — no orphans in either direction.
  The `#rabi-explorer` / `#noise-explorer` anchors linked from the homepage's
  Hardware section, and the `/learn#<pillar>` breadcrumb anchors, all have
  real matching `id`s. Two independent link-integrity passes (a scripted
  cross-reference of every MDX link, glossary/concept slug, course
  prerequisite edge, and CSP image host; plus manual spot-checks across five
  other review lanes) agree on this. Given the brief's emphasis on dead links
  being the most embarrassing possible defect, this is worth stating plainly:
  in a site with hundreds of internal links, none are broken.
- **Image integrity.** Every `ExternalFigure` usage carries both `credit` and
  `license`. The only external hosts used (`upload.wikimedia.org`,
  `www.nist.gov`) match the CSP `img-src` allow-list in `next.config.ts`
  exactly — no orphaned entries, no unlisted hosts.
- **Simulator instrumentation.** All 14 simulators route through
  `src/components/simulators/shared/SimulatorInstrument.tsx`, a real
  `<Instrument>`. No simulator is a bare rounded div.
- **Field accessibility.** `QuantumField.tsx` is `aria-hidden` +
  `data-decorative` with an `sr-only` regime-description paragraph for every
  environment.
- **Regime distinctness.** All six pillar regimes in `regimes.ts` draw
  genuinely different physics: the wave regime uses the real dispersion law,
  the state regime's probability bars are actual Born-rule values matching
  the drawn Bloch vector, the lattice regime propagates control pulses at
  finite speed, the operator regime uses real Fourier-transform magnitudes.
  There is no generic particle system reskinned six ways.
- **Homepage/`journey` alignment.** The `journey` regime's curriculum-order
  sequence (wave → state → lattice → graph → operator → frontier) matches
  `src/app/page.tsx`'s actual section order (Hero → Mechanics → Computing →
  Hardware → Software → Mastery → Apex) exactly, and `PillarBand` tints
  sections without fighting the canvas regime underneath.
- **Mechanics / Computing / Hardware pillar pages are the strongest-executed
  lane of the redesign.** Each is genuinely, structurally different (reading
  column + live sim; asymmetric split + static circuit; schematic-with-readouts
  + full-bleed diagram), each correctly declares its pillar via `PillarScope`
  with the regime derived automatically from `src/lib/design/pillars.ts`
  (matching the design system's wave/state/lattice table exactly), and
  difficulty/progress are encoded consistently with each other (the
  contradiction is with Problems and the lesson page — see P0-3).
- **`.prose h3` genuinely stays in the body face** as documented — no
  `font-display` in the `prose-h3` chain, matching the explicit comment in
  both `LessonLayout.tsx` and `globals.css`.
- **Table overflow is handled.** Markdown tables are wrapped in
  `overflow-x-auto` by `src/mdx-components.tsx`; `.katex-display` gets its own
  horizontal scroll in `globals.css`.
- **Apex earns its brief.** `ApexHero` (a physics-preprint title block:
  running head, oversized display title, prerequisites/manuscript-metadata
  split) and `ApexCourseIndex` (a numbered §-index with dotted-leader module
  lists, explicitly not reusing the `CourseTimeline`/`CourseList` every other
  pillar shares) are structurally distinct from every sibling pillar page, not
  just re-tinted. It is not "black with purple accents" — chroma 0.045 is
  doing real work, and structure carries the weight the color deliberately
  doesn't. Its one real gap: unlike Mechanics/Computing/Hardware/Mastery, Apex
  has no bespoke computed diagram of its own — it earns seriousness entirely
  through typography, density and the `frontier` field, with nothing to point
  at and say "this is real data," which every sibling pillar page does at
  least once (related to P1-4's point about Software).

---

## Verdict

**It is a genuinely good site with a seam down the middle, and the seam is
between the chrome and the content.**

The system layer is the real thing. The pillar channel is a properly derived
OKLCH ramp driven by two numbers per pillar, not six hand-tuned palettes. The
background field draws actual physics — the wave packet spreads by the real
dispersion law, the Bloch probability bars agree with the vector drawn above
them — and that is a choice almost nobody bothers to make. The composition
primitives exist and Mechanics, Computing, Hardware, Mastery and Apex
genuinely use them differently from each other. Apex specifically clears the
hardest bar the brief set: the hero is built as a preprint title block,
`ApexCourseIndex` renders the pillar's real prerequisite topology instead of
a list, and the near-monochrome palette is backed by structure rather than
being purple-on-black. There is exactly one instance of glassmorphism in the
whole codebase, and it sits under the one component whose own source comment
explains why not to do that. There are no dead links in a site with hundreds
of them, which is not normal.

What it is not yet is *evenly* that. The redesign reached the frame
everywhere and the content unevenly. Two of twelve purpose-built narrative
components are used zero times across 219 lessons; two-thirds of lessons
never got a styled hook or a closing beat; visual relief thins out precisely
in Mastery and Apex, where long lessons need it most; the Software pillar
page has nothing running on it, breaking the escalation curve in the middle;
difficulty is drawn five different ways and two of them actively disagree;
and six routes still play the homepage's curriculum crossfade behind
content that has nothing to do with the curriculum, because nobody declared
a regime. These are not tasteful-disagreement items — they are the
difference between "every lesson was restructured" and "every lesson was
restyled, and some were restructured."

So: could someone become fascinated by quantum physics here? In the strongest
lessons — the ones that use `LessonHook`, place `DerivationSteps` and
`ResearchConnection` at the moments that earn them, and sit inside Mechanics,
Mastery or Apex — yes, genuinely, and that's a real bar cleared. But those are
a minority by the site's own numbers. The median lesson is still a
well-tokenized educational document wearing an excellent chassis: it opens on
a bare `## Motivation`, boxes most asides as `type="mistake"` regardless of
actual severity, drops a single-slider bar chart into an instrument mount
labeled "RUN EXPERIMENT" whether or not anything is being run, and ends with a
heading that should have been a forward hook and isn't. Right now this reads,
on balance, as **a well-tokenized educational website with several genuinely
fascinating rooms in it** — not yet the reverse. The fix is not more design.
It is finishing the job of spending the vocabulary that was already built,
evenly, across all six pillars instead of two.
