import Link from "next/link";
import { COURSES, PILLARS } from "@/lib/content/curriculum";
import { DIFFICULTY_LABEL, type Difficulty, type Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { getAllLessonsMeta } from "@/lib/content/lessons";
import { ENTRY_BAR_MATH } from "@/lib/entryBar";

/**
 * The route legend: the six tracks, named, ordered, linked, and labelled with
 * the level they start at.
 *
 * The page below is a descent, one track per section in curriculum order,
 * which reads well once you are moving but tells a first-time visitor nothing
 * about the shape of the thing until they have scrolled past it. This is the
 * legend for that descent.
 *
 * It used to sit in the hero. It sits here instead, under the explanation of
 * what a lesson is, because a list of six subject names read cold is a menu
 * (which of these do I want?) and the same list read after "here is what one
 * lesson does to you" is a route (this is the order they come in). The hero
 * keeps the count; this keeps the names.
 *
 * The `startsAt` rung is what makes it answer the question a beginner is
 * actually asking, which is not "what are the six subjects" but "which of
 * these is for me yet". It is derived from the real `difficulty` of the
 * courses inside each track, so a track cannot advertise a level its content
 * has drifted away from.
 *
 * "Tracks", not "pillars": the nav has always called them Tracks
 * (`TRACK_NAV_ITEMS` in src/lib/nav.ts), and the homepage said "Pillars", the
 * site's internal organizing word, used before anything had introduced it. See
 * docs/BEGINNER_REVIEW.md blocker 5. `Pillar` stays the type/data name
 * throughout the codebase; only the reader-facing noun is Tracks.
 *
 * Counts are computed from the same lesson metadata every catalog page reads
 * (`getAllLessonsMeta` is module-memoized, so calling it here as well as in
 * `Hero` re-walks nothing), not hand-maintained: an empty track would show as
 * 0 rather than quietly reporting a stale number.
 */

/** Ladder order, lowest rung first. `DIFFICULTY_LABEL` is keyed in that order
 *  and is the site-wide source of the reader-facing words. */
const RUNGS = Object.keys(DIFFICULTY_LABEL) as Difficulty[];

function startingRung(pillar: Pillar): Difficulty | null {
  const difficulties = new Set(
    COURSES.filter((course) => course.pillar === pillar).map((course) => course.difficulty)
  );
  return RUNGS.find((rung) => difficulties.has(rung)) ?? null;
}

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
    <nav aria-labelledby="curriculum-strip-heading" className="mt-16 border-t border-border pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 id="curriculum-strip-heading" className="tech-label">
          The curriculum, in order
        </h3>
        {/* `ENTRY_BAR_MATH` rather than a fresh wording. This line used to say
            "Foundational assumes school algebra", which quietly dropped the
            trigonometry half of the claim the rest of the site makes. That
            half is not decorative: both entry routes need sine and cosine in
            radians by their second lesson, which is why the fragment reads the
            way it does. Six different wordings of this claim existed across
            the site once, two of them false, so anything that restates it in
            its own words is somewhere it can drift out of true again. */}
        <p className="max-w-xl text-sm text-muted-foreground">
          Six tracks, each a stack of courses, and every lesson, problem and simulator on the site
          belongs to one of them. Foundational assumes {ENTRY_BAR_MATH}. Master assumes the five
          tracks above it.
        </p>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {PILLARS.map((pillar, index) => {
          const visual = PILLAR_VISUALS[pillar.slug];
          const count = lessonCounts.get(pillar.slug) ?? 0;
          const rung = startingRung(pillar.slug);
          const level = rung ? DIFFICULTY_LABEL[rung] : null;
          return (
            <li key={pillar.slug}>
              <Link
                href={visual.route}
                data-pillar={pillar.slug}
                aria-label={
                  level
                    ? `${pillar.title}, ${count} lessons, starts at ${level}`
                    : `${pillar.title}, ${count} lessons`
                }
                className="flex min-h-11 flex-col justify-center gap-0.5 rounded-(--radius-tight) border border-border bg-surface px-3 py-2 transition-colors duration-(--dur-fast) ease-instrument hover:border-pillar-edge hover:bg-pillar-wash"
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
                {/* Two lines, not one joined by a separator: at 320px a cell
                    in this two-column grid has ~116px of inner width, and
                    "24 lessons · Foundational" wraps mid-phrase there. Split
                    deliberately, each half wraps at a place that still reads. */}
                <span className="tech-value text-xs text-subtle-foreground">{count} lessons</span>
                {level ? <span className="tech-label">{level}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
