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
    nearMisses: [
      { value: 6.25, tolerance: 0.02, feedback: "6.25 is E₂ itself, ω(2 + 1/2). The question asks for the gap to E₁." },
      { value: 1.25, feedback: "1.25 is ħω/2, the zero-point energy. The gap between consecutive levels is a full ħω." },
      { value: 5, feedback: "5 is 2ħω, the gap across two steps of the ladder. E₂ and E₁ are adjacent." },
    ],
  },
  hints: [
    { text: "The oscillator's levels are evenly spaced, so whatever the gap turns out to be, it cannot depend on which adjacent pair was chosen." },
    { text: "Write both levels out from the level formula and subtract, keeping the zero-point term in each." },
    { text: "One term is common to both levels and drops out of the difference. Check what is left standing before substituting the frequency." },
  ],
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
    whyWrong: ["Computing E_2 and E_1 separately invites an arithmetic slip. Recognizing that the spacing is always omega removes the arithmetic entirely."],
  },
};
