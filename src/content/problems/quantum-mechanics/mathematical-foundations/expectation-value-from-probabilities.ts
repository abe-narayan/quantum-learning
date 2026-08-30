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
      "Using the same setup as the Born rule problem (eigenvalues $+1,-1$, with $P(+1)=0.36$ and $P(-1)=0.64$), compute the expectation value $\\langle A\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: -0.28,
    tolerance: 0.01,
    incorrectFeedback: "⟨A⟩ = Σ (eigenvalue) × (its probability). Weight each eigenvalue by its own probability, then add.",
    nearMisses: [
      { value: 0, feedback: "0 is the unweighted average of the two eigenvalues. Weight each by its own probability: 0.36 against 0.64." },
      { value: 0.28, feedback: "The sign is inverted. The larger probability sits on the −1 eigenvalue, so the average comes out negative." },
      { value: 1, feedback: "The probabilities sum to 1, but the expectation value weights the eigenvalues by them: (+1)(0.36) + (−1)(0.64)." },
    ],
  },
  hints: [
    { text: "The probabilities are handed to you here, so nothing needs squaring. What is being tested is only how eigenvalues and probabilities combine." },
    { text: "Weight each eigenvalue by its own probability, then add the two contributions rather than averaging them." },
    { text: "The larger probability sits on the negative eigenvalue, so the result has to come out negative, and smaller in size than 1." },
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
