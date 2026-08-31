import type { ElementType } from "react";
import Link from "next/link";
import { Instrument } from "@/components/ui/Panel";
import { TechLabel } from "@/components/ui/Typography";
import { ExternalFigure } from "@/components/mdx/ExternalFigure";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import type { CurrentQuantumEntry } from "@/lib/content/currentQuantum/types";
import { cn } from "@/lib/utils";
import { entryPillar } from "./entryPillar";
import { CATEGORY_META } from "./categoryIcons";
import { formatEntryDate, entryDateTimeAttr } from "./dateUtils";
import { ENTRY_IMAGE_ASPECT } from "./imageAspect";

/**
 * One real, dated development, framed as an instrument reading rather than
 * a news card: a header strip carrying the category (icon + text, never
 * color alone) and the date/difficulty readouts, then the title, the
 * original summary, an optional real image, and, the point of this whole
 * page, a pillar-tinted "why this matters" block that links back to the
 * exact lesson this connects to.
 *
 * The wrapper carries `data-pillar` for the *curriculum area the linked
 * lesson belongs to* (derived from `relatedLessonSlug`, see `entryPillar`),
 * which is deliberately a different axis from the category shown in the
 * header: a "sensing" result can belong to the Hardware or Mastery
 * curriculum depending on which lesson it actually connects to, and the
 * tint follows that real connection rather than the category label.
 *
 * Reused as-is by both `CurrentQuantumCatalog` (the full timeline) and
 * `RelatedCurrentQuantum` (the lesson-embedded widget) so the two never
 * drift into rendering the same fields differently. On a lesson page,
 * `lessonTitle` is passed as `undefined`, the entry is already the one
 * connected to *that* lesson, so a self-referential "explained in" link
 * would be redundant there.
 *
 * ------------------------------------------------------------
 * Click target, the whole instrument face, not just the link line
 * ------------------------------------------------------------
 * There is no per-entry page, so the card's one real destination is the
 * lesson it connects to. That link used to be a single line of text near the
 * bottom of a tall card: everything above it looked interactive and wasn't.
 * The fix is the technique `CourseList` documents at length, the "Explained
 * in" link is a real `<a>` whose `::after` is stretched (`absolute inset-0`)
 * to the `.instrument`, which is already `position: relative`, so a click
 * anywhere on the instrument's chrome activates it.
 *
 * That overlay is a *positioned* element, so per CSS 2.1 Appendix E it paints
 * (and hit-tests) above every non-positioned in-flow sibling. Each block of
 * real readable text, the title, the summary, the figure with its own credit
 * link, and the "why this matters" paragraph, therefore carries `relative
 * z-10` so it stays selectable, and any link inside it stays independently
 * clickable rather than silently navigating to the lesson. `isolate` on the
 * instrument scopes those z-indices to one card.
 *
 * The header strip (category, date, difficulty) and the padding stay *under*
 * the overlay: they are metadata, not prose to copy, and they are what makes
 * "click the card" true. The `Source:` line lives outside the instrument
 * entirely, so it is never covered.
 *
 * When `lessonTitle` is undefined there is no link and none of this applies,
 * the card renders exactly as it did, with no phantom hover affordance
 * promising a click that does nothing.
 */
