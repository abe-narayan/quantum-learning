import type { MultipleChoiceQuestion, Problem } from "../types";
import type { ValidationResult } from "./types";
import { validateMultipleChoice } from "./multipleChoice";
import { validateNumeric } from "./numeric";
import { validateConceptual } from "./conceptual";

export type { ValidationResult, ValidationStatus } from "./types";

/**
 * Dispatches to the type-specific validator. `problem.answer.type` is a
 * genuine discriminant of the `Answer` union so it narrows `problem.answer`
 * cleanly; `problem.question` is cast alongside it because TypeScript's
 * control-flow analysis narrows only the property actually switched on
 * (`problem.answer`), not sibling properties of the same union member —
 * `question.type` and `answer.type` are kept in lockstep by construction,
 * and `registry.test.ts` asserts that invariant for every authored problem
 * so a mismatch fails fast in tests, not silently here.
 */
export function validateAnswer(problem: Problem, rawAnswer: string): ValidationResult {
  switch (problem.answer.type) {
    case "multiple-choice":
      return validateMultipleChoice(problem.question as MultipleChoiceQuestion, problem.answer, rawAnswer);
    case "numeric":
      return validateNumeric(problem.answer, rawAnswer);
    case "conceptual":
      return validateConceptual(problem.answer, rawAnswer);
  }
}
