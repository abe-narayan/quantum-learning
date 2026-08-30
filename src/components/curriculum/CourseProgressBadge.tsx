"use client";

import { useCompletedLessonSlugs } from "@/lib/content/progress";

/**
 * Distinct from the server-rendered "X/Y lessons" readout in `CourseList`,
 * which tracks content-authoring completeness. This tracks the visitor's
 * own progress, so it only renders once they've actually completed
 * something in this course — an empty "0/12" chip on every course for a
 * first-time visitor would just be noise.
 *
 * Styled as a technical-voice readout in the pillar channel (a translucent
 * `pillar-wash` fill with a `pillar-edge` hairline) rather than the generic
 * `Badge` component, which only knows the site-level `--brand`/`--accent`
 * tokens and would look identical — and wrong — under every pillar.
 */
export function CourseProgressBadge({ lessonSlugs }: { lessonSlugs: string[] }) {
  const completedSlugs = useCompletedLessonSlugs();
  const completedCount = lessonSlugs.filter((slug) => completedSlugs.has(slug)).length;

  if (completedCount === 0) return null;

  return (
    // "3/8 done" sat inches from CourseList's authoring fraction in the same
    // pillar hue and the two read as one number. Naming the owner ("Your
    // progress") is what separates them, and it costs one word.
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pillar-edge bg-pillar-wash px-2.5 py-1 tech-label text-pillar-text">
      Your progress {completedCount}/{lessonSlugs.length}
    </span>
  );
}
