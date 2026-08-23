import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const unitaryDefiningProperty: MultipleChoiceProblem = {
  meta: {
    slug: "unitary-defining-property",
    title: "What's True of Every Unitary Operator",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/unitary-operators",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["unitary-operators"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/unitary-operators"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following is true for every unitary operator $U$?",
    options: [
      { id: "a", text: "$U$ preserves inner products: $\\langle Uu|Uv\\rangle=\\langle u|v\\rangle$" },
      { id: "b", text: "$U$ has only real eigenvalues" },
      { id: "c", text: "$U$ is always Hermitian" },
      { id: "d", text: "$U$ cannot be inverted" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Real eigenvalues is a property of Hermitian operators, not unitary ones — a unitary operator's eigenvalues have modulus 1, which need not be real (e.g. i is a valid unitary eigenvalue).",
      c: "Hermitian and unitary are independent properties — the S gate is a standard example of unitary-but-not-Hermitian.",
      d: "Unitary operators are always invertible — in fact U⁻¹=U† always exists.",
    },
    defaultIncorrectFeedback: "The defining property of a unitary operator is U†U=I, which is exactly what forces inner-product preservation.",
  },
  hints: [
    { text: "Start from the definition U†U=I and see what it implies about ⟨Uu|Uv⟩." },
  ],
  solution: {
    steps: [
      {
        description: "Expand $\\langle Uu|Uv\\rangle$ using the adjoint definition.",
        latex: "\\langle Uu|Uv\\rangle = \\langle u|U^\\dagger U|v\\rangle = \\langle u|I|v\\rangle = \\langle u|v\\rangle",
      },
    ],
    finalAnswer: "Unitary operators preserve inner products — this follows directly from $U^\\dagger U=I$.",
  },
  explanation: {
    correctIdea: "Inner-product preservation is the defining consequence of unitarity, derived directly from U†U=I.",
    whyCorrect: "The derivation above shows it's a direct algebraic consequence of the definition, not an extra assumption.",
    whyWrong: ["Real eigenvalues and Hermiticity are Hermitian-operator properties; unitary operators are guaranteed invertible, not the opposite."],
  },
};
