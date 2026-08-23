import type { NumericProblem } from "@/lib/problems/types";

export const postulateExpectationValue: NumericProblem = {
  meta: {
    slug: "postulate-expectation-value",
    title: "Expectation Value From the Postulates",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["postulates", "expectation-value"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the same system as the previous problem — eigenvalues $+1,-1$, $|\\psi\\rangle=\\cos(\\pi/3)|e_+\\rangle+\\sin(\\pi/3)|e_-\\rangle$ — compute $\\langle A\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: -0.5,
    tolerance: 0.01,
    incorrectFeedback: "⟨A⟩ = (+1)·P(+1) + (-1)·P(-1). You need both probabilities, weighted by their eigenvalues.",
  },
  hints: [
    { text: "P(+1) = 0.25 (from the previous problem); P(-1) = 1 - 0.25 = 0.75." },
    { text: "⟨A⟩ = (+1)(0.25) + (-1)(0.75)." },
  ],
  solution: {
    steps: [
      { description: "$P(+1)=0.25$, $P(-1)=0.75$." },
      { description: "Weight each eigenvalue by its probability and sum.", latex: "\\langle A\\rangle = (1)(0.25)+(-1)(0.75) = -0.5" },
    ],
    finalAnswer: "$\\langle A\\rangle = -0.5$",
  },
  explanation: {
    correctIdea: "Expectation value is the probability-weighted average of the possible outcomes.",
    whyCorrect: "0.25 - 0.75 = -0.5 directly.",
    whyWrong: ["Averaging the two eigenvalues without weighting by probability (giving 0) ignores that -1 is three times as likely as +1 here."],
  },
};
