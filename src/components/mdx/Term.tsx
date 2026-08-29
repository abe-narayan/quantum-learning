import Link from "next/link";
import type { ReactNode } from "react";
import { GLOSSARY_TERMS } from "@/lib/content/glossary";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

const TERMS_BY_ID = new Map(GLOSSARY_TERMS.map((entry) => [entry.id, entry]));

/** The one message for an unresolvable `id`, thrown in dev/test and logged in
 *  production — see "What an unknown `id` does" in the doc comment below. */
export function unknownTermMessage(id: string): string {
  return (
    `<Term id="${id}"> does not match any entry in GLOSSARY_TERMS (src/lib/content/glossary.ts). ` +
    `Fix the id, or add the term to the glossary first — this must not silently render with no gloss.`
  );
}

/**
 * MDX usage:
 * ```mdx
 * The <Term id="partial-trace">reduced density matrix</Term> is what's left
 * once you trace out the rest of an entangled system.
 * ```
 *
 * An inline glossary gloss for running prose: wraps a phrase with a
 * plain-language, one-or-two-sentence definition pulled directly from
 * `GLOSSARY_TERMS` (`src/lib/content/glossary.ts`) — the exact data
 * `/glossary` itself renders — so an inline definition can never drift from
 * the standalone page. `id` addresses the glossary entry's stable `id` (the
 * same string `/glossary` anchors each entry on, as `#<id>`), **not** its
 * display `title`: prose almost never uses a term's exact glossary title
 * verbatim ("the density matrix gets reduced" vs. the entry titled "Partial
 * Trace"), so matching on the free-standing id — checked against the same
 * data the standalone page uses — is what lets an author's word choice stay
 * natural while the definition itself stays pinned to one source of truth.
 *
 * ## What an unknown `id` does — loud in dev, survivable in prod
 *
 * An `id` with no matching entry must never quietly render the bare phrase
 * with no gloss and no signal: that's the same class of silent-wrong as the
 * two MDX hazards at the top of this file, and a term genuinely missing from
 * the glossary is a glossary gap to fix there first. So in development and
 * under test it still **throws** — the dev overlay puts the bad id and the
 * fix in front of the author on the spot, and `lessonRender.test.ts` (which
 * renders all 219 lessons) fails the same way it always did.
 *
 * In a production build it does not throw. `<Term>` is authored by hand
 * across a 219-lesson corpus, every page is statically generated, and a
 * single mistyped id in one paragraph of one lesson would otherwise fail the
 * whole build and take all 219 lessons offline with it. That trade is
 * backwards: the blast radius of one typo should be one gloss, not the site.
 * The production path instead logs the same message via `console.error` (so
 * it is still visible in build and server logs) and renders the phrase as
 * plain, unglossed text — the sentence stays readable and correct, it simply
 * has no definition attached. The dev/test throw is what keeps that fallback
 * from ever being reached in practice.
 *
 * ## Why a checkbox-and-`:has()` disclosure, not `<details>`
 *
 * `EquationReveal`'s glossary already uses `<details>` — but only *outside*
 * running text, as a block sitting below an equation. `Term` has to work
 * *inside* a `<p>`, mid-sentence, and `<details>` cannot go there: it's flow
 * content, so the instant an HTML parser sees a `<details>` start tag while
 * a `<p>` is open, it implicitly closes that `<p>` first — silently splitting
 * one paragraph into two disconnected `<p>` elements around it. No build
 * error, no type error, nothing from MDX or React; the page just renders
 * wrong, exactly the shape of hazard #1/#2 at the top of this file. `Term`
 * is built entirely from `<span>`/`<label>`/`<input>` instead — all
 * phrasing content, all legal inside a `<p>` — with a native checkbox
 * driving the reveal via `:checked` and `:has()` alone (the same `has-[…]`
 * idiom `AnswerInput.tsx` already uses for focus styling). That means zero
 * client JS: Tab reaches it, Space toggles it, and "checkbox, not checked"
 * vs. "checked" is announced by the browser's own checkbox semantics, not by
 * anything this component has to implement.
 *
 * ## What that checkbox has to be told to say
 *
 * A checkbox's role is literally "checkbox." Read linearly that's fine — the
 * user is mid-sentence and the surrounding prose supplies the context. Read
 * *out of context* it isn't: a screen-reader user browsing a lesson by rotor
 * "Form Controls" / NVDA's forms list sees only each control's **name, role
 * and state**, with the sentence it lives in stripped away. A lesson with a
 * dozen glosses turned into a dozen entries whose names were whatever phrase
 * the author happened to type ("the density matrix gets reduced") and whose
 * role said "checkbox" read as a stray, half-built form.
 *
 * Role can't be repaired honestly and the reveal can't grow a JS toggle, so
 * the **name** does the work — and the name is the one thing here CSS can
 * still change, because it's computed from the `<label>`'s text content and
 * two of those text nodes are swapped by `:has(:checked)`. Each control now
 * names itself completely: the author's phrase, the canonical glossary title
 * behind it (skipped when the phrase already *is* that title, so "qubit"
 * doesn't announce as "qubit — Qubit"), and the action, which flips
 * show → hide with the reveal. Nothing in the rotor is anonymous any more.
 *
 * Three richer-looking options were rejected as dishonest or unavailable:
 *
 * - **`aria-expanded`** is valid on `role="checkbox"`, but nothing can update
 *   it. Toggling flips the checkbox's DOM *property*, never its attribute,
 *   and CSS cannot write ARIA — so it would be permanently stuck on one
 *   value and announce "collapsed" over an open panel half the time. A
 *   wrong state is worse than an absent one.
 * - **`role="button"`** would make the rotor say "button" (nicer), but it
 *   also promises Enter-activates-me, which a checkbox does not honour, and
 *   it suppresses the native checked/unchecked state announcement that
 *   currently works for free.
 * - **`aria-controls`/`aria-describedby`** pointing at the panel need an `id`
 *   on it that is unique per page. `Term` is a server component (no hooks, so
 *   no `useId`) and the same term may legitimately be glossed twice in one
 *   lesson, so any id derived from `term.id` would collide — invalid HTML
 *   and both controls pointing at one panel. The panel sits immediately
 *   after its control in DOM order, which is the relationship that actually
 *   gets used.
 *
 * What is left is native and free: `<dfn>` (ARIA `term`) around the phrase
 * and `role="definition"` on the panel, so the pair is exposed as a term and
 * its definition rather than as two anonymous spans.
 *
 * The revealed panel is a `<span>` promoted to `display: block` on toggle,
 * not an absolutely-positioned floating tooltip. A floating panel anchored
 * to an arbitrary point mid-line has no reliable way to stay inside the
 * viewport at 320px without JS to measure and reposition it, which this site
 * doesn't ship for this. Letting it fall into normal block flow instead
 * means it can never overflow sideways — the tradeoff is that opening it
 * pushes the rest of the sentence down rather than floating over it, which
 * reads more like an inline footnote than a tooltip. That's a deliberate
 * trade for a definition that must render correctly on every viewport with
 * no JS-measured positioning logic.
 */
