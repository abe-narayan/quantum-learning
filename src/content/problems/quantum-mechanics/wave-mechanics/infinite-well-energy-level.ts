import type { NumericProblem } from "@/lib/problems/types";

export const infiniteWellEnergyLevel: NumericProblem = {
  meta: {
    slug: "infinite-well-energy-level",
    title: "Infinite Well Energy Level",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["infinite-square-well", "energy-levels"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-infinite-square-well"],
  },
  question: {
    type: "numeric",
    prompt: "For an infinite square well of width L = 6 (natural units, hbar = m = 1), find E_2 = n^2*pi^2/(2*L^2) for n = 2.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.548311,
    tolerance: 0.001,
    incorrectFeedback: "E_n = n^2*pi^2/(2*L^2). Substitute n=2, L=6 carefully — L is squared in the denominator.",
  },
  hints: [
    { text: "E_n = n^2 * pi^2 / (2*L^2), with hbar=m=1." },
    { text: "Substitute n=2, L=6: E_2 = 4*pi^2/72." },
  ],
  solution: {
    steps: [
      { description: "$E_2 = \\dfrac{2^2\\pi^2}{2\\times6^2} = \\dfrac{4\\pi^2}{72} = \\dfrac{\\pi^2}{18}$" },
      { description: "Evaluate numerically.", latex: "E_2 \\approx 0.5483" },
    ],
    finalAnswer: "$E_2 \\approx 0.5483$",
  },
  explanation: {
    correctIdea: "Infinite well energies scale as n^2 and inversely as L^2.",
    whyCorrect: "Direct substitution into the derived formula.",
    whyWrong: ["Using L instead of L^2 in the denominator, or forgetting to square n, both give the wrong scaling."],
  },
};
