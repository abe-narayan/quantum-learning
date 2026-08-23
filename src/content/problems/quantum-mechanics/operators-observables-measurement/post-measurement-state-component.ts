import type { NumericProblem } from "@/lib/problems/types";

export const postMeasurementStateComponent: NumericProblem = {
  meta: {
    slug: "post-measurement-state-component",
    title: "A Post-Measurement State's Amplitude",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["measurement", "degeneracy", "collapse"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"],
  },
  question: {
    type: "numeric",
    prompt: "For N = diag(1,1,2) and |psi> = (1/sqrt(3))(|0> + |1> + |2>), measuring N gives outcome 1. Find the |0> amplitude of the resulting, renormalized state.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.707107,
    tolerance: 0.001,
    incorrectFeedback: "First project (keep only the |0>,|1> components), then renormalize the resulting 2-component vector to unit length.",
  },
  hints: [
    { text: "P_1|psi> keeps only the |0> and |1> components of |psi>, both 1/sqrt(3)." },
    { text: "Renormalize (1/sqrt(3), 1/sqrt(3)) to unit length." },
  ],
  solution: {
    steps: [
      { description: "$P_1|\\psi\\rangle = \\frac{1}{\\sqrt3}|0\\rangle + \\frac1{\\sqrt3}|1\\rangle$, with norm $\\sqrt{2/3}$." },
      { description: "Renormalizing gives $|\\psi'\\rangle = \\frac{1}{\\sqrt2}|0\\rangle+\\frac1{\\sqrt2}|1\\rangle$.", latex: "\\frac{1}{\\sqrt2} \\approx 0.7071" },
    ],
    finalAnswer: "$\\approx 0.7071$",
  },
  explanation: {
    correctIdea: "Collapse means projecting then renormalizing — not just projecting.",
    whyCorrect: "The projected (but not yet renormalized) amplitude 1/sqrt(3) is not itself a valid quantum amplitude, since the projected state isn't normalized.",
    whyWrong: ["Reporting 1/sqrt(3) (≈0.577) instead of the renormalized 1/sqrt(2) forgets the renormalization step entirely."],
  },
};
