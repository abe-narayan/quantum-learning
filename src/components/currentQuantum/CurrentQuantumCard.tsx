import type { ElementType } from "react";
import Link from "next/link";
import { Instrument } from "@/components/ui/Panel";
import { TechLabel } from "@/components/ui/Typography";
import { ExternalFigure } from "@/components/mdx/ExternalFigure";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import type { CurrentQuantumEntry } from "@/lib/content/currentQuantum/registry";
import { cn } from "@/lib/utils";
import { entryPillar } from "./entryPillar";
import { CATEGORY_META } from "./categoryIcons";
import { formatEntryDate, entryDateTimeAttr } from "./dateUtils";

/**
 * One real, dated development, framed as an instrument reading rather than
 * a news card: a header strip carrying the category (icon + text — never
 * color alone) and the date/difficulty readouts, then the title, the
 * original summary, an optional real image, and — the point of this whole
 * page — a pillar-tinted "why this matters" block that links back to the
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
 * `lessonTitle` is passed as `undefined` — the entry is already the one
 * connected to *that* lesson, so a self-referential "explained in" link
 * would be redundant there.
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
        // Static "Most recent" label, not "Most recent · N weeks ago" — see
        // docs/UX_REVIEW.md P0-2 and the comment in dateUtils.ts. This is a
        // Server Component and the site is statically generated with no
        // `export const revalidate`, so any string computed from `new
        // Date()` here would be frozen at build time and drift silently
        // wrong. The card's own `<time>` readout below already carries the
        // absolute date, which stays true without a rebuild.
        <p className="tech-label mb-2 text-pillar-text">Most recent</p>
      ) : null}

      <Instrument
        label={
          <span className="inline-flex items-center gap-1.5">
            <CategoryIcon aria-hidden="true" data-decorative="" className="h-3.5 w-3.5 shrink-0 text-pillar" />
            {category.label}
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
              // Ticks + text via the shared `DifficultyMark`, not bare text —
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
        <Heading className="font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
          {entry.title}
        </Heading>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>

        {entry.imageUrl && entry.imageAttribution ? (
          <ExternalFigure
            src={entry.imageUrl}
            alt={entry.imageAlt ?? entry.title}
            caption={entry.imageCaption}
            credit={entry.imageAttribution.credit}
            creditUrl={entry.imageAttribution.creditUrl}
            license={entry.imageAttribution.license}
            className="mt-4"
          />
        ) : null}

        <div className="mt-4 rounded-[var(--radius-tight)] border-l-2 border-pillar-edge bg-pillar-wash px-4 py-3">
          <TechLabel className="text-pillar-text">Why this matters</TechLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">{entry.whyThisMatters}</p>
          {lessonTitle ? (
            <Link
              href={`/lessons/${entry.relatedLessonSlug}`}
              className="mt-2.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-pillar-text hover:underline"
            >
              <span aria-hidden="true">&#8646;</span>
              <span>Explained in: {lessonTitle}</span>
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
