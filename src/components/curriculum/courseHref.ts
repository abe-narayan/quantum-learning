/**
 * ============================================================
 * Where a course card / timeline station actually goes
 * ============================================================
 * A dedicated, statically generated `/courses/<slug>` page exists for every
 * course. This is the single place that decides the destination, so every
 * caller (`CourseList`, `CourseTimeline`) picks up any future change
 * automatically — no per-component logic to keep in sync.
 *
 * `COURSE_PAGES_LIVE` is `true`: `src/app/courses/[slug]/page.tsx` landed
 * during this pass — confirmed statically generated for every course
 * (`generateStaticParams` maps `COURSES`, `dynamicParams = false`, so there
 * is no "course exists but has no page" gap). If that route is ever removed
 * or gated, flip this back to `false` and every call site here falls back
 * to a course's first authored lesson — always a real, working page, never
 * a 404 — instead of a link with nothing behind it.
 */
const COURSE_PAGES_LIVE = true;

export function getCourseHref(courseSlug: string, firstAuthoredLessonSlug?: string): string {
  if (COURSE_PAGES_LIVE) return `/courses/${courseSlug}`;
  return firstAuthoredLessonSlug ? `/lessons/${firstAuthoredLessonSlug}` : "/learn";
}
