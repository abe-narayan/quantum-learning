# Sprint brief — QuantumLearn beginner-experience / a11y / engagement sprint (wave 3)

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

**Status as of 2026-08-29 (later than this brief).** The `<Term>` rollout is
long past "10 lessons": it now runs to **at least 559 calls across 191 of
the 219 lessons** (still climbing while this wave runs), and the glossary
stands at **258 terms**. Both audits carry dated
resolution notes on the findings that have since landed. Re-derive any count
in this file before relying on it — `grep -c '<Term' -r src/content/lessons`
and `npx vitest run src/lib/content/__tests__/glossary.test.ts`.

Baseline at wave start: `npm run typecheck` clean, `npx vitest run` = 929/929 pass.
Do not regress either.

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
  glossary gloss. The `id` MUST already exist in `src/lib/content/glossary.ts` —
  a bad id **throws at render**. Grep the ids first; do not invent one.
- Gloss the **first** use of a term in a lesson, not every use. Two to five
  `<Term>` per lesson is right; twenty is noise.
- Never wrap a term inside a heading, inside `$...$` math, or inside another
  component's string prop.

### MDX hazards (these have bitten this repo before — read twice)

1. **`//` comments inside a top-level `export const` block silently break every
   later export in the file**, producing a 404 with no error. Use no comments
   inside MDX export blocks.
2. **`$$` display math must be on its own line.** A `$$` sharing a line with
   formula content *inside a custom JSX component* breaks closing-tag detection.
3. A JSX component's children in MDX need blank lines around them to be parsed as
   markdown blocks.
4. Frontmatter/`lessonMeta` shape must not change — `prerequisites`, `objectives`,
   `difficulty` etc. are consumed by the registry and search index.

## Definition of done for your task

- Your scope's files typecheck (`npx tsc --noEmit`, ignoring errors in files you
  don't own).
- Any test you touched passes.
- Your final report is a concise list of: what you changed and why, anything you
  deliberately did NOT do, and any request for a change in a shared file.
