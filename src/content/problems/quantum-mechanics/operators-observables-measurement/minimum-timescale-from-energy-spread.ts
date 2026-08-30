import type { NumericProblem } from "@/lib/problems/types";

export const minimumTimescaleFromEnergySpread: NumericProblem = {
  meta: {
    slug: "minimum-timescale-from-energy-spread",
    title: "Minimum Timescale From an Energy Spread",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["energy-time-uncertainty"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"],
  },
  question: {
    type: "numeric",
    prompt: "A state has Delta E = 2 (natural units, hbar = 1). What is the minimum possible value of Delta t_A, for any observable A, consistent with the energy-time bound?",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.25,
    tolerance: 0.001,
    incorrectFeedback: "Solve Delta E * Delta t_A >= hbar/2 for the minimum Delta t_A: Delta t_A >= hbar/(2*Delta E).",
    nearMisses: [
      { value: 1, feedback: "1 multiplies ΔE by ħ/2 instead of dividing. Isolating Δt from a product bound means dividing by ΔE." },
      { value: 0.5, feedback: "0.5 is ħ/2, the bound itself. It still has to be divided by ΔE = 2." },
      { value: 4, feedback: "4 inverts the relationship: a larger energy spread makes the minimum timescale shorter, not longer." },
    ],
  },
  hints: [
    { text: "The bound constrains a product from below, so fixing one factor forces the other to be at least something. No new physics is needed beyond that." },
    { text: "Write the energy-time bound with hbar = 1 and rearrange so the timescale stands alone on one side." },
    { text: "There is a factor of 2 on the right-hand side before you divide by the energy spread. If your answer came out as 0.5, only one of the two divisions was applied." },
  ],
  solution: {
    steps: [
      { description: "$\\Delta E\\,\\Delta t_A \\ge \\dfrac{\\hbar}{2} = 0.5$." },
      { description: "$\\Delta t_A \\ge \\dfrac{0.5}{\\Delta E} = \\dfrac{0.5}{2} = 0.25$." },
    ],
    finalAnswer: "$\\Delta t_A \\ge 0.25$, minimum $0.25$",
  },
  explanation: {
    correctIdea: "A larger energy spread forces a shorter minimum characteristic timescale, consistent with sharply-defined-energy states changing slowly.",
    whyCorrect: "Direct algebraic rearrangement of the bound.",
    whyWrong: ["Computing 2*0.5=1 confuses which direction the inequality has to be solved. The bound is a product, so isolating Delta t_A requires dividing, not multiplying."],
  },
};
