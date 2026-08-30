"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useCompletedLessonSlugs } from "@/lib/content/progress";

export type OrderedLesson = {
  slug: string;
  title: string;
  courseTitle: string;
};

/**
 * Picks a "next lesson" by finding the learner's furthest point in the
 * curriculum's reading order (the index of their last completed lesson)
 * and returning the first uncompleted lesson after it. That covers the
 * common case of working through courses roughly in order, including
 * jumping ahead into a later course before finishing an earlier one. If
 * nothing uncompleted follows their furthest point (the tail is done but
 * something earlier was skipped), it falls back to the first uncompleted
 * lesson anywhere in the list.
 */
function findNextLesson(
  lessons: OrderedLesson[],
  completed: ReadonlySet<string>
): OrderedLesson | undefined {
  let furthestIndex = -1;
  for (let i = 0; i < lessons.length; i++) {
    if (completed.has(lessons[i].slug)) furthestIndex = i;
  }

  for (let i = furthestIndex + 1; i < lessons.length; i++) {
    if (!completed.has(lessons[i].slug)) return lessons[i];
  }

  return lessons.find((lesson) => !completed.has(lesson.slug));
}

/**
 * Renders nothing for a brand-new visitor (zero completed lessons) so the
 * default hero CTA is all they see. Only a returning visitor with at least
 * one completed lesson gets a "continue learning" link in its place.
 */
export function ContinueLearningClient({ lessons }: { lessons: OrderedLesson[] }) {
  const completed = useCompletedLessonSlugs();

  if (completed.size === 0) return null;

  const next = findNextLesson(lessons, completed);
  if (!next) return null;

  return (
    // The whole box is one link, so without a label its accessible name is
    // every string inside it run together: "Continue learning <title>
    // <course> Resume →". The label states the one thing a link name has to
    // say — what happens and where it goes — and the rest stays readable in
    // browse mode. The arrow is decoration; announcing "right arrow" after
    // the lesson title adds nothing.
    <Link
      href={`/lessons/${next.slug}`}
      aria-label={`Continue learning: ${next.title}, in ${next.courseTitle}`}
      className="mt-6 flex items-center justify-between gap-3 rounded-panel border border-brand/30 bg-brand/5 px-4 py-3 transition-colors hover:border-brand/50"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">Continue learning</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{next.title}</p>
        <p className="text-xs text-muted-foreground">{next.courseTitle}</p>
      </div>
      <Badge tone="brand" className="shrink-0">
        Resume{" "}
        <span aria-hidden="true" data-decorative="">
          →
        </span>
      </Badge>
    </Link>
  );
}
