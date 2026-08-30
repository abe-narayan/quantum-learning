# StudyQuantum design system — "The Instrument"

This is the single source of truth for how StudyQuantum looks and moves.
Everything below already exists in the repo. **Read this before adding any
visual code, and compose from these primitives rather than inventing a
parallel system.**

---

## 1. The idea

StudyQuantum is a **research console**, not an educational website. Deep,
layered laboratory ground; hairline-edged instrument panels; a persistent
background environment that depicts the physics of wherever you are standing;
four distinct typographic voices.

Explicitly avoided: generic SaaS/AI-landing-page aesthetics, endless rounded
cards, glassmorphism stacks, random gradients, neon for its own sake, huge
text everywhere, decorative animation with no educational purpose, and every
page looking like the same template.

The emotional target: *"wait, that's actually happening?" → "I want to
understand why."*

---

## 2. Color

**Dark is the default theme.** `:root` in `src/app/globals.css` *is* dark.
Light ("laboratory notebook" — warm paper, ink) is the opt-in override via
`prefers-color-scheme: light` and `[data-theme="light"]`. Both are real
designs; neither is a de-tuned copy of the other.

### Core tokens

| Token | Use |
| --- | --- |
| `--depth-0` … `--depth-3` | The elevation ladder. Pick a rung; don't invent an opacity. |
| `--background` / `--foreground` | Page ground and primary text. |
| `--surface` / `--surface-muted` / `--surface-raised` | Panel fills. |
| `--border` / `--border-strong` | Hairline vs. a line that must read as a line. |
| `--axis` / `--axis-grid` | The chart channel — see below. Never `--border` on a figure's axes. |
| `--panel-highlight` | The shared machined-face top highlight. See §4. |
| `--muted-foreground` / `--subtle-foreground` | Secondary and tertiary text. Both pass AA on `--depth-0`. |
| `--brand` / `--accent` | Site-level identity, for surfaces with no pillar. |
| `--success` / `--warning` / `--danger` | Semantic only. Never decorative. |

Tailwind utilities exist for all of these (`bg-surface`, `text-muted-foreground`,
`border-border-strong`, `bg-surface-raised`, `text-subtle-foreground`, …).

#### The three files allowed to write a literal colour

A hex literal anywhere in `src/components/` or a page is a bug: it bypasses
the token ladder and is therefore correct in exactly one theme.
`ownedNoHardcodedColors.test.ts` and `auditedNoHardcodedColors.test.ts` scan
for it.

There are **exactly three** exceptions, and the number matters because the
guard comment used to name only the first, which made the other two look like
unflagged violations:

| File | Why |
| --- | --- |
| `src/app/opengraph-image.tsx` | Satori (`next/og`) renders outside any CSS cascade and cannot read custom properties. |
| `src/app/apple-icon.tsx` | Same renderer, same constraint. |
| `src/app/manifest.ts` | A JSON manifest read by the OS. There is no stylesheet involved. |

All three carry *resolved copies* of the dark-theme tokens, not references,
so retuning `--depth-0`, `--brand`, `--accent` or `--foreground` means
editing them by hand. Each file names the token it copied. Anything not in
this table that carries a literal colour is a defect, including a literal
that merely *looks* like a token: `apple-icon.tsx` shipped a `#0a0e17` ground
that matched no rung of the ladder at all (`--depth-0` is `#05070c`,
`--depth-1` is `#0c111b`), so the app icon was a shade nobody had chosen and
nothing could keep in step.

#### The depth ladder is separated on purpose — don't "tidy" it

The dark rungs are spaced further apart than looks necessary in a swatch strip,
and this is deliberate. Measured against the page ground, the original values
gave a panel **1.04:1** — a panel that is not visibly a panel — with `--border`
at **1.33:1** and `--border-strong` at **1.69:1**, despite the latter's whole
stated job being "a line that must read as a line." On a good monitor in a dark
room that reads as intentional minimalism; on a laptop in daylight the entire
surface hierarchy disappears and the site becomes undifferentiated black. The
current values put `--border` at 1.63:1 and `--border-strong` at 2.60:1.

Two light-theme values were outright WCAG AA failures and are now fixed:
`--subtle-foreground` sat at **4.28:1** on `--surface-muted`, and `--danger` —
the color that tells a reader their answer was wrong — at **4.39:1**. Both now
clear 4.5:1.

#### The chart channel — `--axis` is not `--border`

`--border` is a **panel edge**: deliberately near-invisible, measured at
**1.41:1** on `--surface-muted`. That is correct for a hairline around a card
and wrong for the axis of a graph — and every figure on this site had been
drawing its axes with it, well under WCAG 2.1 SC 1.4.11's 3:1 floor for
meaningful graphical objects.

Two tokens now split that job:

| Token | For | Contrast |
| --- | --- | --- |
| `--axis` | Marks a reader **must** perceive to read the figure: axis lines, tick marks, tick labels, reference/threshold lines, the outline of a plotted region. | **4.85:1** on `--surface-raised` (the lightest panel depth, and the worst case in dark) rising to **6.03:1** on `--surface`; **4.56–5.45:1** across the paper theme. |
| `--axis-grid` | Background gridlines **only** — the optional ruling a reader may use but never has to. | 1.93–2.40:1 in dark — deliberately *below* 3:1, so the data stays the loudest thing in the frame, and strictly quieter than `--axis` on every depth. |

**`--axis` is aimed at the text bar, not the graphics bar, and that is
deliberate.** SC 1.4.11 would only ask 3:1, and the token was originally
tuned to it (3.65:1 on `--surface-raised`). But the same token fills tick
*labels*, and a tick label is small text that owes **4.5:1** under SC 1.4.3 —
so a graphics-bar axis would have quietly downgraded every numeric label on
the site from `--muted-foreground` (6.78:1 on `--surface-muted`) to a
failing 4.19:1. It was retuned upward mid-sprint for exactly that reason.
One token that clears the stricter of the two bars is simpler than two
tokens nobody would reliably tell apart at a call site. It still sits a step
quieter than `--muted-foreground` (7.36:1 on `--surface`, dark) on purpose:
the frame of a figure should be legible without competing with the data
drawn inside it.

Note what `contrast.test.ts` actually pins: `--axis` above the **3:1**
non-text floor on all three depths in both themes, and `--axis-grid`
strictly below `--axis` on every depth. The 4.5:1 intent above is a design
decision the test does not yet enforce — if you retune `--axis`, check the
label case by hand.

**One known gap, measured 2026-08-29.** The pillar overrides at
`[data-pillar="apex"]` in light mode redefine the depth ladder (Apex on
paper is a cooler, denser stock: `--depth-3` becomes `#dfe3eb`) without
redefining `--axis`. A tick label on an Apex figure on a `--surface-raised`
panel in light therefore measures **4.23:1** — over the 3:1 the test checks,
under the 4.5:1 the token was retuned to hold. It is the only place the ramp
falls short, because it is the only place a pillar darkens the panel stack
out from under a token tuned against the base ladder. The general lesson is
worth more than the one number: **a token tuned against `:root` is not
automatically safe under a `[data-pillar]` block that moves its ground.**

