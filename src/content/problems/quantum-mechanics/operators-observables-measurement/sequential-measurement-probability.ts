import type { NumericProblem } from "@/lib/problems/types";

export const sequentialMeasurementProbability: NumericProblem = {
  meta: {
    slug: "sequential-measurement-probability",
    title: "Probability After an Intervening Measurement",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["measurement", "incompatibility"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility"],
  },
  question: {
    type: "numeric",
    prompt: "Starting from |0>, X is measured (giving some outcome), then Z is measured. What is P(Z=0) for this final measurement?",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.001,
    incorrectFeedback: "After the X measurement, the state collapses to an X-eigenstate, which is an equal superposition of |0> and |1> — recompute P(Z=0) from there, not from the original |0>.",
  },
  hints: [{ text: "Whichever X-eigenstate results, it's an equal superposition of |0> and |1> in the Z basis." }],
  solution: {
    steps: [
      { description: "Either $X$-outcome collapses the state to $|+\\rangle$ or $|-\\rangle$, both equal superpositions of $|0\\rangle,|1\\rangle$." },
      { description: "$P(Z{=}0) = |\\langle0|\\pm\\rangle|^2 = \\left|\\frac1{\\sqrt2}\\right|^2 = 0.5$ either way." },
    ],
    finalAnswer: "$P(Z{=}0) = 0.5$",
  },
  explanation: {
    correctIdea: "An intervening incompatible measurement destroys the original certainty entirely.",
    whyCorrect: "This matches the lesson's fully worked derivation exactly.",
    whyWrong: ["Reporting P(Z=0)=1 (as if the X measurement didn't matter) ignores that the state was genuinely changed by the intervening incompatible measurement."],
  },
};
