import Link from "next/link";
import { TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { getCourse, PILLARS } from "@/lib/content/curriculum";
import type { LessonMetaWithSlug } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type RelatedEntry = { lesson: LessonMetaWithSlug; note: string };

/**
 * A prerequisite, optionally carrying the author's note about *what* it gives
 * this lesson. The note is the same `related[].note` the "Related elsewhere"
 * list renders: 42 of the corpus's 125 `related` entries name a lesson that
 * is already a prerequisite, so `LessonLayout` folds those notes onto the
 * prerequisite rather than printing the same lesson twice in this one panel.
 * See the merge rationale in LessonLayout.tsx.
 */
type PrerequisiteEntry = { lesson: LessonMetaWithSlug; note?: string };

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
 *
 * "Requires" and "Related elsewhere" no longer overlap. A third of the
 * corpus's `related[]` entries name a lesson that is already a prerequisite,
 * which used to print that lesson twice inside this one panel — bare under
 * "Requires", then again with its note under a heading ("elsewhere") that
 * was false for it. `LessonLayout` now folds those notes onto the matching
 * prerequisite instead; see the reasoning there.
 */
export function LessonMetaStrip({
  currentCourseSlug,
  prerequisites,
  resurfacesIn,
  relatedElsewhere,
}: {
  currentCourseSlug: string;
  prerequisites: PrerequisiteEntry[];
  resurfacesIn: LessonMetaWithSlug[];
  relatedElsewhere: RelatedEntry[];
}) {
  const hasPrereqs = prerequisites.length > 0;
  const hasResurfaces = resurfacesIn.length > 0;
  const hasRelated = relatedElsewhere.length > 0;

  if (!hasPrereqs && !hasResurfaces && !hasRelated) return null;

  // A prerequisite that carries a note is a sentence, not a chip. Two
  // sentence-bearing lists side by side in half of a 46rem panel wrap to
  // three or four lines each and stop reading as a list at all, so the
  // moment any note is present the panel drops to a single column and lets
  // both lists have the full measure. Without notes (the majority of
  // lessons) the two-column pairing is unchanged.
  const anyPrereqNote = prerequisites.some((entry) => Boolean(entry.note));
  const columnCount = anyPrereqNote ? 1 : [hasPrereqs, hasResurfaces].filter(Boolean).length;

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
    // `max-w-reading`, not `max-w-3xl`. 3xl is 48rem — 32px wider than the
    // reading column every other block on a lesson page is measured to
    // (docs/DESIGN_SYSTEM.md §"the reading column is ~46rem", and
    // LessonLayout's prose, pre-content stack, FadeRule and complete-toggle
    // all use it). The below-body stack therefore stepped in and out by 32px
    // down its right edge — Lineage 48rem, rule 46rem, Status 46rem, What's
    // next 48rem — on all 219 lesson pages. Nothing looked broken enough to
    // name, which is exactly why it survived three passes.
    <details className="group mt-10 max-w-reading">
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-(--radius-tight)",
          "border border-border bg-surface-muted/40 px-4 py-3 transition-colors hover:bg-surface-muted",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        {/* Was "Lineage", which is unglossed jargon in the one piece of
            chrome that repeats on all 219 lesson pages: a reader has to open
            the disclosure to find out what the word meant, which is exactly
            backwards for a summary line whose job is to let them decide
            without opening it. The panel's dominant content is the "Requires"
            list, and the summary line beneath already names the other two. */}
        <span className="flex flex-col gap-0.5">
          <TechLabel>What this builds on</TechLabel>
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
        // Honest about provenance now that the two are mixed in one list: the
        // links come from the curriculum graph, the sentences after them are
        // written by the lesson's author. A reader who sees a note attached to
        // one prerequisite and none on the next should know that is an
        // authoring choice, not a gap in the data.
        footnote="Prerequisite and resurfacing links come from the curriculum graph. Notes are written by the lesson author."
      >
        {hasPrereqs ? (
          // A real `<ul>`, not the comma-run this used to be. Two reasons, and
          // the first is the one that forced it: a prerequisite can now carry
          // the author's note explaining what it gives this lesson (see the
          // merge in LessonLayout), and a run of "A — long sentence, B — long
          // sentence" separated only by commas has no scannable boundary
          // between entries. The second is free: a list announces as "list, 3
          // items" with item boundaries, which the run never did. "Resurfaces
          // in" below stays a run on purpose — it carries no notes, is often
          // long, and reads as an index rather than as a set of things to go
          // and do.
          <div>
            <TechLabel>Requires</TechLabel>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              {prerequisites.map(({ lesson, note }) => {
                const prereqCourse =
                  lesson.course !== currentCourseSlug ? getCourse(lesson.course) : undefined;
                return (
                  <li key={lesson.slug}>
                    <Link href={`/lessons/${lesson.slug}`} className="text-pillar-text hover:underline">
                      {lesson.title}
                    </Link>
                    {prereqCourse ? (
                      <span className="text-subtle-foreground"> ({prereqCourse.title})</span>
                    ) : null}
                    {note ? (
                      <>
                        {": "}
                        {note}
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ul>
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
                  {": "}
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
