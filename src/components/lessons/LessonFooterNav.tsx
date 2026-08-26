import Link from "next/link";
import { TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import type { Course, LessonMetaWithSlug, PillarInfo } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const CARD_INTERACTIVE =
  "panel group flex flex-col gap-1.5 px-5 py-4 transition-[border-color,background-color,transform] duration-[--dur-fast] ease-[--ease-instrument] hover:border-pillar-edge hover:bg-surface-muted motion-safe:hover:-translate-y-0.5";

/**
 * The "what's next" moment. Keeps the previous implementation's behavior
 * exactly (prerequisite-graph-derived next-course suggestions, the terminal
 * "browse more" fallback) but replaces two flat bordered rectangles with a
 * discovery-shaped pairing: a quiet "previous" card and a next card/course
 * panel that carries the pillar's identity, so finishing a lesson reads as
 * forward motion rather than a form footer.
 */
export function LessonFooterNav({
  prevLesson,
  nextLesson,
  finishedCourse,
  nextCourseSuggestions,
  pillar,
}: {
  prevLesson: LessonMetaWithSlug | null;
  nextLesson: LessonMetaWithSlug | null;
  finishedCourse: Course | undefined;
  nextCourseSuggestions: { course: Course; lesson: LessonMetaWithSlug }[];
  pillar: PillarInfo | undefined;
}) {
  if (!prevLesson && !nextLesson && !finishedCourse) return null;

  return (
    <nav aria-label="Lesson navigation" className="mt-12 max-w-3xl">
      <TechLabel className="text-subtle-foreground">What&rsquo;s next</TechLabel>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {prevLesson ? (
          <Link href={`/lessons/${prevLesson.slug}`} className={CARD_INTERACTIVE}>
            <span className="tech-label text-subtle-foreground">← Previous</span>
            <p className="font-display text-base font-medium text-foreground group-hover:text-pillar-text">
              {prevLesson.title}
            </p>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}

        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className={cn(CARD_INTERACTIVE, "items-end border-l-2 border-l-pillar-edge text-right sm:col-start-2")}
          >
            <span className="tech-label text-subtle-foreground">Next →</span>
            <p className="font-display text-base font-medium text-foreground group-hover:text-pillar-text">
              {nextLesson.title}
            </p>
          </Link>
        ) : finishedCourse ? (
          <Instrument label="Course complete" className="sm:col-start-2">
            <p className="font-display text-lg font-semibold text-foreground">{finishedCourse.title}</p>
            {nextCourseSuggestions.length > 0 ? (
              <>
                <p className="mt-4 text-xs uppercase tracking-wide text-subtle-foreground">Continues into</p>
                <ul className="mt-2 space-y-1.5">
                  {nextCourseSuggestions.map(({ course: suggestedCourse, lesson }) => (
                    <li key={suggestedCourse.slug}>
                      <Link href={`/lessons/${lesson.slug}`} className="text-sm text-pillar-text hover:underline">
                        Start {suggestedCourse.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-4 text-sm">
                <Link href={pillar ? `/learn#${pillar.slug}` : "/learn"} className="text-pillar-text hover:underline">
                  Browse more courses →
                </Link>
              </p>
            )}
          </Instrument>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
