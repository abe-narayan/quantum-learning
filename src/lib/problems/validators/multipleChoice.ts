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
    // Not "Correct.": `Feedback` already prints "Correct" as the heading, so
    // that made the entire success screen the same word twice while a wrong
    // option got a sentence naming its specific mistake. `validateAnswer`
    // replaces this with the problem's authored `explanation.correctIdea`,
    // which every problem in the corpus has; this is the fallback for a
    // problem authored without one.
    return { status: "correct", message: "That is the right option." };
  }

  return {
    status: "incorrect",
    message: answer.optionFeedback?.[rawAnswer] ?? answer.defaultIncorrectFeedback,
  };
}
