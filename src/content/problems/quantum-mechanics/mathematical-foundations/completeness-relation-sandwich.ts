import type { NumericProblem } from "@/lib/problems/types";

export const completenessRelationSandwich: NumericProblem = {
  meta: {
    slug: "completeness-relation-sandwich",
    title: "Sandwiching the Completeness Relation",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["bra-ket", "completeness-relation"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/bra-ket-formalism"],
  },
  question: {
    type: "numeric",
    prompt: "Using $|0\\rangle\\langle0|+|1\\rangle\\langle1|=I$, compute $\\langle0|(|0\\rangle\\langle0|+|1\\rangle\\langle1|)|1\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0,
    tolerance: 0.01,
    incorrectFeedback: "The sum in parentheses is the identity operator, so the sandwich collapses to the plain inner product between two distinct orthonormal basis states. Orthonormality settles what that is.",
    nearMisses: [
      { value: 1, feedback: "1 is ⟨0|0⟩ or ⟨1|1⟩. The sandwich here has ⟨0| on the left and |1⟩ on the right, two distinct basis states, so orthogonality applies." },
      { value: 2, feedback: "2 counts the two projectors. They sum to the identity, not to 2, and the identity leaves the inner product ⟨0|1⟩ untouched." },
    ],
  },
  hints: [
    { text: "The completeness relation says the whole expression in parentheses equals I." },
    { text: "So this is really just ⟨0|I|1⟩." },
    { text: "The identity does nothing, leaving the inner product of two distinct orthonormal basis states. Recall its value from orthonormality." },
  ],
  solution: {
    steps: [
      { description: "The sum in parentheses is the identity operator by the completeness relation.", latex: "\\langle0|(|0\\rangle\\langle0|+|1\\rangle\\langle1|)|1\\rangle = \\langle0|I|1\\rangle" },
      { description: "The identity does nothing, leaving the plain inner product.", latex: "\\langle0|I|1\\rangle = \\langle0|1\\rangle = 0" },
    ],
    finalAnswer: "$0$",
  },
  explanation: {
    correctIdea: "Recognizing the completeness relation lets you replace a sum of outer products with I, simplifying the whole expression instantly.",
    whyCorrect: "⟨0|I|1⟩ is just ⟨0|1⟩, which is 0 by orthonormality of the computational basis.",
    whyWrong: ["Expanding term by term without recognizing the completeness relation is also valid but easy to slip on: the two middle cross terms in the direct expansion vanish, leaving 0 either way."],
  },
};