Exposed as `stroke-axis` / `text-axis` / `fill-axis` and `stroke-axis-grid`
(`--color-axis` / `--color-axis-grid` in `@theme inline`). 39 figure
components under `src/components/visualizations/` draw through them as of
2026-08-29.

The question to ask is **"must this be seen to read the figure?"** — not "is
this inside an SVG". A figure whose grid is genuinely load-bearing should use
`--axis` for it. Panel frames, decorative rules and diagram chrome keep
`--border`. Reaching for `stroke-border` on an axis is the specific mistake
these tokens exist to prevent.

Any change to `--depth-*`, `--border*`, `--subtle-foreground`, or `--danger`
must keep `src/lib/design/__tests__/contrast.test.ts` green. That test parses
the real stylesheet, checks the neutral text voices against the panels they
actually sit on (not just `--background`, which almost nothing sits directly
on), and asserts `--muted-foreground` and `--subtle-foreground` stay
distinguishable from *each other* — a contrast fix that pushes one onto the
other passes AA individually while silently collapsing the hierarchy.

### The pillar channel — the most important thing in this document

Six pillars, six identities, derived from **two numbers** each (an OKLCH hue
and chroma) declared in `globals.css` §2 and mirrored in
`src/lib/design/pillars.ts`.

| Pillar | Hue | Reads as | Regime |
| --- | --- | --- | --- |
| Quantum Mechanics | 195 | cyan / wave | `wave` |
| Quantum Computing | 268 | indigo / state | `state` |
| Quantum Hardware | 62 | amber / metal | `lattice` |
| Quantum Software | 152 | green / code | `graph` |
| Quantum Mastery | 330 | magenta / structure | `operator` |
| **Apex** | 232, **chroma 0.045** | cold steel, near-monochrome | `frontier` |

Setting `data-pillar="…"` on any wrapper re-resolves the entire ramp for that
subtree:

`--pillar-accent` `--pillar-strong` `--pillar-dim` `--pillar-edge`
`--pillar-wash` `--pillar-glow` `--pillar-text`

…exposed as `text-pillar`, `bg-pillar-wash`, `border-pillar-edge`,
`text-pillar-strong`, and so on. Focus rings, prose links, `h2` rules,
equation slabs and selection color all follow it automatically.

**Use `PillarScope` (a server component) to set it** — never JavaScript, or
you get a flash of the wrong pillar before hydration.

`--pillar-text` is read as body-size text everywhere (prose links inside a
pillar-scoped lesson, eyebrows, breadcrumbs, focus rings), so it is verified
as text rather than assumed: `pillarContrast.test.ts` converts the OKLCH ramp
to sRGB properly and computes the real WCAG ratio for all six hues in both
themes. Measured: **9.6–10.8 : 1 on the dark ground** (10.8 on Apex's darker
one) and **4.7–5.7 : 1 on paper**. A lightness value alone does not guarantee
this — whether it holds depends on the hue — which is why the check resolves
the actual color.

**Apex is the least saturated pillar, not the loudest.** Its distinction comes
from contrast, density, structure and a darker surface ladder (which
`[data-pillar="apex"]` also overrides). "Black with purple accents" is the
exact cliché this system exists to avoid.

---

## 3. Type — four voices

| Voice | Face | Job |
| --- | --- | --- |
| **Display** | Fraunces (`font-display`) | Moments: page/lesson titles, section openings, blockquotes, the "common mistake" callout label. |
| **Body** | Geist Sans (`font-sans`) | Everything read at length. The default — needs no class. |
| **Tech** | Geist Mono (`font-tech`) | Instrument metadata: labels, readouts, units, ids, counts, difficulty, citations, control-panel headings. |
| **Math** | KaTeX | Display math is framed as a *slab* (`.katex-display`), pillar-edged. |

Components in `src/components/ui/Typography.tsx`:
`Eyebrow`, `SectionTitle` (level ≠ size — deliberately), `Lede`, `TechLabel`,
`TechValue`, `Readout`, `Readouts`.

Raw classes for non-React contexts: `.eyebrow`, `.tech-label`, `.tech-value`.

Rules: the reading column is 46rem (`Section width="reading"`, or the
`max-w-reading` utility). Do not put 20px type at full page width.
`.prose h3` stays in the body face. That is deliberate, documented in
`LessonLayout`, and should not be "fixed".

### The scale below `text-xs`

Tailwind's ramp stops at `text-xs` (0.75rem), and this codebase's smallest
voice (the uppercase mono metadata line) sits below it. With no token to
reach for, call sites invented one each: a census found **21 arbitrary
sizes**, led by 30 uses of `text-[0.65rem]`, 22 of `text-[0.6875rem]`, 11 of
`text-[0.625rem]` and 10 of `text-[10px]`, plus one-offs at 0.5625, 0.6, 0.7
and 0.95rem. The metadata voice alone had **six competing definitions of the
same idea**, including one in `globals.css` itself (the callout severity
label, at 0.7rem, which is 0.2px from `.tech-label`'s 0.6875rem, a
difference no reader can cash in).

Three steps, in `@theme inline`, and nothing between them:

| Token | Value | For |
| --- | --- | --- |
| `--text-micro` | 0.625rem | Dense tabular chrome only, where a digit column has to fit. |
| `--text-meta` | 0.6875rem | **The** tech-label size. This is what `.tech-label` sets. |
| `--text-xs` | 0.75rem | The smallest size any *running text* may take. |

`--text-xs` is redeclared at Tailwind's own value on purpose, so the three
sit together and read as one ramp rather than as two systems meeting.

Tracking gets the same treatment. The census found 0.08em, 0.1em, 0.12em,
0.14em and 0.18em in use; at 11px the gap between 0.1 and 0.12 is 0.3px.
Two values, because there are only two distinctions that mean anything:

| Token | Value | For |
| --- | --- | --- |
| `--tracking-meta` | 0.14em | `.tech-label`, the metadata voice. |
| `--tracking-eyebrow` | 0.18em | `.eyebrow`, the louder section marker. |

`.tech-label`, `.eyebrow` and the `[data-callout="note"]`/`[data-callout=
"warning"]` severity labels in `globals.css` all read these tokens rather
than literals. (`[data-callout="mistake"]` is the deliberate exception: it
escalates to the *display* face at its own size, which is a different voice,
not another value of this one.) If you are about to write `text-[0.65rem]`
or `tracking-[0.12em]`, the answer is one of the five tokens above.

### The reading measure is a token now

`--container-reading` (46rem) and `--container-lede` (42rem), exposed as
`max-w-reading` and `max-w-lede`. This document called 46rem "the site's
stated reading measure" for a long time while it existed nowhere *as* a
value: it was the literal `max-w-[46rem]`, repeated 39 times, with
`max-w-[42rem]` (the `Lede` measure) repeated 17 more. That is precisely why
the fix for the too-long line below was to raise the type rather than narrow
the column, since narrowing would have been a 39-site edit. As tokens, the column
is adjustable again. Seven
literal `max-w-[42rem]` call sites remain under `src/app/hardware`,
`src/app/mechanics`, `src/app/software` and `src/components/pillar`; they
should move to `max-w-lede`.

