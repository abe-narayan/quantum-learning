import type { NumericProblem } from "@/lib/problems/types";

export const minimumMomentumUncertainty: NumericProblem = {
  meta: {
    slug: "minimum-momentum-uncertainty",
    title: "Minimum Momentum Uncertainty",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/position-and-momentum",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["uncertainty", "position-momentum"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/position-and-momentum"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using $\\Delta x\\,\\Delta p \\ge \\hbar/2$, what is the minimum possible value of $\\Delta p$, expressed in units of $\\hbar/\\Delta x$?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.01,
    incorrectFeedback: "Divide both sides of Δx·Δp ≥ ħ/2 by Δx to isolate Δp in units of ħ/Δx.",
  },
  hints: [
    { text: "Δp ≥ ħ/(2Δx) = 0.5 × (ħ/Δx)." },
  ],
  solution: {
    steps: [
      { description: "Divide both sides by $\\Delta x$.", latex: "\\Delta p \\ge \\frac{\\hbar}{2\\Delta x} = 0.5 \\times \\frac{\\hbar}{\\Delta x}" },
    ],
    finalAnswer: "$0.5$ (in units of $\\hbar/\\Delta x$)",
  },
  explanation: {
    correctIdea: "The minimum uncertainty is exactly half of ħ/Δx — the bound is saturated with equality, not just satisfied.",
    whyCorrect: "Direct algebraic rearrangement of the uncertainty relation.",
    whyWrong: ["Forgetting the factor of 1/2 (answering 1.0 instead of 0.5) is the most common slip."],
  },
};
