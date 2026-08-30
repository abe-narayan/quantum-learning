# Pre-launch audit, 2026-08-30

> **This is a findings log, not a guide.** Nothing in it binds. It records what
> was found on this date, against this tree, and whether it was resolved. Line
> numbers should be assumed stale. Where a rule came out of a finding here, the
> rule lives in a guide ([`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md),
> [`NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md),
> [`DEPLOYMENT.md`](DEPLOYMENT.md)) or in a test, and the guide is what to read.

A multi-agent sprint covering the whole site: recovery from an interrupted
session, then correctness, pedagogy, accessibility, mobile, performance and
voice, then an adversarial review wave over the work the sprint itself had
just produced.

---

## 1. Recovery: the interrupted session left a coherent tree

The previous sprint was interrupted mid-flight and the working tree carried
**1068 modified files (+54139/-15309), 39 untracked files and 2 deletions**,
none of it committed. The first job was to find out whether any of it was
half-finished.

It was not. Verified before any change was made:

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npx eslint` | clean |
| `npx vitest run` | 113 files, 1788 tests, all pass |
| `npm run build` | exit 0, 830 static pages |

Every untracked file was checked for a real importer, and every one was wired.
The two deletions (`problemPillarIndex.ts` and its test) were deliberate and
well-reasoned: that table cost 7.2KB gzip on all 823 routes to tint one badge.
Both stashes were left untouched. No `reset`, `checkout`, `restore`, `clean` or
`stash` was run at any point, and nothing was committed.

**One genuine loose end**, `ScrollableFigure.tsx`, turned out to be stale
information rather than dead code: 11 lesson files import it across 22 call
sites, and `scrollRegions.test.ts` already records the migration.

---

## 2. The defect classes that were actually costly

### 2.1 Derived-vs-typed counts, again

The homepage printed **"213 of the 219 lessons stop and ask you the same way"**
against a real 218. The source comment above it asked the next person to
re-grep when the corpus moved. The corpus moved; the sentence did not.

This is the same failure `CLAUDE.md` already records for the hand-typed problem
total. Fixed at the root rather than by bumping the number:
`scripts/generate-lesson-registry.mjs` now counts it on the pass that already
reads every lesson, and `predictionCount.test.ts` re-scans the corpus
independently of the generator's own matcher.

Also removed: a fresh in-prose restatement of the entry bar in
`CurriculumStrip.tsx` ("Foundational assumes school algebra") that had quietly
dropped the trigonometry clause. `ENTRY_BAR_MATH` now supplies it.

### 2.2 Contradictions between surfaces

The same fact lives in a lesson, a problem, a glossary entry and sometimes a
simulator. Each was audited inside its own scope by a different agent. Each was
internally correct. **Every existing test passes on a corpus where two of them
disagree.**

Confirmed instances:

- A problem asserted the 3-qubit bit-flip code is `[[3,1,3]]` while its own
  lesson said in bold that it is **distance 1 as a general quantum code**,
  because a single `Z` commutes with both stabilizers.
- A problem prompt said a surface-code vertex stabilizer "always touches
  exactly 4 qubits" after the lesson had been corrected to note that boundary
  stabilizers are smaller. Its own hint already said "interior vertex".
- `lattice-surgery.mdx` and `SurfaceCodePatchExplorer.tsx` carried **opposite
  smooth/rough boundary conventions**, each self-consistent.

### 2.3 Wrong physics that reads well

Found by recomputation, not by reading:

- **`lattice-surgery.mdx`: the logical CNOT did not produce a CNOT.** Step 4
  measured the ancilla in the X basis, which commutes with the `X_A X_T`
  already measured and so collapses the target. Simulated across all 8 outcome
  branches against 6 input states: **no Pauli correction reproduces CNOT.** A
  Z-basis measurement does, with a deterministic correction table. The same
  lesson's smooth/rough boundary labels were then found swapped, verified by
  explicit stabilizer construction on two d=3 patches.
- **A finite-well lesson undercounted its bound states**, concluding "exactly
  one even bound state" where the second even branch overlaps (√10 = 3.1623
  clears k = π = 3.1416). Three bound states, verified numerically.
- **Eastin-Knill was overstated twice**, as ruling out a transversal T on any
  code that still corrects errors. `[[15,1,3]]` has transversal T at distance 3.
- A worked answer claimed `X_0X_1` and `X_2` leave **identical post-measurement
  states**. They differ by exactly the logical X, which is the entire point of
  the question.
- A commutation rule stated as "two Paulis commute when they disagree on an
  even number of qubits". `Z_0` and `X_1X_2` disagree at three sites and
  commute.

### 2.4 Silently unrendered math

The math pipeline runs over MDX **text nodes**. A JSX string prop is not one,
and neither is `lessonMeta`. Math written there reaches the reader as literal
`^{...}` source, with no error, no type error and no failing test. **Sixteen in
the quantum-mechanics pillar alone**, several in figure captions sitting under
the equation they were restating. Now zero corpus-wide, and written up as
hazard 6 in [`NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md).

