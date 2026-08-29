import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const oneStateDensityMatrixChoice: MultipleChoiceProblem = {
  meta: {
    slug: "one-state-density-matrix-choice",
    title: "The Density Matrix of |1⟩",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["density-matrix", "outer-product"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is $\\rho=|1\\rangle\\langle1|$?",
    options: [
      { id: "a", text: "$\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}$" },
      { id: "b", text: "$\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$" },
      { id: "c", text: "$\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$" },
      { id: "d", text: "$\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That's ρ for |0⟩, not |1⟩ — check which basis vector has the amplitude.",
      c: "That matrix isn't even a valid outer product of |1⟩ with itself — it's not diagonal, but |1⟩⟨1| must be.",
      d: "That matrix isn't Hermitian, so it can't be any valid density matrix.",
    },
    defaultIncorrectFeedback: "Compute the outer product directly: |1⟩⟨1| = (0,1)ᵀ(0,1).",
  },
  hints: [
    { text: "|1⟩ = (0,1)ᵀ as a column vector." },
    { text: "⟨1| = (0,1) as a row vector." },
    { text: "Multiply the column by the row to get a 2×2 matrix." },
  ],
  solution: {
    steps: [
      {
        description: "Compute the outer product directly.",
        latex: "|1\\rangle\\langle1| = \\begin{pmatrix}0\\\\1\\end{pmatrix}\\begin{pmatrix}0&1\\end{pmatrix} = \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}",
      },
    ],
    finalAnswer: "$\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}$",
  },
  explanation: {
    correctIdea: "The outer product of |1⟩ with itself places a 1 in the (1,1) position and 0 elsewhere.",
    whyCorrect: "Direct matrix multiplication of the column and row vectors gives exactly this matrix.",
    whyWrong: [
      { optionId: "b", text: "The density matrix of |0⟩, with the 1 in the wrong corner." },
      { optionId: "c", text: "Off-diagonal where |1⟩⟨1| is diagonal. Its trace is 0, so it is not a density matrix at all." },
      { optionId: "d", text: "Not Hermitian, which every density matrix has to be." },
    ],
  },
};
