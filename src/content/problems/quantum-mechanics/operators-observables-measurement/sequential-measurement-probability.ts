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
    incorrectFeedback: "After the X measurement, the state collapses to an X-eigenstate, which is an equal superposition of |0> and |1>. Recompute P(Z=0) from there, not from the original |0>.",
    nearMisses: [
      { value: 1, feedback: "1 is the answer if the X measurement is ignored. It does change the state: whichever outcome it gives, the system lands on |+⟩ or |−⟩, neither of which is |0⟩." },
      { value: 0.25, feedback: "0.25 would come from multiplying two halves. Only the final Z measurement is being asked about, and both X branches give the same P(Z=0)." },
    ],
  },
  hints: [
    { text: "The $X$ measurement is not a passive read-out. Ask what state the system is in immediately after it, not what it was before." },
    { text: "There are two possible $X$ outcomes. Write the post-measurement state for each branch, then expand each in the $Z$ basis." },
    { text: "Work out $P(Z{=}0)$ separately in the two branches. If they agree, the branch probabilities never need weighting." },
  ],
  solution: {
    steps: [
      { description: "Either $X$-outcome collapses the state to $|+\\rangle$ or $|-\\rangle$, both equal superpositions of $|0\\rangle,|1\\rangle$." },
      { description: "$P(Z{=}0) = |\\langle0|\\pm\\rangle|^2 = \\left|\\frac1{\\sqrt2}\\right|^2 = 0.5$ either way." },
    ],
    finalAnswer: "$P(Z{=}0) = 0.5$",
  },
  explanation: {
    correctIdea: "An intervening incompatible measurement destroys the original certainty entirely.",
    whyCorrect: "Both X eigenstates carry equal-magnitude coefficients on |0⟩ and |1⟩, differing only by a sign that the Born rule's modulus discards. So the two branches give the same P(Z=0), and their relative likelihood never has to be worked out.",
    whyWrong: ["Reporting P(Z=0)=1 (as if the X measurement did not matter) ignores that the state was changed by the intervening incompatible measurement."],
  },
};
