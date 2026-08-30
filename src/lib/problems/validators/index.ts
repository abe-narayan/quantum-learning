import type { MultipleChoiceQuestion, Problem } from "../types";
import type { ValidationResult } from "./types";
import { validateMultipleChoice } from "./multipleChoice";
import { validateNumeric } from "./numeric";
import { conceptualContextFor, validateConceptual } from "./conceptual";

export type { ValidationResult, ValidationStatus } from "./types";
export { conceptualContextFor } from "./conceptual";

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
  const result = gradeAnswer(problem, rawAnswer);
  if (result.status !== "correct") return result;

  // The success path's own content, and the reason it is applied here rather
  // than inside the three validators: `explanation.correctIdea` is a property
  // of the *problem*, and this is the only function that holds one. Nothing
  // about grading changes — `gradeAnswer` has already decided — this only
  // replaces what a correct answer is told.
  //
  // WHY IT NEEDED REPLACING. `Feedback` prints "Correct" as the result
  // heading, and the numeric and multiple-choice validators both returned the
  // message "Correct.", so the whole of the success screen was:
  //
  //     Correct
  //     Correct.
  //
  // A *wrong* answer to the same problem got a sentence naming the specific
  // mistake ("0.96 is |β|, the amplitude's magnitude. The Born rule squares
  // it.") plus a block of onward links. Getting it right was strictly the
  // poorer experience: less to read, and fewer places to go. That is backwards.
  //
  // `correctIdea` is the right source and it costs no new authoring: all 556
  // problems already have one, it is written as a plain statement of the idea
  // rather than as praise (which this site does not do), and it is the same
  // sentence `SolutionPanel` shows — so a reader who then opens the solution
  // finds the message they were just given at the top of it, which reads as
  // confirmation rather than repetition.
  //
  // It is an *authored* string, so unlike every other message the validators
  // produce it can carry `$…$` and must be reachable from
  // `renderProblemMath`'s `authoredFeedback`, or a correct answer to one of
  // the 11 problems whose `correctIdea` contains math would be answered with
  // LaTeX source. That is the failure `feedbackMath.test.ts` exists for, and
  // it covers this field.
  const correctIdea = problem.explanation?.correctIdea?.trim();
  return correctIdea ? { ...result, message: correctIdea } : result;
}

/** The grading itself, unchanged: dispatch by type and return the verdict. */
function gradeAnswer(problem: Problem, rawAnswer: string): ValidationResult {
  switch (problem.answer.type) {
    case "multiple-choice":
      return validateMultipleChoice(problem.question as MultipleChoiceQuestion, problem.answer, rawAnswer);
    case "numeric":
      return validateNumeric(problem.answer, rawAnswer);
    case "conceptual":
      // The problem's own prompt, hints, and feedback are handed to the
      // grader so that pasting them back cannot score full marks — see
      // `conceptual.ts` §5. This is the only caller that has them, which is
      // why the context is a parameter rather than something the validator
      // reaches for.
      return validateConceptual(problem.answer, rawAnswer, conceptualContextFor(problem));
  }
}
