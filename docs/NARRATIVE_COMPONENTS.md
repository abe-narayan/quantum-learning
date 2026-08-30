# Narrative component reference

Author-facing reference for every component available inside lesson MDX for
building a lesson as an *experience* rather than a styled document — see
`docs/DESIGN_SYSTEM.md` for the visual language these compose from.

> **This file is a guide, not a log.** Everything in it is a rule that binds
> now. Where a rule carries the story of a past failure, the story is kept
> deliberately, because those explanations are why the rules survive contact
> with the next author. But no *finding* lives here: if something was found and
> fixed, it belongs in one of the dated audit logs listed in
> [`docs/README.md`](README.md), not in this file. If you read a sentence
> here that describes a state of the corpus rather than an instruction to
> you, it has rotted; correct it.
>
> **Recount before quoting any number below.** Corpus figures here are dated
> snapshots and have been badly wrong at least once. The callout
> distribution in the `Callout` section had inverted completely, so a doc
> that meant to warn about overuse of one tier was warning about the wrong
> one.

---

## ⚠️ MDX hazards: read before authoring

Every one of these produces **no build error, no type error and no warning**
in the shape that matters. The page simply breaks, or renders wrongly, and
the only way to find out is to open it. Each has already shipped at least
once.

**1. Never write a comment, of either style, anywhere in the export
prologue** (the code above your first `##` heading).

```mdx
export const lessonMeta = {
  title: "…",
  // ← banned, in every position, in both comment styles
  difficulty: "advanced",
};
```

Two lessons shipped this way. Both 404'd: an `export const` after the comment
was never bound, `loadLesson()` caught the `ReferenceError` and returned
`null`, and `next build` reported success throughout. Removing every `//` in
the prologue fixed both; nobody isolated a narrower rule, so the rule is the
broad one.

**This document used to say block comments were fine. They are not**, and the
mechanism is worth knowing because it explains all of this. MDX cuts the
prologue into chunks at blank lines and hands each chunk to acorn. A chunk
that *starts* with a comment does not survive the trip. Compiled against this
repo's own pipeline:

- A single-line `/** … */` or `//` above an `export`: the whole chunk stops
  being code and is emitted as a **paragraph of literal source text** in the
  finished lesson. The export silently ceases to exist.
- A multi-line `/** … */` above an `export`: `Could not parse expression with
  acorn`. Loud, at least.

If a value needs explanation, give it a descriptive name, or explain it in
markdown prose below the block.

**2. Never let `$$` share a line with formula content inside a JSX
component.**

```mdx
<DerivationStep annotation="…">
$$ E = mc^2          ← breaks closing-tag detection
$$
</DerivationStep>
```

Put `$$` on its own line. In plain markdown (outside a component) either form
is fine; inside a component's children it swallows the rest of the document.

**3. Watch bare braces in prose.** MDX parses `{…}` as a JavaScript
expression *anywhere*, including ordinary paragraphs. Writing `e^{iφ}` as
plain text makes MDX evaluate `iφ` and the page dies with "iφ is not
defined". Use inline math — `$e^{i\varphi}$` — or escape the brace.

**4. A JSX expression inside `$…$` is not evaluated, and does not fail.**
This is the quiet cousin of hazard 3. Writing

```mdx
… so $\sigma \approx {SIGMA.toFixed(3)}$ at this coupling.
```

typesets the literal characters `{SIGMA.toFixed(3)}` as math. The reader sees
an italic identifier where a number should be. Nothing errors, the source
reads correctly, and more than twenty of these survived several review passes
before anyone opened the pages. Close the math and reopen it around the
expression instead. **No test covers this one yet**: grep a file you have
edited for a `$` followed by a `{` before calling it done.

**5. `<p className="…">` with its children on the next line styles nothing.**
MDX wraps those children in a second `<p>`, and the browser's HTML parser
closes the outer paragraph as soon as it meets the nested open tag. The class
you wrote ends up on an empty element. Keep the children on the same line as
the tag, or use a `<div>`.

**6. Math in a JSX string prop, or in `lessonMeta`, is never typeset.**
The remark/rehype math pipeline runs over MDX **text nodes**. A JSX attribute
value is not one, and neither is anything inside the `lessonMeta` export. So

