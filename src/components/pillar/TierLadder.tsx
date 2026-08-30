import Link from "next/link";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { cn } from "@/lib/utils";
import {
  TIER_COPY,
  TIER_OF_PILLAR,
  TIER_ORDER,
  pillarsInTier,
  type CurriculumTier,
} from "./tiers";

/**
 * ============================================================
 * "Which rung of the curriculum is this?"
 * ============================================================
 * The one element that is identical on all six pillar pages, on purpose.
 * Everything else about those pages is deliberately different per pillar
 * (see `PillarFraming`'s note on their four composition languages), and the
 * cost of that was that the *hierarchy* between them had nowhere to live: a
 * visitor on `/apex` saw a page shaped like `/mechanics` and had no way to
 * know one is the summit and the other is the ground floor.
 *
 * So the ladder is fixed, four rungs, in the same place on every page: the
 * rung you are standing on is filled in the pillar's own accent, the rungs
 * you have already passed are filled and quiet, the rungs still ahead are
 * hollow. It is the only place the four-level structure is drawn, and it is
 * drawn the same way every time, which is what makes it readable at a glance
 * rather than something to work out.
 *
 * "Hollow" is now literally true. It used to be `bg-border`, and `--border`
 * is documented at 1.41:1 against the page precisely because it is
 * decorative chrome, so the rungs ahead were a bar nobody could see: the
 * ladder read as one bright segment plus grey, and the fourth state was
 * missing. An outline (`border-border-strong` over nothing) is a *shape*
 * difference rather than another value of the same fill, so it survives
 * grayscale and colour-blind rendering the way `DifficultyMark`'s
 * filled-vs-hollow ticks already do. The rungs are 6px rather than 3px for
 * the same reason: 1px of border on each side of a 3px bar leaves 1px of
 * interior, which is not a hollow, it is a slightly paler solid.
 *
 * Active still has to be separable from behind with the hue removed, and two
 * solid fills are one channel, so the active *label* also carries weight.
 * That matters more on paper than on screen: `[data-decorative]` is
 * `display: none` under `@media print` (globals.css), so the four bars are
 * not printed at all, and the printed ladder is four words plus the sentence
 * underneath, which states the tier and its number in full.
 *
 * It sets no colour of its own. The active rung reads the `pillar-*` ramp that
 * `PillarScope` has already switched on the page wrapper, so Apex's near
 * monochrome steel and Mechanics' cyan arrive for free and the ladder looks
 * like the page it is on.
 *
 * Rungs are not links. A tier is not a destination (two of them hold two
 * tracks), and turning four labels into four vague navigation targets is
 * exactly the "Explore / Open / Learn more" pattern the rest of this work is
 * removing. The one real link is the named neighbouring track underneath,
 * which goes somewhere specific.
 */

/** The rung a reader would most usefully step to from `tier`, if any. */
function stepDown(tier: CurriculumTier): CurriculumTier | undefined {
  return TIER_ORDER[TIER_ORDER.indexOf(tier) - 1];
}

