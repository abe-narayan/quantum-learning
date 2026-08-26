import Link from "next/link";
import { TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { getCourse, PILLARS } from "@/lib/content/curriculum";
import type { LessonMetaWithSlug } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type RelatedEntry = { lesson: LessonMetaWithSlug; note: string };

/**
 * Everything the old LessonLayout stacked as up to three separate
 * bordered `<div>`s (prerequisites / resurfaces-in / related elsewhere)
 * collapsed into one instrument strip. Nothing is dropped — every link and
 * note the old markup rendered is still here.
 *
 * Rendered as a native `<details>` — a real disclosure, not a styled div,
 * so it's server-renderable with zero client JS and gets keyboard/AT
 * support for free — collapsed by default, with a one-line summary naming
 * what's inside so a reader can decide whether to open it without having
 * to. `LessonLayout` now mounts this *below* the lesson body rather than
 * between the title and the prose: prerequisites matter before starting a
 * lesson, but per docs/UX_REVIEW.md P2-6 they don't matter more than the
 * lesson's own first sentence, and a reader who wants this before starting
 * can still open it from the top in one glance at the summary line. See
 * LessonLayout.tsx for the placement rationale.
 *
 * `currentCourseSlug` is only used to decide whether a prerequisite's
 * course name needs to be printed (a same-course prerequisite doesn't need
 * its course repeated back to the reader).
 */
export function LessonMetaStrip({
  currentCourseSlug,
  prerequisites,
  resurfacesIn,
  relatedElsewhere,
}: {
  currentCourseSlug: string;
  prerequisites: LessonMetaWithSlug[];
  resurfacesIn: LessonMetaWithSlug[];
  relatedElsewhere: RelatedEntry[];
}) {
  const hasPrereqs = prerequisites.length > 0;
  const hasResurfaces = resurfacesIn.length > 0;
  const hasRelated = relatedElsewhere.length > 0;

  if (!hasPrereqs && !hasResurfaces && !hasRelated) return null;

  const columnCount = [hasPrereqs, hasResurfaces].filter(Boolean).length;

  const summary = [
    hasPrereqs
      ? `${prerequisites.length} prerequisite${prerequisites.length === 1 ? "" : "s"}`
      : null,
    hasResurfaces ? `resurfaces in ${resurfacesIn.length}` : null,
    hasRelated ? `${relatedElsewhere.length} related` : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");

  return (
    <details className="group mt-10 max-w-3xl">
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg",
          "border border-border bg-surface-muted/40 px-4 py-3 transition-colors hover:bg-surface-muted",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span className="flex flex-col gap-0.5">
          <TechLabel>Lineage</TechLabel>
          <span className="text-sm text-muted-foreground">{summary}</span>
        </span>
        <svg
          aria-hidden="true"
          data-decorative=""
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4 shrink-0 text-pillar-text transition-transform group-open:rotate-180"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>

      <Instrument
        className="mt-3"
        bodyClassName={cn("grid gap-x-8 gap-y-5", columnCount > 1 && "sm:grid-cols-2")}
        footnote="Prerequisites and resurfacing are derived automatically from the curriculum graph."
      >
        {hasPrereqs ? (
          <div>
            <TechLabel>Requires</TechLabel>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {prerequisites.map((lesson, i) => {
                const prereqCourse = lesson.course !== currentCourseSlug ? getCourse(lesson.course) : undefined;
                return (
                  <span key={lesson.slug}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/lessons/${lesson.slug}`} className="text-pillar-text hover:underline">
                      {lesson.title}
                    </Link>
                    {prereqCourse ? <span className="text-subtle-foreground"> ({prereqCourse.title})</span> : null}
                  </span>
                );
              })}
            </p>
          </div>
        ) : null}

        {hasResurfaces ? (
          <div>
            <TechLabel>Resurfaces in</TechLabel>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {resurfacesIn.map((lesson, i) => {
                const resurfaceCourse = getCourse(lesson.course);
                const resurfacePillar = resurfaceCourse
                  ? PILLARS.find((p) => p.slug === resurfaceCourse.pillar)
                  : undefined;
                return (
                  <span key={lesson.slug}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/lessons/${lesson.slug}`} className="text-pillar-text hover:underline">
                      {lesson.title}
                    </Link>
                    {resurfacePillar ? <span className="text-subtle-foreground"> ({resurfacePillar.title})</span> : null}
                  </span>
                );
              })}
            </p>
          </div>
        ) : null}

        {hasRelated ? (
          <div className={columnCount > 1 ? "sm:col-span-2" : undefined}>
            <TechLabel>Related elsewhere</TechLabel>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              {relatedElsewhere.map(({ lesson, note }) => (
                <li key={lesson.slug}>
                  <Link href={`/lessons/${lesson.slug}`} className="text-pillar-text hover:underline">
                    {lesson.title}
                  </Link>
                  {" — "}
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Instrument>
    </details>
  );
}
