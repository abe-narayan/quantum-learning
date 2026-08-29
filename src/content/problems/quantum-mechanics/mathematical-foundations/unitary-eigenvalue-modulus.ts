import type { NumericProblem } from "@/lib/problems/types";

export const unitaryEigenvalueModulus: NumericProblem = {
  meta: {
    slug: "unitary-eigenvalue-modulus",
    title: "The Modulus of a Unitary Operator's Eigenvalue",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/unitary-operators",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["unitary-operators", "eigenvalues"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/unitary-operators"],
  },
  question: {
    type: "numeric",
    prompt: "What is $|\\lambda|$, the modulus of any eigenvalue of any unitary operator?",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.001,
    incorrectFeedback: "Unitary operators preserve norms: ‖Uv‖=‖v‖. Apply that to an eigenvector and cancel the nonzero norm; the modulus that remains has no freedom left.",
    nearMisses: [
      { value: 0, feedback: "A zero eigenvalue would collapse an eigenvector to nothing, destroying its norm. Unitaries preserve norms, so no eigenvalue can shrink a vector." },
    ],
  },
  hints: [
    { text: "Unitary operators preserve vector norms: ‖Uv‖ = ‖v‖." },
    { text: "If Uv = λv, then ‖λv‖ = |λ|·‖v‖ must equal ‖v‖." },
  ],
  solution: {
    steps: [
      { description: "Start from norm preservation applied to an eigenvector.", latex: "\\|Uv\\| = \\|v\\| \\quad\\Longrightarrow\\quad \\|\\lambda v\\| = \\|v\\|" },
      { description: "Factor out the modulus and cancel the nonzero norm.", latex: "|\\lambda|\\,\\|v\\| = \\|v\\| \\quad\\Longrightarrow\\quad |\\lambda| = 1" },
    ],
    finalAnswer: "$|\\lambda| = 1$ for every eigenvalue of a unitary operator.",
  },
  explanation: {
    correctIdea: "Norm preservation is the defining property of unitary operators, and it forces eigenvalues onto the unit circle.",
    whyCorrect: "The derivation shows this is forced algebraically, not just true for particular examples.",
    whyWrong: ["This directly generalizes the |e^{iθ}|=1 fact from the Complex Numbers lesson: unitary eigenvalues are always of the form e^{iθ}."],
  },
};
