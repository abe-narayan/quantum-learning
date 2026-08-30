import Link from "next/link";
import { Instrument } from "@/components/ui/Panel";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { TechValue } from "@/components/ui/Typography";
import { PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { PILLAR_ORDER } from "@/lib/design/pillars";
import type { LessonMetaWithSlug, Pillar } from "@/lib/content/types";

/**
 * ============================================================
 * PillarLessonStrip — real lesson titles, one screen in
 * ============================================================
 * The brief's open complaint about `/learn` was that *lessons* — the thing a
 * visitor actually came to read — are invisible until they scroll a long way.
 * The page opens with a hero, a readout row, a two-card "how do you want to
 * start" fork, a search field and six pillar headers before the first course
 * card's module manifest appears, and even that manifest is a list of *module*
 * titles behind another click.
 *
 * Of the three fixes the brief weighs, two are already in the tree: every
 * authored module row in `CourseList` is already a direct link to its lesson,
 * and (as of this pass) it is labelled with the *lesson's* own title rather
 * than the module's. What was missing is the third — something high on the
 * page with real lesson titles on it. This is that, and it is deliberately
 * built as *one row per pillar* rather than as a "latest lessons" feed:
 *
 *   - It shows six real, clickable lesson titles within the first screen or
 *     two, so "where are the lessons" is answered before any scrolling.
 *   - Because it is the **first authored lesson of each pillar, in curriculum
 *     order**, it restates the six-pillar progression instead of flattening
 *     it. A "recently authored" strip would have done the opposite: an
 *     arbitrary, order-destroying sample of six lessons from anywhere, which
 *     is exactly the "wall" the brief warns against. (There is also no
 *     authored-at date in `lessonMeta`, so "recent" could only ever have been
 *     faked from file order.)
 *   - It is honest: every row is derived from what is actually written. A
 *     pillar with nothing authored yet simply has no row, and the readout
 *     says how many of the six are open.
 *
 * It is one `Instrument` with a `TechLabel` header — not a heading — so it
 * adds no level to the document outline and cannot compete with the "Two ways
 * in" heading it sits under. Each row carries `data-pillar`, so the six rows
 * are tinted through their own pillar channels and read as the ramp, not as
 * six identical chips.
 *
 * Server component: pure data, no hooks, so none of this reaches the client
 * bundle.
 */

type StripRow = {
  pillar: Pillar;
  pillarTitle: string;
  index: number;
  lesson: LessonMetaWithSlug;
  courseTitle: string;
};

function buildRows(lessons: LessonMetaWithSlug[]): StripRow[] {
  // `course|module` index so the per-pillar walk below stays linear rather
  // than re-scanning the whole lesson list for every module of every course.
  const byCourseModule = new Map(lessons.map((lesson) => [`${lesson.course}|${lesson.module}`, lesson]));

  const rows: StripRow[] = [];
  for (const pillar of PILLARS) {
    const courses = getCoursesByPillar(pillar.slug);
    let found: { lesson: LessonMetaWithSlug; courseTitle: string } | undefined;
    for (const course of courses) {
      for (const courseModule of course.modules) {
        const lesson = byCourseModule.get(`${course.slug}|${courseModule.slug}`);
        if (lesson) {
          found = { lesson, courseTitle: course.title };
          break;
        }
      }
      if (found) break;
    }
    if (!found) continue;
    rows.push({
      pillar: pillar.slug,
      pillarTitle: pillar.title,
      index: PILLAR_ORDER.indexOf(pillar.slug),
      lesson: found.lesson,
      courseTitle: found.courseTitle,
    });
  }
  return rows;
}

export function PillarLessonStrip({
  lessons,
  className,
}: {
  lessons: LessonMetaWithSlug[];
  className?: string;
}) {
  const rows = buildRows(lessons);
  if (rows.length === 0) return null;

  return (
    <Instrument
      className={className}
      // Not "Or open a lesson right now". The fork above it now names its two
      // doors "Route A" and "Route B", and a leading "Or" made this strip read
      // as a third route with six destinations rather than as the same choice
      // shown in more detail.
      label="Open a lesson right now"
      readout={
        <span className="font-tech text-xs text-muted-foreground">
          <TechValue>{rows.length}</TechValue> of {PILLARS.length} tracks open
        </span>
      }
      footnote={
        <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          {/* The second clause is the one that had to be here. Every row is
              genuinely a real page, and on `/learn` this strip sits directly
              under the beginner fork, so "open a lesson right now" over six
              undifferentiated rows was the shortest route on the site from
              "never seen quantum mechanics" to row 6, a 65-minute Apex
              lesson. The rows now carry `DifficultyMark`; this says out loud
              what the marks encode. */}
          <span>
            The first written lesson of each track, in curriculum order, each marked with its
            level. Every one is a real page you can read today, but the list climbs: these are six
            tracks in order, not six equal doors.
          </span>
          {/* `-my-3.5 py-3.5` grows a 16px line box to a 44px hit area without
              moving the footnote strip, the same padding-cancelled-by-margin
              trick `LessonSearch` uses; and the arrow is `aria-hidden` because
              this link has no `aria-label` to override it, so without the wrap
              a screen reader ends the name with "right arrow". */}
          <Link
            href="/lessons"
            className="-my-3.5 shrink-0 py-3.5 font-medium text-pillar-text underline-offset-4 hover:underline"
          >
            All {lessons.length} lessons{" "}
            <span aria-hidden="true" data-decorative="">
              →
            </span>
          </Link>
        </span>
      }
    >
      {/* `-m-1.5` pulls the rows back toward the instrument's frame without
          fighting `Instrument`'s own `p-4 sm:p-5` body padding. It has to be a
          margin and not a `bodyClassName` padding override, because `cn()` here
          is a plain string join with no tailwind-merge: two `p-*` utilities
          both survive into the class attribute and the *stylesheet* order (not
          the attribute order) decides, so `p-4` would quietly beat any smaller
          padding passed in. */}
      <ol className="-m-1.5 grid gap-1 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.lesson.slug} data-pillar={row.pillar}>
            <Link
              href={`/lessons/${row.lesson.slug}`}
              className="group flex min-h-11 items-center gap-3 rounded-(--radius-tight) px-2.5 py-2 transition-colors duration-(--dur-fast) ease-mech hover:bg-surface-muted focus-visible:bg-surface-muted"
            >
              <span
                aria-hidden="true"
                data-decorative=""
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pillar-edge bg-pillar-wash font-tech text-meta font-semibold text-pillar-text"
              >
                {row.index + 1}
              </span>
              {/* Neither line truncates, and the measurement is why. At a 320px
                  viewport `Container` leaves 288px; `.instrument`'s 1px borders
                  and the body's `p-4` leave 254px; the `-m-1.5` on the `<ol>`
                  puts 12px back, giving 266px; the link's `px-2.5` leaves
                  246px. Off that come the 28px index badge, two 12px gaps, and
                  the minutes column ("30 min" is 6 monospace characters at
                  0.65rem, about 38px), leaving this column 156px. At 14px that
                  is roughly 21 characters for the title, and at 0.65rem
                  monospace with `tracking-wide` about 24 for the line below —
                  so "Quantum Mechanics · Mathematical Foundations for Quantum
                  Physics" arrived as "QUANTUM MECHANICS · MATH...", which
                  deletes the course name this line exists to carry. The `sm`
                  two-column grid is no wider (a 640px viewport gives 169px per
                  column), so there is no width at which truncation was showing
                  the whole string. Wrapping to a second line costs a few pixels
                  of row height; `min-h-11` already reserved most of it. */}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-foreground group-hover:text-pillar-text">
                  {row.lesson.title}
                </span>
                <span className="tech-label leading-snug text-subtle-foreground">
                  {/* The pillar number above is decorative; this is where the
                      pillar's name actually reaches a screen reader, and it
                      doubles as the "which of the six is this" cue for a
                      sighted reader who does not read the ramp by hue. */}
                  {row.pillarTitle} · {row.courseTitle}
                </span>
                {/* The level, on its own line rather than beside the minutes,
                    and the 320px arithmetic in the note above is why: the
                    text column is 156px there, and the mark is four ticks
                    (33px), an 8px gap and a `tech-label` word, so
                    "Foundational" at 8.14px a character is 139px — it fits on
                    a line of its own and cannot fit on one shared with the
                    minutes. `data-pillar` on the `<li>` already scopes the
                    pillar channel, so the ticks tint with the row. */}
                <DifficultyMark difficulty={row.lesson.difficulty} className="mt-1" />
              </span>
              <span className="shrink-0 font-tech text-micro tabular-nums text-subtle-foreground">
                {row.lesson.estimatedMinutes} min
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Instrument>
  );
}