### Body prose is 18px, and that is a measured decision

```css
.prose { font-size: 1.125rem; line-height: 1.7; }
```

At the plugin's 16px, a 46rem (736px) column runs to about 92 characters.
The comfortable band for prose read at length is 66 to 75, and technical
text with inline math tolerates a somewhat longer measure (an equation
should not have to break), but 92 is past what that tolerance buys. The fix
is the type, not the column:
18px takes the same 736px to about 82 characters, and 18px is independently
the better size for material read for half an hour with KaTeX set inline,
which scales with it. Nothing else moves: no sibling is re-measured, no
figure is resized, and the ragged right edge that comes from narrowing prose
never appears. Leading drops from the plugin's 1.75 to 1.7 in step: 1.75 is
tuned for 16px, and at 18px the same ratio reads airy rather than readable.

That base is load-bearing for everything set against it, and three
consequences are worth knowing before you size anything inside a lesson:

- **`Lede` is `text-xl` (20px), not `text-lg`.** `text-lg` *is* 1.125rem, so
  on every page carrying both a lede and a prose body, the lesson page above
  all, the standfirst had collapsed onto the body size, and the voice with
  it. 20px is a visible step over 18px prose and the classic 1.25× standfirst
  ratio over 16px body on the index pages.
- **`not-prose` does not reset an inherited `font-size`.** It excludes a
  subtree from the typography plugin's *selectors*; the 18px keeps
  inheriting. So the boxed narrative devices moved from `text-sm` to
  `text-base`. At `text-sm` they were setting their own body copy at 0.78×
  the prose that leads into them. If you write an absolute size inside a
  `not-prose` island in a lesson, you are measuring it against 18px.
- **Lesson headings are set by `LessonLayout`, not by `.prose`.**
  `prose-h3:text-2xl prose-h3:font-bold` and `prose-h4:text-sm
  prose-h4:font-semibold prose-h4:uppercase`. h4 is deliberately smaller
  than body, because it is a labelling device rather than a title.

### Rhythm inside a section

`--rhythm-section` and `--rhythm-block` only ever governed a `<Section>`'s
*outer* padding, so everything between a heading and the next one was
improvised per component: a census found **18 distinct `mt-*` steps** across
`app/`, `home/`, `lessons/` and `pillar/`, four of which (`mt-7`, `mt-9`,
`mt-2.5`, `mt-0.5`) are used exactly once each next to a heavily used
neighbour, which is a difference that encodes nothing.

`--rhythm-tight` (1.25rem), `--rhythm-close` (2rem) and `--rhythm-open`
(3rem) are the three real relationships: a label to the thing it labels, a
paragraph to the next paragraph, and a subsection to the next subsection.
Three steps is enough. A fourth needs an argument for what a reader gets
from it.

### Earned variation, not decoration

A page may look different from its neighbours **only when the difference
carries information the reader can use.** Variation that a reader cannot cash
in is decoration, and decoration is what makes a site look assembled rather
than designed.

The one typographic instance of this in the codebase is difficulty density.
`LessonLayout` stamps `data-difficulty` on the lesson root, and
master-difficulty lessons set slightly tighter prose:

```css
[data-difficulty="master"] .prose            { line-height: 1.6; }
[data-difficulty="master"] .prose :where(p, ul, ol) { margin-block: 1.1em; }
```

Two declarations, and only for `master`. The payload is real: a denser page
signals *reference instrument, not guided walk* before a word is read, which
is exactly the expectation a master lesson needs to set. It stays at two
declarations because anything louder stops reading as a signal and starts
reading as a bug — a reader who notices the page "looks wrong" has learned
nothing and lost trust.

The rule is **unlayered on purpose**: the typography plugin's `.prose` styles
live in the utilities layer, and only unlayered rules outrank them (§4). It
rides on `prose`'s existing `INTENTIONALLY_UNLAYERED` entry — the guard test
keys on class name, and `.prose` is the class this selector ends in.

Before adding a second variation of this kind, answer what the reader gets
from it. "Apex feels different" is not an answer; "Apex is less saturated and
denser because its content is reference material" is.

---

## 4. Surfaces

| Primitive | Where | Use |
| --- | --- | --- |
| `.panel` / `<Panel>` | globals.css §8, `ui/Panel.tsx` | The machined face. Hairline edge, top highlight. |
| `.panel-inset` / `<Panel inset>` | " | A recessed well. |
| `.instrument` / `<Instrument>` | " | Mounted equipment: pillar-tinted, corner ticks, optional label strip + readouts + footnote. **Everything containing a canvas, simulator or large diagram should be one.** |
| `.input-instrument` | " | The one text-input recipe — see below. |
| `.rule-fade` / `<FadeRule>` | " | Separator that fades at both ends. |
| `.grid-paper` | " | Engineering-grid texture. Always mask it. |
| `Card` | `ui/Card.tsx` | The older, quiet box. Still fine — but if a page is *only* cards, it is not finished. |

No glassmorphism. No blur stacks over the canvas field.

### The boxed narrative devices are told apart by shape, not by hue

A lesson can put seven different kinds of box in front of a reader. They were
once, geometrically, near-identical: `rounded-panel border border-border
bg-surface`, a filled header strip, a small label, separated only by **which
word sat in the header and what colour it was in**. That fails for a reader
scanning rather than reading, and it fails outright in grayscale, in print,
and for a reader with a colour-vision deficiency. Every distinction is now
carried in geometry, and the hue is redundant reinforcement rather than the
signal:

| Shape | Devices | Reads as |
| --- | --- | --- |
| Solid border **+ filled header strip** + a 13px glyph | `TheoremBox` (`∎`), `DefinitionBox` (`≝`) | A formal statement this course is making. Deliberately one family of two. |
| Solid border **+ thick left severity bar** | `Callout` (`note` / `warning` / `mistake`, one glyph each) | A pedagogical aside, weight escalating with severity. |
| **Dashed** border, no header strip | `ResearchConnection` (arrow leaving a bracket) | Provisional, from outside, not ours. |
| **Pillar-wash fill**, no strip | `InsightBlock` (spark), `NextDiscovery` (forward arrow) | The lesson's own voice. |
| **No box at all** | `HistoricalMoment` (margin rule), `ChallengePrompt` (fade rule + eyebrow) | A change of gear: a timeline beat, or the lesson handing you something to do. |

Two details are load-bearing and easy to undo by accident:

- **The glyphs are drawn as SVG paths, not typed as characters.** At 13px a
  font-substituted or missing codepoint *is* the entire signal, and a fallback
  box where `≝` should be says nothing at all. `∎`, `≝` and the external
  arrow are all drawn at the same 13px so the three device marks sit on one
  visual scale.
- **`ChallengePrompt`'s lack of a box is the point.** Everything else in
  `src/components/narrative/` and `src/components/mdx/` is a boxed surface,
  so an open editorial treatment is what makes it read as a genuine change of
  gear rather than a seventh card.

