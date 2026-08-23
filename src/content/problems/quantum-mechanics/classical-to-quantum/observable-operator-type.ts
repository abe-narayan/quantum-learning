import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const observableOperatorType: MultipleChoiceProblem = {
  meta: {
    slug: "observable-operator-type",
    title: "What Kind of Operator Represents an Observable",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["postulates"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Postulate 2 requires a physical observable to be represented by which kind of operator?",
    options: [
      { id: "a", text: "Hermitian" },
      { id: "b", text: "Unitary" },
      { id: "c", text: "Anti-Hermitian" },
      { id: "d", text: "Any invertible linear operator" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Unitary operators are what Postulate 4 requires for dynamics, not observables.",
      c: "Anti-Hermitian operators have purely imaginary expectation values — the opposite of what a real-valued measurement outcome needs.",
      d: "Most invertible operators aren't Hermitian and would allow complex eigenvalues, which can't be measurement outcomes.",
    },
    defaultIncorrectFeedback: "Think about what guarantees a measurement outcome comes out real.",
  },
  hints: [
    { text: "Measurement outcomes must be real numbers." },
    { text: "Which class of operator is proven, in the Hermitian Operators lesson, to always have real eigenvalues?" },
  ],
  solution: {
    steps: [
      { description: "Measurement outcomes are real numbers, and Hermitian operators are exactly the ones guaranteed to have real eigenvalues (Hermitian Operators lesson)." },
    ],
    finalAnswer: "Hermitian.",
  },
  explanation: {
    correctIdea: "Postulate 2's requirement traces directly back to the real-eigenvalue theorem for Hermitian operators.",
    whyCorrect: "This is exactly why the theorem was proven before the postulates were stated.",
    whyWrong: ["Unitary is the requirement for Postulate 4 (dynamics), a completely different postulate with a different justification."],
  },
};