```mdx
<AnnotatedFigure caption="The probability density |\psi(x)|^{2} at t = 0" … />
```

reaches the reader as literal `|\psi(x)|^{2}`, backslash, braces, caret and
all. Wrapping it in `$…$` does not help: the dollars render literally too.
There is no error, no type error, and no failing test, and the source looks
correct to anyone who does not know the rule.

The same applies to every `lessonMeta` field a page prints, which is
`title`, `description`, `objectives` and `related[].note`, and to the string
props on every component in this document: `caption`, `ariaLabel`,
`description`, `question`, `label`, `summary`, `note`.

Write those in plain-text-safe form instead, using Unicode where it reads
cleanly: `⟨x⟩`, `|ψ(x)|²`, `e^iφ`, `√2`, `ρ_AB`, `Δx`. A 2026-08-30 audit
found **16 of these in the quantum-mechanics pillar alone**, several of them
in figure captions sitting directly under the equation they were trying to
restate.

Hazards 1 (the `//` form), 2 and 3 are checked mechanically by
`npx vitest run src/lib/content/__tests__/mdxHazards.test.ts`, and
`lessonRender.test.ts` renders all 219 lessons to catch anything that only
fails at render time. **Run both after editing lesson content.**

**And a hazard about editing rather than authoring: do not write lesson MDX
through a shell heredoc.** Backslash escapes are interpreted on the way in
even with a quoted delimiter, so `\alpha` lands as a BEL byte, `\rangle` as a
lone CR and `\to` as a TAB. It has damaged this corpus more than once, the
control characters are invisible when you read the file back, and a lone CR
makes git report a whole-file rewrite that buries the real change. Use a
literal-replacement edit.

---

The narrative arc these support:

```
HOOK → QUESTION → VISUALIZATION → PREDICTION → INTERACTION → EXPLANATION →
DERIVATION → PHYSICAL INTUITION → RESEARCH CONNECTION → CHALLENGE → NEXT DISCOVERY
```

Not every lesson uses every beat. Use only what the content genuinely calls
for — a lesson that boxes every paragraph is worse than one that mostly uses
prose and reaches for these at the moments that earn them.

**Most, but not all, components below are registered globally in
`src/mdx-components.tsx`**, and those are available in any `.mdx` file with no
import. Three are not: `Question`, `AnnotatedFigure`
and `ToggleView`. Each is used by fewer than ten lessons, and that mapping is
capped at 30 entries because every entry in it is eagerly imported into all
219 compiled lesson graphs, paid for by every lesson page's client bundle and
by every static-generation worker (ARCHITECTURE.md §5). Using one of those
three means adding its `import` to the lesson file. Getting that wrong fails
loudly rather than silently: an unresolved tag throws at render, which
`lessonRender.test.ts` catches.

Math inside `children` (`$...$` / `$$...$$`) renders through the site's
normal KaTeX pipeline, same as anywhere else in a lesson. Where that math is
a `$$` display block inside `TheoremBox`, `DefinitionBox` or
`DerivationSteps`, the surrounding device drops the equation slab's own frame
while keeping its scroll, its tab stop and its overflow indicator, so you do
not get two nested pillar rails; see DESIGN_SYSTEM.md §4.

---

## Inline glossary — `Term`

The one gap none of the components above close: a reader mid-paragraph who
doesn't recognize a term has to leave the lesson, go to `/glossary`, search,
and find their way back. `Term` (`src/components/mdx/Term.tsx`) gives a
technical phrase a plain-language definition *in place*, without losing
reading position.

```mdx
The <Term id="partial-trace">reduced density matrix</Term> is what's left
once you trace out the rest of an entangled system.
```

Renders as the phrase with a quiet dotted underline; activating it (click,
or Tab then Space) reveals a small panel with the glossary entry's title,
its one-or-two-sentence definition, and a link to the full `/glossary`
entry. Activating it again — or opening a second `Term` on the page — hides
it.

