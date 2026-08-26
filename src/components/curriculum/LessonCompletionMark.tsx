"use client";

import { useLessonProgress } from "@/lib/content/progress";

/**
 * A small "completed" indicator shown next to a lesson's "View →" link once
 * the visitor has marked it done. Drawn as a ring-plus-check glyph in the
 * pillar's text-safe accent (`currentColor`, so no background fill and thus
 * no contrast computation to get wrong across six pillars and two themes) —
 * a shape distinct from every other state a module row can be in (no mark
 * at all if incomplete), so nothing here depends on color alone.
 */
export function LessonCompletionMark({ slug }: { slug: string }) {
  const { progress } = useLessonProgress(slug);
  if (!progress.completed) return null;

  return (
    <span aria-label="Completed" title="Completed" className="inline-flex text-pillar-text">
      <svg aria-hidden="true" data-decorative="" viewBox="0 0 16 16" className="h-4 w-4">
        <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M5 8.3 L7 10.2 L11 5.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
