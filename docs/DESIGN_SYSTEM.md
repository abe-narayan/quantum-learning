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
| `--muted-foreground` / `--subtle-foreground` | Secondary and tertiary text. Both pass AA on `--depth-0`. |
| `--brand` / `--accent` | Site-level identity, for surfaces with no pillar. |
| `--success` / `--warning` / `--danger` | Semantic only. Never decorative. |

Tailwind utilities exist for all of these (`bg-surface`, `text-muted-foreground`,
`border-border-strong`, `bg-surface-raised`, `text-subtle-foreground`, …).

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

---

## 4. Surfaces

| Primitive | Where | Use |
| --- | --- | --- |
| `.panel` / `<Panel>` | globals.css §8, `ui/Panel.tsx` | The machined face. Hairline edge, top highlight. |
| `.panel-inset` / `<Panel inset>` | " | A recessed well. |
| `.instrument` / `<Instrument>` | " | Mounted equipment: pillar-tinted, corner ticks, optional label strip + readouts + footnote. **Everything containing a canvas, simulator or large diagram should be one.** |
| `.rule-fade` / `<FadeRule>` | " | Separator that fades at both ends. |
| `.grid-paper` | " | Engineering-grid texture. Always mask it. |
| `Card` | `ui/Card.tsx` | The older, quiet box. Still fine — but if a page is *only* cards, it is not finished. |

No glassmorphism. No blur stacks over the canvas field.

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

If you add a class to `globals.css` that is meant to be *combined* with
utilities, put it in `@layer components`. If you add one that must **win**
outright — `.katex-display` (beats KaTeX's own unlayered stylesheet), the
`.prose` overrides (beat the typography plugin), `@media print`,
`prefers-reduced-motion` — leave it unlayered and add it to
`INTENTIONALLY_UNLAYERED` in `src/lib/design/__tests__/cascadeLayers.test.ts`
with a reason. That test fails on any unreviewed unlayered class rule, so the
choice has to be made deliberately.

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
need — `curriculum.ts`, `concepts.ts`, `glossary.ts`, for search and filtering
— are allowed but carry a gzipped size budget in that same test, so they
cannot quietly balloon.

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
- [ ] If you added a class to `globals.css`: it is in `@layer components`, or
      it is in `INTENTIONALLY_UNLAYERED` with a reason (§4)
- [ ] If you added a `"use client"` component: it reaches no content registry
      (§10) — `clientBoundary.test.ts` walks the real import graph
- [ ] If you changed a component the print stylesheet targets: its selectors
      still match (`printAndReducedMotionSelectors.test.ts`)

`npm test` runs all of these. A green suite is the bar, not a formality —
every one of those checks exists because the thing it guards already broke
once, silently.

---

## 12. Lesson narrative components

`src/components/narrative/` — ten MDX components (`LessonHook`, `Question`,
`InsightBlock`, `DerivationSteps`/`DerivationStep`, `EquationReveal`,
`AnnotatedFigure`, `ResearchConnection`, `HistoricalMoment`,
`ChallengePrompt`, `NextDiscovery`) plus six restyled pre-existing ones
(`Callout`, `DefinitionBox`, `TheoremBox`, `ExternalFigure`,
`InteractiveSection`, `PredictBeforeReveal`) give a lesson author a vocabulary
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
