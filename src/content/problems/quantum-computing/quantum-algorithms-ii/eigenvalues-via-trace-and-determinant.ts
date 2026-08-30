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
      // "λ^2" stripped to the bare token "2" and "+1"/"-1"/"±1" all stripped to
      // the bare token "1", so both groups matched any answer that happened to
      // contain those digits. "λ²" and "±" survive only as literal substrings
      // (they strip to nothing), which is exactly the tight match wanted here.
      {
        phrases: ["lambda^2", "lambda²", "lambda squared", "λ²", "characteristic equation", "characteristic polynomial", "quadratic"],
        missingFeedback:
          "Substitute the two given numbers into the equation the question hands you, and write the resulting polynomial down before you solve anything.",
        anchors: {
          "λ²": "Written in symbols, the squared eigenvalue strips to nothing; spelling it as lambda^2 would strip to the bare digit 2 and match any answer containing it. The raw glyphs are the tight test.",
        },
      },
      {
        phrases: ["plus or minus", "plus and minus 1", "minus one", "±", "+1 and -1", "+1 and −1", "-1 and +1", "−1 and +1", "1 and -1", "1 and −1", "1 or -1", "1 or −1"],
        missingFeedback:
          "You have set the equation up. Now solve it and state both roots explicitly, then say which one is the ground energy.",
        anchors: {
          "±": "The plus-minus sign strips to nothing and is matched raw. It is the shortest way a student writes a pair of opposite eigenvalues.",
        },
      },
    ],
    incorrectFeedback: "You reached for the √(a²+b²+c²) shortcut the prompt rules out, or read the answer off the Pauli coefficients. Use the route asked for: substitute the two given numbers into the degree-two equation and solve it.",
    partialFeedback: "Now state the two resulting eigenvalues.",
    modelAnswers: [
      "Put trace 0 and determinant -1 into the characteristic equation: lambda^2 - 0*lambda + (-1) = 0, so lambda squared equals 1. That gives lambda = +1 and -1, so E0 = -1.",
      "The characteristic polynomial is lambda squared minus the trace times lambda plus the determinant, which here is lambda^2 - 1 = 0. That factors, giving eigenvalues 1 and -1.",
    ],
  },
  hints: [
    { text: "For a 2×2 matrix there is a standard degree-two equation whose roots are the eigenvalues, written using only the trace and the determinant. Write it down." },
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
