import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const outerProductType: MultipleChoiceProblem = {
  meta: {
    slug: "outer-product-type",
    title: "What Kind of Object Is |0⟩⟨1|?",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["bra-ket", "outer-product"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/bra-ket-formalism"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What kind of mathematical object is $|0\\rangle\\langle1|$?",
    options: [
      { id: "a", text: "A complex number" },
      { id: "b", text: "A ket (column vector)" },
      { id: "c", text: "An operator (matrix)" },
      { id: "d", text: "A bra (row vector)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "c",
    optionFeedback: {
      a: "A complex number is what a bra times a ket (⟨·|·⟩) gives — the reverse order, ket times bra, gives a matrix instead.",
      b: "A ket is a column vector on its own — |0⟩⟨1| is a column times a row, which is a matrix.",
      d: "A bra is a row vector on its own, not the product of a ket and a bra.",
    },
    defaultIncorrectFeedback: "Column vector times row vector is matrix multiplication — think about the shapes involved.",
  },
  hints: [
    { text: "|0⟩ is a column vector; ⟨1| is a row vector." },
    { text: "Multiplying a column by a row (in that order) is an outer product." },
  ],
  solution: {
    steps: [
      { description: "$|0\\rangle$ is a $2\\times1$ column; $\\langle1|$ is a $1\\times2$ row." },
      { description: "A $2\\times1$ times a $1\\times2$ gives a $2\\times2$ matrix — an operator, not a number." },
    ],
    finalAnswer: "$|0\\rangle\\langle1|$ is an operator (a $2\\times2$ matrix).",
  },
  explanation: {
    correctIdea: "Outer products (ket-then-bra) are operators; inner products (bra-then-ket) are numbers.",
    whyCorrect: "The shape arithmetic (column × row = matrix) settles it directly.",
    whyWrong: [
      { optionId: "a", text: "Reads the product in the other order. ⟨0|1⟩, a row times a column, is the number; this is a column times a row." },
      { optionId: "b", text: "Keeps only the ket half. |0⟩ alone is the column; the bra on its right changes the shape of the result." },
      { optionId: "d", text: "Keeps only the bra half, and a row times nothing is still a row." },
    ],
  },
};
