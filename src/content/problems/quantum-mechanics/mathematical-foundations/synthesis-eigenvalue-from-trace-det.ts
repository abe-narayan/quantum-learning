import type { NumericProblem } from "@/lib/problems/types";

export const synthesisEigenvalueFromTraceDet: NumericProblem = {
  meta: {
    slug: "synthesis-eigenvalue-from-trace-det",
    title: "Synthesis: Eigenvalues From Trace and Determinant",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["eigenvalues", "synthesis"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"],
  },
  question: {
    type: "numeric",
    prompt: "A $2\\times2$ Hermitian matrix has trace $4$ and determinant $3$. What is its larger eigenvalue?",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 3,
    tolerance: 0.001,
    incorrectFeedback: "Set up the characteristic equation λ² - tr·λ + det = 0 with tr=4, det=3, then factor.",
  },
  hints: [
    { text: "λ² - (trace)λ + (determinant) = 0." },
    { text: "λ² - 4λ + 3 = 0 factors nicely." },
  ],
  solution: {
    steps: [
      { description: "Set up the characteristic equation.", latex: "\\lambda^2 - 4\\lambda + 3 = 0" },
      { description: "Factor.", latex: "(\\lambda-1)(\\lambda-3) = 0 \\quad\\Longrightarrow\\quad \\lambda = 1, 3" },
    ],
    finalAnswer: "The larger eigenvalue is $3$.",
  },
  explanation: {
    correctIdea: "Trace and determinant alone determine a 2×2 matrix's characteristic equation, without needing the matrix itself.",
    whyCorrect: "1+3=4 (matches trace) and 1×3=3 (matches determinant) — both consistency checks pass.",
    whyWrong: ["Being Hermitian guarantees the eigenvalues are real, which is why factoring over the reals works cleanly here."],
  },
};
