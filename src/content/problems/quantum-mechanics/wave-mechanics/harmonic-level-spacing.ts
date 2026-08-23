import type { NumericProblem } from "@/lib/problems/types";

export const harmonicLevelSpacing: NumericProblem = {
  meta: {
    slug: "harmonic-level-spacing",
    title: "Harmonic Oscillator Level Spacing",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["harmonic-oscillator", "energy-levels"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space"],
  },
  question: {
    type: "numeric",
    prompt: "For a harmonic oscillator with omega = 2.5 (natural units, hbar = 1), find E_2 - E_1.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 2.5,
    tolerance: 0.01,
    incorrectFeedback: "Consecutive harmonic oscillator levels are always spaced by exactly hbar*omega, regardless of n.",
  },
  hints: [{ text: "E_n = omega*(n+1/2) — subtract E_1 from E_2 and see what cancels." }],
  solution: {
    steps: [
      { description: "$E_2-E_1 = \\omega(2+\\tfrac12) - \\omega(1+\\tfrac12) = \\omega$." },
      { description: "Substitute $\\omega=2.5$.", latex: "E_2-E_1 = 2.5" },
    ],
    finalAnswer: "$E_2 - E_1 = 2.5$",
  },
  explanation: {
    correctIdea: "The harmonic oscillator's levels are equally spaced by exactly hbar*omega, independent of which two consecutive levels you pick.",
    whyCorrect: "The (n+1/2) structure makes any two adjacent levels' difference exactly omega.",
    whyWrong: ["Computing E_2 and E_1 separately and subtracting incorrectly (e.g. an arithmetic slip) is more error-prone than recognizing the spacing is always exactly omega."],
  },
};
