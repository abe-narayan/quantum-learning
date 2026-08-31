@AGENTS.md

# StudyQuantum

A static Next.js 16 site: a quantum physics and quantum computing curriculum
of 219 lessons, 556 problems, 32 courses across 6 pillars, and 14 simulators.
No backend, no database, no API routes, no environment variables. See
[`README.md`](README.md) for the stack and the architecture in brief.

**Read before writing code:**

| Doc | When |
| --- | --- |
| [`docs/README.md`](docs/README.md) | The index. Says which docs bind and which are dated logs, and lists every test that enforces a rule. Start here. |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Any visual code. Its §4 (cascade layers) and §10 (client-bundle boundary) each document a class of bug that shipped silently. |
| [`docs/NARRATIVE_COMPONENTS.md`](docs/NARRATIVE_COMPONENTS.md) | Any lesson MDX. Its hazards section is the most load-bearing page in this repo. |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | The build pipeline, the math pipeline, or any "load the whole corpus" convenience. |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Information architecture, content pipelines, the problems system (§7b). |

**The six things most likely to cost you a silent failure here:**

1. **MDX fails quietly.** A comment in a lesson's export prologue, a `$$`
   sharing a line with a formula inside a JSX component, a JSX expression
   inside `$…$`, a `<p className>` whose children start on the next line, and
   **math written in a JSX string prop or in `lessonMeta`** (the math pipeline
   runs over text nodes only, so it reaches the reader as literal `^{...}`
   source): all compile, none error, and the page is wrong or gone. Full list
   in `docs/NARRATIVE_COMPONENTS.md`; most are guarded by
   `src/lib/content/__tests__/mdxHazards.test.ts`.
2. **Unlayered CSS beats every `@layer`,** regardless of specificity. Five
   live bugs so far. `src/lib/design/__tests__/cascadeLayers.test.ts`.
3. **A `"use client"` component must never reach a content registry.**
   `src/lib/design/__tests__/clientBoundary.test.ts` walks the real import
   graph, and also holds a ceiling on the total of client-reachable data.
4. **Do not edit through a shell heredoc.** Backslash escapes are
   interpreted even with a quoted delimiter, so `\alpha` becomes a BEL byte
   and `\b` in a regex becomes a literal BACKSPACE. Nothing catches it.
5. **Never pass `--reporter=basic` to Vitest.** It crashes during reporter
   loading and exits 0, so a run of zero tests reads as a pass.
6. **A lesson, its problems, its glossary entry and its simulator can each be
   correct and still disagree with each other.** Every file compiles, every
   file renders, every test passes. A problem once said the 3-qubit bit-flip
   code is `[[3,1,3]]` while its own lesson said, in bold, that it is distance
   1 as a general quantum code. When you change a claim, grep the other three
   surfaces for it. `src/lib/problems/__tests__/crossSurfaceConsistency.test.ts`
   catches the shape both known instances shared, which is an unqualified
   absolute on the problem side of a claim the lesson side qualifies.

**Counts are derived, never typed.** Problem, lesson, course, glossary and
route totals each have exactly one derivation in code, pinned by a test. A
hand-typed 549 against a corpus of 556 rendered on every page once. If you
need a number, re-derive it or cite the module that owns it.

**Reader-facing prose contains no em dashes.** That covers lesson MDX,
problem content and UI strings, and it is enforced by
`src/lib/content/__tests__/readerFacingDashes.test.ts` over three scopes: all
of `src/content`, every `.tsx` outside tests with comments stripped, and every
`.ts` outside tests **inside string literals only**. That last restriction is
what makes the `.ts` half possible: a regex literal is not a string literal, so
the validators' deliberate `[.;:!?\n—]` character classes are excluded by
construction rather than by an allowlist that would rot. A further check covers
the same character written so the file does not contain it: a `\u2014` escape,
an HTML entity, or a `fromCharCode`. The rule already bans three other dash
codepoints so it cannot be met by swapping the character, and one that can be
met by swapping the encoding is exactly as hollow. En dashes are correct
typography and are left alone: the corpus uses about 111 of them, for name
pairs (Cauchy-Schwarz), page ranges and axis pairs.

**Content clipped by an `overflow: hidden` or `overflow: clip` ancestor is
unreachable, not safe.** `body` carries `overflow-x: clip`, so an element
wider than its container produces no page scrollbar and no overflow warning;
it just loses its right-hand end. Three defects of this shape shipped. When
you check a layout, measure `scrollWidth` against `clientWidth` on the
element, not `documentElement.scrollWidth` against the viewport.

**Audits that need a rendered page live in `scripts/audit/`.** A
dependency-free CDP client plus harnesses for orientation (what a first-time
visitor can act on without scrolling), responsive layout, accessibility (real
key events and Chrome's computed accessibility tree), background loudness, and
peak build memory. Use them rather than reasoning about layout from source, and
read the "why this exists" header of any one you extend: every bug found in
those harnesses so far came from substituting a proxy for what the browser
actually does, and the worst of them made a crashed page measure as a clean
one.