export function Term({
  id,
  children,
  className,
}: {
  /** A real `id` from `GLOSSARY_TERMS` (`src/lib/content/glossary.ts`) — the
   *  same id `/glossary` anchors each entry on as `#<id>`. Not the entry's
   *  `title`. An id with no match throws at render time. */
  id: string;
  /** The phrase exactly as it should read in the sentence — it does not
   *  need to match the glossary entry's `title` verbatim. */
  children: ReactNode;
  className?: string;
}) {
  const term = TERMS_BY_ID.get(id);
  if (!term) {
    // Read at call time rather than hoisted to a module constant so the
    // dev/test throw can't be constant-folded away, and so a test can stub
    // the environment around a single render.
    if (process.env.NODE_ENV !== "production") throw new Error(unknownTermMessage(id));
    console.error(unknownTermMessage(id));
    // Degraded, never invisible: the phrase renders exactly as written, with
    // no dotted underline promising a definition that isn't there and no
    // orphan checkbox in the screen-reader forms list. `data-term-missing`
    // gives a smoke test or a console sweep something to find.
    return (
      <span className={className} data-term-missing={id}>
        {children}
      </span>
    );
  }

  // The canonical glossary title is what makes a rotor entry identifiable,
  // but repeating it when the prose already reads as the title is just noise
  // ("qubit — Qubit: show glossary definition"). Rich children (a `<Math>`,
  // an emphasis span) can't be compared, so they always get the title —
  // that's the case where the phrase alone is least likely to stand on its own.
  const phrase = typeof children === "string" ? children.trim() : null;
  const titlePrefix =
    phrase !== null && phrase.toLowerCase() === term.title.toLowerCase() ? "" : `${term.title}: `;

  return (
    <span className={cn("group/term relative inline", className)}>
      <label
        className={cn(
          // `border-b-2 border-pillar-edge`, not `border-b border-pillar-edge/70`.
          // `--pillar-edge` is already authored at alpha 0.34; the extra `/70`
          // took the underline to ~0.24 alpha, and a 1px dotted line at that
          // opacity over the dark ground is essentially invisible at reading
          // size — measured in a browser, not guessed. That matters more than
          // it looks: this component is the site's whole answer to "I hit a
          // word I don't know", it is now called ~570 times across the lesson
          // corpus, and an affordance nobody can see means none of those calls
          // reach the reader who needed them. Two pixels at full edge alpha is
          // legible in running prose while still reading as a definition
          // marker rather than a link (links are solid and pillar-coloured).
          "cursor-pointer border-b-2 border-dotted border-pillar-edge pb-px",
          "hover:border-pillar",
          "has-[:focus-visible]:rounded-[2px] has-[:focus-visible]:outline",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pillar",
          "has-[:focus-visible]:outline-offset-2"
        )}
      >
        <input type="checkbox" className="sr-only" />
        {/* `dfn` is phrasing content (legal mid-`<p>`, unlike `<details>`) and
            maps to the ARIA `term` role. `not-italic` cancels the UA
            stylesheet's `font-style: italic`, which Tailwind's preflight
            doesn't reset — the gloss is marked by its dotted underline, not
            by italics. */}
        <dfn className="not-italic">{children}</dfn>
        {/* The accessible name of the checkbox, and the only part of it CSS
            can swap. Both spans are inside the `<label>`, so they are the
            name; the `hidden` one is `display: none` and therefore excluded
            from the name computation rather than merely unread. */}
        <span className="sr-only group-has-[:checked]/term:hidden">
          {` — ${titlePrefix}show glossary definition`}
        </span>
        <span className="sr-only hidden group-has-[:checked]/term:inline">
          {` — ${titlePrefix}hide glossary definition`}
        </span>
      </label>
      <span
        role="definition"
        className={cn(
          "panel-inset hidden max-w-full px-3.5 py-3",
          "group-has-[:checked]/term:my-1.5 group-has-[:checked]/term:block"
        )}
      >
        <TechLabel className="text-pillar">{term.title}</TechLabel>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {term.definition}
        </span>
        <Link
          href={`/glossary#${term.id}`}
          className="mt-1.5 inline-block text-sm text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar"
        >
          Full glossary entry →
        </Link>
      </span>
    </span>
  );
}
