"use client";

import { useLessonProgress } from "@/lib/content/progress";

/** A small checkmark shown next to a lesson's "View →" link once the visitor has marked it complete. */
export function LessonCompletionMark({ slug }: { slug: string }) {
  const { progress } = useLessonProgress(slug);
  if (!progress.completed) return null;

  return (
    <span aria-label="Completed" title="Completed" className="text-accent">
      ✓
    </span>
  );
}
