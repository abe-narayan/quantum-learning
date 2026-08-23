import type { NumericProblem } from "@/lib/problems/types";

export const energyAboveWellFloor: NumericProblem = {
  meta: {
    slug: "energy-above-well-floor",
    title: "Energy Above the Well's Floor",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["finite-square-well", "numerical-methods"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"],
  },
  question: {
    type: "numeric",
    prompt: "For the lesson's worked well (half-width a = 1, depth V0 = 5, ground state E ≈ -4.2964), find the energy above the well's floor, E + V0.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.703607,
    tolerance: 0.001,
    incorrectFeedback: "Just add V0 to E directly: (-4.2964) + 5.",
  },
  hints: [{ text: "E + V0 directly, using the lesson's own numbers." }],
  solution: {
    steps: [{ description: "$E+V_0 \\approx -4.2964+5 = 0.7036$." }],
    finalAnswer: "$\\approx 0.7036$",
  },
  explanation: {
    correctIdea: "This is the energy measured from the bottom of the well, the natural comparison point against the infinite well's E_1.",
    whyCorrect: "Direct arithmetic using the lesson's own bisection result.",
    whyWrong: ["Comparing E directly to the infinite well's E_1 (both positive numbers) without first shifting to a common reference point (the well's floor) compares two different zero-points."],
  },
};
