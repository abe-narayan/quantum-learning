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
      "For the same $\\psi_1=0.3$, $\\psi_2=0.3e^{i2\\pi/3}$ as the previous problem, compute the classical prediction $|\\psi_1|^2+|\\psi_2|^2$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.18,
    tolerance: 0.005,
    incorrectFeedback: "The classical prediction ignores relative phase entirely — just square each magnitude and add.",
  },
  hints: [
    { text: "|ψ1|² = 0.3² = 0.09." },
    { text: "|ψ2|² = 0.3² = 0.09 as well — the phase doesn't affect an individual amplitude's own magnitude." },
  ],
  solution: {
    steps: [
      { description: "Each amplitude has the same magnitude, 0.3.", latex: "|\\psi_1|^2 = |\\psi_2|^2 = 0.09" },
      { description: "Add them.", latex: "0.09+0.09 = 0.18" },
    ],
    finalAnswer: "$0.18$",
  },
  explanation: {
    correctIdea: "The classical prediction never depends on relative phase — only on the individual magnitudes.",
    whyCorrect: "Both amplitudes have magnitude 0.3 regardless of the phase e^{i2π/3} attached to ψ2.",
    whyWrong: ["This is deliberately different from the quantum answer (0.09) computed in the companion problem — the gap between them is exactly the interference effect."],
  },
};
