import type { NumericProblem } from "@/lib/problems/types";

export const degenerateMeasurementProbability: NumericProblem = {
  meta: {
    slug: "degenerate-measurement-probability",
    title: "A Degenerate Measurement Probability",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["measurement", "degeneracy", "born-rule"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"],
  },
  question: {
    type: "numeric",
    prompt: "For N = diag(1,1,2) and |psi> = (1/sqrt(3))(|0> + |1> + |2>), find P(N = 1).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.666667,
    tolerance: 0.001,
    incorrectFeedback: "P(N=1) sums |c_i|^2 over every basis state sharing eigenvalue 1 — that's |0> and |1> here, each with coefficient 1/sqrt(3).",
    nearMisses: [
      { value: 1 / 3, tolerance: 0.002, feedback: "1/3 counts only one of the two degenerate basis states. Both |0⟩ and |1⟩ carry eigenvalue 1, so both contribute to this outcome." },
      { value: 1 / Math.sqrt(3), tolerance: 0.002, feedback: "That is an amplitude, not a probability. Square each coefficient before summing." },
    ],
  },
  hints: [
    { text: "Which basis states share the eigenvalue 1?" },
    { text: "Sum |c|^2 for each of those states' coefficients." },
  ],
  solution: {
    steps: [
      { description: "$P(N{=}1) = |\\langle0|\\psi\\rangle|^2 + |\\langle1|\\psi\\rangle|^2 = \\left|\\frac{1}{\\sqrt3}\\right|^2 + \\left|\\frac{1}{\\sqrt3}\\right|^2 = \\frac13+\\frac13$" },
      { description: "Evaluate.", latex: "P(N{=}1) = \\frac23 \\approx 0.6667" },
    ],
    finalAnswer: "$P(N{=}1) \\approx 0.6667$",
  },
  explanation: {
    correctIdea: "The generalized Born rule sums probabilities over every eigenvector sharing the measured eigenvalue.",
    whyCorrect: "Direct application of P(a_i) = <psi|P_i|psi>, expanded as a sum of |c|^2 terms.",
    whyWrong: ["Using only one of the two degenerate coefficients (getting 1/3 instead of 2/3) forgets that both |0> and |1> contribute to the N=1 outcome."],
  },
};