Separately, **62 authored feedback strings across 30 problems contained `$…$`
and were rendered as raw LaTeX to a student who had just answered wrong** —
the worst possible moment for it. Hints and solutions already prerendered their
math on the server; feedback had been missed. Fixed by the same route, which
keeps the 268KB KaTeX runtime out of all 556 problem pages.

### 2.5 Content clipped rather than overflowing

Four defects, all invisible to any check that watches
`documentElement.scrollWidth`:

- `/hardware` at 320px: a grid with `sm:grid-cols-2` and no base `grid-cols-1`
  gets an implicit `auto` column, which took the max-content width of a 320px
  SVG. The 354px track sat in a 288px container and the overhang was swallowed
  by `body { overflow-x: clip }`. The fix needed **both** an explicit
  `minmax(0,1fr)` base column and a `w-full min-w-0` wrapper; the first alone
  left the frame at `fit-content` so its own `overflow-x-auto` never engaged.
- `/map` at 320px: the zoom toolbar overflowed inside an `overflow: hidden`
  ancestor, leaving ~37px of "Reset view" permanently unreachable.
- `/hardware` again, this time on a **desktop**: the same five schematics sat
  in a `lg:grid-cols-5` grid inside `max-w-6xl`, giving 205px tracks for a
  figure needing 346px. Measured at both 1280 and 1512, **every one of the five
  was showing 203px of 352 and hiding 149px**, with the distinguishing labels
  cut off, on the page section whose entire job is comparing them. The frames
  did scroll, which is why no overflow check flagged it, but asking a reader to
  scroll five separate boxes to read one comparison is not a comparison. Now
  `sm:grid-cols-2 xl:grid-cols-3` with the frame padding at `p-3`, verified at
  0 clipped from 768px up.

- A fourth instance surfaced only after the audit route list was widened:
  `capstone-comparing-qubit-platforms.mdx` holds two grids of fixed-width SVG
  schematics and was still overflowing at 320px **after the identical bug had
  been fixed twice elsewhere**, because that route was not in the audited set.
  Fixed with a base `grid-cols-1` and `[&>div]:min-w-0`, and the route is now
  audited.

**Two general rules came out of these.** Content clipped by an
`overflow: hidden`/`clip` ancestor is unreachable, not safe. And a scroll
frame that scrolls is not automatically fine: if it is hiding most of a figure
at the width most readers use, the layout is wrong, not the frame.

### 2.6 Claims the page itself disproves

Three, all on the homepage or one click from it, and all of the same shape: a
sentence asserting something a reader can check in the next two seconds.

- **The hero simulator was frozen on every phone, under a caption saying it was
  live.** The autoplay run is 260 frames, about 4.3 seconds, and it starts on
  mount. `LazyWavefunctionHeroExplorer` mounts on an idle-after-paint timer
  whose own comment says "this widget is always above the fold (it's the
  homepage hero)". True at `lg`; false on a phone, where `SplitFigure`
  collapses and the panel sits about 1080px down. So the run played out and
  paused itself entirely off screen, and every mobile visitor met a motionless
  bump with a Play button directly above *"This is a real numerical
  simulation ... computed live in your browser"* and *"an actual FFT, not a
  canned animation."* The page's loudest claim, sitting under the one thing on
  it that looked like a canned image. Fixed by gating the **run** (not the
  mount) on an IntersectionObserver; verified at 375x812 as held at "Play"
  off screen and running on "Pause" once scrolled to.
- **"Problem of the Day" showed 19 problems a year, not 337.** The hash summed
  the character codes of `YYYY-MM-DD`, which is order-insensitive and barely
  moves within a year: 365 dates produced **19 distinct values**, so the card
  drew 19 problems roughly 30 times each and repeated within three days, under
  a footnote reading "A new pick every calendar day." The fixed sample also
  skewed hard, so the homepage greeted every first-time visitor with s-wave
  scattering cross sections. FNV-1a gives 241 distinct problems a year.
