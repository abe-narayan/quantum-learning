# Discoverability and orientation sprint

**2026-08-30.** A dated log, not a binding document. The rules it describes
live in `CLAUDE.md` and in the tests named below; this file records what was
wrong, what was measured, and what was decided, so the next person does not
re-derive it.

Baseline at the start: `f4f6203`, a clean technical state. TypeScript, ESLint
and 2017 tests green, a production build of 830 pages, and both the responsive
and accessibility harnesses at zero blockers.

None of that was the problem.

## 1. The problem, stated as a measurement

The site was technically excellent and a first-time visitor could not tell what
to click. That is an easy thing to assert and a hard thing to act on, so it was
turned into a number first.

At 375x812, **the homepage's first screen contained zero links or buttons
inside `<main>`**: three dense paragraphs and nothing to act on. At 1440x900 it
contained five, and all five were the hero simulation's own preset switches.
"Start learning" appeared nowhere in the first screen at either width except as
a small button in the navbar.

No existing harness could see this, because nothing was broken. Every check in
`scripts/audit/` answers a question about correctness: does this overflow, does
this control have a name, does this text clear AA. A page can pass all of them
and still strand the reader.

## 2. `scripts/audit/orientation.mjs`

So orientation got a harness of its own. Per route per width, at scroll 0, it
reports:

- **Forward actions in the first screen.** Links, buttons and form controls
  inside `<main>` whose box intersects the viewport, **excluding breadcrumbs**.
  A first screen whose only actions are three breadcrumbs pointing back the way
  you came is not oriented, and the raw count alone would call it fine.
- **Where the first substantial prose sits**, and whether it is above the fold.
- **Page height.**

It is not a pass/fail gate. There is no universally correct number of
first-screen actions, and a threshold would be satisfied by padding rather than
by orienting anyone. `--require-forward` is the one exception: a route with no
forward action at all has no defensible reading.

### What the harness got wrong four times before it could be trusted

`docs/README.md` records four bugs previously found in these harnesses, all the
same mistake: substituting a proxy for what the browser actually does. This one
made it four more times. Every one of the four produced a result that looked
entirely reasonable, and every one was caught only because that result was
checked against something else: a second measurement, a status code, or another
agent reporting a number that disagreed. None of them would have been found by
reading the harness.

**Counting only `<a>` and `<button>`** reported `/glossary`, whose primary
control is a filter field, as nearly stranded. Form controls are actions.

**A crashed page measures beautifully.** While this file's harness was being
written, a parallel edit put the dev server into a compile error for about a
minute. `/glossary` and `/about` both measured as ordinary pages with two
sensible forward actions above the fold. They were the global error boundary's
buttons ("Try again", "Back to home", h1 "The instrument itself failed").
Nothing in the shape of the result said so, and the reading was nearly
believed. The harness now fetches the status code separately from the
navigation and refuses to report a 5xx as a measurement at all; under
`--require-forward` an unmeasurable route fails the run, because a check that
cannot see the page must never be the reason a run goes green.

