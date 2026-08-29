# Accessibility audit

Read against `docs/DESIGN_SYSTEM.md` §9, `docs/UX_REVIEW.md`, `docs/UX_REVIEW_2.md`,
`docs/README.md` and `AGENTS.md`, then the components and routes below, as
they stand in the working tree while twelve agents actively edit them. This
is a static code read — **no browser was used** (see "What I could not
check" at the end). Every finding cites a real file and line, re-checked
immediately before this was written.

Two files were re-verified a second time after a mid-audit pause because the
brief flagged them as freshly landed: `CourseList.tsx`/`CourseTimeline.tsx`
(clickable-card conversion) and `Term.tsx` (new inline glossary). Their
current on-disk content is what's described below.

Counts: **4 Blocker, 9 Serious, 9 Polish** = 22 findings.

> **Status note, 2026-08-29.** This is a point-in-time record and the
> findings below are left exactly as written. All five "Top five" items have
> since been fixed, re-verified against the current tree:
>
> 1. `CourseList.tsx` — the stretched link is now an `::after` on the title
>    anchor with the card's own static text raised above it in the stacking
>    order; the description, prerequisites and captions are selectable again.
> 2. `MechanicsSection.tsx` — the decorative SVG is `aria-hidden="true"` and
>    the link carries a short `aria-label`, so its accessible name is a name.
> 3. `.katex-display` — `src/lib/mdx/rehypeKatexHtml.mjs` injects
>    `tabindex="0"` onto every display-math wrapper (and deliberately not
>    onto inline math), guarded by `rehypeKatexHtml.test.ts`.
> 4. Concept map pinch-to-zoom — implemented and guarded by
>    `src/components/map/__tests__/pinch.test.ts`.
> 5. `Term.tsx` — the checkbox trade-off is now documented explicitly as an
>    accepted residual risk in the component's own docstring (fix option 1),
>    and the pair is exposed as a term and its definition — a `<dfn>`
>    (implicit ARIA `term`) around the phrase, `role="definition"` on the
>    panel. There is no literal `role="term"` attribute to grep for.
>
> The Serious and Polish findings further down have **not** been re-verified
> one by one in this pass; several are known fixed (Navbar Escape,
> `IconButton`, linked prerequisites — see `SPRINT_BRIEF.md`). Re-check
> against the code before acting on any specific line reference, as the
> preamble to `docs/README.md` says.

## Top five

1. **`CourseList.tsx`'s stretched course-title link silently sits on top of
   the card's own plain text**, making the description, prerequisites,
   difficulty and progress-bar caption unselectable across `/learn` and four
   of six pillar pages. (Serious → routed as top item because of reach: this
   is the component the sprint brief specifically asked to be audited
   closely, and it hits the most pages.)
2. **`MechanicsSection.tsx`'s phenomenon cards give their link an
   accessible name that is an entire paragraph** — the exact anti-pattern
   named in the brief — because a long SVG `aria-label` and a full
   description sentence both live inside one unlabeled `<Link>`.
3. **`.katex-display` (`globals.css:489`) is horizontally scrollable but not
   keyboard-focusable** in Chromium/WebKit, so a keyboard-only reader cannot
   scroll to see the rest of any display equation wider than the viewport,
   across all 219 lessons.
4. **The concept map's pinch-to-zoom is missing on touch** — pan works via
   Pointer Events, but zoom is button/wheel-only, so a phone/tablet user
   without a working "+/−" tap target loses zoom entirely.
5. **`Term.tsx`'s inline glossary uses a real `<input type="checkbox">` as
   the disclosure control**, so a screen-reader's forms/controls list
   surfaces every inline glossary term (potentially dozens per lesson) as an
   orphaned "checkbox," not a term or a disclosure — announced correctly
   moment-to-moment, but disorienting when a user browses by form control.

---

## `src/components/curriculum/` — CourseList, CourseTimeline, LessonSearch

### Blocker: none in this directory once the stretch-link issue below is fixed — see Serious.

### Serious — `CourseList.tsx:92-146` — stretched link paints over, and swallows pointer/selection on, the card's own static text

The course title's `<Link data-course-link>` (line 96-102) is stretched via
`after:absolute after:inset-0` (line 99) to the Panel's `relative` ancestor
(line 87), which is the documented technique for whole-card click targets.
The file's own comment (lines 39-44) correctly identifies that a
`position: static` sibling paints *underneath* a positioned descendant
regardless of DOM order, and fixes this for the module list by adding
`relative` to each module `<Link>` (line 162). But that fix was applied only
to the module list. Everything else in the header — the description
paragraph (line 104), the "Requires ..." prerequisite line (lines 105-110),
the difficulty mark / hours / lesson-count block (lines 113-121), and the
progress bar + "Content available" caption (lines 132-146) — is still
`position: static`, so per the same CSS painting-order rule the file's own
comment explains, the invisible stretched pseudo-element paints on top of
**all of it**. A mouse user cannot click-drag to select the course
description, the prerequisite names, or any of the stats text — the
pointer/selection target under the cursor is the empty `::after`, not the
text. This is exactly the "stretched link that swallows the text selection"
failure mode named in the audit brief, and it now affects every course card
on `/learn`, `/mechanics`, `/computing`, `/hardware`, `/software` (Mastery
and Apex use their own bespoke index components instead — unaffected).

**Fix:** add `relative` to the same elements that already need it for the
module list — the description `<p>` (line 104), the prerequisites `<p>`
(lines 105-110), and the difficulty/stats `<div>` (line 113) — so they win
the same paint-order tie the module rows already do. One class each, no
markup restructuring.

### Polish — `CourseList.tsx` / `ConceptListView.tsx` / `PrerequisiteReadout.tsx` — several list-row touch targets sit under 44px

- `src/components/map/ConceptListView.tsx:62-67` — the concept button has no
  `min-h`; `py-2` plus one line of `text-sm` is roughly 34-36px tall for a
  node with no prerequisites line.
- `src/components/lessons/PrerequisiteReadout.tsx:84-93` — prerequisite
  chips are `px-3 py-2` with `leading-none`, roughly 30px tall.
- `src/components/problems/ProblemCard.tsx`'s sibling `ProblemRow` (same
  file, lines 176-216) is usually tall enough because of its wrapped
  metadata line, but a row with no `lessonTitle` and a short course name can
  come in under 44px too.