**Props:**
- `id` (required) — a real `id` from `GLOSSARY_TERMS` in
  `src/lib/content/glossary.ts`, the same id `/glossary` anchors each entry
  on as `#<id>`. **Address by id, not by title.** Prose almost never uses a
  term's exact glossary title verbatim ("the density matrix gets reduced"
  vs. the entry titled "Partial Trace"), so `id` is the stable handle and
  `children` stays free to read naturally.
- `children` (required) — the phrase exactly as it should read in the
  sentence. It does not need to match the glossary entry's `title`.

**An `id` with no matching glossary entry throws during render** — caught
immediately by `lessonRender.test.ts` (which renders all 219 lessons) — the
same "fail loudly, not silently" bar the two MDX hazards above are held to.
A term genuinely missing from the glossary is a gap to fix in
`src/lib/content/glossary.ts` first, not a reason for this component to
quietly render the bare phrase with no gloss.

**Definitions are never authored here.** The panel always shows the live
`definition` (and `title`) from `GLOSSARY_TERMS`, so a `Term` call site can
never drift out of sync with what `/glossary` itself says — edit the
glossary once, every inline gloss for that term updates with it.

**Use sparingly, on genuine first-encounter jargon.** The brief this
component answers is explicit that a paragraph turned into "a minefield of
links" is a failure: gloss the handful of terms in a lesson a newcomer is
actually likely to stumble on, not every noun that happens to have a
glossary entry. A reader who already knows the term should barely notice
the dotted underline; a lesson that glosses six terms in one paragraph has
made every one of them harder to notice. As a rule of thumb, gloss a term
once per lesson, at its first real use — not at every repetition.

**Implementation note, if you're extending this component:** it deliberately
does *not* use `<details>`, unlike `EquationReveal`'s block-level term
glossary. `<details>` is flow content — an HTML parser implicitly closes an
open `<p>` the instant it sees one, which would silently split the
surrounding paragraph in two with no error from MDX, React or `tsc`. `Term`
has to sit *inside* a `<p>`, so it's built from `<span>`/`<label>`/`<input>`
(all phrasing content) with a native checkbox driving the reveal via
`:checked`/`:has()` — zero client JS, and keyboard/screen-reader support
comes from the browser's own checkbox semantics for free. The revealed
panel is a plain block-level reveal in the text flow rather than a floating
tooltip, specifically so it can never overflow sideways at 320px without
JS-measured positioning. See the comment at the top of `Term.tsx` for the
full reasoning before changing either decision.

### Considered and not built: a prose-level "prerequisite check"

The brief for this pass asked us to weigh a lightweight affordance for a
lesson to say "this assumes you're comfortable with X" at a specific point
in the prose — distinct from the frontmatter prerequisites `LessonMetaStrip`
already lists (as a collapsed "Lineage" strip below the lesson body).

Decision: **not built.** The gap it would fill is already covered by two
existing pieces of vocabulary working together, and a dedicated component
would mostly duplicate them: `Callout type="note"` already covers "a
definition reminder, a forward reference" in its documented vocabulary
above, and pairing one with a `Term` for the specific concept and a `Link`
to the lesson that covers it in full gives an author everything a
"prerequisite check" would — a flag, an inline refresher, and an escape
hatch to the fuller treatment — with no new component to learn:

```mdx
<Callout type="note">
  This builds on the <Term id="entanglement">entanglement</Term> covered in
  [Bell states](/lessons/quantum-computing/qubits-and-quantum-states/bell-states) —
  worth a quick look first if that still feels shaky.
</Callout>
```

A component whose only job is to restate that pattern under a new name would
add API surface without adding capability. That is the trap
`ObservePredictExplain` fell into, and it is why that component was removed;
see the note further down.

---

## Restyled existing components

These six existed before this pass and keep their exact prop APIs — only
their visual treatment (and, for `InteractiveSection`, an additive optional
prop) changed. Full docs live as comments at the top of each file.

### `Callout`

A short aside: a note, a caution, or a common-mistake flag.

```mdx
<Callout type="warning">
  Careful: the sign convention flips here.
</Callout>
```

`type`: `"note"` (default) | `"warning"` | `"mistake"`. Severity escalates in
both border weight and typographic voice — `mistake` switches to the display
face, the one thing on the page most likely to catch a scanning eye.