export function TierLadder({
  pillar,
  className,
}: {
  pillar: Pillar;
  className?: string;
}) {
  const tier = TIER_OF_PILLAR[pillar];
  const activeIndex = TIER_ORDER.indexOf(tier);
  const copy = TIER_COPY[tier];
  const below = stepDown(tier);
  // The other track on this same rung, if there is one, and the tracks one
  // rung down. Both are real routes with real names, which is the only kind
  // of onward link this block carries.
  const sameRung = pillarsInTier(tier).filter((entry) => entry !== pillar);
  const rungBelow = below ? pillarsInTier(below) : [];

  return (
    <div className={cn("border-l-2 border-pillar-edge pl-5", className)}>
      {/* `<ol>` has an implicit `list` role, so `aria-label` actually attaches
          here (unlike on a bare `<div>`, where it is silently dropped: the
          defect this codebase has hit repeatedly). `aria-current="step"` marks
          the rung the reader is standing on. */}
      {/* ----------------------------------------------------------------
          Rung width, re-derived. The root is `overflow-x: clip`, so an
          overrun here shows no scrollbar: it silently cuts a label off. The
          number is therefore worked out rather than eyeballed.

          Two columns on a phone, four from `sm` up. The four-across case has
          to survive the *narrowest* container this component is dropped into,
          which is not a phone: it is `/computing`'s `SplitFigure` text
          column, the `1fr` track of `lg:grid-cols-[1fr_1.35fr]`.

            Container    `max-w-6xl` with `lg:px-8`, so at a 1024px viewport
                         the inner width is 1024 - 64 = 960px.
            Split        (960 - 56 gap) / 2.35 = 384.7px for the 1fr track.
            This block   less `border-l-2` (2px) and `pl-5` (20px) = 362.7px.
            Four rungs   less three `gap-x-2` (24px), / 4 = 84.7px per rung.

          1024px is the global minimum, not a convenient sample: below `lg`
          the split has not engaged and the ladder spans the container, and
          above 1024 the track only grows until `max-w-6xl` caps it at
          (1088 - 56) / 2.35 = 439px, i.e. 98.2px per rung.

          A grid item's default `min-width: auto` is its min-content width and
          the labels are single words, so the widest one sets it.
          "FOUNDATIONS" is 11 characters of Geist Mono, whose advance is
          exactly 0.6em, plus the tracking on each. That tracking is now
          `tracking-meta` (0.14em) rather than the literal `0.1em` this table
          was first computed on, because 0.1em was one of five competing
          hand-written values for the one uppercase-mono voice and the system
          keeps two; the rounding goes up, and it costs 0.4px a character:
          0.74em per character rather than 0.70em.

            text-micro  10px  11 x 7.4 = 81.4px   3.3px spare (3.9%)   fits
            text-meta   11px  11 x 8.1 = 89.5px   4.8px over           no
            text-xs     12px  11 x 8.9 = 97.7px  13.0px over           no

          So `text-xs` does not fit, and the honest answer is to stay at
          `text-micro` rather than ship a clip nobody would see. What *did*
          change is the numeric prefix: with "1 " in front (2 characters,
          14.8px) the label's preferred width was 96.2px against 84.7px, so at
          exactly the `lg` breakpoint every rung on `/computing` wrapped onto
          two lines while the same rung on `/mechanics` stayed on one. The one
          component whose whole purpose is to render identically everywhere
          did not. Dropping the number is also the right call on its own
          terms: it restated the left-to-right order the four bars already
          draw, in the same element, at the smallest type on the site, while
          the sentence directly below says "Tier 1 of 4, Foundations" at
          reading size and with the denominator the bare "1" never had.

          Budget for a future label: 84.7 / 7.4 = 11 characters at
          `text-micro`, which "Foundations" spends exactly. A twelfth character
          wraps the rung onto two lines at 1024px (it wraps rather than clips:
          the `li` is `min-w-0` and the label is a block). Past 11, recompute
          this. */}
      <ol
        aria-label="Curriculum tiers, foundational to terminal"
        className="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-4"
      >
        {TIER_ORDER.map((rung, index) => {
          const active = index === activeIndex;
          const behind = index < activeIndex;
          return (
            <li
              key={rung}
              {...(active ? { "aria-current": "step" as const } : null)}
              className="min-w-0"
            >
              <span
                aria-hidden="true"
                data-decorative=""
                className={cn(
                  "block h-1.5 w-full rounded-full",
                  active
                    ? "bg-pillar"
                    : behind
                      ? "bg-border-strong"
                      : "border border-border-strong bg-transparent"
                )}
              />
              <span
                className={cn(
                  "mt-2 block font-tech text-micro uppercase leading-tight tracking-meta",
                  active
                    ? "font-semibold text-pillar-text"
                    : behind
                      ? "text-muted-foreground"
                      : "text-subtle-foreground"
                )}
              >
                {TIER_COPY[rung].label}
                {active ? <span className="sr-only"> (this track)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">
          Tier {activeIndex + 1} of {TIER_ORDER.length}, {copy.label}.
        </span>{" "}
        {copy.blurb}
        {sameRung.length > 0 ? (
          <>
            {" "}
            {sameRung.length === 1 ? "The other track on this tier is " : "The other tracks on this tier are "}
            {sameRung.map((entry, index) => (
              <span key={entry}>
                {index > 0 ? (index === sameRung.length - 1 ? " and " : ", ") : null}
                <Link
                  href={PILLAR_VISUALS[entry].route}
                  className="text-foreground underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
                >
                  {PILLAR_VISUALS[entry].short}
                </Link>
              </span>
            ))}
            .
          </>
        ) : null}
        {rungBelow.length > 0 ? (
          // Deliberately not "One tier down is mastery: Mastery." The rung
          // below Apex holds exactly one track whose name *is* the tier's, so
          // naming both reads as a stutter. Naming the tracks alone is the
          // half that is always useful, and always a real link.
          <>
            {" "}
            One tier down:{" "}
            {rungBelow.map((entry, index) => (
              <span key={entry}>
                {index > 0 ? (index === rungBelow.length - 1 ? " and " : ", ") : null}
                <Link
                  href={PILLAR_VISUALS[entry].route}
                  className="text-foreground underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
                >
                  {PILLAR_VISUALS[entry].short}
                </Link>
              </span>
            ))}
            .
          </>
        ) : null}
      </p>
    </div>
  );
}
