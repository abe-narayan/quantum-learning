import Link from "next/link";
import { COURSES, PILLARS } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { getAllLessonsMeta } from "@/lib/content/lessons";

/**
 * The homepage's orientation strip: the six tracks, named and linked, inside
 * the opening screen instead of two scrolls down.
 *
 * The page below is a descent — one track per section, in curriculum order —
 * which reads well once you are moving but tells a first-time visitor nothing
 * about the shape of the thing until they have scrolled past it. This is the
 * legend for that descent: what the six subjects are, how many lessons sit
 * behind each, and a way straight into any of them. It also does the work of
 * defining the hero readout's "Tracks" figure in the one place that figure is
 * first shown, so the word never appears as an unexplained unit.
 *
 * "Tracks", not "pillars": the nav has always called them Tracks
 * (`TRACK_NAV_ITEMS` in src/lib/nav.ts), and the homepage said "Pillars" —
 * the site's internal organizing word, used before anything had introduced
 * it. See docs/BEGINNER_REVIEW.md blocker 5. `Pillar` stays the type/data
 * name throughout the codebase; only the reader-facing noun is Tracks.
 *
 * Counts are computed from the same lesson metadata every catalog page reads
 * (`getAllLessonsMeta` is module-memoized, so calling it here as well as in
 * `Hero` re-walks nothing), not hand-maintained — an empty track would show
 * as 0 rather than quietly reporting a stale number.
 */
export async function CurriculumStrip() {
  const lessons = await getAllLessonsMeta();

  const pillarByCourse = new Map(COURSES.map((course) => [course.slug, course.pillar]));
  const lessonCounts = new Map<string, number>();
  for (const lesson of lessons) {
    const pillar = pillarByCourse.get(lesson.course);
    if (!pillar) continue;
    lessonCounts.set(pillar, (lessonCounts.get(pillar) ?? 0) + 1);
  }

  return (
    <nav aria-labelledby="curriculum-strip-heading" className="mt-10 border-t border-border pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 id="curriculum-strip-heading" className="tech-label">
          The curriculum, in order
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Six tracks, each a stack of courses. Quantum Mechanics first, Apex last — every
          lesson, problem, and simulator on the site belongs to one of them.
        </p>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {PILLARS.map((pillar, index) => {
          const visual = PILLAR_VISUALS[pillar.slug];
          const count = lessonCounts.get(pillar.slug) ?? 0;
          return (
            <li key={pillar.slug}>
              <Link
                href={visual.route}
                data-pillar={pillar.slug}
                aria-label={`${pillar.title} — ${count} lessons`}
                className="flex min-h-11 flex-col justify-center gap-0.5 rounded-[var(--radius-tight)] border border-border bg-surface px-3 py-2 transition-colors duration-[--dur-fast] ease-[--ease-instrument] hover:border-pillar-edge hover:bg-pillar-wash"
              >
                <span className="flex items-baseline gap-1.5">
                  {/* The index is the ordering cue the sections below repeat
                      ("01 · Quantum Mechanics"); as a name it would only add
                      a bare number in front of every link. */}
                  <span aria-hidden="true" data-decorative="" className="tech-label text-pillar-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-foreground">{visual.short}</span>
                </span>
                <span className="tech-value text-xs text-subtle-foreground">{count} lessons</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