**Pick the tier deliberately — this only works if `mistake` stays rare.**
Recounted 2026-08-30: `warning` 271, `note` 184, `mistake` 49, for 504 uses
across all 219 lessons, every one passing an explicit `type`. That is a
healthy distribution, with `mistake` at under 10%.

It has not always been. This paragraph previously read "`mistake` is used
for ~95% of all callouts, `warning` for under 1%," which was true when it
was written and is now *backwards*: an authoring pass fixed the imbalance,
and anyone reading the old figures would have concluded the exact opposite
of what the corpus says. Recount before trusting these numbers again: they
are a snapshot, not an invariant, and `Callout.tsx`'s own docstring carries
the same warning.

The vocabulary is what actually binds, and it has not changed. Reaching for
`mistake` because it is the loudest option is the drift that produced the
old imbalance:
- `note` — background/context, a definition reminder, a forward reference.
  Not urgent, just useful.
- `warning` — a lower-stakes caution the reader should keep in mind while
  working: a sign convention, a unit, an edge case, "this only holds when…".
  Most asides inside a "Common Mistakes" section that describe something to
  *watch out for* (rather than a mistake already made) belong here.
- `mistake` — reserved for "students reliably get this specific thing
  wrong," stated as the error itself. If most of a lesson's asides are
  `mistake`, most of them are probably `warning`.

### `DefinitionBox` / `TheoremBox`

Formal statements — for naming a concept (`DefinitionBox`) versus stating a
result about it (`TheoremBox`). Mostly used in Quantum Mastery / Apex
lessons.

```mdx
<DefinitionBox title="Self-adjoint operator">
  An operator $A$ such that $A = A^\dagger$ *and* $\mathrm{dom}(A) =
  \mathrm{dom}(A^\dagger)$.
</DefinitionBox>

<TheoremBox title="Stone's theorem" provenance="cited">
  Every strongly continuous one-parameter unitary group $U(t)$ has the form
  $U(t) = e^{-iAt}$ for a unique self-adjoint $A$.
</TheoremBox>
```

`TheoremBox`'s `provenance`: `"cited"` | `"derived"` — whether the lesson
proves the result in full or invokes it from outside its own scope.

### `ExternalFigure`

An externally-sourced photo or illustration (NASA, a lab, Wikimedia
Commons…), styled as a numbered scientific figure with credit/license in the
technical voice.

```mdx
<ExternalFigure
  src="https://upload.wikimedia.org/.../stern-gerlach.png"
  alt="Schematic of the Stern–Gerlach apparatus"
  caption="Silver atoms split into two discrete beams by an inhomogeneous field."
  credit="Wikimedia Commons"
  creditUrl="https://commons.wikimedia.org/wiki/File:..."
  license="CC BY-SA 4.0"
  number={2}
/>
```

`credit`/`license` are required; `caption`, `creditUrl`, `number` (renders a
"Fig. N" label) and `wide` (a bounded, large-screen-only widen) are optional.
**`src` must be on the CSP `img-src` allow-list in `next.config.ts`** — an
unlisted host fails silently (no build/type error) and is caught only by
`lessonImages.test.ts`.

### `InteractiveSection`

Frames an embedded simulator as mounted lab equipment rather than "here is a
simulator," with a concrete instruction before the embed.

```mdx
<InteractiveSection
  title="Watch the packet spread"
  description="Increase the initial momentum spread and note how quickly the packet delocalizes."
  mode="observe"
>
  <LazyWavefunctionExplorer />
</InteractiveSection>
```

(Copied verbatim from the component's own docstring, which names a
`LazyWavePacketSimulator` that has never existed — corrected here to a real
one. Check any name against the real `Lazy*.tsx` files
under `src/components/simulators/` and `src/components/visualizations/`
before pasting an example: an unresolved JSX tag in a lesson is a
*render*-time failure, not a compile one.)

`title` defaults to `"Try it yourself"`. `mode` (optional): `"observe"` |
`"predict"` | `"run"` | `"compare"` — names the label strip badge.

