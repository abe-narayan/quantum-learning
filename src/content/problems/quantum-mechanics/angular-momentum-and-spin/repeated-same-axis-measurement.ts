import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const repeatedSameAxisMeasurement: MultipleChoiceProblem = {
  meta: {
    slug: "repeated-same-axis-measurement",
    title: "Measuring the Same Axis Twice in a Row",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["stern-gerlach"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"],
  },
  question: {
    type: "multiple-choice",
    prompt: "If a z-oriented SG apparatus gives 'up', and a SECOND z-oriented apparatus immediately follows (same axis, nothing in between), what is P(up again)?",
    options: [
      { id: "a", text: "1 (certain)" },
      { id: "b", text: "0.5" },
      { id: "c", text: "0" },
      { id: "d", text: "Depends on the atom's speed" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "0.5 would apply if an incompatible-axis measurement occurred in between — here there's no intervening measurement at all.",
      c: "This would mean measuring twice always flips the outcome, which contradicts the state being an eigenstate after the first measurement.",
      d: "Measurement outcomes here don't depend on classical details like speed — only on the quantum state and which observable is measured.",
    },
    defaultIncorrectFeedback: "After the first measurement, the atom is in the |↑⟩ eigenstate exactly — what does measuring the same observable again on an eigenstate give?",
  },
  hints: [
    { text: "After the first z-measurement gives 'up', the state collapses to exactly |↑⟩." },
    { text: "|↑⟩ is already an eigenstate of Sz with eigenvalue +ħ/2." },
    { text: "Measuring the same observable on its own eigenstate reproduces that same eigenvalue with certainty." },
  ],
  solution: {
    steps: [{ description: "|↑⟩ is already an Sz eigenstate, so measuring Sz again (with nothing in between) gives 'up' with certainty, P=1." }],
    finalAnswer: "P = 1 (certain)",
  },
  explanation: {
    correctIdea: "This contrasts directly with the x-then-z sequence — without an intervening incompatible-observable measurement, there's no disturbance to erase the first result.",
    whyCorrect: "This is exactly the lesson's Practice Question 3, confirming why the intervening x-measurement specifically is what breaks the correlation.",
    whyWrong: ["Any answer other than certainty misses that measuring the same compatible observable twice, with nothing disturbing the state in between, simply confirms the same result."],
  },
};
