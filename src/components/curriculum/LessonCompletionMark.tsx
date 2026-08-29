"use client";

import { useLessonProgress } from "@/lib/content/progress";

/**
 * A small "completed" indicator shown next to a lesson's "View →" link once
 * the visitor has marked it done. Drawn as a ring-plus-check glyph in the
 * pillar's text-safe accent (`currentColor`, so no background fill and thus
 * no contrast computation to get wrong across six pillars and two themes) —
 * a shape distinct from every other state a module row can be in (no mark
 * at all if incomplete), so nothing here depends on color alone.
 *
 * The word "Completed" is a real `sr-only` text node in the tree, NOT an
 * `aria-label` on the wrapper. That distinction is the whole accessibility of
 * this component. A `<span>` with no `role` has the implicit `generic` role,
 * and ARIA prohibits naming a `generic` element — every major screen reader
 * simply drops the attribute. So the previous `<span aria-label="Completed">`
 * wrapping an `aria-hidden` SVG contributed *nothing* to the accessibility
 * tree: this mark is rendered beside lesson links across the whole site, and
 * a screen-reader user could not tell a single finished lesson from an
 * unfinished one anywhere. `role="img"` on the wrapper would also honour the
 * label, but a plain text node is the pattern this codebase already uses for
 * exactly this job (AnswerInput's "Option B:" prefix, ProblemsCatalog's
 * "— remove this filter"), it needs no role support to be announced, and it
 * applies unchanged to the two sibling marks in components/map/ that render a
 * bare "✓" character rather than an SVG — so all three now say the same word
 * the same way. `title` stays as the pointer tooltip; it is not load-bearing
 * for assistive tech and never was.
 */
export function LessonCompletionMark({ slug }: { slug: string }) {
  const { progress } = useLessonProgress(slug);
  if (!progress.completed) return null;

  return (
    <span title="Completed" className="inline-flex text-pillar-text">
      <span className="sr-only">Completed</span>
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
