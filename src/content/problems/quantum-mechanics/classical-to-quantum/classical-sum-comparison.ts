import type { NumericProblem } from "@/lib/problems/types";

export const classicalSumComparison: NumericProblem = {
  meta: {
    slug: "classical-sum-comparison",
    title: "The Classical Prediction, For Comparison",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["interference", "probability"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability"],
  },
  question: {
    type: "numeric",
    prompt:
      "Two amplitudes, $\\psi_1=0.3$ and $\\psi_2=0.3e^{i2\\pi/3}$, combine at a detector. Compute the classical prediction $|\\psi_1|^2+|\\psi_2|^2$: the answer ordinary probability theory would give if the two paths never interfered.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.18,
    tolerance: 0.005,
    incorrectFeedback: "The classical prediction ignores relative phase entirely: square each magnitude and add, with no cross term.",
    nearMisses: [
      { value: 0.09, feedback: "0.09 is the quantum answer |ψ₁+ψ₂|², which includes the interference cross term. The classical prediction drops that term and adds the two squared magnitudes." },
      { value: 0.6, feedback: "0.6 adds the magnitudes rather than their squares. Probabilities come from squared magnitudes." },
      { value: 0.36, feedback: "0.36 is (0.3+0.3)², squaring the summed amplitude. That is a quantum-style calculation, and for these phases it does not give 0.36 either." },
    ],
  },
  hints: [
    { text: "|ψ1|² = 0.3² = 0.09." },
    { text: "|ψ2|² = 0.3² = 0.09 as well. The phase doesn't affect an individual amplitude's own magnitude." },
  ],
  solution: {
    steps: [
      { description: "Each amplitude has the same magnitude, 0.3.", latex: "|\\psi_1|^2 = |\\psi_2|^2 = 0.09" },
      { description: "Add them.", latex: "0.09+0.09 = 0.18" },
    ],
    finalAnswer: "$0.18$",
  },
  explanation: {
    correctIdea: "The classical prediction never depends on relative phase, only on the individual magnitudes.",
    whyCorrect: "Both amplitudes have magnitude 0.3 regardless of the phase e^{i2π/3} attached to ψ2.",
    whyWrong: ["This is deliberately different from the quantum answer (0.09), where the phase drives interference; the gap between the two numbers is the interference effect itself."],
  },
};
