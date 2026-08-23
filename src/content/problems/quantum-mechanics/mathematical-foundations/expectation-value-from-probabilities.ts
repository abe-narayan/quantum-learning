import type { NumericProblem } from "@/lib/problems/types";

export const expectationValueFromProbabilities: NumericProblem = {
  meta: {
    slug: "expectation-value-from-probabilities",
    title: "Expectation Value From Outcome Probabilities",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["born-rule", "expectation-value"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/probability-and-quantum-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the same setup as the Born rule problem — eigenvalues $+1,-1$, with $P(+1)=0.36$ and $P(-1)=0.64$ — compute the expectation value $\\langle A\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: -0.28,
    tolerance: 0.01,
    incorrectFeedback: "⟨A⟩ = Σ (eigenvalue) × (its probability) — weight each eigenvalue by its own probability and add.",
  },
  hints: [
    { text: "⟨A⟩ = (+1)·P(+1) + (-1)·P(-1)." },
    { text: "= (1)(0.36) + (-1)(0.64)." },
  ],
  solution: {
    steps: [
      { description: "Apply the expectation-value formula.", latex: "\\langle A\\rangle = (+1)(0.36) + (-1)(0.64)" },
      { description: "Simplify.", latex: "\\langle A\\rangle = 0.36 - 0.64 = -0.28" },
    ],
    finalAnswer: "$\\langle A\\rangle = -0.28$",
  },
  explanation: {
    correctIdea: "Expectation value is a probability-weighted average of the possible outcomes.",
    whyCorrect: "0.36-0.64=-0.28 directly; this also equals ⟨ψ|A|ψ⟩ computed the other way, as the lesson derives.",
    whyWrong: ["Averaging the two eigenvalues without weighting by their probabilities (giving 0) ignores that -1 is more likely than +1 here."],
  },
};