If you add an eighth device, it needs a shape nobody else has. A new hue is
not a distinction.

### Display math inside a device un-nests its own frame

`.katex-display` is a full panel in its own right: border, a 3px pillar-edge
left rail, a panel radius, a muted fill. That is right when an equation sits
alone in the prose column, and wrong the moment it sits inside something that
is *already* a panel, which is often. 22 of the 49 `TheoremBox`es in the
corpus contain display math, 4 of 23 `DefinitionBox`es, and `DerivationSteps`
wraps 193 steps across 55 instances. In a `TheoremBox` the reader was getting
two pillar-edged left rails at the same radius twenty pixels apart, with the
**inner rail thicker than the outer one** (the subordinate element as the
louder frame), and the inner fill identical to the outer panel's header strip.

`[data-math-plain] .katex-display` drops the second frame and **keeps every
behaviour**: `overflow-x: auto`, `overscroll-behavior`, the `tabindex="0"`
focus stop `rehypeKatexHtml.mjs` injects, and the scroll-gradient overflow
indicator all survive. That last one is the subtle part: `background-image:
none` would have taken the indicator out with the fill, because the indicator
*is* two `scroll`-attached edge glows revealed as two `local`-attached covers
scroll away from them. Losing it would leave a wide equation ending flush at
a box edge with nothing but a thin scrollbar to say there is more, and
truncated notation reads as a complete statement rather than a clipped one.
So the layers are restated minus the pillar wash, with the covers painted in
`--surface`, because all three opting-in components sit on `bg-surface` and a cover
only works when it matches the ground behind it.

It is applied by the components themselves, via a `data-math-plain` attribute
on the element wrapping the math, **not** by a descendant selector naming the
boxes. A device that wants the framed treatment keeps it by simply not opting
in.

### `--panel-highlight` — one light source

`.panel`, `.instrument` and the primary `Button` all carry the same
`inset 0 1px 0` top highlight: the single light-catch line that makes a
surface read as a machined face rather than a rounded div. It is **one token**
precisely so all three catch the *same* light per theme — a faint foreground
mix over the dark ground, a white mix on paper (where it disappears on white
panels, because highlights don't exist on paper, but still bevels a filled
control like the brand button).

It is an inset `box-shadow` rather than a pseudo-element so it survives
`overflow: hidden` children — canvases and scroll regions. If you build a new
raised surface, compose `--panel-highlight`; do not hand-roll a second
highlight value, because two light sources in one viewport is the exact thing
that reads as "assembled from templates".

### `.input-instrument` — the text-input voice

Every search/filter field on the site uses it: `LessonIndex`, `LessonSearch`,
`GlossaryFilter`, `SearchOverlay`. One recipe — tight radius, hairline border,
surface fill, the quiet placeholder voice — so an input cannot quietly
reinvent the soft SaaS pill this language avoids.

What it deliberately does **not** own: sizing. Width, padding and text scale
stay utilities at the call site, and focus comes from the global
`:focus-visible` outline, which text inputs match whenever they are focused.
A call site set in a frame of its own (the search overlay header) overrides
border and background with utilities, which win by layer order (§4 above).

Adding a fifth field means using this class, not writing a fourth variation of
`border border-border rounded-… bg-surface`.

### Cascade layers — the rule that bit us

Every class above lives in **`@layer components`** in `globals.css`, and it has
to stay there.

`@import "tailwindcss"` establishes `@layer theme, base, components,
utilities;`. In the CSS cascade, **unlayered rules beat every layered rule**,
regardless of specificity. So a class defined outside a layer silently defeats
any Tailwind utility composed with it — which is exactly how these are used:

```
class="panel border-l-2 border-l-pillar-edge"   → the accent border did nothing
class="tech-label text-subtle-foreground"       → the color override did nothing
```

Both shipped that way. Nothing failed; the markup read correctly; the overrides
just silently lost. Roughly twenty call sites were affected before it was found.

**The general rule, of which the above is only the first instance: in
`globals.css`, the layer a rule sits in is a statement about who is allowed
to override it, and unlayered means "nobody".** Three questions, one answer
each:

| The rule is… | Put it in | Because |
| --- | --- | --- |
| a **default** a page may want to override per-page | `@layer base` | utilities live in `@layer utilities`, which beats `base` — so the page's override wins, as intended |
| a class meant to be **combined** with utilities | `@layer components` | same reason: the utility composed onto it still wins |
| something that must **win outright** over third-party or plugin CSS | unlayered, plus an `INTENTIONALLY_UNLAYERED` entry | unlayered beats every layer regardless of specificity |

The trap is the first row, and it has now bitten this repo **five times**.
All five were the same mistake: a rule that was a *default*, something any
page or component should have been able to override, written outside a
layer, where nothing can override it.

**Case 2: `[id] { scroll-margin-top: 6rem }`**, a *default* anchor offset for
the sticky navbar, written unlayered. Unlayered, it outranked every Tailwind
utility, so **every `scroll-mt-*` on the site was dead**. `/glossary` is the
case that exposed it: it asks for `scroll-mt-40` above a sticky filter bar,
got 6rem, and landed every glossary deep link — every `<Term>` gloss, the
homepage's glossary link, every glossary hit in site search — about 86px
underneath that bar, where the reader sees a heading they did not ask for and
no sign of the term they clicked. Six other pages carry `scroll-mt-24`,
which is coincidentally the same 6rem: dead, but not *visibly* wrong, so
nothing flagged it. The rule now lives in `@layer base` and the utilities
work. (`GlossaryFilter` still sets its own offset through an inline
`scrollMarginTop: var(--anchor-top)` rather than a utility, because that
offset varies by viewport — 12rem normally, 5rem where the filter bar goes
static on a short screen — which is a custom property's job, not a class's.)

**Case 3: `:focus-visible`.** The global focus ring (§9) was unlayered, so it
outranked every Tailwind utility regardless of specificity, which made every
`focus-visible:outline-none` call site in the codebase dead code, 59 of them
at the time the count was taken. Each of those writes `outline-none ring-2
ring-offset-2` to *replace* the outline with a ring, and instead rendered
**both**: a 2px pillar outline at a 2px offset, plus a pillar ring separated
by an opaque `ring-offset-background` band cutting through the translucent
field. Two of them are the shared link recipes in `Navbar` and `Footer`, so
this was every nav and footer link on every route on the site. In `@layer
base` the
default still reaches everything that asks for nothing, and a control that
deliberately substitutes its own indicator can now actually do so.

