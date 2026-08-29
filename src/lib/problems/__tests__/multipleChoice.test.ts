import { describe, expect, it } from "vitest";
import { validateMultipleChoice } from "../validators/multipleChoice";
import { seededShuffle } from "@/components/problems/optionOrder";
import type { MultipleChoiceAnswer, MultipleChoiceQuestion } from "../types";

const question: MultipleChoiceQuestion = {
  type: "multiple-choice",
  prompt: "Which is |0⟩⊗|1⟩?",
  options: [
    { id: "00", text: "$|00\\rangle$" },
    { id: "01", text: "$|01\\rangle$" },
    { id: "10", text: "$|10\\rangle$" },
  ],
};

const answer: MultipleChoiceAnswer = {
  type: "multiple-choice",
  correctOptionId: "01",
  optionFeedback: { "10": "Order matters." },
  defaultIncorrectFeedback: "Try again.",
};

describe("validateMultipleChoice", () => {
  it("marks the correct option as correct", () => {
    expect(validateMultipleChoice(question, answer, "01").status).toBe("correct");
  });

  it("marks a wrong option as incorrect with option-specific feedback", () => {
    const result = validateMultipleChoice(question, answer, "10");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Order matters.");
  });

  it("falls back to default feedback when no option-specific message exists", () => {
    const result = validateMultipleChoice(question, answer, "00");
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe("Try again.");
  });

  it("rejects an empty submission without crashing", () => {
    expect(validateMultipleChoice(question, answer, "").status).toBe("incorrect");
  });

  it("rejects an option id that doesn't exist on the question", () => {
    const result = validateMultipleChoice(question, answer, "not-a-real-option");
    expect(result.status).toBe("incorrect");
  });

  /**
   * The property that makes the seeded display shuffle safe at all. Options
   * are rendered in a per-slug order (see `components/problems/optionOrder.ts`)
   * and the submitted value is the option's `id`, never its position — so
   * reordering the authored array must change nothing about grading or about
   * which targeted feedback comes back. If this ever failed, shuffling the
   * display would be silently re-grading the problem.
   */
  it("grades identically no matter what order the options are in", () => {
    for (const seed of ["slug-one", "slug-two", "slug-three", "slug-four", "slug-five"]) {
      const reordered: MultipleChoiceQuestion = {
        ...question,
        options: seededShuffle(question.options, seed),
      };
      for (const option of question.options) {
        expect(validateMultipleChoice(reordered, answer, option.id)).toEqual(
          validateMultipleChoice(question, answer, option.id)
        );
      }
    }
  });

  it("looks feedback up by id, not by the option's index", () => {
    // "10" is the third authored option and the only one with targeted
    // feedback. Moving it to the front must not move its message onto
    // whatever now sits third.
    const reordered: MultipleChoiceQuestion = {
      ...question,
      options: [question.options[2], question.options[0], question.options[1]],
    };
    expect(validateMultipleChoice(reordered, answer, "10").message).toBe("Order matters.");
    expect(validateMultipleChoice(reordered, answer, "00").message).toBe("Try again.");
    expect(validateMultipleChoice(reordered, answer, "01").status).toBe("correct");
  });
});
