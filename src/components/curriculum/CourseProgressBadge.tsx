"use client";

import { Badge } from "@/components/ui/Badge";
import { useCompletedLessonSlugs } from "@/lib/content/progress";

/**
 * Distinct from the server-rendered "X/Y lessons" badge in `CourseList`,
 * which tracks content-authoring completeness. This tracks the visitor's
 * own progress, so it only renders once they've actually completed
 * something in this course — an empty "0/12" badge on every course for a
 * first-time visitor would just be noise.
 */
export function CourseProgressBadge({ lessonSlugs }: { lessonSlugs: string[] }) {
  const completedSlugs = useCompletedLessonSlugs();
  const completedCount = lessonSlugs.filter((slug) => completedSlugs.has(slug)).length;

  if (completedCount === 0) return null;

  return (
    <Badge tone="accent">
      {completedCount}/{lessonSlugs.length} completed by you
    </Badge>
  );
}
