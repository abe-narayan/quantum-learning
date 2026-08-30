import type { NumericProblem } from "@/lib/problems/types";

const concurrence = 0.6;
const value = 1 - (concurrence * concurrence) / 2;

export const purityFromConcurrence: NumericProblem = {
  meta: {
    slug: "purity-from-concurrence",
    title: "Reduced Purity from Concurrence",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["concurrence", "purity"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the identity $\\text{Tr}(\\rho_A^2)=1-C^2/2$, find $\\text{Tr}(\\rho_A^2)$ for a pure 2-qubit state with concurrence $C=0.6$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.005,
    incorrectFeedback: "Plug C=0.6 directly into Tr(ρ_A²)=1-C²/2.",
    nearMisses: [
      { value: 1 - concurrence, feedback: "1 − C uses a linear relationship. The identity is quadratic in C: square the concurrence before halving it." },
      { value: 1 - concurrence * concurrence, feedback: "You squared C but skipped the division by 2. The identity subtracts C²/2, not C²." },
      { value: (concurrence * concurrence) / 2, feedback: "That is the impurity term the identity subtracts. The purity is 1 minus it." },
    ],
  },
  hints: [
    { text: "The identity is already solved for the quantity you want, so the whole task is a substitution. Start by squaring the concurrence." },
    { text: "Halve that square: C²/2 is the impurity the identity subtracts from 1." },
    { text: "Subtract it from 1, then sanity-check the range: a product state (C=0) gives purity 1 and a Bell state (C=1) gives 0.5, so C=0.6 must land between them and nearer the top." },
  ],
  solution: {
    steps: [
      { description: "$C^2/2 = 0.36/2 = 0.18$." },
      { description: "$\\text{Tr}(\\rho_A^2) = 1-0.18 = 0.82$." },
    ],
    finalAnswer: "Tr(ρ_A²) = 0.82",
  },
  explanation: {
    correctIdea: "Higher concurrence corresponds directly to lower reduced purity, via the exact identity derived in this course.",
    whyCorrect: "0.82 sits between 1 (product state, C=0) and 0.5 (Bell state, C=1), consistent with C=0.6 being partial entanglement.",
    whyWrong: ["Computing 1-C (without squaring) uses the wrong identity: the relationship is quadratic in C, not linear."],
  },
};
