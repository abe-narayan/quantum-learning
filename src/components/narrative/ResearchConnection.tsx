import type { ReactNode } from "react";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <ResearchConnection
 *   title="Error rates below the surface-code threshold"
 *   source="Google Quantum AI, Nature (2023)"
 *   url="https://www.nature.com/articles/s41586-022-05434-1"
 * >
 *   The logical qubit in this experiment got *more* reliable as it got
 *   larger — the first experimental evidence that scaling actually helps,
 *   not just theory predicting it should.
 * </ResearchConnection>
 * ```
 * `url` is optional; when present, `source` becomes the citation link.
 */

/**
 * "This is live research" — a callout that carries a real paper or lab
 * result, set in the technical/citation voice rather than as pedagogical
 * prose.
 *
 * ## Why a dashed edge, and why the header strip is gone
 *
 * This panel used to be, geometrically, the same object as `TheoremBox` and
 * `DefinitionBox`: `rounded-panel border border-border bg-surface`, a filled
 * `bg-surface-muted` header strip with a `border-b` under it, a small glyph
 * and a `TechLabel`. Those two are a deliberate family ("a formal statement
 * this course is making"), and this one was reading as a third member of it
 * while meaning something categorically different: not a claim the course
 * proves or defines, but a pointer *out* of the course at somebody else's
 * result. The only thing separating the three was which word sat in the
 * header and what hue it was in, which is the exact failure the definition/
 * theorem glyphs were introduced to fix — and it does not survive grayscale,
 * a phone, or a reader who is scanning rather than reading.
 *
 * So the distinction moves from hue to edge *texture*. A dashed border is the
 * one shape signal here that means "provisional, from outside, not ours" in
 * every medium the page can end up in: grayscale, print, a 320px screen, a
 * colour-vision deficiency. The header strip goes with it, because a filled
 * strip is the formal family's signature; the label now sits directly on the
 * panel's own ground. Net result, all in shape: solid + header strip = a
 * formal statement (theorem, definition); solid + thick left severity bar =
 * a `Callout`; dashed = cited from outside; pillar-wash fill = the lesson's
 * one keep-this-above-all idea (`InsightBlock`, and only that); no box at
 * all = a `HistoricalMoment`, a `ChallengePrompt` or a `NextDiscovery`.
 * `NextDiscovery` moved out of the fill family on 2026-08-30 precisely
 * because it appears in all 219 lessons and `InsightBlock` in 44: see that
 * file for the full reasoning.
 *
 * The pulsing `.field-breathe` dot that used to sit in the header is gone.
 * It was ambient decoration standing in for "current, ongoing" next to a
 * label that already said "Research connection", and an infinitely looping
 * animation beside a citation on 34 lesson pages competes with the reading
 * it is attached to. The static glyph that replaced it says something the
 * label does not: an arrow leaving a bracket, i.e. this points off the site.
 */

/** An arrow leaving an open bracket: "this result comes from outside this
 *  course." Static, unlike the pulsing dot it replaces, and a *shape* rather
 *  than a colour, so it reads in grayscale and on paper. Drawn at the same
 *  13px as `TheoremBox`'s `∎` and `DefinitionBox`'s `≝` so the three device
 *  marks sit on one visual scale. */
function ExternalMark() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      aria-hidden="true"
      data-decorative=""
      className="shrink-0 fill-none stroke-current text-pillar"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The bracket: open on the right, so the arrow reads as leaving it. */}
      <path d="M7.4 1.7H1.7v9.6h5.7" />
      <path d="M4.6 6.5h6.7M8.6 3.9l2.7 2.6-2.7 2.6" />
    </svg>
  );
}

export function ResearchConnection({
  title,
  source,
  url,
  children,
  className,
}: {
  title: string;
  source: string;
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // `border-dashed` at `border-border-strong`: a dashed rule drawn at
        // the plain `--border` value reads as a smudge rather than as dashes,
        // because the gaps eat most of an already-low-contrast line. The
        // stronger token puts the dash pattern itself above the noise floor,
        // which is the entire point of using it.
        // No `overflow-hidden`: it existed to clip the old header strip's
        // fill to the rounded corners, and with the strip gone it only stands
        // to clip the global `:focus-visible` ring (2px outline at 2px
        // offset) off the citation link.
        "not-prose my-8 rounded-panel border border-dashed border-border-strong bg-surface px-5 py-4",
        className
      )}
    >
      <p className="flex items-center gap-2">
        <ExternalMark />
        <TechLabel className="text-pillar">Research connection</TechLabel>
      </p>
      <div className="mt-3">
        <p className="font-display text-base font-semibold text-foreground sm:text-lg">{title}</p>
        {/* `text-base`: `not-prose` does not reset an inherited `font-size`,
            so this body copy is sized against `.prose`'s 18px. The citation
            line below stays `text-xs` — it is metadata, not reading. */}
        <div className="mt-2 space-y-2 text-base leading-relaxed text-muted-foreground">{children}</div>
        <p className="mt-3 text-xs text-subtle-foreground">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              {source}
              {/* `target="_blank"` moves the reader to a new tab with no
                  warning otherwise — the one thing a citation link owes a
                  screen-reader or keyboard user before they follow it. */}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            source
          )}
        </p>
      </div>
    </div>
  );
}
