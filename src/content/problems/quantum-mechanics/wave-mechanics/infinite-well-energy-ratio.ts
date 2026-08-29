import type { NumericProblem } from "@/lib/problems/types";

export const infiniteWellEnergyRatio: NumericProblem = {
  meta: {
    slug: "infinite-well-energy-ratio",
    title: "Infinite Well Energy Ratio",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["infinite-square-well", "energy-levels"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-infinite-square-well"],
  },
  question: {
    type: "numeric",
    prompt: "For an infinite square well, find the ratio E_4/E_2 without needing to know the well's width L.",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 4,
    tolerance: 0.001,
    incorrectFeedback: "E_n grows as n squared, so the ratio is the squared ratio of the two quantum numbers, with the L-dependence canceling entirely. If you answered the bare ratio of the n values, square it.",
    nearMisses: [
      { value: 2, feedback: "2 is the ratio of the quantum numbers. Energy scales as n², so the ratio of energies is the square of that." },
      { value: 16, feedback: "16 is 4², using only the upper level's quantum number. The denominator's n² has to divide out too." },
    ],
  },
  hints: [
    { text: "E_n = n^2*pi^2/(2L^2). The L-dependence is identical for both levels and cancels in a ratio." },
    { text: "So the ratio is the square of the quantum-number ratio. Square the ratio of the two n values." },
  ],
  solution: {
    steps: [
      { description: "$\\dfrac{E_4}{E_2} = \\dfrac{4^2\\pi^2/(2L^2)}{2^2\\pi^2/(2L^2)} = \\dfrac{16}{4} = 4$." },
    ],
    finalAnswer: "$E_4/E_2 = 4$",
  },
  explanation: {
    correctIdea: "Energy ratios between infinite-well levels depend only on n, since every other factor cancels.",
    whyCorrect: "This is a direct consequence of E_n proportional to n^2.",
    whyWrong: ["Computing 4/2=2 confuses the ratio of n-values with the ratio of n^2 values: energies scale as n^2, not n."],
  },
};
