"use client";

import { Button } from "@/components/ui/Button";
import { TechLabel } from "@/components/ui/Typography";
import { useLessonProgress } from "@/lib/content/progress";

/**
 * Framed as a small instrument reading "Status" rather than a bare button —
 * finishing a lesson should register as a moment, not just flip a boolean
 * with no acknowledgement. `completedAt` (already persisted, previously
 * unused by any lesson UI) now surfaces as the actual date, so completing a
 * lesson leaves a visible trace rather than just a checkmark.
 */
export function LessonCompleteToggle({ slug }: { slug: string }) {
  const { progress, setCompleted } = useLessonProgress(slug);

  const completedDate = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="instrument flex flex-wrap items-center justify-between gap-4 px-5 py-4">
      <div>
        <TechLabel>Status</TechLabel>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {progress.completed
            ? completedDate
              ? `Marked complete on ${completedDate}.`
              : "Marked complete."
            : "Mark this lesson complete once you're confident with it."}
        </p>
      </div>
      <Button
        variant={progress.completed ? "secondary" : "primary"}
        onClick={() => setCompleted(!progress.completed)}
        aria-pressed={progress.completed}
      >
        {progress.completed ? (
          <>
            {/* The tick is a visual confirmation, not part of the button's
                name: bare in the label it was spoken ("check mark
                Completed" / "tick Completed"), on top of the "pressed"
                state `aria-pressed` already announces. Decorative here, so
                the accessible name is exactly "Completed". */}
            <span aria-hidden="true" data-decorative="">
              {"✓ "}
            </span>
            Completed
          </>
        ) : (
          "Mark as complete"
        )}
      </Button>
    </div>
  );
}
