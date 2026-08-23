import type { MultipleChoiceAnswer, MultipleChoiceQuestion } from "../types";
import type { ValidationResult } from "./types";

/** `rawAnswer` is the selected option's `id`, or "" if nothing is selected. */
export function validateMultipleChoice(
  question: MultipleChoiceQuestion,
  answer: MultipleChoiceAnswer,
  rawAnswer: string
): ValidationResult {
  if (!rawAnswer) {
    return { status: "incorrect", message: "Select an option before submitting." };
  }

  const selected = question.options.find((option) => option.id === rawAnswer);
  if (!selected) {
    return { status: "incorrect", message: "That option isn't valid for this question." };
  }

  if (rawAnswer === answer.correctOptionId) {
    return { status: "correct", message: "Correct." };
  }

  return {
    status: "incorrect",
    message: answer.optionFeedback?.[rawAnswer] ?? answer.defaultIncorrectFeedback,
  };
}