**`mode` has no default.** It used to default to `"run"`, so every call site
that omitted it, which at the time was all of them, was badged "RUN
EXPERIMENT" regardless of what the embed actually did (docs/UX_REVIEW.md
P1-9). An embed with no `mode` now gets the neutral "Interact" badge instead
(honest for any kind of embed, rather than specific and often wrong). Only
7 of 215 call sites pass `mode` as of 2026-08-29, so the neutral badge is
still what almost every embed shows; that is correct-but-uninformative, and
narrowing it is a genuine, cheap improvement available to anyone editing a
lesson. Pass
`mode` explicitly whenever a sharper label is true of this particular embed:
`"observe"` for a slider-and-watch demo with no real decision to make,
`"predict"` when it's paired with (or is) a commit-then-reveal moment,
`"run"` for a genuine multi-parameter experiment worth calling one, `"compare"`
for a side-by-side. New lessons should prefer passing `mode` over relying on
the neutral default.

### `PredictBeforeReveal`

The single best interaction pattern on the site: commit to a guess, then see
what actually happens. A real keyboard radiogroup (arrow keys move the
selection; the option locks once chosen).

```mdx
<PredictBeforeReveal
  question="If you double the box width, what happens to the ground-state energy?"
  options={[
    { label: "Doubles", value: "double" },
    { label: "Halves", value: "half" },
    { label: "Quarters", value: "quarter" },
  ]}
  correctValue="quarter"
  explanation="E_1 ∝ 1/L², so doubling L cuts the ground-state energy to a quarter."
/>
```

The reveal is non-punitive by design — no right/wrong coloring, just "here's
what actually happens."

---

## New narrative components (`src/components/narrative/`)

### `LessonHook` — HOOK

The opening moment: a striking claim or question, set large in the display
voice.

```mdx
<LessonHook eyebrow="Why this matters">
  A single photon can go through two slits at once — and the pattern it
  leaves behind proves it.
</LessonHook>
```

`eyebrow` is optional. Keep it to one or two sentences — this opens the
lesson, it doesn't summarize it.

**Placement: this must come first**, before any heading — including a
`## Motivation`-style one. Placing it after a heading (seen in a meaningful
fraction of current usages, per docs/UX_REVIEW.md P1-8) means the reader has
already scrolled past a section heading and the table-of-contents has
already logged its first entry before the "opening moment" appears — it
stops being a cold open. The component can't enforce this from inside
MDX — get it right at the call site.

### `Question` — QUESTION

A framed question meant to make the reader stop and think. No options, no
reveal — for that, use `PredictBeforeReveal`.

```mdx
<Question>
  If measuring one particle instantly affects its entangled partner, why
  can't we use that to send a message faster than light?
</Question>
```

### `InsightBlock` — EXPLANATION / PHYSICAL INTUITION

"The idea in one sentence" — the single takeaway worth keeping. Distinct
from `Callout`: not a note or a correction, an anchor point.

```mdx
<InsightBlock>
  Superposition isn't the particle being in two places — it's the
  probability *amplitudes* for each place adding together.
</InsightBlock>
```

### `DerivationSteps` / `DerivationStep` — DERIVATION

A numbered derivation, each line a slab with an optional gloss on why the
step is legal.

```mdx
<DerivationSteps>
  <DerivationStep annotation="Apply the product rule.">
    $$\frac{d}{dt}\langle\psi|\psi\rangle = \langle\dot\psi|\psi\rangle + \langle\psi|\dot\psi\rangle$$
  </DerivationStep>
  <DerivationStep annotation="Substitute the Schrödinger equation for both kets.">
    $$= \frac{i}{\hbar}\langle\psi|H^\dagger - H|\psi\rangle$$
  </DerivationStep>
  <DerivationStep annotation="H is Hermitian, so this vanishes.">
    $$= 0$$
  </DerivationStep>
</DerivationSteps>
```

`children` of `DerivationSteps` must be `<DerivationStep>` elements, in
order — numbers are assigned automatically from position; never pass
`stepNumber` yourself.

### `EquationReveal` — DERIVATION / EXPLANATION

An equation with a term-by-term glossary: hover, click, or Tab to a term
chip to see its plain-language meaning. Every gloss is also always visible in
a `<details>` glossary underneath, so nothing is reachable only via hover.

