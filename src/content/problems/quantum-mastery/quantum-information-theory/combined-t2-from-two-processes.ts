import type { NumericProblem } from "@/lib/problems/types";

export const combinedT2FromTwoProcesses: NumericProblem = {
  meta: {
    slug: "combined-t2-from-two-processes",
    title: "Combined T2 from Amplitude Damping and Pure Dephasing",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/the-lindblad-master-equation",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["lindblad", "t1-t2"],
    prerequisites: ["quantum-mastery/quantum-information-theory/the-lindblad-master-equation"],
  },
  question: {
    type: "numeric",
    prompt:
      "A qubit has T1=5 microseconds (amplitude damping) and, independently, a pure-dephasing time constant T2,pure=8 microseconds. Using 1/T2 = 1/(2*T1) + 1/T2,pure (derived from the Lindblad generator's linearity), compute the combined T2 in microseconds.",
    inputHint: "microseconds, to 2 decimal places",
  },
  answer: {
    type: "numeric",
    value: 4.44,
    tolerance: 0.02,
    incorrectFeedback: "Compute 1/(2*5) + 1/8 first, then take the reciprocal of the sum.",
  },
  hints: [
    { text: "1/(2*T1) = 1/10 = 0.1 per microsecond." },
    { text: "1/T2,pure = 1/8 = 0.125 per microsecond." },
    { text: "Add the two rates, then invert." },
  ],
  solution: {
    steps: [
      { description: "$1/(2T_1) = 1/10 = 0.1\\ \\mu s^{-1}$" },
      { description: "$1/T_{2,\\text{pure}} = 1/8 = 0.125\\ \\mu s^{-1}$" },
      { description: "$1/T_2 = 0.1+0.125=0.225\\ \\mu s^{-1} \\Rightarrow T_2 = 1/0.225 \\approx 4.44\\ \\mu s$" },
    ],
    finalAnswer: "T2 ≈ 4.44 microseconds, correctly below the 2*T1=10 microsecond bound.",
  },
  explanation: {
    correctIdea: "Independent Lindblad jump operators contribute additively to a coherence's total decay rate, not to T2 itself directly -- rates add, not time constants.",
    whyCorrect: "This is exactly the additivity the lesson derived from the generator's linearity, and the result correctly respects T2 <= 2*T1 = 10 microseconds.",
    whyWrong: ["Averaging T1 and T2,pure directly (rather than their rates) would give a different, incorrect number."],
  },
};
