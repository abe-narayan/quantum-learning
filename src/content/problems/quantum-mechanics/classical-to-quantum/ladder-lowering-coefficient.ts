import type { NumericProblem } from "@/lib/problems/types";

export const ladderLoweringCoefficient: NumericProblem = {
  meta: {
    slug: "ladder-lowering-coefficient",
    title: "A Lowering-Operator Coefficient",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["harmonic-oscillator", "ladder-operators"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"],
  },
  question: {
    type: "numeric",
    prompt: "Using $a|n\\rangle=\\sqrt{n}\\,|n-1\\rangle$, find the coefficient $c$ such that $a|4\\rangle = c\\,|3\\rangle$.",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0.01,
    incorrectFeedback: "The coefficient is √n with n=4, not n-1.",
    nearMisses: [
      { value: Math.sqrt(3), tolerance: 0.01, feedback: "√3 uses the level you land on. The lowering coefficient is √n, taken from the level you start on." },
      { value: 4, feedback: "4 is n itself. The coefficient is its square root." },
      { value: Math.sqrt(5), tolerance: 0.01, feedback: "√5 is the raising coefficient √(n+1) for a†|4⟩. Lowering uses √n." },
    ],
  },
  hints: [
    { text: "The lowering rule gives a|n⟩ = √n |n-1⟩." },
    { text: "Here n = 4." },
  ],
  solution: {
    steps: [
      { description: "Apply the lowering rule with $n=4$.", latex: "a|4\\rangle = \\sqrt4\\,|3\\rangle = 2|3\\rangle" },
    ],
    finalAnswer: "$c = 2$",
  },
  explanation: {
    correctIdea: "The lowering-operator coefficient is the square root of the starting level, not the ending one.",
    whyCorrect: "√4 = 2 directly.",
    whyWrong: ["Using √3 (the ending level) instead of √4 (the starting level) is the most common slip."],
  },
};
