import type { NumericAnswer } from "../types";
import type { ValidationResult } from "./types";

/**
 * `rawAnswer` is parsed with `Number(...)`, never `eval` — a submission
 * that isn't a plain numeric literal (e.g. "1/2", "sqrt(2)") is rejected
 * as unparseable rather than executed. Students are expected to submit a
 * decimal value, same as any numeric-answer field in a textbook.
 *
 * When the submission is wrong, `answer.nearMisses` (if authored) is
 * checked next: each entry is a recognizable mistake (sign flip, forgot to
 * square, ...) with its own feedback and an optional tolerance window
 * defaulting to the answer's own. Checked only *after* the correct-answer
 * test fails, so a near miss can never shadow the real answer; first
 * matching entry wins, keeping the result deterministic.
 */
export function validateNumeric(answer: NumericAnswer, rawAnswer: string): ValidationResult {
  const trimmed = rawAnswer.trim();
  if (trimmed === "") {
    return { status: "incorrect", message: "Enter a number before submitting." };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { status: "incorrect", message: "That doesn't look like a number — enter a decimal value (e.g. 0.5)." };
  }

  const toleranceType = answer.toleranceType ?? "absolute";
  const allowedError = toleranceType === "relative" ? Math.abs(answer.value) * answer.tolerance : answer.tolerance;
  const error = Math.abs(parsed - answer.value);

  if (error <= allowedError) {
    return { status: "correct", message: "Correct." };
  }

  for (const nearMiss of answer.nearMisses ?? []) {
    const nearMissTolerance = nearMiss.tolerance ?? answer.tolerance;
    const nearMissAllowedError =
      toleranceType === "relative" ? Math.abs(nearMiss.value) * nearMissTolerance : nearMissTolerance;
    if (Math.abs(parsed - nearMiss.value) <= nearMissAllowedError) {
      return { status: "incorrect", message: nearMiss.feedback };
    }
  }

  return { status: "incorrect", message: answer.incorrectFeedback };
}