None of these are courses/lessons the reader can't eventually hit, but per
the brief's own "Targets ≥44px" bar they're all a tap-precision risk on a
phone. **Fix:** add `min-h-11` (44px) consistently, matching the pattern
`CourseList.tsx:162` and `controls.tsx`'s `RunControls`/`PillGroup` already
use.

### Polish — `LessonSearch.tsx` — clear button and result-card touch targets: clean

Verified current state: the clear button (`LessonSearch.tsx:75-89`) is a
real `w-11` (44px) hit target flush with the input's height via
`inset-y-0`, with `aria-label="Clear search"` and Escape-to-clear
(`handleKeyDown`, line 42-47). This is the fix the sprint note described,
and it's correctly landed — no further action.

---

## `src/components/home/` — pillar section cards

### Serious — `MechanicsSection.tsx:106-117` — a card's accessible name is an entire descriptive paragraph, not a name

The `PHENOMENA` card (`Superposition`/`Tunneling`) wraps an SVG figure, a
heading, a description paragraph and a CTA span in one `<Link
className="group block">` with no `aria-label` on the link itself. The SVG
inside (`SuperpositionGlyph`/`TunnelingGlyph`, lines 16-55) is `role="img"`
with a full-sentence `aria-label` (e.g. "Bar chart of two equal-height
amplitude bars labeled |0> and |1>, with a phase dial above them,
illustrating a state that is a combination of both at once."). Because none
of this is hidden from the accessibility tree, the Link's computed
accessible name concatenates the SVG's long `aria-label` *and* the visible
heading *and* the full description *and* "See the derivation →" — a
screen-reader user tabbing to this link hears the whole block read as one
run-on name before they can decide whether to activate it. This is the
exact "accessible name that reads as an entire paragraph" failure mode the
audit brief calls out for clickable cards.

Checked and confirmed this pattern is **not** shared by the sibling pillar
sections — `ComputingSection.tsx`, `HardwareSection.tsx`,
`SoftwareSection.tsx`, `MasterySection.tsx` all keep their CTAs as short,
separately-labeled links (e.g. `ComputingSection.tsx:47-52`, "See the proof
of entanglement →" as its own link, not wrapping a figure). This is
localized to `MechanicsSection.tsx`.

**Fix:** either give the outer `Link` an explicit `aria-label={phenomenon.title}`
(and mark the SVG `aria-hidden="true"` instead of a described `role="img"`,
since the description is now redundant with the visible paragraph a sighted
user reads separately), or stop wrapping the whole block and make only the
title + CTA the interactive link, leaving the figure and description as
adjacent non-interactive content.

---

## `src/components/mdx/Term.tsx` — inline glossary disclosure

### Serious — checkbox-as-disclosure exposes every glossed term as a bare "checkbox" to assistive tech

`Term.tsx:87-101` builds the reveal from a real `<input type="checkbox"
className="sr-only">` inside a `<label>`, toggled via `:checked`/`:has()`
with zero client JS — deliberately, because `<details>` would split the
surrounding `<p>` (the component's own docstring at lines 35-62 explains
this correctly and is factually accurate about the `<details>`-in-`<p>`
hazard).

The trade-off has a real cost: a checkbox's ARIA role is literally
"checkbox," not "button" or "disclosure." A screen-reader user browsing by
form control (VoiceOver's rotor "Form Controls," NVDA/JAWS's forms list)
will see every `<Term>` instance on a lesson page listed as an unlabeled
form field with no enclosing `<form>` and no submit action — on a lesson
with several glossed terms, that's several stray checkboxes appearing in a
list meant for actual form inputs. In-line, linear reading is fine: the
label text plus the "— show definition"/"— hide definition" sr-only spans
(lines 99-100) make the *in-context* announcement reasonably clear
("reduced density matrix — show definition, checkbox, not checked"), and
the checked/unchecked state is reported correctly by the browser's native
checkbox semantics, exactly as the docstring claims. The risk is specifically
about out-of-context discovery, not about someone who tabs to it directly.

**Fix options, in order of effort:** (1) document the trade-off explicitly
as accepted (it already is, just not framed as a residual risk); (2) if a
small amount of client JS is acceptable for this one leaf component, swap
to a `<button aria-expanded>` — still legal phrasing content inside a `<p>`,
same zero-registry-import safety, but reports as "button, collapsed/expanded"
to a rotor instead of "checkbox." Given `Term` never imports a content
registry (only local `glossary.ts` data passed as props), a JS toggle here
would not touch the client-bundle-boundary rule.

Everything else about this component is solid: the revealed panel is real
block flow (no floating-tooltip viewport-overflow risk at 320px), the
`Link` to the full glossary entry sits outside the `<label>` so it isn't
nested inside another interactive element, tab order matches visual order,
and focus is visibly ringed via `has-[:focus-visible]` on the label (lines
92-94) even though the checkbox itself is visually hidden.

---

## `src/app/globals.css` — KaTeX display math

### Serious — `globals.css:489-500` — `.katex-display`'s horizontal scroll has no keyboard path

```css
.katex-display {
  overflow-x: auto;
  ...
}
```

This is real `rehype-katex`-generated markup (`next.config.ts:112`, `{
strict: false }`, no custom wrapper component in `src/mdx-components.tsx` —
confirmed no `katex`/`math` override exists there), so nothing gives the
scrollable box a `tabindex` or a `role`. `overflow: auto` containers are
**not** in the default tab sequence in Chromium or WebKit (only Firefox
auto-includes scrollable regions), so on those browsers a keyboard-only
reader — no mouse, no trackpad, no touchscreen — has no way to scroll a
display equation wider than the viewport into view. The truncated part of
the equation is simply unreachable. This affects every lesson with a wide
display equation, which given 219 lessons of graduate-level notation is
common (tensor products, multi-term Hamiltonians, block matrices).

**Fix:** this needs a `rehype` post-process step (or a small client
component swap) that adds `tabindex="0"` and `role="region"` with a
descriptive `aria-label` (e.g. "Equation, scrollable") to each
`.katex-display` div. Framing it as a `region` also gives it a landmark
name, which helps a screen-reader user realize it's a distinct scrollable
unit rather than assuming the equation ends where the viewport does.

---

## `src/components/map/` — concept map

### Serious — `ConceptMapExplorer.tsx` — no pinch-to-zoom on touch

Pan is implemented correctly for touch via Pointer Events
(`handlePointerDown`/`handlePointerMove`, lines 341-362) with `touch-none`
on the viewport (line 486) to suppress the browser's native touch-scroll
so the custom pan doesn't fight it. Zoom, however, is wired only to the
non-passive `wheel` listener (lines 376-389, explicitly desktop-mouse) and
the `+`/`−` buttons (lines 441-456). There is no multi-touch pinch handler.
A phone or tablet user can pan the graph with one finger but can only zoom
by finding and repeatedly tapping two small buttons — the natural two-finger
gesture for a pannable diagram does nothing. This is a real, if narrower,
gap under the brief's "pinch/pan interactions that work with a finger."

**Fix:** either add a minimal two-pointer pinch handler (track the distance
between two active `pointerId`s and map its delta to `scale`, same clamp as
`zoomBy`), or, if that's out of scope for this sprint, make the zoom buttons
larger/more discoverable on touch and call out in the `aria-describedby`
instructions (line 471) that zoom on touch is button-only. The current
sr-only instructions text ("Drag to pan, scroll or use the zoom buttons to
zoom") is at least honest about this — it doesn't claim pinch works — so no
one is being told something false, but the feature gap itself remains.

### Polish — `ConceptMapExplorer.tsx` — DOM/tab order does not follow visual (x, y) layout, but is well mitigated

Nodes are rendered (and so tab-ordered) in `graph.nodes` array order
(concept-authoring order in `src/lib/content/concepts.ts`), not by their
visual left-to-right/top-to-bottom position in the pan/zoom canvas. In most
drag-to-pan interfaces this would be a real defect (tabbing jumps
unpredictably around the screen), but this implementation specifically
mitigates the worst consequence: `onFocusNode` re-centers the viewport on
whatever node receives focus (`handleFocusNode`, line 339, with a clear
comment explaining exactly why), so a focused node is never left scrolled
off-screen. The list view (`ConceptListView.tsx`) is the real, complete,
correctly-ordered (by `depth` then alphabetically, lines 36-38) alternative
for anyone who wants a predictable order — this is functioning exactly as
`docs/DESIGN_SYSTEM.md` §9 asks. Flagged only for completeness; no action
needed unless the graph view's tab order specifically bothers testing.

### Checked and clean — `ConceptListView.tsx`

Real list markup (`<section>`/`<h3 id>`/`<ol>`), `aria-labelledby` per
pillar group, `aria-current="true"` on the selected node, completion and
difficulty never color-only (check glyph + text "Step N" + `DifficultyMark`
ticks). This is the genuine text/keyboard equivalent to the graph the brief
asked to verify exists — it does, and it's complete (same `nodes` data as
the graph, not a subset).

---

## `src/components/field/` — background environment

### Checked and clean

`QuantumField.tsx` re-verified end to end: `aria-hidden` + `data-decorative`
on the canvas, a separate `sr-only` paragraph rendering
`REGIME_DESCRIPTIONS[regime]` (line 259), one static frame under reduced
motion with scroll/time frozen at 0 (lines 168-172), full teardown on
`prefers-reduced-motion`, `saveData`, and tab-hidden. `REGIME_DESCRIPTIONS`
(`regimes.ts:729-743`) was spot-checked against each regime's actual drawing
function and reads accurately for `wave`, `state`, `lattice`, `graph`,
`operator`, `frontier`, `journey`, and the newer `atlas` regime (a "faint
reference grid behind six slowly orbiting nodes" — matches `drawAtlas`).
No stale description found.

---

## `src/components/problems/` — feedback, answers, cards

### Checked and clean

- `Feedback.tsx:42-58` — `role="status"` + `aria-live="polite"`, an
  `aria-hidden` glyph always paired with a text label
  (`STATUS_LABEL`), never color-only. Correct/incorrect/partial all read
  correctly.
- `AnswerInput.tsx` — multiple-choice is a real `radiogroup` with visible
  lettered cells (never color-only for "selected"); numeric input has a
  `sr-only` "Your answer" label plus `aria-describedby` wired to its hint;
  free-response `textarea` has `aria-label`. No unlabeled inputs found.
- `ProblemCard.tsx`/`ProblemRow.tsx` (`src/components/problems/ProblemCard.tsx`) —
  single `Link` per card, no nested anchors, "Solved" never color-only
  (explicit checkmark + `sr-only` text), accessible name is just the
  problem title (not swept up into a paragraph) since the description/tags
  sit inside the one link's flow without a separate `aria-label` fight.

---

## `src/components/layout/` — Navbar, ThemeToggle, SearchTrigger

### Polish — `Navbar.tsx:303-372` — the mobile menu disclosure doesn't close on Escape

`TracksDropdown` (same file, lines 71-189) is the documented "standard to
match" per `docs/DESIGN_SYSTEM.md` §9 — it closes on Escape, outside
pointerdown, and blur (lines 77-117), and returns focus to its trigger
button. The mobile hamburger panel (`isMenuOpen`, lines 226-372) is the same
kind of disclosure (`aria-expanded`/`aria-controls` on its trigger, line
280-282) but has no `keydown` listener at all — Escape does nothing.
Lower severity than a true modal gap because this panel pushes content in
normal flow rather than covering it (no focus trap is strictly required),
but it's the one disclosure in the file that doesn't meet the pattern the
design system itself holds up as the standard.

**Fix:** the same four-line `Escape` branch `TracksDropdown` already has,
returning focus to the hamburger button on close.

### Polish — chrome icon buttons cluster at 40×40px, just under the 44px guideline

`Navbar.tsx:274-279` (hamburger, `h-10 w-10`), `ThemeToggle.tsx:144-156`
(`h-10 w-10`), `SearchTrigger.tsx:28-38` (`h-10`, width driven by
icon+padding, ~40px on mobile where the text label is `hidden`). All three
pass the WCAG 2.5.8 AA minimum (24px) comfortably but sit under the 44px
target the brief asks for and under WCAG 2.5.5 AAA. Consistent across the
whole chrome rather than a one-off, so this is a single systemic note, not
three separate defects — worth a deliberate call either way (bump to 44px,
or explicitly accept 40px as this site's chrome standard).

### Polish — `SearchTrigger.tsx:32-33` — `aria-expanded`/`aria-haspopup` with no `aria-controls`

The trigger sets `aria-haspopup="dialog"` and `aria-expanded={open}` but
`SearchOverlay`'s dialog (`SearchOverlay.tsx:204-210`) has no `id` for the
trigger to point to via `aria-controls`. Minor — the dialog's own
`aria-label` and focus-on-open behavior (`SearchOverlay.tsx:118-129`) mean a
screen-reader user still lands somewhere sensible — but the relationship
isn't programmatically declared.

### Checked and clean

Focus-trap and Escape/outside-click/blur behavior in `TracksDropdown` is
correct and matches its own extensive comments — verified against actual
behavior, not just the comments. `SearchOverlay.tsx`'s modal is a real
focus trap (Tab-cycling, lines 132-161), restores focus to the trigger on
close (lines 118-129), locks body scroll (line 120-121), and its live
region correctly announces loading/error/result-count states
(`aria-live="polite"`, lines 245-255) without being color-only.

---

## `src/app/courses/[slug]/` — new route family (32 pages)

### Checked and clean

Single `<h1>` via `SectionTitle level={1}` (line 177), breadcrumb `<nav
aria-label="Breadcrumb">` (line 148), heading levels step down correctly
(`level={2}` for every subsequent section, no skips to `h3`/`h4` without an
intervening `h2`), `<Instrument>` module list uses a real `<ol>`
(line 331), prerequisite list is a real `<ul>` (line 239). No nested
interactive elements found — the one place a `<Link>` wraps a `<Badge>`
(dependent-courses section, lines 393-401) is a span inside an anchor, not
another interactive element, so it's legal.

### Polish — `PrerequisiteStatus.tsx` not separately audited

`src/app/courses/[slug]/PrerequisiteStatus.tsx` renders inline inside the
prerequisites list (line 250) but was not read in isolation this pass — it's
small and low-risk (a status readout, not a control), but flagging so it
isn't assumed covered.

---

## `src/components/lessons/PrerequisiteReadout.tsx`

### Checked and clean (aside from the touch-target note above)

Done/not-done is never color-only (`CheckGlyph`, lines 102-127: filled vs.
hollow circle, plus the "N/M complete" text readout, line 74). Each chip is
a real `Link` to the prerequisite lesson; empty-state ("No prerequisites")
still gets the same glyph treatment rather than silently rendering nothing.

---

## What I could not check

No browser was used anywhere in this audit — everything above is a static
read of source and CSS. Concretely, that means:

- **No rendered contrast measurement.** The brief's composed cases (text
  over `--pillar-wash`, over the atmosphere layer, disabled states,
  placeholder text, text sitting on the animated canvas) require an actual
  compositing pass across six pillars × two themes × varying
  `--atmosphere-strength`; I did not attempt to hand-compute OKLCH alpha
  blends, since a wrong hand-computed number is worse than an honest "not
  checked." `contrast.test.ts`/`pillarContrast.test.ts` cover the
  token-against-flat-ground and token-against-`--surface`/`--surface-muted`
  cases; the genuinely composited cases (pillar-wash *and* atmosphere *and*
  a text token, simultaneously, on Apex specifically, where
  `--atmosphere-strength` is highest) are the priority spot-check for
  someone with a real browser.
- **No verification that focus is visible over the animated canvas** in
  practice — the CSS (`:focus-visible` ring, pillar-tinted) is defined
  globally and nothing in the components read here overrides it, but
  whether a cyan/amber/green ring is actually legible against a specific
  moving frame of that pillar's canvas is a rendered-pixel question.
- **No 320px-viewport overflow sweep.** I read `CourseTimeline`'s
  `overflow-x-auto` wrapper and confirmed intent, but did not render every
  page at 320px. `docs/UX_REVIEW_2.md`'s P2-12 fixes were re-read, not
  re-measured.
- **No actual screen-reader run** (VoiceOver/NVDA/JAWS). Every screen-reader
  claim above (what gets announced, rotor/forms-list behavior, live-region
  timing) is inferred from HTML/ARIA semantics and documented browser
  behavior, not observed.
- **`src/lib/design` test suite**: ran `npx vitest run src/lib/design` as
  permitted. 63 of 64 tests passed; `routes.test.ts`'s sitemap/course-route
  test timed out at 60s (not a content failure, a timeout — likely the
  32-page `/courses/[slug]` static-param generation being slow under
  `vitest`, given `src/app/courses/` and `src/app/sitemap.ts` are both
  mid-edit). Not an accessibility finding; noting it so it isn't mistaken
  for a clean run.
- **Mid-edit files.** `src/app/sitemap.ts`, `src/lib/design/__tests__/routes.test.ts`,
  and the large batch of `src/content/lessons/**/*.mdx` changes under
  `quantum-hardware`/`quantum-mastery`/`quantum-mechanics`/`quantum-software`
  were left unread in detail — they were still moving during this pass and
  a per-lesson MDX content read was out of scope for an accessibility audit
  at this depth (219 lessons). The `EquationReveal`/`Term`/narrative
  component *implementations* were audited; individual lesson call sites
  were not swept for misuse the way `docs/UX_REVIEW.md`/`UX_REVIEW_2.md`
  already did mechanically.

## Verdict

The accessibility fundamentals here are unusually good for a sprint in
progress: the concept map has a genuine, complete list-view fallback; the
background field is properly described and reduced-motion-safe; problem
feedback is never color-only; every simulator slider I sampled is labelled
and unit-exposed; and the two riskiest new patterns this sprint
introduced — whole-card click targets and a checkbox-driven inline
glossary — were both clearly *thought about* (the comments in `CourseList.tsx`
and `Term.tsx` correctly diagnose the exact failure modes they're trying to
avoid). The defects found are almost all incomplete applications of a
correct idea, not wrong ideas: `CourseList.tsx` fixed painting order for
module links but not for the header text sharing the same panel; the KaTeX
scroll container has the right CSS property but no keyboard path; the
concept map has real pan but no pinch. None of the 22 findings above
require rethinking an approach — each has a small, mechanical fix in the
same file that already got most of the way there.
