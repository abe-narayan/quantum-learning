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
    incorrectFeedback: "The width cancels, so nothing about L is needed. What is left is built from the two quantum numbers, and the level formula does not attach them at the first power. If you answered the bare ratio of the n values, one step remains.",
    nearMisses: [
      { value: 2, feedback: "2 is the ratio of the quantum numbers. Energy scales as n², so the ratio of the energies is the square of that." },
      { value: 16, feedback: "16 is 4², using only the upper level's quantum number. The denominator carries an n² of its own that has to divide out." },
      { value: 8, feedback: "8 squares one level and leaves the other alone. Both levels get the same treatment before the ratio is formed." },
    ],
  },
  hints: [
    { text: "Every factor in the level formula except the quantum number is the same for both levels, which is why the width can drop out of the question entirely." },
    { text: "Form the ratio symbolically and cancel the common factors before substituting any numbers." },
    { text: "What survives is built from the two quantum numbers, but not at the first power. Check what exponent the level formula attaches to n." },
  ],
  solution: {
    steps: [
      { description: "$\\dfrac{E_4}{E_2} = \\dfrac{4^2\\pi^2/(2L^2)}{2^2\\pi^2/(2L^2)} = \\dfrac{16}{4} = 4$." },
    ],
    finalAnswer: "$E_4/E_2 = 4$",
  },
  explanation: {
    correctIdea: "Energy ratios between infinite-well levels depend only on the quantum numbers, since every other factor is common to both levels and cancels.",
    whyCorrect: "Both levels carry the same $\\pi^2\\hbar^2/(2mL^2)$, so forming the ratio deletes the well entirely and leaves $4^2/2^2$. That is why a ratio like this can be quoted without ever being told how wide the well is.",
    whyWrong: ["Computing 4/2=2 confuses the ratio of the n values with the ratio of the n² values. Energies scale as n², so the ratio does too."],
  },
};
