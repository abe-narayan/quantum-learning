export type ValidationStatus = "correct" | "incorrect" | "partial";

export type ValidationResult = {
  status: ValidationStatus;
  /** Short, non-punitive feedback. Never the solution itself. */
  message: string;
  /**
   * One extra line the *grader* knows and the authored message cannot: a fact
   * about this submission rather than about this problem.
   *
   * Only `validateNumeric` sets it, and only on a correct answer that was
   * accepted by tolerance rather than typed exactly, where the exact value is
   * information the reader does not otherwise get — someone who computes 0.92
   * for a problem whose answer is 0.9216 is right, and still better off
   * knowing the third and fourth digits.
   *
   * Always composed at runtime and therefore always plain text: it can carry
   * no `$…$` and needs no entry in `ProblemMath["feedback"]`, which is keyed
   * by authored strings. `Feedback` renders it through the same plain-text
   * path as every other composed message. See `renderProblemMath.ts`.
   */
  note?: string;
};
