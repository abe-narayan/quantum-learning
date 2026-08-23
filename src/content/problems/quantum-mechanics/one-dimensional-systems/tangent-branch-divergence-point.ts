import type { NumericProblem } from "@/lib/problems/types";

export const tangentBranchDivergencePoint: NumericProblem = {
  meta: {
    slug: "tangent-branch-divergence-point",
    title: "Where the First Tangent Branch Diverges",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["finite-square-well", "transcendental-equation"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"],
  },
  question: {
    type: "numeric",
    prompt: "For a finite well with half-width a = 2, the even-parity condition's tangent term diverges when k*a = pi/2. Find that value of k.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.785398,
    tolerance: 0.001,
    incorrectFeedback: "Solve k*a = pi/2 for k, with a=2.",
  },
  hints: [{ text: "k = pi/(2a) directly." }],
  solution: {
    steps: [{ description: "$k = \\dfrac{\\pi}{2a} = \\dfrac{\\pi}{4} \\approx 0.7854$." }],
    finalAnswer: "$k \\approx 0.7854$",
  },
  explanation: {
    correctIdea: "The tangent function's first divergence bounds how far the first branch of possible bound-state wavenumbers extends.",
    whyCorrect: "Direct substitution into ka = pi/2.",
    whyWrong: ["Using a=2 as if it were the full width (rather than the half-width already specified) would give a different, incorrect divergence point."],
  },
};