**Case 4: `h3[id$="-heading"]`.** Every simulator controls component wires an
`h3` to its `<section>` via `aria-labelledby` pointing at an id ending in
`-heading`. That accessibility convention doubles as a free CSS hook, giving
every control-panel label the instrument voice with no component edits,
which is a genuinely good move, and it was written unlayered. The convention had
escaped the simulators. Unlayered, an id-suffix selector meant for simulator
chrome beat `text-sm font-semibold text-foreground` on the two-qubit
explorer's measurement panel and on `NestedCodeDiagram` twice, and beat
`.tech-label` (which lives in `@layer components`) on the homepage curriculum
strip and `StabilizerTable`, rendering those at 0.75rem/0.12em instead of the
class's 0.6875rem/0.14em. Nobody could see that difference, which is exactly
what made it dangerous: the markup said `.tech-label` and the reader got
something else. It is now in `@layer base`, where it is what it always
claimed to be: the default for a heading that asks for nothing.

**Case 5: two content-scoped attribute selectors.**
`[data-difficulty="master"] .prose` killed `mt-3`, `mt-2.5`, `mt-2`, `mt-1.5`
and `mt-1` on nine paragraphs and lists of every master lesson, and gave
`DerivationSteps`'s `<ol class="not-prose my-8">` a `1.1em` top margin instead
of `2rem`. `[data-callout="note"|"warning"|"mistake"] > p:first-child` put
`font-family`, `text-transform`, `font-size`, `font-weight` and
`letter-spacing` out of reach of any utility. Same shape as cases 2 to 4, and
invisible for the same reason: the markup asks for the right thing and gets
something else.

Applying it: if you add a rule to `globals.css` that is meant to be
*combined* with utilities, put it in `@layer components`. If you add one that
must **win** outright — `.katex-display` (beats KaTeX's own unlayered
stylesheet), the `.prose` overrides (beat the typography plugin), `@media
print`, `prefers-reduced-motion` — leave it unlayered and add it to
`INTENTIONALLY_UNLAYERED` in `src/lib/design/__tests__/cascadeLayers.test.ts`
with a reason.

**That test used to have a blind spot wide enough to let cases 2 through 5
through, and no longer does.** The first version extracted class names from
each selector, so a bare element, pseudo-class or attribute selector was
simply invisible to it, and a walker quirk meant the stylesheet's *first*
rule could never be checked at all. It now works on whole rules:

- the selector is read as the text after the last top-level `;`, so leading
  `@import`/`@plugin` statements cannot swallow the first rule;
- the allowlist is keyed by **normalized selector text**, so an intentional
  exception like `[data-reveal]` is expressible at all;
- a rule that sets only custom properties is exempt by construction, because
  a token block competes with no utility;
- it descends into top-level at-rules, since a rule inside an unlayered
  `@media` is unlayered too. The four media contexts that exist to win are
  named in `POLICY_AT_RULES` with reasons; a responsive `@media (min-width:
  …)` block is held to the same standard as top-level CSS.

So the choice now has to be made deliberately for every rule shape, not only
for classes.

### Utility syntax that compiles to nothing

A different silent failure from the four above, with the same signature: the
class is in the DOM, the markup reads correctly, and the declaration was
never emitted.

Tailwind v4 changed the arbitrary-variable shorthand, and this repo shipped
the v3 form for a long time:

```
rounded-[--radius-tight]     ← v3. In v4 this emits NO CSS. Silently.
rounded-(--radius-tight)     ← v4. Parentheses, not brackets.
```

**85 occurrences across 37 files were dead** before they were found. Nothing
warned: not `tsc`, not the linter, not the build. The class was in the DOM;
the declaration simply never existed. The sweep converted every one and
registered the common cases as named utilities — `rounded-panel`,
`ease-instrument`, and friends — which is the form to prefer, because a named
utility cannot be written in the wrong syntax at all.