**Closed disclosures.** Three templates moved to closed `<details>` on the same
day (the lesson header's objectives, the course card's module manifest, the
problem page's context summary), and headless Chrome gives content inside one a
box of **1x1** that is `display: block` and `visibility: visible`, with
`elementFromPoint` at its centre returning an ancestor. Non-zero, so every
width and height guard in `responsive.mjs` passed it through. The guard added
for it is deliberately **not** applied uniformly:

- **Tap targets and contrast skip it.** A reader cannot tap or read what is
  folded away, and a real control measured as a 1x1 target is a blocker nobody
  can act on.
- **Overflow does not skip it**, because overflow is a property of the layout
  rather than of the current disclosure state. Adding the guard there
  immediately dropped a real finding: `optimalGroverIterations(6)` on the Grover
  lesson measures 265px wide reaching x=335 in a 320px viewport, inside a closed
  fold. Suppressing it would have reported the page clean while the reader who
  opens that fold loses the right-hand end of the code, with no scrollbar to say
  so.

**Prose detection was wrong three times before it was right.** `orientation.mjs`
reports where the first substantial prose sits. Looking only at `<p>` was wrong
on the template it mattered most on, because a problem statement renders through
`ScrollableMathText`, which emits no `<p>`; that produced a confident "the
statement is at y=840, below the fold" for a statement whose box began at 557.
Taking any element with long `textContent` was worse: every ancestor up to
`<main>` qualifies, so a container of thirty short links matched and reported
`/learn` as having no visible prose at all. Summing only an element's own direct
text nodes fixed that and then matched screen-reader-only copy, which is long,
real prose sitting in a clipped 1x1 box at y=0. The working version needs all
three conditions: own direct text, a real box, and not hidden. **The number is
"where does continuous reading start", not "where does the main content
start"**, and those differ on any template whose primary content is not prose.

### Two bugs in `a11y.mjs` that named the wrong culprit 32 times

The final sweep reported 32 `clipped-at-200pct-text` blockers. All but one were
real content loss, and nearly every one **named the wrong element as the
cause**, which is almost as expensive as a false positive because it sends the
fix to the wrong file. Two bugs in `CLIP_PROBE`, both found by an agent that
diagnosed in the browser instead of trusting the label:

**The TreeWalker escaped the subtree it was measuring.** On skipping a
deliberately-clipped subtree it climbed `up = up.parentNode` while `up !== root`
and took `up.nextSibling`, which at the top of the climb is **root's own next
sibling**, a node outside the element under test. The walker carried on through
unrelated DOM from there, which is how a course card was reported as clipping
the footer's "StudyQuantum. All rights reserved." It then resumed with
`walker.currentNode = next; walker.nextNode()`, which returns the node *after*
`next` and so never tested `next` itself, letting a second skippable subtree
straight into the measurement. One finding, `/courses/quantum-gates-and-circuits`
losing 242px of "Your progress:", was a **pure false positive** produced this
way: the text was entirely `sr-only`.

**Nested scroll regions were measured against the wrong box.** Text inside a
legitimately scrollable descendant, a `.katex-display` with its own
`overflow-x: auto` and a keyboard tab stop, had its true unclamped page position
compared to the *outer* element's edge. That reported hundreds of pixels of a
"⟩" outside an ancestor panel, which was not real, and because it was the
largest number it became `worst` and hid the genuinely clipped text beside it.
A descendant that clips or scrolls on its own account shows only what fits in
its own box, so that box is what has to fit inside the parent; the probe now
measures it and stops descending.

Both fixes were proved non-vacuous the same way everything else here was: a
clipping rule was injected deliberately (`main h1 { max-width: 40px; overflow:
hidden }`) and the probe caught 433px of "About StudyQuantum" outside a 40px
box, before the rule was reverted.

### A cached 500 is not a slow page, and restarting does not clear it

Late in the sprint every route began returning HTTP 500. The instinct was that
someone had broken `globals.css`, since the error named it, and two agents held
write access to that file at the time. That was wrong twice over.

The file was fine: its braces balance at depth 0 across 1941 lines. And the
underlying error was a **timeout**, not a parse failure. Turbopack's PostCSS
loader runs in a subprocess, and under machine saturation it reported "timeout
while receiving message from process" and "deadline has elapsed".

The diagnostic that settles it is the response time. The failure returned in
about **25 milliseconds on every route**, which is far too fast to be a compile
attempt: Turbopack had cached the failed module and was replaying it. So
restarting `next dev` changed nothing, because the cache outlives the process.
Deleting `.next` and starting again fixed it immediately, and a cold homepage
then compiled in 7.2s.

Worth recording alongside it: the obvious culprit for the saturation was leaked
headless browsers from the audit harnesses, and it was checked rather than
assumed. All 36 `chrome.exe` processes were the user's own browser, with **none**
carrying `--headless` or the harnesses' `sq-audit` profile. Killing them would
have destroyed a real browsing session and reclaimed nothing.

### A hazard in `cdp.mjs` that affected all five harnesses

`launchChrome` decided Chrome was ready by polling `/json/version` until it
answered. An **already running** Chrome answers instantly. So when the port was
taken, the spawned Chrome failed to bind and exited, the poll succeeded against
the other browser, and every subsequent command drove somebody else's tabs. Two
audits running at once did not collide loudly; they interleaved and reported
plausible nonsense.

Each harness picks a different default port, which is enough right up until two
copies of the *same* harness run at once, which is routine when several agents
work in parallel. `launchChrome` now probes for a free port before spawning and
refuses to attach to a browser it did not spawn, closing the spawn race by
watching its own child's `exit`.

## 3. What changed

### The homepage, rebuilt as an orientation system

`Hero → EntryChooser → PredictSection → HowItWorks → SiteContents → three acts`.

The `h1` is now the question the subject exists to answer, "Why has the electron
not fallen into the nucleus?", rather than a description of the site. **Free**
is stated in the first screen, in display type, with what it covers and what it
does not cost. `EntryChooser` offers four self-descriptions, each linking
straight to a destination, with no modal, no wizard and no stored state.
`SiteContents` replaced `ExploreSection` and lists ten destinations as
whole-row-clickable rows; coverage went from five to ten, and `/lessons`,
`/mastery`, `/apex` and `/about` had previously appeared nowhere on the page
outside running prose. Every *count badge* on it is computed from a live
registry (`COURSES.length`, `getAllLessonsMeta()`, `SIMULATOR_COUNT`,
`GLOSSARY_TERMS.length`, `getCoursesByPillar(...)`).

That was first written here as "every figure on it is derived from a registry",
which a reviewer checked and falsified. It was not true of prose: `/apex` and
its hero both said "five courses", and `/mastery` and the homepage's own index
row both said "Five self-contained structures", all four hand-typed and none
pinned. All four were correct, which is exactly the state "Fourteen simulators"
was in before it got a test. They are pinned now, and the claim above is
narrowed to what is actually true.

Measured after, at status 200:

| | before | after |
| --- | --- | --- |
| First-screen actions, 375x812 | **0** | **2**, "Start learning" and "Browse the curriculum" |
| First-screen actions, 1440x900 | 5, all simulator controls | 7, primary CTA first |
| Height, 375 / 1440 | 19597 / 14004 | 19355 / 13917 |

### The six track pages had the same defect, worse

`/mechanics`, `/computing`, `/hardware`, `/software`, `/mastery`, `/apex` are
the six destinations the homepage's curriculum strip points at, and they were in
no agent's scope until they were measured. **Four of the six had zero forward
actions in the first screen at 375px**, and on the other two the only action was
a sideways tier-ladder link rather than the page's own call to action.

The cause was the same on every page: the primary "Start: *course*" button was
rendered *after* the tier ladder and the briefing block, which together run
150-290px tall on a phone and pushed it past the fold. On `/apex` the "Begin at"
label was visible while the button itself sat at y=910. The fix was reordering
alone; no shared component was touched. All six now present exactly one
deliberate primary action.

### The homepage tunneling simulation stopped before anything tunnelled

The hero ran every preset to a flat 260 frames. On the tunneling preset the
packet was still inside the wall at that point: mean position -2.71, 11.4% of
the probability inside the barrier, transmission not yet settled. The
simulation that existed to show tunneling stopped before the tunneling.

Running longer was the wrong fix, because the box is periodic and the packet
wraps past roughly frame 650, at which point the reported transmission is an
artefact. Instead the packet now starts at x = -10 rather than -20 and the
preset carries its own budget of 300 frames. Starting closer is free: the
transmitted fraction is fixed by |φ(k)|², which free evolution leaves
invariant.

Independently reproduced against the same engine, driving it directly rather
than through the fix's own test:

```
frame     inside barrier      left        right (transmitted)   edge
   60           1.374%      99.92%              0.075%        4.7e-12
  120          20.095%      96.74%              3.256%        1.6e-10
  180           1.428%      97.28%              2.718%         1.7e-9
  300           0.001%      97.29%              2.708%         6.0e-8
  420           0.000%      97.29%              2.708%         5.1e-7
```

The run now reads as arrival, collision peaking at frame 120, and a settled
two-lobe split from 200. Both autoplaying components also stop the instant the
packet wraps, so a slider pushed to high momentum cannot produce a false
number. The transmitted lobe's peak is 3.1% of the reflected peak, about three
CSS pixels, so it is drawn a second time at 10x, dashed and keyed.

### The beginner entry door made a claim that was false

`/courses/qubits-and-quantum-states` is where the homepage sends "I have never
studied quantum physics". Above its module list it said:

> "No prerequisites" is not the same as "no background." **From the first lesson
> on**, you will be reading and writing in this vocabulary: TRIGONOMETRY ·
> COMPLEX NUMBERS · VECTORS AND MATRICES · PROBABILITY · READING AND WRITING
> PROOFS

`technicalRegister()` builds those chips by reading the title, description and
objectives of **every lesson in the course** and joining them, so they describe
the course as a whole. The sentence made it a claim about lesson 1. Four of the
five were false there: `what-is-a-qubit` says in as many words that "every
calculation in this lesson works if you treat alpha and beta as ordinary
numbers" and that the complex case is built from scratch in the *next* lesson,
and its objectives never mention proofs.

It survived because it happens to be true on the site's other zero-prerequisite
course, `/courses/mathematical-foundations`, which really is a mathematics
course from its first page. This is the failure `CLAUDE.md` records for the
entry bar, six wordings of one claim with two of them false, reached again by a
sentence that is not built from `entryBar.ts` and so is not covered by
`entryBar.test.ts`. The wording now says what the data supports: "By the end of
this course".

### The navbar was permanently over its width budget

Not occasionally tight. The container caps at 1152px, padding leaves 1088, and
brand plus nav plus CTA came to 145 + 608 + 303 with two 16px gaps, which is
exactly 1088, with "Current Quantum" (98x56) and the "Start learning" CTA
(108x54) both already wrapping at **every** desktop width from 1024 to 1600.
Eight top-level slots became six: **Learn · Tracks · Simulators · Problems ·
Reference · About**, with Glossary, Concept map and Current Quantum moving into
a Reference dropdown where they each show their description, which is strictly
more than the flat bar gave them. `TracksDropdown` was generalised into
`NavDropdown` rather than copied, so its accessibility behaviour has one home.

Two related findings on the same pass, both measured: `/glossary`'s filter field
sat at **y=4251** on an 812px screen, because fifteen full-size "start here"
cards ran ahead of it, and a `sticky` element does not exist until its own
position scrolls into view. On a page whose commonest visit is looking up one
word. And ten rows in the concept-map list view had accessible names of 123 to
200 characters, read out in full on every focus, 59 rows deep.

### Both corpora, humanized

The lesson corpus (219 lessons, roughly 531,000 words of prose once math and
code are stripped) and the problem corpus (556 problems, 240,870 words) were
each read for filler. The lesson pass changed 97 files by 211 lines with no
lines added or removed, taking `precisely` from 0.49 to 0.35 per thousand
words. The problem pass changed 32 files by 33 lines.

Both passes were deliberately conservative, and the reason is worth recording:
**the highest-density files were dense because exactness was their subject.**
Phase estimation, period finding, Lindblad and Grover amplification all argue
"exactly, not approximately" as their central claim, and the single worst file
by the metric is named `why-exact-vs-approximate-convergence`. Two files were
read instance by instance and changed in no way at all. `actually` was likewise
left almost entirely alone in the problems, where "say what X actually does" is
the corpus's Socratic hint idiom rather than padding. A large diff is a cost,
not an achievement.

The real defect in the lessons was not on the list: 27 instances of words in
all caps used as emphasis.

### Lesson descriptions were the dominant chrome above the teaching

A lesson's `description` renders as the `Lede` directly under the h1, and it is
also the page's `<meta name="description">`. The lesson-layout work got the
entry lesson's first teaching sentence from y=905 to y=692 at 375px and then hit
a wall: on an Apex lesson a 400-character description renders **488px tall at
375px, 60% of the viewport**, and no rearrangement recovers a block that size.
`DESIGN_SYSTEM.md` pins `Lede` at 20px with reasoning, so the type size was not
the lever. The text was.

Measured across the 219 descriptions, before and after:

| | median | p75 | p90 | p95 | max | >300 | >350 | >400 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| before | 250 | 303 | 354 | 400 | 539 | 56 | 24 | 11 |
| after | 248 | 286 | 315 | 326 | **347** | 34 | **0** | **0** |

59 files edited. The search index fell from 538.1KB to 535.4KB against its
560KB ceiling. Note that **199 of 219 descriptions still exceed roughly 160
characters**, the point where a search result truncates, so the tail that serves
search rather than the reader is smaller but not gone.

### The prose diff was read by eye, because tests cannot catch this

Three passes edited **157 content files, 299 insertions and 299 deletions**, and
every one of those files compiles, renders, and passes every test. That is
exactly the condition `CLAUDE.md` names for its most expensive defect class:
"Every file compiles, every file renders, every test passes." So the whole diff
was read hunk by hunk against the physics rather than signed off on green
checks.

The balance of 299 against 299 is itself the first check: every edit was meant
to be an in-place substitution or a deletion within a line, so any added or
removed line would have been a departure from the brief.

One hunk in 2101 lines was not mechanical. In
`the-quantum-period-finding-circuit.mdx`, "verified exactly for the a=7, N=15
case" became "verified to six decimals". Line 189 of the same file
independently says the check is "approximately, to six decimal places", so the
edit removed a real overclaim: a floating-point verification is not exact. It
is a correction rather than a regression, and it is recorded here because it is
the only place in the diff where meaning moved at all.

The caps-to-italics conversion was the other thing worth checking, because
markdown emphasis does not render inside a JSX string prop or in `lessonMeta`,
where it would reach the reader as a literal `*word*`. In prose it became
italics; in JSX props, inline JSX text and TypeScript string literals the word
was simply lowercased with no asterisks added. Zero asterisks landed in those
positions.

### Clipping at 200% text zoom turned out to be a class, not an incident

WCAG 1.4.4 asks that text resize to 200% without loss of content. Several
components lost it, all the same way: a fixed box with `overflow: hidden`, and
Tailwind's rem-based padding doubling along with the text so the usable width
halves. `ExternalFigure` (which backs 130 lesson figures), `TheoremBox`,
`DefinitionBox`, `CurrentQuantumCard` and the `Instrument` panel itself were all
found this way.

The fix that works is **`[overflow-wrap:anywhere]`, not `break-words`**, and the
reason is worth keeping: only `anywhere` counts toward min-content, and
min-content is what a flex item's `min-width: auto` resolves to, so
`break-words` leaves the box exactly as wide and changes nothing.

Two truncations in the lesson header needed a judgement rather than a rule,
and they resolved in opposite directions:

- The mobile contents trigger shows either the current section's title or a
  fallback "N sections". Clipping the **title** costs nothing, because the same
  words are a heading in the page below and a row in the panel the button
  opens. Clipping the **count** loses the only copy, and at 200% it did: 131px
  of content in a 39px box. So the title still truncates and the count no
  longer does.
- The instrument row's module name is the "you are here" rung that the
  component's own comment says is named nowhere else above the fold, so there
  is no second copy anywhere. It was clipping constantly rather than rarely:
  module titles in `curriculum.ts` reach 58 characters and 54 exceed 40,
  against roughly 150px of room beside "Module 07 / 9" at 375px, which is about
  25 characters at `text-xs`. A rung that is present but unreadable takes the
  space and delivers nothing. It now clamps to two lines, which bounds the
  height growth the original `truncate` was protecting against.

### A figure caption cannot be readable inside a fixed viewBox

`/hardware` rendered an 11px caption, below the 12px floor. The component's own
comment explained why, and it was not carelessness: it carried real Chrome
measurements over all 17 labels showing that 11px put the widest at 316.8 of
320 available units and 12px put it at 345.6, i.e. 12.8 units outside the
viewBox, clipped with no scrollbar. The author had picked the larger of the two
sizes that fit.

The constraint nobody had questioned was that the caption had to be inside the
SVG at all. A caption describing the figure as a whole is prose about the
drawing, not part of it, and the wavefunction hero had already proved the
alternative in this same sprint by moving its legend to plain HTML at a real
12px, which also puts it in the accessibility tree. Three whole-figure captions
came out, all of which sat dead centre at the viewBox midpoint; the positional
labels that annotate a specific part ("RF electrode", "chip substrate") stayed,
because moving those would destroy the figure.

With the widest string gone, every remaining label clears 12px, re-measured in
a real browser with `getBBox()` rather than estimated. The same sweep found
three more figures whose text fell below the floor once viewBox scaling was
accounted for: the effective size is `fontSize x renderedWidth / viewBoxWidth`,
and a 460-unit viewBox in a 254px phone column turns 17 units into 9.4px.

### A measuring regex that was wrong by a factor of forty

The sweep for over-wide inline formulas was scoped with
`grep -rohE '\$[^$\n]{40,}\$'`, which returned 47 spans and looked entirely
plausible. It is wrong. In POSIX ERE a bracket expression has no escape
sequences, so `[^$\n]` excludes a literal backslash and the letter **n**, which
between them appear in almost every real LaTeX span. The true figure is **2048
spans across 199 files**, and the number was quoted twice before anyone checked
it.

It was caught because the agent given that command re-derived it instead of
trusting it, which is the only reason the sweep was not scoped to a fortieth of
the corpus.

The correction also changed the method rather than just the number. Character
count turns out to be a poor predictor of whether a formula overflows at all:
KaTeX stacks fractions, subscripts and kets vertically, so a 119-character
fraction-heavy expression can render narrower than a 31-character flat list of
numbers. The useful heuristic was structural, not dimensional (flat
comma-separated lists of four or more items, long `\texttt` or `\text` runs),
and it found **12 real overflows across 10 files**.

### Twice, the obvious CSS fix was worse than the defect

Both 200%-zoom fixes were first attempted as one sweeping rule, and both were
reverted after measurement. The pattern is worth naming, because in each case
the rule *did* fix the reported defect.

**`Instrument` as a scroll container.** Swapping its `overflow-hidden` for
`overflow-x-auto` mirrors what `.katex-display` already does and measurably
cleared the clip. It was wrong for two reasons. `scrollRegions.test.ts` fails
it, because a horizontally scrollable region a keyboard user cannot focus is a
WCAG 2.1.1 failure, and `Instrument` has about 43 call sites that cannot supply
a tab stop as a blanket default. Worse, `responsive.mjs`'s overflow walker
treats any non-`visible` `overflow-x` as containment and stops looking past it,
so making every panel a scroll container would have **permanently exempted
everything inside every panel from the sitewide overflow check**. That trades
one visible defect for an invisible one, on a site where `body` carries
`overflow-x: clip` and clipped content is unreachable rather than untidy.

**Every inline `.katex` as a scrollable inline-block.** This fixed all twelve
confirmed horizontal overflows. But `overflow-x: auto` forces the other axis
out of `visible` too, and KaTeX's internal layout deliberately extends outside
its own box with absolute offsets that rely on vertical overflow staying
visible: a radical's overbar, a stacked fraction. `overflow-y: hidden` clipped
those glyphs on lessons far outside the ten that motivated the rule, taking
`what-is-a-qubit` from 2 blockers to 9. There is no safe universal vertical
padding, because the clip depends on each formula's tallest glyph, and KaTeX
does not support restricting overflow on `.katex` for exactly this reason.

Both were fixed instead at the layer where the problem actually is: the content.
The panel cases were single missing `min-w-0` declarations (a `w-fit` summary
whose text children could not shrink, and a grid item that sized itself to a
523px equation's min-content and dragged the readouts beside it out of the box).
The formula cases were reworded, or promoted to display math, which already has
a correct padded scroll treatment.

Neither revert came from reading the code. Both came from re-running the
measurement afterwards and finding the number had gone the wrong way.

## 4. Rules made enforceable

**Em dashes.** `src/lib/content/__tests__/readerFacingDashes.test.ts` grew a
third scope. It already covered all of `src/content` and every `.tsx` outside
tests with comments stripped; it now also covers every `.ts` outside tests
**inside string literals only**. That restriction is what makes the `.ts` half
possible: reader-facing copy really does live in `lib/entryBar.ts`, `lib/nav.ts`
and `lib/structuredData.ts`, but so do the validators' deliberate `[.;:!?\n—]`
character classes, and a regex literal is not a string literal. The exclusion is
by construction rather than by an allowlist that would rot. Proven non-vacuous
in both directions before being trusted: a probe file containing only a regex
character class passes, and a probe containing one em dash in an exported string
fails with the file, line and text.

**Spelled-out counts.** `CLAUDE.md` records that a hand-typed 549 against a
corpus of 556 once rendered on every page. `SITE_DESCRIPTION` was pinned against
the registries, but three surfaces spell the simulator count as a *word* and
none of them were checked: `nav.ts` says "Fourteen simulators", and
`/simulators` says "Fourteen quantum simulators" in its metadata and "Fourteen
live instruments" on the page. They are typed out for a real reason:
`SIMULATOR_COUNT` derives itself by building the search index, and `nav.ts` is
imported by `Navbar`, a client component in the root layout, so importing the
constant there would drag `lib/search` into every page's bundle. The literal has
to stay; the drift does not. A test file is under no such constraint, so
`problemCount.test.ts` now imports both and holds them together, and fails if
fewer than three such claims are found so it cannot pass vacuously.

The same test grew a second case for the tiers. `/apex` and `ApexHero` say
"five courses"; `/mastery` and the homepage's index row say "Five
self-contained structures". Those are spelled out for readability rather than
for a bundle constraint, so they could have interpolated, but they read better
as words and a test costs nothing, so the words stay and the drift does not.
Both are checked against `getCoursesByPillar()`.

Neither of these was found by looking for it. Both came out of a reviewer whose
only instruction was to try to falsify the sprint's own claims, which is the
argument for running that pass at all.

## 5. Where it ended

`node scripts/audit/orientation.mjs --widths 375,1440 --require-forward`, exit
0. Every one of the 26 route/width pairs measured cleanly (no 5xx, no stuck
skeleton), and every one has at least one forward action in its first screen
with its first substantial prose above the fold.

```
=== 375px ===                                     h1  prose  seen  fwd   height
/                                                138    269   yes    2    19327
/learn                                           138    232   yes    2    27395
/lessons                                         138    232   yes    2    18653
/lessons/.../what-is-a-qubit                     205    734   yes    1    19977
/problems                                        134    224   yes    1     7644
/problems/bell-state-outcome-probability         157    658   yes    3     2402
/courses/quantum-gates-and-circuits              211    305   yes    1     6162
/simulators                                      174    264   yes    1    50845
/glossary                                        174    227   yes   25   121090
/map                                             174    227   yes    3     2850
/current-quantum                                 138    269   yes    3    42557
/apex                                            225    303   yes    1    12510
/about                                           138    232   yes    5     5077

=== 1440px ===
/                                                162    367   yes    7    13917
/learn                                           162    305   yes    2    17530
/lessons                                         162    244   yes    3    14342
/lessons/.../what-is-a-qubit                     189    664   yes    6    14106
/problems                                        158    297   yes    2     5166
/problems/bell-state-outcome-probability         181    601   yes    4     1860
/courses/quantum-gates-and-circuits              218    361   yes    2     4446
/simulators                                      231    309   yes    5    27895
/glossary                                        231    309   yes   19    68549
/map                                             231    309   yes    8     2169
/current-quantum                                 162    305   yes   13    31548
/apex                                            256    417   yes    2     8394
/about                                           162    244   yes    5     2925
```

Read the `fwd` column as a floor, not a score. **One deliberate primary action
is the target state.** `/learn`, `/simulators`, `/problems` and four of the six
track pages each present exactly one, by design, and padding a page to raise
that number would be the failure this whole exercise exists to avoid.
`/glossary`'s 25 is its A-Z index, which is the point of that page, and
`/current-quantum`'s 13 at 1440 is the one place where no single action is
obviously primary.

## 6. Numbers worth keeping

- A cold production build passes in **108.7s at a peak of 4461MB across 13
  processes**, against the 5000MB budget and an 8192MB container. That is
  unchanged from the 4546MB and 4408MB the previous sprint recorded, so the
  homepage rebuild, the new orientation layer and the extra registries reaching
  the homepage's server graph cost nothing measurable. Measured with the dev
  server stopped, because peak memory on a contended machine is noisy and
  `build-memory.mjs` says so in its own header.
- Tests went from **131 files / 2017 tests** to **141 files / 2112 tests**, all
  passing. Ten new test files and 95 new assertions, every one of them pinning
  behaviour that was found by measuring a rendered page rather than by reading
  code.
- The search index is **535.4KB against a 560KB ceiling**, down from 538.1KB
  after the description pass. The ceiling is enforced by
  `scripts/generate-search-index.mjs` at generation time, so it fails loudly
  rather than silently, but the headroom is thin.
- `/glossary` is **121,090px tall at 375px**, with 273 terms rendered flat, and
  its filter now sits at y=571 rather than y=4251. `/simulators` is 50,845px at
  375 against 27,895 at 1440.
- `/problems` went from **85,023px to 7,644px** at 375 once its index gained
  progressive disclosure, and its tab stops from 1,159 to 118.
- Four of thirteen simulators now put their first control in the first screen at
  375px, up from two. Seven are left deliberately: their height is the
  visualization itself, and shrinking it to seat a slider would remove the thing
  the reader came for.

## 7. Still open

- **A focus-order jump on `/`**, 930px, in `ComputingSection`, left after a
  measured trade could not be resolved. Tailwind's `order-1`/`order-2` flips
  *visual* stacking below `lg` but never DOM or tab order, so mobile tabs the
  Bloch-sphere figure before the text that introduces it. Reverting to
  text-first DOM order restores mobile and reintroduces the 640 to 745px
  desktop jump that the current order was measured to fix. No arrangement
  satisfies both breakpoints from one DOM tree without restructuring the
  content, so the mechanism is recorded rather than a guess applied.

- `/about` names no author and offers no route for reporting an error. This
  needs the owner; provenance must not be invented. Carried over from
  `PRELAUNCH_AUDIT.md` §6 and still carried. It is the loudest absence on that
  page precisely because everything else on it is checkable: a reader who has
  just been told every figure is counted at build time will ask, counted by
  whom.

- **Reported and not reproduced:** a hydration blocker on
  `/lessons/quantum-hardware/measurement-and-control/qubit-readout-techniques`,
  attributed to a floating-point difference in an SVG path's `d` attribute in
  `ReadoutScatter.tsx`. Three clean runs at 320, 375 and 1280 afterwards found
  nothing. It was first seen around the dev-server outage above, which is the
  most likely explanation. Recorded rather than fixed, because the component
  already uses a seeded `mulberry32` PRNG specifically to keep server and
  client markup identical, so the obvious cause is already handled and a
  speculative second fix would be worse than none. If it returns, the place to
  look is the Box-Muller transform: `Math.log` and `Math.cos` are not required
  to be bit-identical across engines, and rounding the emitted coordinates
  before they reach the `d` string would absorb that.

- Seven of the thirteen simulators still land their first control 100 to 600px
  below the fold at 375px. The remaining height is canvases, charts and
  narration rather than prose, so no further copy trim closes it; only a
  layout change of the kind `compare-states` received would.

- 199 of 219 lesson descriptions still exceed roughly 160 characters, the point
  at which a search result truncates. The tail that serves neither reader is
  much shorter than it was but is not gone.
