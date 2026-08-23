export type ValidationStatus = "correct" | "incorrect" | "partial";

export type ValidationResult = {
  status: ValidationStatus;
  /** Short, non-punitive feedback. Never the solution itself. */
  message: string;
};
