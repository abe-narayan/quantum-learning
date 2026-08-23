import type { NumericProblem } from "@/lib/problems/types";

export const harmonicOscillatorEnergyLevel: NumericProblem = {
  meta: {
    slug: "harmonic-oscillator-energy-level",
    title: "An Energy Level Calculation",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["harmonic-oscillator", "energy-levels"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"],
  },
  question: {
    type: "numeric",
    prompt: "For $\\hbar\\omega=3$, find $E_3 = \\hbar\\omega(n+\\tfrac12)$ with $n=3$.",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 10.5,
    tolerance: 0.01,
    incorrectFeedback: "Don't forget the +1/2 — E_n = ħω(n + 1/2), not ħω·n.",
  },
  hints: [
    { text: "E_3 = 3 × (3 + 0.5)." },
  ],
  solution: {
    steps: [
      { description: "Substitute directly.", latex: "E_3 = 3\\left(3+\\tfrac12\\right) = 3(3.5) = 10.5" },
    ],
    finalAnswer: "$E_3 = 10.5$",
  },
  explanation: {
    correctIdea: "Every level includes the zero-point-energy offset of ħω/2, not just ħω times the level number.",
    whyCorrect: "3 × 3.5 = 10.5 directly.",
    whyWrong: ["Computing 3×3=9 (forgetting the +1/2 term) is the single most common harmonic-oscillator mistake."],
  },
};
