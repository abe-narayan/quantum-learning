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
    { text: "Postulate 3 says the possible outcomes of a measurement are the operator's eigenvalues." },
    { text: "A measured quantity is a real number, so the constraint has to be one that rules out complex eigenvalues." },
    { text: "The Hermitian Operators lesson proves exactly one class of operator always has real eigenvalues." },
  ],
  solution: {
    steps: [
      { description: "Postulate 3 identifies measurement outcomes with the operator's eigenvalues, and a measured quantity is a real number. Hermitian operators are the class proven to have real eigenvalues, so an observable must be Hermitian." },
    ],
    finalAnswer: "Hermitian, since that is the class whose eigenvalues are guaranteed real.",
  },
  explanation: {
    correctIdea: "Postulate 2's requirement traces back to the real-eigenvalue theorem for Hermitian operators, which is why that theorem is proven before the postulates are stated.",
    whyCorrect: "Real measurement outcomes and real eigenvalues are the same requirement, and Hermiticity is what secures it.",
    whyWrong: [
      { optionId: "b", text: "Names the requirement Postulate 4 places on dynamics, which is a different postulate with a different justification." },
      { optionId: "c", text: "Gives purely imaginary eigenvalues, the opposite of what a measured value needs." },
      { optionId: "d", text: "Is far too weak. Most invertible operators have complex eigenvalues, which no apparatus could report." },
    ],
  },
};
