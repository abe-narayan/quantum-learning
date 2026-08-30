import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const synthesisHermitianAndUnitary: MultipleChoiceProblem = {
  meta: {
    slug: "synthesis-hermitian-and-unitary",
    title: "Synthesis: Real, Symmetric, and Its Own Inverse",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["hermitian-operators", "unitary-operators", "synthesis"],
    prerequisites: [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/mathematical-foundations/unitary-operators",
    ],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A $2\\times2$ matrix $M$ is real, symmetric, and satisfies $M^2=I$. Which of the following must be true?",
    options: [
      { id: "a", text: "$M$ is both Hermitian and unitary" },
      { id: "b", text: "$M$ must equal the identity matrix" },
      { id: "c", text: "$M$ cannot have eigenvalue $-1$" },
      { id: "d", text: "$M$ must be diagonal" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Pauli-X is real, symmetric, and satisfies X²=I, but X is not the identity matrix, so it is a direct counterexample.",
      c: "Pauli-X has eigenvalue -1 (with eigenvector |−⟩), so this is false.",
      d: "Pauli-X is real, symmetric, satisfies X²=I, and is not diagonal, so it is another direct counterexample.",
    },
    defaultIncorrectFeedback: "Real + symmetric gives Hermitian directly; combine that with M²=I to check the unitarity condition M†M=I.",
  },
  hints: [
    { text: "Real and symmetric means M† = Mᵀ = M, so M is Hermitian." },
    { text: "Since M is Hermitian, M†M = M·M = M²." },
    { text: "You're told M² = I. What does that make M†M?" },
  ],
  solution: {
    steps: [
      { description: "Real and symmetric gives $M^\\dagger = M^T = M$, which is the Hermitian condition." },
      { description: "Since $M^\\dagger=M$, $M^\\dagger M = M\\cdot M = M^2 = I$ (given), which is the unitarity condition." },
    ],
    finalAnswer: "$M$ must be both Hermitian and unitary.",
  },
  explanation: {
    correctIdea: "Combining the Hermitian Operators and Unitary Operators lessons: real+symmetric gives Hermitian, and M²=I combined with Hermiticity gives unitary too.",
    whyCorrect: "Pauli-X is the standard concrete example satisfying all the given conditions.",
    whyWrong: [
      { optionId: "b", text: "Pauli-X is real, symmetric and squares to I without being the identity." },
      { optionId: "c", text: "Pauli-X has eigenvalue −1, with eigenvector |−⟩. Squaring to I permits eigenvalues ±1, not just +1." },
      { optionId: "d", text: "Pauli-X satisfies all three hypotheses and is not diagonal." },
    ],
  },
};
