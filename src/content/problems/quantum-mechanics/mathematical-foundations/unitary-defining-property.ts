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
      { id: "b", text: "$U$ has only real eigenvalues: $\\lambda\\in\\mathbb{R}$ for every eigenvector" },
      { id: "c", text: "$U$ is Hermitian: $U^\\dagger=U$ for every unitary operator" },
      { id: "d", text: "$U$ preserves the length of every vector, but can change the angle between two of them" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Real eigenvalues is a property of Hermitian operators, not unitary ones. A unitary operator's eigenvalues have modulus 1, which need not be real; i is a valid unitary eigenvalue.",
      c: "Hermitian and unitary are independent properties. The S gate is a standard example of unitary but not Hermitian.",
      d: "Lengths and angles are not separable here. Polarization rebuilds ⟨u|v⟩ out of the norms of u+v and u−v alone, so an operator that preserves every length has already preserved every inner product, angles included.",
    },
    defaultIncorrectFeedback: "The defining property of a unitary operator is U†U=I, which is what forces inner-product preservation.",
  },
  hints: [
    { text: "Write down the defining condition first: what equation does every unitary operator satisfy?" },
    { text: "Move one U across the inner product using the adjoint: ⟨Uu|Uv⟩ = ⟨u|U†U|v⟩." },
    { text: "Substitute the defining condition for U†U and see what is left." },
  ],
  solution: {
    steps: [
      {
        description: "Expand $\\langle Uu|Uv\\rangle$ using the adjoint definition.",
        latex: "\\langle Uu|Uv\\rangle = \\langle u|U^\\dagger U|v\\rangle = \\langle u|I|v\\rangle = \\langle u|v\\rangle",
      },
    ],
    finalAnswer: "Unitary operators preserve inner products, which follows directly from $U^\\dagger U=I$.",
  },
  explanation: {
    correctIdea: "Inner-product preservation is the defining consequence of unitarity, derived directly from U†U=I.",
    whyCorrect: "The derivation above shows it's a direct algebraic consequence of the definition, not an extra assumption.",
    whyWrong: [
      { optionId: "b", text: "Borrows a Hermitian property. A unitary operator's eigenvalues have modulus 1, so i is a perfectly legitimate one." },
      { optionId: "c", text: "Treats two independent properties as one. The S gate is unitary and not Hermitian." },
      { optionId: "d", text: "Splits length from angle. Polarization recovers ⟨u|v⟩ from ‖u+v‖ and ‖u−v‖, so preserving all lengths preserves all angles too." },
    ],
  },
};
