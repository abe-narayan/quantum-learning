export type LessonProgress = {
  completed: boolean;
  completedAt: number | null;
};

export const EMPTY_LESSON_PROGRESS: LessonProgress = {
  completed: false,
  completedAt: null,
};

/**
 * Persistence boundary for lesson-completion state, mirroring
 * `ProgressStore` in `lib/problems/progress` — no component talks to
 * `localStorage` directly, so swapping the backend later means writing one
 * new implementation, not touching any lesson UI.
 */
export interface LessonProgressStore {
  getLessonProgress(slug: string): LessonProgress;
  setCompleted(slug: string, completed: boolean): LessonProgress;
}
