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
    incorrectFeedback: "Set up the characteristic equation λ² - tr·λ + det = 0 with the given numbers, then factor. Check your roots: they must add up to the trace and multiply to the determinant.",
    nearMisses: [
      { value: 1, feedback: "1 is the smaller root. Both roots come from the same factorization; the question asks for the larger." },
      { value: 4, feedback: "4 is the trace, the sum of both eigenvalues rather than one of them." },
      { value: 2, feedback: "2 is the average of the two eigenvalues, which is where the characteristic parabola's vertex sits. The roots lie one unit either side of it." },
    ],
  },
  hints: [
    { text: "λ² - (trace)λ + (determinant) = 0." },
    { text: "Substitute the given trace and determinant, then factor the quadratic. Its two roots add to the trace and multiply to the determinant; report the larger one." },
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
    whyCorrect: "1+3=4 (matches trace) and 1×3=3 (matches determinant): both consistency checks pass.",
    whyWrong: ["Being Hermitian guarantees the eigenvalues are real, which is why factoring over the reals works cleanly here."],
  },
};
