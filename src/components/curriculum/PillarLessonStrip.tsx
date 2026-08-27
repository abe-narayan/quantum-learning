import Link from "next/link";
import { Instrument } from "@/components/ui/Panel";
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
      label="Or open a lesson right now"
      readout={
        <span className="font-tech text-xs text-muted-foreground">
          <TechValue>{rows.length}</TechValue> of {PILLARS.length} tracks open
        </span>
      }
      footnote={
        <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span>
            The first written lesson of each track, in curriculum order — every one is a real page
            you can read today.
          </span>
          <Link
            href="/lessons"
            className="shrink-0 font-medium text-pillar-text underline-offset-4 hover:underline"
          >
            All {lessons.length} lessons →
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
              className="group flex min-h-11 items-center gap-3 rounded-[--radius-tight] px-2.5 py-2 transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:bg-surface-muted focus-visible:bg-surface-muted"
            >
              <span
                aria-hidden="true"
                data-decorative=""
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pillar-edge bg-pillar-wash font-tech text-[0.7rem] font-semibold text-pillar-text"
              >
                {row.index + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground group-hover:text-pillar-text">
                  {row.lesson.title}
                </span>
                <span className="truncate font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                  {/* The pillar number above is decorative; this is where the
                      pillar's name actually reaches a screen reader, and it
                      doubles as the "which of the six is this" cue for a
                      sighted reader who does not read the ramp by hue. */}
                  {row.pillarTitle} · {row.courseTitle}
                </span>
              </span>
              <span className="shrink-0 font-tech text-[0.65rem] tabular-nums text-subtle-foreground">
                {row.lesson.estimatedMinutes} min
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Instrument>
  );
}