```mdx
<EquationReveal
  terms={[
    { id: "H", symbol: "Ĥ", gloss: "The Hamiltonian — the operator for total energy." },
    { id: "psi", symbol: "ψ", gloss: "The state vector: everything knowable about the system." },
    { id: "E", symbol: "E_n", gloss: "An eigenvalue of Ĥ — an allowed energy the system can have." },
  ]}
>
  $$\hat{H}\psi = E_n\psi$$
</EquationReveal>
```

`children` is the full equation as ordinary MDX math (rendered once,
normally). `terms[].symbol` is a short **plain-text/Unicode** label for the
chip (e.g. `"Ĥ"`, `"E_n"`) — keep it short and Unicode; it's a glossary
label, not a second equation.

**If `symbol` contains raw LaTeX source anyway** (a backslash command, or
`^{`/`_{` grouping — e.g. someone passes `"C^{j,m-1}"` instead of a short
label), the component now detects that and typesets the chip through KaTeX
as a fallback, instead of showing literal `^{...}` source text (this was
`docs/UX_REVIEW.md`'s P0-1 — the single worst rendering defect found). It
also logs a `console.warn` in development pointing at the offending term. **Do
not rely on this fallback** — it exists so a misused call site degrades
legibly rather than breaking, not as a sanctioned way to typeset symbols.
`symbol` should stay a short plain-text/Unicode label; if what you actually
have is a multi-term recursive expression this dense, use `DerivationSteps`
with an `annotation` gloss on each step instead of cramming it into a chip.

### `AnnotatedFigure` — VISUALIZATION

A figure with numbered pins over specific features and a matching legend
below.

```mdx
<AnnotatedFigure
  src="https://upload.wikimedia.org/.../dilution-fridge.png"
  alt="Cutaway of a dilution refrigerator"
  caption="Each stage cools the mixing chamber further toward millikelvin temperatures."
  pins={[
    { id: "still", x: 30, y: 22, label: "Still — where the ³He/⁴He mixture is distilled." },
    { id: "mc", x: 55, y: 78, label: "Mixing chamber — the coldest stage, where the qubits sit." },
  ]}
  number={3}
/>
```

`x`/`y` are percentages of the image's own box (0–100), so pins stay
correctly placed at any width. `credit`/`creditUrl`/`license` are optional
(unlike `ExternalFigure`, since not every annotated figure is externally
sourced) — but an external `src` is still subject to the same CSP
allow-list. `aspect` optionally reserves the figure's space before the image
loads (e.g. `aspect="aspect-[4/3]"`) — pass the image's **actual** ratio or
not at all, because pin coordinates are percentages of the rendered image box
and a mismatched ratio letterboxes the image and slides every pin off its
feature. `number` (a "Fig. N" label) and `wide` (a bounded, large-screen
widen — more room before pins start crowding) mirror `ExternalFigure`'s
props of the same name, so swapping one component for the other never loses
either.

**When to use this vs. `ExternalFigure`:** the moment a figure needs a
reader to find *more than one* specific labeled feature — an apparatus
photo, an instrument cutaway, a schematic with several named stages — reach
for `AnnotatedFigure`. If the image only needs one caption describing the
whole thing, `ExternalFigure` is simpler and correct; converting only pays
off once you're naming individual parts. Quantum Hardware's platform and
cryogenics lessons are the canonical case (this component's own docstring
example *is* a dilution-refrigerator cutaway), and all six of them now use
it. If you are adding an apparatus photo to a hardware lesson and reaching
for a flat single-caption `ExternalFigure`, look at
`physical-qubit-platforms/trapped-ions.mdx` first.

### `ResearchConnection` — RESEARCH CONNECTION

"This is live research" — carries a real paper or lab result, in the
citation voice.

```mdx
<ResearchConnection
  title="Error rates below the surface-code threshold"
  source="Google Quantum AI, Nature (2023)"
  url="https://www.nature.com/articles/s41586-022-05434-1"
>
  The logical qubit in this experiment got *more* reliable as it got
  larger — the first experimental evidence that scaling actually helps, not
  just theory predicting it should.
</ResearchConnection>
```

`url` is optional; when present, `source` becomes the citation link.

### `HistoricalMoment`

A dated moment with real historical context — a timeline entry, not a boxed
card, so a run of these reads as one continuous timeline.

```mdx
<HistoricalMoment date="1935" place="Institute for Advanced Study, Princeton">
  Einstein, Podolsky and Rosen publish the paper arguing that quantum
  mechanics must be incomplete — the argument that, three decades later,
  Bell would turn into a testable prediction.
</HistoricalMoment>
```

`place` is optional.

### `ChallengePrompt` — CHALLENGE

The "now you try" beat at a lesson's end. Deliberately open (no border, no
panel) — a change of gear from every boxed component above it.

