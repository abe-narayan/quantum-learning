# QuantumLearn design system — "The Instrument"

This is the single source of truth for how QuantumLearn looks and moves.
Everything below already exists in the repo. **Read this before adding any
visual code, and compose from these primitives rather than inventing a
parallel system.**

---

## 1. The idea

QuantumLearn is a **research console**, not an educational website. Deep,
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
(`--color-axis` / `--color-axis-grid` in `@theme inline`). 38 figure
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

Rules: the reading column is ~46rem (`Section width="reading"`). Do not put
20px type at full page width. `.prose h3` stays in the body face — that is
deliberate, documented in `LessonLayout`, and should not be "fixed".

### Earned variation, not decoration

A page may look different from its neighbours **only when the difference
carries information the reader can use.** Variation that a reader cannot cash
in is decoration, and decoration is what makes a site look assembled rather
than designed.

The one typographic instance of this in the codebase is difficulty density.
`LessonLayout` stamps `data-difficulty` on the lesson root, and
master-difficulty lessons set slightly tighter prose:

```css
[data-difficulty="master"] .prose            { line-height: 1.65; }
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

The trap is the first row, and it has now bitten this repo twice. The second
case was `[id] { scroll-margin-top: 6rem }` — a *default* anchor offset for
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

Applying it: if you add a class to `globals.css` that is meant to be
*combined* with utilities, put it in `@layer components`. If you add one that
must **win** outright — `.katex-display` (beats KaTeX's own unlayered
stylesheet), the `.prose` overrides (beat the typography plugin), `@media
print`, `prefers-reduced-motion` — leave it unlayered and add it to
`INTENTIONALLY_UNLAYERED` in `src/lib/design/__tests__/cascadeLayers.test.ts`
with a reason. That test fails on any unreviewed unlayered class rule, so the
choice has to be made deliberately. Note its blind spot: it scans *class*
rules, so a bare element or attribute selector like `[id]` was never in its
scope — which is why the anchor bug survived it.

### Utility syntax that compiles to nothing — the third silent failure

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
asymmetric split → margin-annotated figure. Different pillars should feel
compositionally different, not just differently tinted.

---

## 6. Motion

| Primitive | File | Notes |
| --- | --- | --- |
| `<Reveal as delay y repeat>` | `motion/Reveal.tsx` | The one entrance animation. One shared IntersectionObserver for the whole page; the transition itself is CSS. Stagger siblings by 60–120 ms. |
| `useScrollSubscription(cb)` | `motion/useScrollProgress.ts` | One rAF-coalesced scroll listener site-wide. High-frequency consumers write to a ref/canvas — **never to `useState`**. |
| `useScrollProgress(steps)` | " | Quantised scroll progress for the rare consumer that must re-render. |
| `usePrefersReducedMotion()` | `motion/usePrefersReducedMotion.ts` | Canonical location. The old simulator-local path re-exports it. |
| `.field-breathe`, `.trace-sweep` | globals.css §9 | Ambient CSS animations, already reduced-motion gated. |

Tokens: `--ease-instrument` (entrances), `--ease-mech` (state changes),
`--dur-instant|fast|base|slow|scene`.

**Reduced motion is enforced globally** in globals.css §11 (all animations and
transitions neutered, `[data-reveal]` force-shown). Canvas loops must check
`usePrefersReducedMotion()` themselves — a media query cannot stop a rAF loop.

---

## 7. The background environment

`src/components/field/` — a persistent, scroll-driven layer behind the whole
site.

- `regimes.ts` — seven environments. **Each depicts the physics of its
  pillar**, not generic particles: a genuinely dispersing Gaussian wave packet;
  Bloch precession with matching Born-rule probability bars; control pulses
  travelling a qubit lattice at finite speed; a circuit executing; the
  magnitude structure of a Fourier-like unitary; and Apex's rising horizon
  separating settled results from sparse, tentatively-linked open problems.
  `journey` crossfades all six in curriculum order across the homepage scroll.
- `QuantumField.tsx` — one canvas, one rAF loop, DPR capped at 2 (1.5 on
  phones), `detail`/`intensity` scaled down on small screens and low-core
  devices, paused when the tab is hidden, **not rendered at all** under
  reduced motion or `saveData`. `aria-hidden`, with an `sr-only` text
  description of what the environment depicts.
- `PillarScope.tsx` — **server** component: sets `data-pillar`, paints the CSS
  atmosphere (survives no-JS, reduced motion and the pre-hydration frame), and
  declares the canvas regime.
- `fieldStore.ts` / `FieldRegimeSetter.tsx` — module store, so declaring a
  regime does not make a page a client component.

**Rule: the field may never compete with text.** All alpha is multiplied by
`intensity`, which the caller caps. If you cannot comfortably read body copy
over it, it is too strong.

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

---

## 9. Accessibility — non-negotiable

- Everything conveyed visually needs a text equivalent (see how
  `QuantumField` exposes its regime description).
- `:focus-visible` is defined globally in the pillar color with an offset;
  do not remove outlines.
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

`registry.generated.ts` *statically* imports all 547 problem modules, so
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
   18→14 are the two visible in git; `problemPillarIndex.ts` (9),
   `currentQuantum/metaRegistry.ts` (4) and `lib/problems/types.ts` (2) came
   down the same way. Smaller numbers, and not one of them looser.
2. **So does the total ceiling**, which is the quantity no per-module budget
   can see: this app regresses by *addition* — ten new 3KB modules, each
   obviously fine, each added by a different person — not by any one module
   growing. `CLIENT_DATA_TOTAL_CEILING_KB` is 100 against a measured 90.1 KB
   of payload across 85 modules; the figure it replaced, 160.3 KB, counted
   comment text.
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
      `--border` (§2)
- [ ] If you added a `"use client"` component: it reaches no content registry
      (§10) — `clientBoundary.test.ts` walks the real import graph
- [ ] If you changed a component the print stylesheet targets: its selectors
      still match (`printAndReducedMotionSelectors.test.ts`)

`npm test` runs all of these. A green suite is the bar, not a formality —
every one of those checks exists because the thing it guards already broke
once, silently.

---

## 12. Lesson narrative components

`src/components/narrative/` — eleven MDX components (`LessonHook`, `Question`,
`InsightBlock`, `DerivationSteps`/`DerivationStep`, `EquationReveal`,
`AnnotatedFigure`, `ResearchConnection`, `HistoricalMoment`,
`ChallengePrompt`, `NextDiscovery`, and `ObservePredictExplain` — the last
of which is used in exactly one lesson and is **recommended for removal**;
do not add a call site, see NARRATIVE_COMPONENTS.md) plus six restyled
pre-existing ones (`Callout`, `DefinitionBox`, `TheoremBox`,
`ExternalFigure`, `InteractiveSection`, `PredictBeforeReveal`), and the
inline glossary gloss `Term` (`src/components/mdx/Term.tsx`, over 550 call
sites across more than 190 of the 219 lessons), give a lesson author a vocabulary
for structuring a lesson as hook → question → visualization → prediction →
derivation → physical intuition → research connection → challenge → next
discovery, instead of undifferentiated prose. All are registered globally in
`src/mdx-components.tsx` and compose from the primitives elsewhere in this
document (type voices, panel surfaces, pillar tinting) rather than
introducing a parallel visual language.

This document stays the source of truth for the visual rules those
components follow. For per-component prop APIs, usage examples, and
guidance on choosing between similar-looking ones (`Callout` vs.
`InsightBlock`, `Question` vs. `PredictBeforeReveal`, `ExternalFigure` vs.
`AnnotatedFigure`), see the author-facing reference:
[`docs/NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md).
