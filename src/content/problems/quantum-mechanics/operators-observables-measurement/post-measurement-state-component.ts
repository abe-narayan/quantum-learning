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
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.707107,
    tolerance: 0.001,
    incorrectFeedback: "First project (keep only the |0>,|1> components), then renormalize the resulting 2-component vector to unit length.",
    nearMisses: [
      { value: 1 / Math.sqrt(3), tolerance: 0.002, feedback: "That is the amplitude after projecting but before renormalizing. The projected vector has norm √(2/3), so dividing by it lifts the amplitude to 1/√2." },
      { value: 0.5, feedback: "0.5 is the post-measurement probability of |0⟩. The question asks for the amplitude, which is its square root." },
      { value: 1, feedback: "Amplitude 1 would mean the outcome left the system in |0⟩ alone. The N = 1 eigenspace is two-dimensional, so both |0⟩ and |1⟩ survive the projection." },
    ],
  },
  hints: [
    { text: "Measurement does two things here: it deletes the components outside the observed eigenspace, and it renormalizes what is left. Both steps matter." },
    { text: "Apply the projector for outcome 1 to get the unnormalized surviving vector, then compute that vector's norm." },
    { text: "Divide by that norm. The two surviving components were equal before the projection, so they are still equal after it, and there are only two of them left." },
  ],
  solution: {
    steps: [
      { description: "$P_1|\\psi\\rangle = \\frac{1}{\\sqrt3}|0\\rangle + \\frac1{\\sqrt3}|1\\rangle$, with norm $\\sqrt{2/3}$." },
      { description: "Renormalizing gives $|\\psi'\\rangle = \\frac{1}{\\sqrt2}|0\\rangle+\\frac1{\\sqrt2}|1\\rangle$.", latex: "\\frac{1}{\\sqrt2} \\approx 0.7071" },
    ],
    finalAnswer: "$\\approx 0.7071$",
  },
  explanation: {
    correctIdea: "Collapse means projecting and then renormalizing, not projecting alone.",
    whyCorrect: "The projected (but not yet renormalized) amplitude 1/sqrt(3) is not itself a valid quantum amplitude, since the projected state isn't normalized.",
    whyWrong: ["Reporting 1/sqrt(3) (≈0.577) instead of the renormalized 1/sqrt(2) forgets the renormalization step entirely."],
  },
};
