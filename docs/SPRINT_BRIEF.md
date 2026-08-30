# Sprint brief — StudyQuantum beginner-experience / a11y / engagement sprint (wave 3)

> **This is a previous sprint's brief, not the current one.** Wave 3 was the
> beginner-experience / accessibility / engagement sprint, and it is finished:
> its two named audits (`A11Y_AUDIT.md`, `BEGINNER_REVIEW.md`) both carry
> dated resolution notes now, and the `<Term>` rollout and glossary buildout
> it was chasing have both landed. At least one later sprint has run on top of
> it: a design-system pass that rewrote `src/app/globals.css` substantially,
> introduced the sub-`text-xs` type scale, the tracking and container tokens,
> and moved `:focus-visible` and `h3[id$="-heading"]` into `@layer base`.
>
> Two consequences for anyone reading this file:
>
> 1. **The "Rules of engagement" section below is wave-3-specific.** Its
>    off-limits list names `src/app/globals.css`, `src/mdx-components.tsx`
>    and `src/components/ui/` as shared files nobody may touch. That was that
>    sprint's arrangement. A later sprint deliberately edited all three. The
>    *principle* (one owner per file while many agents run concurrently)
>    still holds; the specific list does not.
> 2. **Everything under "Content rules" and "MDX hazards" is still live and
>    still correct.** Those are the durable half of this document. The MDX
>    hazards in particular have each cost this repo a silently broken lesson
>    at least once, and are restated in `NARRATIVE_COMPONENTS.md` for the
>    same reason.

Read this in full before editing anything.

## Situation

A large multi-agent sprint was interrupted mid-flight. **Everything currently in the
working tree is good, intentional work.** Do not revert, reset, stash, or "clean up
to a baseline." Continue from what is there.

Two audits describe where things stood: `docs/A11Y_AUDIT.md` and
`docs/BEGINNER_REVIEW.md`. Most of their findings have since been fixed in the tree
(clickable course cards, linked prerequisites, `rehypeScrollableMath`, pinch-zoom on
the concept map, Navbar Escape, `IconButton`, `getCourseHref`, `/courses/[slug]`,
beginner glossary entries, `<Term>` in 10 lessons). **Verify before you "fix" —
re-reading the audit and re-doing a finished item wastes the wave.**

**Status as of 2026-08-30 (later than this brief, and after the wave
closed).** The `<Term>` rollout is long past "10 lessons": it now runs to
**561 calls across 191 of the 219 lessons**, and the glossary stands at
**273 terms** (59 derived from `CONCEPT_NODES` in `concepts.ts`, 214
authored in `glossary.ts`). Both audits carry dated resolution notes on the
findings that have since landed. Re-derive any count in this file before
relying on it, with `grep -rho '<Term ' src/content --include=*.mdx | wc -l`
and `npx vitest run src/lib/content/__tests__/glossary.test.ts`.

Baseline at wave start: `npm run typecheck` clean, `npx vitest run` = 929/929 pass.
Do not regress either. That test count is a wave-3 figure and the suite has
grown since; do not treat 929 as the current expected total.

## Product goals (in priority order)

1. **A beginner who knows almost nothing about quantum computing must feel welcome
   and oriented within ten seconds on any page.** Not dumbed down — oriented. They
   should always know what this page is, what to do next, and how to look up a word
   they don't know.
2. **An advanced student / grad reader must keep respecting the site.** The identity
   is a *research instrument / quantum laboratory*, not a course platform and
   absolutely not a kids' game. Zero emoji, zero mascots, zero streaks/XP/confetti,
   zero "Great job!" copy. Sober, precise, exciting.
3. **Navigation clarity + course discoverability + lesson visibility.** Courses are
   directly clickable (already landed — keep it). Lessons must not feel hidden or
   invisible until the user scrolls. Reduce interaction friction: fewer clicks,
   fewer hidden affordances, fewer "where do I click" moments.
4. **Engagement.** Real computed figures, honest forward hooks, live instruments.

## Visual direction — do not change

- Dark-first: black/near-black grounds, white/light text, high contrast.
- The circuit/quantum canvas backgrounds (`src/components/field/`) are GOOD.
  Preserve them. Never delete or disable a field/regime.
