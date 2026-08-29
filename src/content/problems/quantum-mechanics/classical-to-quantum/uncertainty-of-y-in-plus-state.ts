import type { NumericProblem } from "@/lib/problems/types";

export const uncertaintyOfYInPlusState: NumericProblem = {
  meta: {
    slug: "uncertainty-of-y-in-plus-state",
    title: "Uncertainty of Pauli-Y in |+⟩",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["uncertainty", "pauli-operators"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"],
  },
  question: {
    type: "numeric",
    prompt:
      "In the state $|+\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)$, compute $\\Delta Y$, the uncertainty of the Pauli-$Y$ operator.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.01,
    incorrectFeedback: "Find ⟨Y⟩ and ⟨Y²⟩ separately, recalling that every Pauli operator squares to the identity. If you answered zero, you treated |+⟩ as an eigenstate of Y; it is an eigenstate of X, which is a different operator.",
    nearMisses: [
      { value: 0, feedback: "Zero uncertainty means the state is an eigenstate of Y. |+⟩ is an eigenstate of X; measuring Y on it gives ±1 with equal probability." },
      { value: Math.SQRT1_2, tolerance: 0.01, feedback: "Check the variance: ⟨Y²⟩ = 1 because Y² = I, and ⟨Y⟩ = 0, so the variance is 1 and its square root is 1 too." },
    ],
  },
  hints: [
    { text: "Uncertainty needs two ingredients, ⟨Y⟩ and ⟨Y²⟩, and one of them comes free: every Pauli operator squares to the identity. Start there." },
    { text: "Since Y² = I, its expectation is fixed regardless of the state. The real work is ⟨Y⟩ = ⟨+|Y|+⟩: write out Y|+⟩ and watch the imaginary terms cancel." },
    { text: "With ⟨Y⟩ vanishing, the variance is just ⟨Y²⟩. Take the square root to get ΔY." },
  ],
  solution: {
    steps: [
      { description: "$Y^2=I$, so $\\langle Y^2\\rangle = 1$." },
      { description: "$\\langle Y\\rangle = \\langle+|Y|+\\rangle = 0$ (direct computation)." },
      { description: "Variance and uncertainty.", latex: "\\operatorname{Var}(Y) = 1 - 0 = 1, \\quad \\Delta Y = 1" },
    ],
    finalAnswer: "$\\Delta Y = 1$",
  },
  explanation: {
    correctIdea: "|+⟩ is an eigenstate of X, not Y or Z, so both Y and Z have maximal uncertainty (1) in this state.",
    whyCorrect: "⟨Y⟩=0 and ⟨Y²⟩=1 give Var(Y)=1 directly.",
    whyWrong: ["Assuming ΔY=0 confuses |+⟩ (an eigenstate of X) with an eigenstate of Y, which it isn't."],
  },
};
