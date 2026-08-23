import type { NumericProblem } from "@/lib/problems/types";

export const matrixProductEntry: NumericProblem = {
  meta: {
    slug: "matrix-product-entry",
    title: "An Entry of a Matrix Product",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/linear-operators",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["linear-operators", "matrix-multiplication"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/linear-operators"],
  },
  question: {
    type: "numeric",
    prompt:
      "Let $A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ and $B=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$. What is the top-left (row 1, column 1) entry of $AB$?",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 0,
    tolerance: 0.001,
    incorrectFeedback: "The (1,1) entry of AB is (row 1 of A) dotted with (column 1 of B) — compute A_11·B_11 + A_12·B_21.",
  },
  hints: [
    { text: "(AB)_11 = A_11·B_11 + A_12·B_21." },
    { text: "A_11=2, A_12=0, B_11=0, B_21=1." },
  ],
  solution: {
    steps: [
      { description: "Apply the matrix-multiplication formula for the (1,1) entry.", latex: "(AB)_{11} = A_{11}B_{11} + A_{12}B_{21} = 2\\cdot0 + 0\\cdot1" },
      { description: "Simplify.", latex: "(AB)_{11} = 0" },
    ],
    finalAnswer: "$0$",
  },
  explanation: {
    correctIdea: "Each entry of a matrix product is a sum over the shared index — row of the first matrix, column of the second.",
    whyCorrect: "A's first row is (2,0) and B's first column is (0,1); their dot product is 2·0+0·1=0.",
    whyWrong: ["Multiplying entries in the wrong position (e.g. A_11·B_12) gives a different, incorrect entry of the product."],
  },
};
