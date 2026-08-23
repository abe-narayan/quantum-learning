import type { ValidationStatus } from "../validators/types";

export type ProblemAttempt = {
  /** ms since epoch, stamped by the caller (not this module) at submit time. */
  timestamp: number;
  submitted: string;
  status: ValidationStatus;
};

export type ProblemProgress = {
  attempts: ProblemAttempt[];
  solved: boolean;
  hintsRevealed: number;
  solutionRevealed: boolean;
};

export const EMPTY_PROGRESS: ProblemProgress = {
  attempts: [],
  solved: false,
  hintsRevealed: 0,
  solutionRevealed: false,
};

/**
 * Persistence boundary for problem progress. No component or hook talks to
 * `localStorage` (or, eventually, a database) directly — everything goes
 * through this interface, so swapping the backend (an authenticated API,
 * server-side persistence) later means writing one new implementation, not
 * touching `ProblemView` or any other UI code.
 */
export interface ProgressStore {
  getProblemProgress(slug: string): ProblemProgress;
  recordAttempt(slug: string, attempt: ProblemAttempt): ProblemProgress;
  revealHint(slug: string, hintsRevealed: number): ProblemProgress;
  revealSolution(slug: string): ProblemProgress;
  resetProblem(slug: string): ProblemProgress;
}
