import type { ConceptualProblem } from "@/lib/problems/types";

export const eigenvaluesViaTraceAndDeterminant: ConceptualProblem = {
  meta: {
    slug: "eigenvalues-via-trace-and-determinant",
    title: "Finding H's Eigenvalues from Trace and Determinant",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["vqe", "eigenvalues"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example"],
  },
  question: {
    type: "conceptual",
    prompt: "For H=0.6Z+0.8X, use its trace (0) and determinant (−1) to find its eigenvalues via the characteristic equation λ²−(trace)λ+(det)=0, without using the general √(a²+b²+c²) shortcut.",
    placeholder: "Substitute trace=0, det=-1 into the characteristic equation...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["lambda^2", "lambda²", "lambda squared", "λ²", "λ^2", "characteristic equation", "characteristic polynomial", "quadratic"],
      ["+1", "-1", "−1", "plus or minus 1", "plus or minus one", "plus and minus 1", "minus one", "±1", "± 1"],
    ],
    incorrectFeedback: "Substitute the given trace and determinant into the equation from the prompt, then solve what remains.",
    partialFeedback: "Good. Now state the two resulting eigenvalues explicitly.",
  },
  hints: [
    { text: "Write the characteristic polynomial of a 2×2 matrix in terms of its trace and determinant." },
    { text: "Substitute the two given numbers. How simple does the equation become?" },
    { text: "Solve it, remembering that a square has two roots." },
  ],
  solution: {
    steps: [
      { description: "λ² − (0)λ + (−1) = 0, i.e. λ² = 1." },
      { description: "λ = +1 or λ = −1." },
    ],
    finalAnswer: "Eigenvalues are +1 and −1, so E₀=−1. This matches both the shortcut formula and the engine's direct output.",
  },
  explanation: {
    correctIdea: "The trace-and-determinant method is a completely general way to find 2×2 eigenvalues, independent of any Pauli-specific shortcut.",
    whyCorrect: "This is exactly the general method eigenvaluesHermitian2x2 implements internally, applied here by hand.",
    whyWrong: ["Using the √(a²+b²+c²) shortcut without deriving it from the characteristic equation skips exactly what this question asks for."],
  },
};
