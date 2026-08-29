import type { NumericProblem } from "@/lib/problems/types";

export const bellStateZ0MeasurementProbability: NumericProblem = {
  meta: {
    slug: "bell-state-z0-measurement-probability",
    title: "Measuring Z_0 on a Bell State",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["csco", "bell-states", "measurement"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/degeneracy-in-practice"],
  },
  question: {
    type: "numeric",
    prompt: "For the Bell state |Phi+> = (|00> + |11>)/sqrt(2) and Z_0 = Z (x) I, find P(Z_0 = +1).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.001,
    incorrectFeedback: "Z_0's +1 eigenspace is spanned by |00> and |01>. Sum |c|^2 over the Bell state's components in that subspace.",
    nearMisses: [
      { value: 1, feedback: "Certainty would require the state to be |00⟩ alone. The |11⟩ component carries equal weight and lies in the −1 eigenspace of Z₀." },
      { value: 0.25, feedback: "0.25 spreads weight over all four basis states. Only |00⟩ and |11⟩ appear in |Φ⁺⟩, each with probability 1/2." },
    ],
  },
  hints: [
    { text: "Z_0's +1-eigenspace is span{|00>, |01>}." },
    { text: "The Bell state has amplitude 1/sqrt(2) on |00> and 0 on |01>." },
  ],
  solution: {
    steps: [
      { description: "$P(Z_0{=}{+}1) = |\\langle00|\\Phi^+\\rangle|^2 + |\\langle01|\\Phi^+\\rangle|^2 = \\left|\\frac1{\\sqrt2}\\right|^2 + 0 = 0.5$." },
    ],
    finalAnswer: "$P(Z_0{=}{+}1) = 0.5$",
  },
  explanation: {
    correctIdea: "Measuring just one qubit of a Bell state gives a completely random (50/50) outcome, even though the two qubits are perfectly correlated with each other.",
    whyCorrect: "Direct application of the generalized Born rule to the degenerate Z_0 projector.",
    whyWrong: ["Assuming P(Z_0=+1)=1 (as if the state were already |00>) ignores the |11> component contributing equally to the total superposition."],
  },
};
