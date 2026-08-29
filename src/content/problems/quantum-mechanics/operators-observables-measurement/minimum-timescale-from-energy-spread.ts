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
    { text: "Start from the bound Delta E * Delta t_A >= hbar/2 (hbar=1)." },
    { text: "Solve for the smallest Delta t_A consistent with this, given Delta E = 2." },
  ],
  solution: {
    steps: [
      { description: "$\\Delta E\\,\\Delta t_A \\ge \\dfrac{\\hbar}{2} = 0.5$." },
      { description: "$\\Delta t_A \\ge \\dfrac{0.5}{\\Delta E} = \\dfrac{0.5}{2} = 0.25$." },
    ],
    finalAnswer: "$\\Delta t_A \\ge 0.25$, minimum $0.25$",
  },
  explanation: {
    correctIdea: "A larger energy spread forces a shorter minimum characteristic timescale — consistent with sharply-defined-energy states changing slowly.",
    whyCorrect: "Direct algebraic rearrangement of the bound.",
    whyWrong: ["Computing 2*0.5=1 confuses which direction the inequality needs to be solved — the bound is a product, so isolating Delta t_A requires dividing, not multiplying."],
  },
};
