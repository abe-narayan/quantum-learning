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
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.703607,
    tolerance: 0.001,
    incorrectFeedback: "Just add V0 to E directly: (-4.2964) + 5.",
    nearMisses: [
      { value: -4.2964, tolerance: 0.001, feedback: "That is E measured from the top of the well, where V = 0 outside. Adding V₀ re-references it to the well's floor." },
      { value: 9.2964, tolerance: 0.001, feedback: "The sign slipped: E is negative, so E + V₀ is smaller than V₀, not larger." },
    ],
  },
  hints: [
    { text: "Two different zero-points are in play: the quoted $E$ is measured against the potential outside the well, while the well's floor sits a depth $V_0$ lower." },
    { text: "To express the energy above the floor, take the state's energy relative to the floor's potential value rather than relative to the outside." },
    { text: "$E$ is negative and $V_0$ is positive, so keep the sign of $E$ when you combine them. The result must be a positive number smaller than $V_0$." },
  ],
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
