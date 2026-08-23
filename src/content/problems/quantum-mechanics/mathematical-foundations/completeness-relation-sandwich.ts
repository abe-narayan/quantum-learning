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
    incorrectFeedback: "Since the sum in parentheses literally equals the identity operator I, sandwiching it between ⟨0| and |1⟩ must give exactly ⟨0|1⟩.",
  },
  hints: [
    { text: "The completeness relation says the whole expression in parentheses equals I." },
    { text: "So this is really just ⟨0|I|1⟩." },
    { text: "⟨0|I|1⟩ = ⟨0|1⟩ — what is that?" },
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
    whyWrong: ["Expanding term by term without recognizing the completeness relation is also valid but easy to make an orthonormality sign/term error in — the two middle cross terms in the direct expansion vanish, leaving 0 either way."],
  },
};
