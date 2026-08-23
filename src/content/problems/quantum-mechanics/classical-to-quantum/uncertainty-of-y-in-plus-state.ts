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
    incorrectFeedback: "First find ⟨Y⟩ and ⟨Y²⟩ in |+⟩ (recall Y² = I for any Pauli operator), then Var(Y) = ⟨Y²⟩ - ⟨Y⟩².",
  },
  hints: [
    { text: "Y² = I for every Pauli operator, so ⟨Y²⟩ = 1 always." },
    { text: "Compute ⟨Y⟩ = ⟨+|Y|+⟩ directly — Y|+⟩ involves ±i times |∓⟩-type terms that turn out to cancel." },
    { text: "If ⟨Y⟩=0, then Var(Y) = 1 - 0 = 1, and ΔY = √1." },
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