export function CurrentQuantumCard({
  entry,
  lessonTitle,
  headingLevel = 3,
  featured = false,
  id,
  className,
}: {
  entry: CurrentQuantumEntry;
  /** Real lesson title for entry.relatedLessonSlug, or undefined to omit the "explained in" link. */
  lessonTitle: string | undefined;
  headingLevel?: 2 | 3 | 4;
  /** Tags this as the single most-recent entry across the whole (unfiltered) corpus. */
  featured?: boolean;
  id?: string;
  className?: string;
}) {
  const pillar = entryPillar(entry);
  const visual = pillar ? PILLAR_VISUALS[pillar] : undefined;
  const category = CATEGORY_META[entry.category];
  const CategoryIcon = category.Icon;
  const Heading = (`h${headingLevel}` as const) satisfies ElementType;

  return (
    <div id={id} data-pillar={pillar} className={cn("scroll-mt-24", className)}>
      {featured ? (
        // Static "Most recent" label, not "Most recent · N weeks ago", see
        // docs/UX_REVIEW.md P0-2 and the comment in dateUtils.ts. This is a
        // Server Component and the site is statically generated with no
        // `export const revalidate`, so any string computed from `new
        // Date()` here would be frozen at build time and drift silently
        // wrong. The card's own `<time>` readout below already carries the
        // absolute date, which stays true without a rebuild.
        <p className="tech-label mb-2 text-pillar-text">Most recent</p>
      ) : null}

      <Instrument
        className={cn(
          lessonTitle &&
            "isolate transition-colors duration-(--dur-fast) ease-instrument has-[a[data-entry-link]:hover]:border-pillar-edge has-[a[data-entry-link]:focus-visible]:border-pillar-edge"
        )}
        label={
          // `[overflow-wrap:anywhere]` on the text, not `break-words`, and the
          // difference is the whole fix. Both introduce soft wrap
          // opportunities inside a word, but only `anywhere` is counted when
          // the browser computes an element's *min-content* size — and a flex
          // item's default `min-width: auto` resolves to exactly that. This
          // strip is a flex row inside `.instrument`'s `overflow-hidden`, and
          // at the 200% text size WCAG 1.4.4 asks for its `p-4`/`px-4`
          // paddings double too (Tailwind spacing is in `rem`), leaving the
          // label about 220px of a 252px card. "Cryptography" set in
          // `.tech-label` at 0.14em tracking wants 235px, so with
          // `break-words` the item still refused to shrink and 15px of it was
          // clipped away. Measured with `scripts/audit/a11y.mjs --width 375`.
          <span className="inline-flex min-w-0 flex-wrap items-center gap-1.5">
            <CategoryIcon aria-hidden="true" data-decorative="" className="h-3.5 w-3.5 shrink-0 text-pillar" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{category.label}</span>
          </span>
        }
        readout={
          <>
            <time
              dateTime={entryDateTimeAttr(entry.date)}
              className="tech-value text-xs text-foreground sm:text-sm"
            >
              {formatEntryDate(entry.date)}
            </time>
            {entry.difficulty ? (
              // Ticks + text via the shared `DifficultyMark`, not bare text,
              // see docs/UX_REVIEW.md P0-3, which names this exact bare
              // `TechLabel` readout (alongside `ApexCourseIndex`) as one of
              // five inconsistent difficulty encodings on the site. Using
              // the same component the curriculum pages use puts this card
              // on the one shared ladder instead of adding a sixth.
              <DifficultyMark difficulty={entry.difficulty} />
            ) : null}
          </>
        }
      >
        {/* `break-words`. `Instrument` frames itself with `overflow-hidden`,
            and these titles are the site's longest single line of display
            type — real research headlines, full of slash- and hyphen-joined
            runs ("Harvard/QuEra/MIT", "Post-Quantum Cryptography") that a
            browser will not break by default. At the 200% text size WCAG
            1.4.4 requires, twelve of the 32 cards pushed their title past the
            frame: 394px of text in a 252px box on the worst of them, with
            `overflow-hidden` swallowing the remainder. Clipped, so no
            scrollbar, no symptom, and the headline simply ends mid-word.
            Measured with `scripts/audit/a11y.mjs --width 375`, which reports
            it as a blocker. */}
        <Heading className="relative z-10 break-words font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
          {entry.title}
        </Heading>
        <p className="relative z-10 mt-2.5 break-words text-sm leading-relaxed text-muted-foreground">
          {entry.summary}
        </p>

        {entry.imageUrl && entry.imageAttribution ? (
          // Raised with the text blocks: the figure carries its own
          // credit/license link, which would otherwise sit under the stretched
          // overlay and navigate to the lesson instead of the source.
          <ExternalFigure
            src={entry.imageUrl}
            alt={entry.imageAlt ?? entry.title}
            caption={entry.imageCaption}
            credit={entry.imageAttribution.credit}
            creditUrl={entry.imageAttribution.creditUrl}
            license={entry.imageAttribution.license}
            aspect={ENTRY_IMAGE_ASPECT[entry.slug]}
            className="relative z-10 mt-4"
          />
        ) : null}

        <div className="mt-4 rounded-(--radius-tight) border-l-2 border-pillar-edge bg-pillar-wash px-4 py-3">
          <TechLabel className="text-pillar-text">Why this matters</TechLabel>
          <p className="relative z-10 mt-1.5 break-words text-sm leading-relaxed text-foreground">
            {entry.whyThisMatters}
          </p>
          {lessonTitle ? (
            // Deliberately NOT `relative`/`z-10` itself: the stretched
            // `::after` must resolve against the `.instrument`, and giving this
            // anchor a positioned context of its own would shrink the overlay
            // back to the link's own box.
            <Link
              href={`/lessons/${entry.relatedLessonSlug}`}
              data-entry-link
              className="mt-2.5 inline-flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-pillar-text after:absolute after:inset-0 after:content-[''] hover:underline"
            >
              <span aria-hidden="true">&#8646;</span>
              {/* `min-w-0 break-words`. This span is a flex item, so its
                  default `min-width: auto` refuses to shrink below its
                  longest unbreakable run, and the lesson titles it carries
                  are long ("Explained in: Computational Cost & Scaling").
                  At the 200% text size WCAG 1.4.4 asks for, the surrounding
                  `p-4`/`px-4` paddings double as well (Tailwind spacing is in
                  `rem`), leaving this line about 122px inside a 252px card,
                  and it was clipped by `.instrument`'s `overflow-hidden`.
                  `[overflow-wrap:anywhere]` rather than `break-words` for the
                  reason spelled out on the category label above: only
                  `anywhere` counts toward min-content, which is what
                  `min-width: auto` resolves to here. */}
              <span className="min-w-0 [overflow-wrap:anywhere]">Explained in: {lessonTitle}</span>
              {visual ? <span className="tech-label text-subtle-foreground">{visual.short}</span> : null}
            </Link>
          ) : null}
        </div>
      </Instrument>

      <p className="mt-2.5 px-1 text-xs text-subtle-foreground">
        Source:{" "}
        <a
          href={entry.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border underline-offset-2 hover:text-foreground"
        >
          {entry.source.name}
        </a>
      </p>
    </div>
  );
}
