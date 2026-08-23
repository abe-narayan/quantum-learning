import { describe, expect, it } from "vitest";
import { validateMultipleChoice } from "../validators/multipleChoice";
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
});