```mdx
<ChallengePrompt prompt="Work out the ground-state energy for an infinite well twice this width.">
  You already have every piece you need from this lesson — no new formula
  required.
</ChallengePrompt>
```

`children` is optional extra detail or hints below the prompt.

### `NextDiscovery` — NEXT DISCOVERY

The forward hook — a teaser for what's next, usually right after
`ChallengePrompt`.

```mdx
<NextDiscovery>
  Next: what happens when you entangle *three* particles instead of two —
  and why the result breaks an assumption Bell's theorem itself relies on.
</NextDiscovery>
```

### `ObservePredictExplain` — removed 2026-08-30

**This component no longer exists.** The section that stood here documented
it while recommending its removal, which is a state a doc should not stay in;
both the component and the recommendation are now resolved.

Kept as a short note because the reasoning generalises. The site's one
established, load-bearing interaction is predict-*then*-observe
(`PredictBeforeReveal`, which appears in 218 of the 219 lessons).
`ObservePredictExplain` was that pattern's mirror image: it showed the reader
a result before asking them to commit to a guess about it, which gives away
the answer the guess exists to test. Five independent review passes reached
that conclusion, and its single call site
(`quantum-hardware/control-and-readout/qubit-readout-techniques.mdx`)
demonstrated the failure exactly: its `observe` slot told the reader to watch
the live fidelity readout, and the `predict` slot then asked what happens to
the fidelity.

That lesson was migrated to the sequence the component's own "when not to use
this" advice described: an `InteractiveSection`, then a `PredictBeforeReveal`
with its question reworded to stand alone, then prose. The component and the
lesson's import were deleted in the same change, which is the order that
matters: deleting the component first would have left a tag resolving to
nothing, and `lessonRender.test.ts` catches that only after the fact.

**The generalisable rule: never show any part of an answer before the
commitment that answer is meant to test.** When adding or reviewing a reveal
component, check the ordering of its slots as rendered, not as named.

---

## Choosing between similar-looking components

- **A technical term a newcomer may not know, used in passing in a
  sentence** → `Term`, addressed by its glossary `id`. Not for a concept the
  lesson is about to spend a whole section defining and deriving — that's
  `DefinitionBox`, in full, once. `Term` is for the second, third, offhand
  mention, or a term from *another* lesson's vocabulary that this one
  leans on without re-teaching it.
- **A short aside** (note/caution/correction) → `Callout`.
- **The one-sentence takeaway** → `InsightBlock`.
- **A provocative question with no answer options** → `Question`.
- **A question with answer options and a reveal** → `PredictBeforeReveal`.
- **An embedded simulator/visualization** → `InteractiveSection`.
- **A step-by-step algebraic/logical derivation** → `DerivationSteps`.
- **An equation whose individual symbols need explaining** → `EquationReveal`.
- **A photo/diagram needing full attribution** → `ExternalFigure`.
- **The same, but pointing at several specific labeled features of it (an
  apparatus photo, an instrument cutaway)** → `AnnotatedFigure`.
- **A demonstrated result + a specific prediction + the mechanism** →
  sequence `InteractiveSection` → `PredictBeforeReveal` → prose directly.
  There is no wrapper for this and there should not be: the wrapper that
  existed put the demonstration before the prediction, which gave away the
  answer the prediction was there to test. Predict first, then show.
- **A formal named result** → `TheoremBox` (a claim) or `DefinitionBox` (a
  name).
