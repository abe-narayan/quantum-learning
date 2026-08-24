"use client";

import { Button } from "@/components/ui/Button";
import { useLessonProgress } from "@/lib/content/progress";

export function LessonCompleteToggle({ slug }: { slug: string }) {
  const { progress, setCompleted } = useLessonProgress(slug);

  return (
    <Button
      variant={progress.completed ? "secondary" : "primary"}
      onClick={() => setCompleted(!progress.completed)}
      aria-pressed={progress.completed}
    >
      {progress.completed ? "✓ Completed" : "Mark as complete"}
    </Button>
  );
}