- The pillar ramp, `Panel`/`Instrument`/`Section`/`Readouts`/`TechLabel` vocabulary
  in `src/components/ui/` is the design system. Reuse it; don't invent parallel
  primitives.
- Read `docs/DESIGN_SYSTEM.md` before adding any new visual pattern.

## Rules of engagement (multi-agent)

- **You own only the files listed in your task's "Scope".** Other agents are editing
  other files at the same moment. Editing outside your scope will be overwritten or
  will overwrite someone else's work.
- **Shared files are OFF LIMITS to everyone:** `src/app/globals.css`,
  `src/mdx-components.tsx`, `src/lib/content/curriculum.ts`, `src/lib/content/types.ts`,
  existing files in `src/components/ui/`, `src/lib/design/`, `next.config.ts`,
  `package.json`, `AGENTS.md`, `CLAUDE.md`. If you need a change there, put the
  request in your final report instead of editing.
- You MAY create new files inside your own scope directory.
- Do not run `git` mutating commands. Never `git checkout`, `reset`, `stash`, `revert`.
- Do not run `npm run build` or the full `vitest` suite (other agents are mid-edit;
  you will get other people's transient errors). You MAY run
  `npx tsc --noEmit 2>&1 | grep <your-file>` and `npx vitest run <your-test-file>`.

## Content rules

- `<Term id="...">phrase</Term>` (`src/components/mdx/Term.tsx`) is the inline
  glossary gloss. The `id` MUST already resolve through `GLOSSARY_TERMS` —
  a bad id **throws at render**, which breaks `next build` for the whole
  site. Note that `GLOSSARY_TERMS` merges two sources: entries authored in
  `src/lib/content/glossary.ts`, plus about sixty derived from
  `CONCEPT_NODES` in `src/lib/content/concepts.ts`. Grepping only
  `glossary.ts` produces a false "this id is missing". Check with
  `getGlossaryTerm`, or run `glossary.test.ts`, which asserts every `<Term
  id>` in the corpus resolves.
- Gloss the **first** use of a term in a lesson, not every use. Two to five
  `<Term>` per lesson is right; twenty is noise.
- Never wrap a term inside a heading, inside `$...$` math, or inside another
  component's string prop.
- **No em dashes in reader-facing prose.** This holds for lesson MDX,
  problem content and any UI string. The corpus is currently at zero, and it
  took two rounds and 386 corrections to get there once already, because a
  fork's "none remaining" self-report was wrong for 22 files. Nothing
  enforces it: `grep -rl "—" src/content` is the check.

### MDX hazards (these have bitten this repo before — read twice)

1. **Comments in a top-level `export` block break the file, in either
   style.** A `//` or single-line `/** … */` line silently unbinds every later
   export, producing a 404 with no error; a multi-line `/** … */` fails acorn
   outright. Use no comments at all in an MDX export block.
2. **`$$` display math must be on its own line.** A `$$` sharing a line with
   formula content *inside a custom JSX component* breaks closing-tag detection.
3. A JSX component's children in MDX need blank lines around them to be parsed as
   markdown blocks.
4. **A JSX expression inside `$…$` is not evaluated.** `$x \approx {v}$`
   typesets the literal `{v}`, with no error and no type error. Close the math
   around the expression instead. Not covered by any test.
5. **`<p className="…">` with its children on the next line styles an empty
   element**, because MDX wraps the children in a nested `<p>` and the browser
   closes the outer one. Keep them on one line, or use a `<div>`.
6. Frontmatter/`lessonMeta` shape must not change — `prerequisites`, `objectives`,
   `difficulty` etc. are consumed by the registry and search index.
7. **Never edit lesson MDX through a shell heredoc.** Backslash escapes are
   interpreted on the way in even with a quoted delimiter: `\alpha` becomes a
   BEL byte, `\rangle` a lone CR, `\to` a TAB. The damage is invisible on a
   read-back.

The fuller version of all of these, with the mechanism, is in
[`NARRATIVE_COMPONENTS.md`](NARRATIVE_COMPONENTS.md).

## Definition of done for your task

- Your scope's files typecheck (`npx tsc --noEmit`, ignoring errors in files you
  don't own).
- Any test you touched passes.
- Your final report is a concise list of: what you changed and why, anything you
  deliberately did NOT do, and any request for a change in a shared file.
