import type { NumericProblem } from "@/lib/problems/types";

export const pauliXEigenvalueSum: NumericProblem = {
  meta: {
    slug: "pauli-x-eigenvalue-sum",
    title: "Sum of Pauli-X's Eigenvalues",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["eigenvalues", "trace"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"],
  },
  question: {
    type: "numeric",
    prompt: "What is the sum of the eigenvalues of $X=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$?",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 0,
    tolerance: 0.001,
    incorrectFeedback: "The sum of a matrix's eigenvalues always equals its trace, so no characteristic equation is needed. Read the trace directly off X's diagonal.",
    nearMisses: [
      { value: 2, feedback: "2 adds the magnitudes of the eigenvalues. They are +1 and −1, and the sum keeps their signs, matching the trace of 0." },
      { value: 1, feedback: "1 is one eigenvalue. The question asks for the sum of both, which the trace gives directly." },
      { value: -1, feedback: "−1 is the product of the eigenvalues, which equals the determinant. The sum is the trace." },
    ],
  },
  hints: [
    { text: "You don't need to find the eigenvalues individually. There's a shortcut." },
    { text: "The sum of the eigenvalues of any matrix equals its trace." },
    { text: "Read the trace off X's diagonal. Both diagonal entries vanish, so the sum follows immediately." },
  ],
  solution: {
    steps: [
      { description: "The sum of eigenvalues equals the trace, by Vieta's formulas applied to the characteristic equation.", latex: "\\lambda_1+\\lambda_2 = \\operatorname{tr}(X)" },
      { description: "Compute the trace directly.", latex: "\\operatorname{tr}(X) = 0+0 = 0" },
    ],
    finalAnswer: "$0$ (consistent with the actual eigenvalues $+1$ and $-1$, which do sum to $0$.)",
  },
  explanation: {
    correctIdea: "The trace/eigenvalue-sum shortcut avoids solving the characteristic equation entirely.",
    whyCorrect: "X's diagonal entries are both 0, so its trace, and hence the eigenvalue sum, is 0.",
    whyWrong: ["Solving the full characteristic equation (eigenvalues ±1) and adding them gives the same answer, just with more work."],
  },
};
