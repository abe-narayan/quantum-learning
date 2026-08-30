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
    incorrectFeedback: "Divide both sides of Δx·Δp ≥ ħ/2 by Δx to isolate Δp. If you answered one, you dropped the factor of two in the denominator.",
    nearMisses: [
      { value: 1, feedback: "1 drops the factor of 2. The bound is ħ/2, not ħ, so dividing by Δx leaves a half in front." },
      { value: 2, feedback: "2 inverts the fraction. The 2 sits in the denominator, alongside Δx." },
    ],
  },
  hints: [
    { text: "Nothing here has to be evaluated numerically. Rearranging the inequality so that $\\Delta p$ stands alone is the entire task." },
    { text: "Divide both sides by $\\Delta x$, then read off the smallest value of $\\Delta p$ the inequality still permits." },
    { text: "The prompt asks for the result in units of $\\hbar/\\Delta x$, so what is left over is the pure number in front of that combination. Check whether the 2 ended up above or below the line." },
  ],
  solution: {
    steps: [
      { description: "Divide both sides by $\\Delta x$.", latex: "\\Delta p \\ge \\frac{\\hbar}{2\\Delta x} = 0.5 \\times \\frac{\\hbar}{\\Delta x}" },
    ],
    finalAnswer: "$0.5$ (in units of $\\hbar/\\Delta x$)",
  },
  explanation: {
    correctIdea: "The minimum uncertainty is exactly half of ħ/Δx: the bound is saturated with equality, not just satisfied.",
    whyCorrect: "Direct algebraic rearrangement of the uncertainty relation.",
    whyWrong: ["Forgetting the factor of 1/2 (answering 1.0 instead of 0.5) is the most common slip."],
  },
};
