import type { NumericProblem } from "@/lib/problems/types";

export const stationaryPhaseCalculation: NumericProblem = {
  meta: {
    slug: "stationary-phase-calculation",
    title: "The Phase of a Stationary State",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["schrodinger-equation", "stationary-states"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space"],
  },
  question: {
    type: "numeric",
    prompt: "A stationary state has energy E = 3 (natural units, hbar = 1). At t = 2, what is the phase angle (in radians) of the factor e^(-iEt/hbar)?",
    inputHint: "a number (can be negative)",
  },
  answer: {
    type: "numeric",
    value: -6,
    tolerance: 0.01,
    incorrectFeedback: "The phase angle is -E*t/hbar directly.",
    nearMisses: [
      { value: 6, feedback: "The sign is dropped. The exponent is −iEt/ħ, so a positive energy makes the phase angle run negative as time increases." },
      { value: -1.5, feedback: "−1.5 is −E/t, dividing by the time where the exponent multiplies by it. The phase angle is the product −Et/ħ." },
    ],
  },
  hints: [
    { text: "The phase angle is whatever multiplies i in the exponent, sign included. Nothing has to be evaluated until that is identified." },
    { text: "Read that combination off the given factor, then substitute the numbers with hbar set to 1." },
    { text: "The exponent carries an explicit minus sign in front. The question asks for the angle, not its magnitude, so that sign belongs in the answer." },
  ],
  solution: {
    steps: [
      { description: "$\\theta = -\\dfrac{Et}{\\hbar} = -\\dfrac{3\\times2}{1} = -6$." },
    ],
    finalAnswer: "$\\theta = -6$ radians",
  },
  explanation: {
    correctIdea: "A stationary state's entire time dependence is the single phase factor e^(-iEt/hbar).",
    whyCorrect: "Direct substitution into the phase angle formula.",
    whyWrong: ["Dropping the minus sign (reporting +6) reverses the direction of phase rotation."],
  },
};