- **"What is actually behind a link on this page / Every one of them opens the
  same kind of page: a lesson"** sat beside a panel linking to `/learn`,
  `/mastery` and `/apex`. The one section whose job is being accurate about the
  site was the one a reader could falsify by clicking.

### 2.7 Two ways to lose a reader's work

No accounts, no backend: this origin's `localStorage` **is** the entire record
of a reader's progress.

- **An unbounded attempt log.** `recordAttempt` appended forever and stored the
  reader's raw submission at full length. Measured: pasting 100,000 characters
  and submitting twenty times grew the origin to **2.07MB**, about 40% of quota,
  from one problem in under a minute; **52 such submissions exhaust it.** After
  that every `setItem` throws, both progress stores correctly swallow the
  error rather than white-screening, and from that moment **lesson completions
  silently stop persisting**, with nothing on screen to say so. The read path
  had been hardened against corrupt JSON, wrong types and ghost slugs; nobody
  had bounded the write path. Now capped at 50 attempts and 500 stored
  characters, applied on read as well so an already-bloated record shrinks the
  first time it is touched. Re-measured: 2,069,548 to 11,548 characters.
- **One click on an empty field revealed the worked solution.** The
  try-first gate was `attempts.length > 0 || result !== null`, and an empty
  submission is still graded, so it set `result` and opened the gate. Both
  halves fixed: an empty submission is still answered helpfully but records no
  attempt and no longer counts as a try.

### 2.8 Getting it right was worse than getting it wrong