The same failure has a second shape. The pillar ramp is exposed to Tailwind
under **shortened** names (`--color-pillar: var(--pillar-accent)` in
globals.css's `@theme inline`), so:

```
text-pillar          ← works
text-pillar-accent   ← compiles to nothing. Ten call sites had it.
```

`border-pillar-accent`, `bg-pillar-accent` and every other prefix behave the
same way. Raw CSS `var(--pillar-accent)` is fine and unaffected — it is only
the *utility* form that is dead.

**`src/lib/design/__tests__/utilitySyntax.test.ts` now guards both**, walking
every `.ts`/`.tsx`/`.mdx` file under `src/` and failing on either pattern.
Comments are stripped before matching, so a file may legitimately *explain*
the dead forms (several do) without tripping the guard. Its exemption
allowlist is empty and is meant to stay that way.

### And the inverse: a comment that compiles to something

Tailwind v4's class extractor reads source files as raw text. It does not
parse JavaScript, and it **does not skip comments**. So a class-shaped string
written in a `.ts` doc comment is not an example: it is an input, and Tailwind
will try to compile it.

This has already taken the whole site down once. A comment illustrating the
container-query breakpoint variant used a placeholder where the pixel width
belongs, something of the shape "at-min, square bracket, angle-bracketed N,
px, square bracket". Tailwind lexed it as a real class and emitted invalid
CSS, and invalid CSS in the one global stylesheet is not a local defect:
**every route returned HTTP 500.**

This is the exact blind spot of the guard above. `utilitySyntax` strips
comments before matching, on purpose, so a file may explain a dead form
without tripping it. Tailwind does the opposite. So when you write a
class-shaped example in a comment, either use a real, valid value, or
describe the shape in prose. Never leave a placeholder inside the brackets.
(This paragraph is written the long way round for the same reason: Tailwind's
auto content detection is not limited to `src/`.)

---

## 5. Layout — breaking card monotony

`src/components/ui/Section.tsx`:

- `<Section width="reading|wide|full" tight bleed>` — vertical rhythm from
  `--rhythm-section` / `--rhythm-block`. Never hand-roll `py-20`.
- `<FullBleed>` — escape a Container to span the viewport.
- `<SplitFigure text figure reverse align>` — asymmetric 1 : 1.35 split;
  collapses with text *before* figure on mobile, which is the order that
  teaches.
- `<Marginalia side>` — a true margin note at `2xl`, inline below it.

A page should alternate: measured reading column → full-bleed instrument →
asymmetric split → margin-annotated figure.

### The four track pages have four composition languages

"Different pillars should feel compositionally different, not just
differently tinted" used to be a request in this section. It is now a
description. Each track page below the fold is structurally, not just
chromatically, its own thing:

| Page | Composition language | Why that one |
| --- | --- | --- |
| `/mechanics` | Editorial reading column, a real numerical simulation where a textbook would put a worked figure, and the curriculum laid out below as a **derivation chain** rather than a card grid. | The subject is continuous argument. |
| `/computing` | **Asymmetric split**, twice. The hero puts a drivable Bloch sphere beside the text introducing it; the curriculum repeats the move with the course stack on the wide side and a real two-qubit circuit on the narrow one. | A gate sequence composed against a state is exactly what these courses are. Putting the circuit in a full-width band said the opposite. |
| `/hardware` | **Schematic.** Heavy technical-voice metadata up top (a real readout strip, not prose pretending to be data), a full-bleed engineering diagram of the drive/readout signal chain, then the five competing platform schematics. | Device-diagram, not editorial. |
| `/software` | **Pipeline.** A four-stage flow strip captioning a live transpile/execute instrument, and `PillarPipeline` drawing the three courses as three stages of one line with each stage's inputs and outputs read out of the registry. | Both are flows because the subject is one. |

Each page file carries this reasoning in its own header comment, and
`PillarFraming.tsx` carries the shared half: what the four pages must
nevertheless answer, **in the same order** (eyebrow → what this pillar is in
one plain sentence → what it assumes and how deep it goes → honest readouts →
what you can do after it → real lesson titles → the course list → where it
leads). Divergent shape, identical question order. That is the whole trick,
and the derivable answers are derived from curriculum data rather than
hand-written into four files where they would go stale the moment a course
moves.

`/software`'s flow strip is hand-rolled rather than reusing the generic
`PipelineDiagram` visualization, which hard-codes the site-level `--accent`
token; the local one stays in the pillar channel so it retints correctly
under `data-pillar="quantum-software"`.

### `TierLadder`, the one thing that is identical everywhere

The cost of four composition languages is that the *hierarchy between* the
tracks had nowhere to live: a visitor on `/apex` saw a page shaped like
`/mechanics` and had no way to know one is the summit and the other the
ground floor.

So `src/components/pillar/TierLadder.tsx` renders identically on all **six**
track pages (`/mechanics`, `/computing`, `/hardware`, `/software`,
`/mastery`, and `/apex` via `ApexHero`): four rungs, same place every time.
The rung you are on is filled in the pillar's own accent, rungs already
passed are filled and quiet, rungs ahead are **hollow**: an outline over
nothing, which is a *shape* difference rather than another value of the same
fill, so it survives grayscale and colour-vision deficiency. (It used to be
`bg-border`, and `--border` is documented above at 1.41:1 precisely because
it is decorative chrome, so the fourth state was simply invisible. The rungs
are 6px rather than 3px for the same reason: 1px of border each side of a 3px
bar leaves 1px of interior, which is not a hollow, it is a slightly paler
solid.) The active *label* also carries weight, because two solid fills are
one channel and the distinction has to survive the hue being removed. On
paper it must, since `[data-decorative]` is `display: none` under `@media
print` and the printed ladder is four words plus a sentence stating the tier
and its number in full.

Rungs are not links. A tier is not a destination (two of them hold two
tracks), and four vague navigation targets is the "Explore / Open / Learn
more" pattern the rest of this work is removing. The one real link is the
named neighbouring track underneath.

It sets no colour of its own; the active rung reads the `pillar-*` ramp
`PillarScope` already switched on, so the ladder looks like the page it is on.

---

## 6. Motion

| Primitive | File | Notes |
| --- | --- | --- |
| `<Reveal as delay y repeat>` | `motion/Reveal.tsx` | The one entrance animation. One shared IntersectionObserver for the whole page; the transition itself is CSS. Stagger siblings by 60–120 ms. |
| `useScrollSubscription(cb)` | `motion/useScrollProgress.ts` | One rAF-coalesced scroll listener site-wide. High-frequency consumers write to a ref/canvas — **never to `useState`**. |
| `useScrollProgress(steps)` | " | Quantised scroll progress for the rare consumer that must re-render. |
| `usePrefersReducedMotion()` | `motion/usePrefersReducedMotion.ts` | Canonical location. The old simulator-local path re-exports it. |
| `.panel-arrive` | globals.css §9 | The arrival of a panel that appears in response to a deliberate action (`PredictBeforeReveal`'s answer). A *mount* animation, not a JS class flip: the element is conditionally rendered, so it plays exactly when it should with no state and no effect. |
| `.trace-sweep` | globals.css §9 | A travelling highlight along a rule. Reduced-motion gated **and** gated on intent; see below. |

Tokens: `--ease-instrument` (entrances), `--ease-mech` (state changes),
`--dur-instant|fast|base|slow|scene`.

**Reduced motion is enforced globally** in globals.css §11 (all animations and
transitions neutered, `[data-reveal]` force-shown). Canvas loops must check
`usePrefersReducedMotion()` themselves — a media query cannot stop a rAF loop.

### No ambient loop next to prose

There is now **no perpetual animation anywhere in the reading column**, and
that is a rule rather than an accident of the current component set.

`.trace-sweep` used to run continuously. Its one call site is the base rule of
`NextDiscovery`, which closes **all 219 lessons**, directly under the "next
discovery" heading, so a reader who had just finished four thousand words of
quantum
field theory got something moving in their periphery while they decided where
to go next. "Signal flowing" is a mood, and a mood is not information about
what the next lesson is. It now runs only under
`:where(:hover, :focus-within)`, which makes it what it should always have
been: a response to the reader pointing at the card. It also owns its own
gradient now. That was two arbitrary-value utilities at the call site, which
meant the visual and the motion animating it were defined in two files and
neither said what it was for.

**`.field-breathe` was deleted outright** rather than gated: the keyframe, the
class, and its `INTENTIONALLY_UNLAYERED` allowlist entry. It was a pulsing dot
beside a citation in the `ResearchConnection` header, standing in for "current,
ongoing" next to a label that already read *Research connection*, on 34 lesson
pages. A static glyph replaced it that says something the label does not (an
arrow leaving a bracket: this points off the site), after which nothing
referenced the class. If you find `.field-breathe` referenced anywhere, that
reference is stale.

Everything left is purposeful by construction: `Reveal` is a one-shot
entrance, `.panel-arrive` fires on a deliberate action, `animate-pulse` is
confined to loading skeletons, and the `animate-ping` markers are measurement
feedback inside simulators.

---

## 7. The background environment

`src/components/field/` — a persistent, scroll-driven layer behind the whole
site.

- `regimes.ts`: **eight** environments. Six of them depict the physics of a
  pillar, not generic particles: `wave` (a genuinely dispersing Gaussian wave
  packet with its probability-density envelope), `state` (Bloch precession
  with matching Born-rule probability bars), `lattice` (control pulses
  travelling a qubit lattice at finite speed), `graph` (a circuit executing),
  `operator` (the magnitude structure of a Fourier-like unitary) and
  `frontier` (Apex's rising horizon separating settled results from sparse,
  tentatively-linked open problems). The other two are structural: `journey`
  crossfades all six in curriculum order across the homepage scroll, and
  `atlas` is the calm, pillar-less reference environment.
- **`atlas` is the default, and `journey` is never inferred.** `journey`
  means something only on a page whose scroll position tracks a descent
  through the curriculum. When the default resolved to `journey`, six routes
  with no `<PillarScope>` at all inherited the homepage's crossfade purely by
  omission. Every route should declare its regime explicitly: bare
  `<PillarScope>` for the neutral case, `pillar={…}` for a pillar page, and
  `regime="journey"` on `src/app/page.tsx` alone.
- `QuantumField.tsx` — one canvas, one rAF loop, DPR capped at 2 (1.5 on
  phones), `detail`/`intensity` scaled down on small screens and low-core
  devices, paused when the tab is hidden. Under reduced motion or `saveData`
  it paints **one static frame and then stops**, which is deliberate: the
  environment is still there, nothing moves. (This bullet said "not rendered
  at all" until 2026-08-30, which was stale; the code comment was correct and
  `scripts/audit/a11y.mjs --checks motion` verifies the real behaviour by
  hashing the canvas pixels across a scroll.) `aria-hidden`, with an `sr-only`
  text description of what the environment depicts.
- `PillarScope.tsx` — **server** component: sets `data-pillar`, paints the CSS
  atmosphere (survives no-JS, reduced motion and the pre-hydration frame), and
  declares the canvas regime.
- `fieldStore.ts` / `FieldRegimeSetter.tsx` — module store, so declaring a
  regime does not make a page a client component.

**Rule: the field may never compete with text.** Three things enforce it, and
the first two were not enough:

- `intensity`, which the caller caps, multiplied into all alpha.
- `REGIME_ALPHA_CEILING` in `regimes.ts`, which bounds **a single mark**.
- `REGIME_COMPOSITE_CEILING`, a measured per-regime multiplier applied once on
  the top-level regime, plus the per-theme `--field-strength` token.

The third exists because the second is not sufficient and the gap was real. A
ceiling of 0.55 on one mark says nothing about a frame that composites many:
`1 - (1-a)(1-b)` put real pixels at 0.72 to 0.82. And the ceiling had been
reasoned against `--foreground` alone, while `Lede` is `--muted-foreground` at
20px and captions, units and code are `--subtle-foreground` at 12px. A
2026-08-30 measurement of the canvas's own backing store, over 70 frames and 3
scroll positions per regime, found **seven of the eight regimes taking a text
voice below AA, and three taking body text below it**: `graph` reached 2.40:1
against `--foreground` on `/software`. Light mode needs `--field-strength`
particularly, because light `--subtle-foreground` starts at 4.98:1 on
`--depth-0`, half a point of margin before anything is painted at all.

`scripts/audit/field.mjs` is the check, and it exits non-zero while any
regime/voice pair is under AA. `compositedContrast.test.ts` remains correct
about what it models, which is the CSS atmosphere; it cannot see the canvas,
which has no closed form. Run both.

If you cannot comfortably read body copy over the field, it is too strong, and
now there is a number for it.

---

## 8. Visuals must teach

Every diagram, animation and figure needs an answer to *"what does this help
the learner understand?"* A wave animation shows wave behavior; an
entanglement visualization reveals correlations; a circuit executes; a
measurement animation communicates measurement. Decorative motion with no
educational payload does not ship.

Conversely: **do not read this as "add fewer visuals."** If a hard concept
would land better with a diagram, an animated derivation, a real photograph or
an interactive figure, build it.

External imagery goes through `ExternalFigure` and **must** be on a host
allow-listed in `next.config.ts`'s CSP `img-src`; `lessonImages.test.ts`
enforces this and will fail the build otherwise. Attribution (credit,
license, source URL) is required.

### The figure box is 254px, and SVG type is scaled by it

An SVG figure does not render at the size its `viewBox` suggests. Its type is
scaled by the box the layout gives it, and the narrowest box on this site is
the one it gets in a lesson at a 320px viewport:

```
320   viewport
-32   Container px-4
=288  content column
-34   2 x (panel inset: 16px padding + 1px border)
=254  the SVG's real box
```

So **effective type size is `fontSize x 254 / viewBox width`**. A 480-unit
viewBox needs about 17 units to clear a 9px floor; a 640-unit box needs about
23. A figure nested one panel deeper gets about 220px, and simulator figures
land back on 254 via `Instrument`'s padding on a 1px-bordered `.instrument`.
Say which box you computed against in the comment.

This is written down because a sitewide legibility pass computed against 288
instead, and wrote that number into roughly fifteen files' justifying
comments. Every claimed effective size was 13% optimistic, and four figures
were still under their own stated floor. Two files had the right number all
along, so the wrong one was copied straight past a correct counter-example.

Two consequences worth knowing before you change a size:

- **Text that overflows a `viewBox` is silently clipped, not scrolled.**
  Raising a size means recomputing label positions, not just the number.
- `src/lib/design/__tests__/figureLegibility.test.ts` holds the floor, and it
  understands the responsive pairs this tree uses (a phone variant and a wide
  variant gated on a container query), so it charges each half the box it is
  actually painted in.

---

## 9. Accessibility — non-negotiable

- Everything conveyed visually needs a text equivalent (see how
  `QuantumField` exposes its regime description).
- `:focus-visible` is defined globally in the pillar color with an offset, in
  `@layer base` (§4, case 3). Do not remove outlines. If a control genuinely
  needs to substitute its own indicator, `focus-visible:outline-none` now
  actually works. It did not while the rule was unlayered, and every call
  site was painting two indicators at once.
- Contrast: `--muted-foreground` and `--subtle-foreground` both pass AA on
  `--depth-0`. If you introduce a new color, verify it.
- Heading outline stays valid — `SectionTitle`'s `level` is separate from
  `size` precisely so you never fake it.
- Decorative layers get `aria-hidden="true"` **and** `data-decorative=""` (the
  latter is what the print stylesheet keys off).
- Keyboard: dropdowns/disclosures close on Escape, outside click and blur —
  see `Navbar`'s existing implementation for the standard to match.

## 10. Performance — non-negotiable

Hundreds of static pages. Keep them static.

- Server components by default. `"use client"` only at leaves that genuinely
  need interactivity — `PillarScope` and `Section` are server components on
  purpose.
- No animation library. No blur-heavy compositing.
- Heavy simulators stay behind their existing `Lazy*` wrappers.
- No `useState` on scroll or pointer-move at input frequency.
- No layout thrash: never read `getBoundingClientRect()` inside a scroll
  handler; use the shared subscription.

### The client-bundle boundary — the other rule that bit us

**A `"use client"` component must never import a content registry.** Not
`@/lib/problems/registry`, not `@/lib/content/lessons`, not anything under
`src/content/`.

`registry.generated.ts` *statically* imports every problem module (556 of
them), so
importing it pulls in every question, hint, tolerance, **answer and worked
solution** — measured at ~366 KB gzip. `src/components/home/DailyPuzzle.tsx`
was a client component that called `getAllProblemMeta()` to preview one daily
problem, and shipped the entire problem corpus to every homepage visitor. The
homepage bundle was more than double every other route's, and the answers to
every problem on the site sat in a file any student could open in devtools.
`tsc` was happy and the page rendered correctly.

The fix pattern: **shape the data in a server component, pass the minimum to a
thin client child.** `DailyPuzzle` (server) now builds a lean
`{slug, title, prompt, difficulty, estimatedMinutes}` list and hands it to
`DailyPuzzleClient`.

`src/lib/design/__tests__/clientBoundary.test.ts` walks the real import graph
from every `"use client"` entry point and fails on any path that reaches a
server-only module. Smaller data modules a genuinely interactive UI *does*
need — `curriculum.ts`, `concepts.ts`, `currentQuantum/metaRegistry.ts`, for
search and filtering — are allowed but carry a gzipped size budget in that
same test, so they cannot quietly balloon. (`glossary.ts` used to be one of
them. It is now server-only outright: nothing client-side imports it any
more, because glossary rows are baked into `public/search-index.json` at
build time, and "must not reach a browser at all" is a stronger promise than
a number that has to be renegotiated every time a term is added.)

**Three things about those budgets are worth knowing before you read a
number in that file.**

1. **They measure payload, not source.** `payloadKb()` strips block comments
   and whole-line `//` before gzipping, because comments are 14–74% of the
   gzipped source of the budgeted modules (`lib/problems/types.ts` is 74%;
   `field/regimes.ts` 54%; `curriculum.ts` 30%) and they ship nowhere. The
   budgets were measured against raw source for a while, which made this
   suite a tax on the one thing this codebase most wants people to do: a
   fifteen-line comment explaining why a prerequisite edge was removed pushed
   `curriculum.ts` past its ceiling over bytes no browser ever receives. A
   guard that punishes documentation gets the documentation deleted, or gets
   its number raised until it guards nothing. Every budget was re-baselined
   downward when this changed — `curriculum.ts` 16→12 and `concepts.ts`
   18→14 are the two visible in git; `currentQuantum/metaRegistry.ts` (4) and
   `lib/problems/types.ts` (2) came down the same way. Smaller numbers, and
   not one of them looser. `curriculum.ts` is the one to watch: it sits just
   under its own budget, with course descriptions the largest thing in it.
2. **So does the total ceiling**, which is the quantity no per-module budget
   can see: this app regresses by *addition* — ten new 3KB modules, each
   obviously fine, each added by a different person — not by any one module
   growing. `CLIENT_DATA_TOTAL_CEILING_KB` is the guard.
   **Read its current value and its derivation out of the test, not out of
   this document.** It has moved more than once (the figure it originally
   replaced, 160.3 KB, counted comment text), and the file carries the
   working: measured total, plus the slack the per-module budgets already
   grant, rounded up by the only free room anyone allowed themselves. Quoting
   a number here would go stale the next time someone deletes a module.
3. **The famous ~366 KB is raw gzipped source of the problem registry**, not
   a payload number, and it is quoted that way on purpose: it is the size of
   the thing that must never ship, not a budget anyone is measured against.

`KATEX_IN_EAGER_CLIENT_GRAPH` in the same file is the fourth guard: a map of
routes whose eager client graph reaches `katex`. It is **empty and meant to
stay that way** — an entry is debt with its fix written down, not a licence,
and the test fails the moment an entry stops matching reality so a fixed
chain cannot leave an excuse behind for the next route. The last chain it
recorded was `/problems/[slug]`; see ARCHITECTURE.md §7b for how it was
closed.

---

## 11. Checklist before you call anything done

- [ ] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` all clean
- [ ] Looks right in **both** themes
- [ ] Looks right with reduced motion on
- [ ] No horizontal overflow at 320 px
- [ ] Keyboard-reachable, visible focus
- [ ] Every new visual answers "what does this teach?"
- [ ] No scientific content altered to suit the design
- [ ] If you edited lesson content: it **renders**, not just compiles
      (`lessonRender.test.ts` — a component that throws mid-render compiles
      perfectly and only fails at build time, seven minutes in)
- [ ] If you added a rule to `globals.css`: it is in `@layer components` (a
      class composed with utilities), or `@layer base` (a default a page may
      override), or it is in `INTENTIONALLY_UNLAYERED` with a reason (§4).
      Unlayered is the wrong default, not the neutral one
- [ ] If you wrote a utility referencing a CSS variable: it uses v4's
      `rounded-(--var)`, never v3's `rounded-[--var]`, and no
      `*-pillar-accent` class (§4) — `utilitySyntax.test.ts` catches both
- [ ] If you drew a figure: its axes and tick labels use `--axis`, not
      `--border` (§2), its axis range comes from its data rather than its
      annotations (`figureDomains.test.ts`), and its in-SVG type was sized
      against the 254px box, not the 288px column (§8) —
      `figureLegibility.test.ts` checks the last one
- [ ] If you wrote a class-shaped string in a **comment**: it is valid, or it
      is prose (§4). Tailwind's extractor does not skip comments, and a
      placeholder inside arbitrary-value brackets compiles to invalid CSS,
      which 500s every route
- [ ] If you added a `"use client"` component: it reaches no content registry
      (§10) — `clientBoundary.test.ts` walks the real import graph
- [ ] If you changed a component the print stylesheet targets: its selectors
      still match (`printAndReducedMotionSelectors.test.ts`)
- [ ] If you wrote a type size or a letter-spacing: it is a token, not a
      literal (§3). There are three sizes below `text-xs` and two tracking
      values, and no test enforces this one
- [ ] If you built a new boxed device for a lesson: it is distinguishable
      from the existing seven **in grayscale** (§4). A new hue is not a
      distinction
- [ ] If you added an animation: it is not a perpetual loop next to prose
      (§6). Gate it on hover, focus, mount, or a deliberate action

`npm test` runs all of these. A green suite is the bar, not a formality —
every one of those checks exists because the thing it guards already broke
once, silently.

---

## 12. Lesson narrative components

`src/components/narrative/` — ten MDX components (`LessonHook`, `Question`,
`InsightBlock`, `DerivationSteps`/`DerivationStep`, `EquationReveal`,
`AnnotatedFigure`, `ResearchConnection`, `HistoricalMoment`,
`ChallengePrompt`, `NextDiscovery`) plus six restyled
pre-existing ones (`Callout`, `DefinitionBox`, `TheoremBox`,
`ExternalFigure`, `InteractiveSection`, `PredictBeforeReveal`), and the
inline glossary gloss `Term` (`src/components/mdx/Term.tsx`, over 550 call
sites across more than 190 of the 219 lessons), give a lesson author a vocabulary
for structuring a lesson as hook → question → visualization → prediction →
derivation → physical intuition → research connection → challenge → next
discovery, instead of undifferentiated prose. They compose from the
primitives elsewhere in this document (type voices, panel surfaces, pillar
tinting) rather than introducing a parallel visual language.

**Most, but not all, are registered globally in `src/mdx-components.tsx`.**
That mapping is capped at 30 entries and holds 27, because every entry is
eagerly imported into all 219 compiled lesson graphs (see ARCHITECTURE.md §5).
`Question` (3 lessons), `AnnotatedFigure` (8) and `ToggleView` (2) are below
the roughly-≥10-lessons bar and are imported explicitly by the files that use
them. So is `ScrollableFigure` (11 files, 22 call sites), which lives in
`src/components/mdx/` and centralises the keyboard-reachable frame for a wide
figure. Adding a call site for one of those
means adding its `import` too, which fails loudly rather than silently, so
this is safe to get wrong once.

This document stays the source of truth for the visual rules those
components follow. For per-component prop APIs, usage examples, and
guidance on choosing between similar-looking ones (`Callout` vs.
`InsightBlock`, `Question` vs. `PredictBeforeReveal`, `ExternalFigure` vs.
`AnnotatedFigure`), see the author-facing reference:
[`docs/NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md).
