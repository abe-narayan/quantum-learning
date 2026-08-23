import type { NumericProblem } from "@/lib/problems/types";

export const pauliZEigenvalueProduct: NumericProblem = {
  meta: {
    slug: "pauli-z-eigenvalue-product",
    title: "Product of Pauli-Z's Eigenvalues",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["eigenvalues", "determinant"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"],
  },
  question: {
    type: "numeric",
    prompt: "What is the product of the eigenvalues of $Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$?",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: -1,
    tolerance: 0.001,
    incorrectFeedback: "The product of a matrix's eigenvalues always equals its determinant.",
  },
  hints: [
    { text: "The product of the eigenvalues of any matrix equals its determinant." },
    { text: "det(Z) = Z_11·Z_22 - Z_12·Z_21." },
  ],
  solution: {
    steps: [
      { description: "The product of eigenvalues equals the determinant, by Vieta's formulas.", latex: "\\lambda_1\\lambda_2 = \\det(Z)" },
      { description: "Compute the determinant directly.", latex: "\\det(Z) = (1)(-1) - (0)(0) = -1" },
    ],
    finalAnswer: "$-1$ (consistent with the actual eigenvalues $+1$ and $-1$, whose product is $-1$.)",
  },
  explanation: {
    correctIdea: "Z is already diagonal, so its eigenvalues are just its diagonal entries — but the determinant shortcut works regardless.",
    whyCorrect: "det(Z) = (1)(-1) - 0 = -1, matching the product of the diagonal entries directly since Z is diagonal.",
    whyWrong: ["Adding the eigenvalues instead of multiplying them would give the trace (0), not the determinant."],
  },
};