A wrong answer got specific coaching (*"0.96 is |β|, the amplitude's magnitude.
The Born rule squares it."*) and a NEXT STEP block with three onward links. A
right answer got the word **Correct** twice, once as the heading and once as
the message, and the NEXT STEP block **disappeared**, because it was gated on
`status !== "correct"`. Strictly fewer affordances, and less to read, for the
reader who did the algebra.

The fix cost no authoring, which is the interesting part: **all 556 problems
already carry `explanation.correctIdea`**, written as a plain statement of the
idea rather than praise, which is exactly the register this site's
zero-celebration rule requires. A correct submission is now answered with it,
plus a runtime line giving the exact value when the reader landed inside the
tolerance rather than on it, plus a link to the next problem in the lesson's
own practice order. Grading logic was not touched; the promotion happens after
the verdict.

### 2.9 The background was breaking AA almost everywhere

The circuit/physics canvas behind every page is one of this site's best ideas
and it was, measured rather than inferred, **taking a text voice below AA on
seven of its eight regimes, and body text below it on three.** The `graph`
regime reached **2.40:1** against `--foreground` on `/software`.

Two independent reasons, and the second is the instructive one:

- `REGIME_ALPHA_CEILING` bounds **a single mark**. A frame composites many, and
  `1 - (1-a)(1-b)` put real pixels at 0.72 to 0.82 against a 0.55 ceiling.
- The ceiling had been reasoned against `--foreground` only. But `Lede` is
  `--muted-foreground` at 20px, and captions, units and code are
  `--subtle-foreground` at 12px, both on the bare ground. The rule was checked
  against the loudest voice and applied to the quietest.

Nothing could have caught this from source. `compositedContrast.test.ts` is
correct about what it models, the CSS atmosphere, and its contribution at the
failing points was measured at nil; it simply cannot see a canvas, which has
no closed form. The fix is a measured per-regime composite ceiling plus a
per-theme `--field-strength` (light mode needs it most: light
`--subtle-foreground` starts at 4.98:1 before anything is painted), and
`scripts/audit/field.mjs` now reads the canvas's own backing store over 70
frames and 3 scroll positions per regime and fails while any regime/voice pair
is under AA. All eight regimes now peak in a narrow band instead of across an
18x spread.

**One trade in that fix is worth stating plainly, because it costs something.**
In dark mode the field survives intact: measured on `/software`, 1.7% of pixels
painted at a peak alpha of 34/255, and the circuit rails and gate marks read
clearly. In light mode `--field-strength` is 0.3, which brings it to 1.45% at a
peak alpha of **11/255**, and at that level the texture is very nearly
invisible. Light mode has lost most of its atmosphere.

That was forced, not chosen carelessly. Light `--subtle-foreground` starts at
4.98:1 on `--depth-0`, so it has under half a point of headroom before anything
is painted behind it, and darkening that token collides with
`--muted-foreground`, which `contrast.test.ts` holds apart on purpose. Given
the brief's own ordering, that legibility beats atmosphere and that dark is the
primary experience, 0.3 is the right call today. But it is a real loss of
identity on the light theme, and the honest fix is upstream: either give light
`--subtle-foreground` genuine headroom, or stop setting 12px subtle text over
the field at all. Worth revisiting rather than accepting as settled.

### 2.10 Dead ends

15 of 32 course pages offered no forward step a reader could actually take. 24
forward edges in the prerequisite graph point at a course needing a second
prerequisite the reader was never sent to. `LessonLayout` had the same defect
independently. Both now annotate the gap ("Also needs X and Y") and fall back
to a derived "open to you next" panel, from one shared closure helper
(`src/components/curriculum/prerequisiteClosure.ts`) rather than three copies.

---

## 3. The largest pedagogical gap, closed

**140 of 218 lessons with a `## Practice Questions` section had no worked
answers.** The gap was not random: it fell at the end of five Mechanics
courses, across almost all of Mastery and Apex, and across one whole Computing
course. A reader got rich worked answers for two thirds of a pillar, then
nothing exactly where the material got hardest.

On a site with no instructor, no office hours and no answer key anywhere else,
an unanswered practice question is a dead end.

**Now 218 of 218, with 814 answer reveals.** The lesson corpus grew from 3.59MB
to 5.49MB of MDX in the process, which is itself a build-memory input (§5).

Roughly 670 of those answers were written during this sprint by four agents
working in parallel, then put through an independent adversarial review that
recomputed them rather than reading them. Review yield so far: **6 defects in
96 mechanics answers, 4 in 32 error-correction answers**, plus lesson-body
errors found while checking them.

---

## 4. New capability: audits against a rendered page

Whole classes of defect here are assertions about a **rendered page at a given
viewport**: does this overflow at 320px, is that tap target reachable, did the
console throw during hydration, what is the accessible name of this formula.
jsdom does not lay out, so vitest cannot see any of it, and the site correctly
sets `X-Frame-Options: DENY`, which closes the narrow-iframe trick too.

`scripts/audit/` now holds a dependency-free Chrome DevTools Protocol client
(`cdp.mjs`) and four harnesses built on it: `responsive.mjs` (overflow, tap
targets, text size, console errors, composited contrast), `a11y.mjs` (Chrome's
computed accessibility tree and real dispatched key events), `field.mjs`
(measured background loudness), and `build-memory.mjs` (§5). No new dependency:
Chrome is already installed and Node 22+ ships a global `WebSocket`.

**Seven bugs were found in these harnesses before they were trusted.** The
first four are the same mistake, substituting a proxy for what the browser
actually does.

1. Parsing `getComputedStyle().backgroundColor` with an `rgba()` regex silently
   fails on a design system authored in **oklch**, and reported the site's own
   accent buttons at 1.07:1.
2. Recovering a translucent colour from one painted pixel by dividing by alpha
   double-unpremultiplies, because `getImageData` already returns
   unpremultiplied RGBA. It turned a `bg-brand/5` eyebrow into a 1.09:1
   failure.
3. The tap-target check measured the anchor's own box, but this codebase
   deliberately keeps anchors small and stretches the hit area with
   `after:absolute after:inset-0`, so the accessible name stays short.
4. A buried-target check tested `position` on the link itself when the lift
   comes from an ancestor's stacking context.

Colours are now resolved by compositing the ancestor stack on a canvas, and the
lesson is recorded here because **a checker that cries wolf is worse than
none**: the tempting response to a false blocker is to relax the threshold,
which hides the real one.

Three more turned up in the same family, and the last two are the instructive
ones.

**Fifth: a listener leak.** `goto()` removed its `Page.loadEventFired` listener
on the load path but not on the 45-second timeout path, so every slow
navigation leaked a listener that then parsed every subsequent frame on that
socket. Self-amplifying, and it meant a route that never fired `load` was
measured anyway and reported clean.

**Sixth: the harness was measuring loading skeletons.** In dev a streamed RSC
response fires `load` while `loading.tsx` is still on screen, so `/simulators`,
`/glossary` and `/map` were audited as their skeletons. That surfaced as three
false `h1-count: 0 visible h1` blockers, on three routes that each serve
exactly one `<h1>`. **The false blocker was the smaller half of the problem**:
every other check on those routes also ran against a skeleton, which is a
handful of empty boxes with no overflow, no contrast failures and no console
errors, so it reported clean on everything else. `goto` now waits for the
`role="status"` "Loading…" line every skeleton carries, and reports a route
that never leaves it as `unmeasured-skeleton` rather than measuring it.

**Seventh, found while fixing the sixth: `\b` inside a JavaScript template
literal is the BACKSPACE character, not a regex word boundary.** The readiness
probe was written as `/^loading\b/i`, which the page received as
`/^loading` followed by a literal U+0008. It matched nothing, so the new
gate reported every route as ready and would have shipped looking like it worked. This is the hazard
`CLAUDE.md` already records for shell heredocs, reached by a different route,
and it fails exactly as quietly. Caught only because the gate was
negative-tested against a deliberately injected skeleton rather than assumed
to work.

That is the mirror lesson, and the worse one. A checker that cries wolf gets
argued with; **a checker that quietly measures the wrong thing gets believed.**
Every one of these seven was found by testing the checker, not by reading it.

`routeInventory.test.ts` exists for a related reason. A route in the audit list
that 404s makes the harness measure the **not-found page**, which is short,
centred, single-column, and has no overflow or contrast failures at any width.
A typo silently converts a real audit into a clean bill of health.
`/problems/bell-state-measurement-correlations` was in that list and had never
existed.

---

## 5. Measurements

| Quantity | Value |
| --- | --- |
| Lessons / problems / courses / simulators | 219 / 556 / 32 / 14 |
| Sitemap entries | 822 |
| Static pages built | 830 / 830, build exit 0, 16.8s compile |
| Cold build peak memory | **4546MB and 4408MB** on two quiet-machine runs (budget 5000, container 8192) |
| Lessons with worked practice answers | **218 / 218** (was 140) |
| Answer reveals | 814, median 285 words, min 84, max 569 |
| Lesson MDX source | 5.50MB (was 3.59MB at HEAD) |
| Search index | 538.1KB of a 560KB cap |
| Em dashes in reader-facing prose | 0 |
| Test suite | **131 files / 2014 tests**, all passing (was 113 / 1788) |

**On the corpus growth, and what it cost**: MDX source size is the direct
input to the compile graph that caused the 2026-08 Vercel OOM. A 53% increase
in a single sprint is exactly the kind of drift no existing guard would have
mentioned, which is why `scripts/audit/build-memory.mjs` now exists. **It was
worth building: the peak did move.** Two quiet-machine cold runs measured
4546MB and 4408MB, against a documented band of 2544-3451MB. Still inside the
8GB container and inside the 5000MB budget, but the headroom is now about 43%
rather than the ~62% the older figures imply, and the docs said nothing about
it until it was measured.

A trap in that measurement is worth more than the number. A third run the same
day reported **3016MB**, and it was the least trustworthy of the three despite
looking the healthiest: its wall clock was 202.7s against 109-114s, because
eight other node processes and 28 Chrome processes were competing for the
machine. **Contention lowers the reported peak**, by serialising work that
would otherwise run across Next's seven static-generation workers. Vercel's
builder is not contended, so the quiet-machine number is the one that predicts
production, and a comfortable reading taken on a busy laptop is precisely the
one to distrust. See
[`DEPLOYMENT.md`](DEPLOYMENT.md) for how to read its number and why it samples
the build's own process tree rather than every `node.exe` on the machine.

**Responsive, on rendered pages.** `responsive.mjs` over 16 routes covering
every page template at 320, 375, 390, 768 and 1280: **0 blockers** (no
horizontal overflow, no console errors, no text failing WCAG contrast against
its actually-painted background). The remaining output is tap-target and
type-size warnings, each of which needed a judgment call rather than a fix, and
those are recorded in the harness itself.

**Accessibility, on rendered pages.** `a11y.mjs` over the full default route
set, using Chrome's computed accessibility tree and real dispatched key events:
**0 blockers, exit 0.** What remains is 3 `INFO` (decorative overflow at 200%
text, each confirmed to have no readable content outside the clip) and 4
focus-order warnings, each checked and benign (two-column `SplitFigure`
layouts, and a sticky filter bar that is visually pinned but behind in document
order).

**Reduced motion, verified on a rendered page rather than from source.** With
`prefers-reduced-motion: reduce` emulated, the homepage renders no Play control
at all, shows a "Reduced motion: showing the settled frame" badge, and the
canvas is byte-identical across a 2.5-second gap: the animation is *stopped*,
not slowed, and the settled state is computed directly rather than by running
the loop faster. Without the preference, the same panel reads "Pause", changes
between samples, and settles to "Replay" when its run completes.

**Corrections spot-checked independently.** The adversarial reviewers'
arithmetic was re-derived rather than taken on report. All confirmed exactly:
the Carnot correction at 15 mK (COP = 5.000e-5, so 1 uW costs **20 mW**, not
the "tens of watts" the lesson had); the T1/T2/T_phi relation and its
consequences (T1 = 80us with T2 = 30us gives T_phi = 36.92us, doubling T1 gives
T2 = 33.10us for +10.3%, and the ceiling as T1 grows without bound is +23%);
the threshold recursion at r = 0.75 (17.1x weaker suppression than r = 0.5 at
seven levels, and a 49x hardware penalty to compensate); and the distillation
closed form `eps_r = C^((3^r - 1)/2) eps_0^(3^r)`, whose recursion
`a_r = 3a_{r-1} + 1` does solve to `(3^r - 1)/2`.

**Voice, measured rather than asserted.** Across 238,651 words of worked
answers: `"not X, but Y"` appears 7 times (0.03 per 1k words), and there are
zero instances of "delve", "let us dive", "in conclusion" or "great question".
`"exactly"` appears 742 times (3.11 per 1k), of which about half are
quantitative ("exactly one", "exactly zero"). Density is uniform across all six
pillars (0.54 to 1.03 per 1k for the non-quantitative forms), so it is ordinary
technical prose rather than one writer's tic, and it was left alone. A
mass rewrite of 142 instances of "exactly the" would have been churn.

---

## 6. Open, and needing the owner

- **Light mode's background field is now nearly invisible** (peak alpha 11/255
  against dark mode's 34), because light `--subtle-foreground` has under half a
  point of contrast headroom. The dimming was forced and is correct as a
  priority call, but the real fix is upstream and is a design decision: give
  that token headroom, or stop setting 12px subtle text over the field. See
  §2.9.
- **`/about` does not say who made the site, and offers no way to report an
  error.** On a page whose job is helping a reader decide whether to trust the
  curriculum, that is a real hole. It was left empty deliberately: every
  sentence that could fill it would be invented, and a trust page is the worst
  possible place to guess.
- ~~`CITATION_AUDIT.md`'s coverage is stale.~~ **Resolved 2026-08-30.**
  Re-run over all **51** `<ResearchConnection>`, **19** `<HistoricalMoment>`
  and **141** figure credits, with 8 corrections: a misattributed Forrelation
  priority (the problem is Aaronson 2010, not Aaronson & Ambainis 2015, and
  that block is itself a case study in how relativized evidence accumulates in
  stages, so collapsing two stages was the worst place for it), an LCU setting
  described as Taylor/Chebyshev series when the paper's is multi-product
  formulas, a `2^{0.47t}` runtime that appears nowhere in the cited PRL,
  reversed Wootters/Zurek author order, two independent results described as a
  collaboration, six LANL figure licenses declared four different ways when
  `{{PD-LosAlamos}}` is attribution rather than public domain, and a portrait
  credited to a university when Commons has it as the photographer's own work.
  Method for the next re-run is written up in that log.
- ~~`surface-codes-a-conceptual-introduction.mdx` mixes two lattice
  conventions.~~ **Resolved 2026-08-30.** The lesson drew the unrotated code
  (qubits on edges, separate vertex and face stabilizers) and then quoted the
  rotated code's `d²` count, and its own figure showed a third number again:
  twelve edge qubits, against prose saying nine and a real distance-3 patch
  needing thirteen.

  Worth recording that the obvious fix was the wrong one. Converting to the
  rotated layout looks right, because the resource-estimation lessons use
  `d²`. But `surface-codes-in-depth.mdx` adopts the unrotated convention
  *explicitly because of this lesson*, so that "vertex = Z, face = X" carries
  over unchanged, and both attached problems are edge-based. The corpus is
  deliberately split: unrotated is the pedagogical spine, rotated is used only
  where it is named. Correcting the counts to `2d² − 2d + 1` (13 at d=3, 1741
  at d=30) desynchronised nothing; converting the layout would have falsified
  a load-bearing cross-reference and both problems. The figure needed
  labelling, not restructuring.
