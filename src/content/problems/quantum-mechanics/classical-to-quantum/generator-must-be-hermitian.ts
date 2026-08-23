import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const generatorMustBeHermitian: MultipleChoiceProblem = {
  meta: {
    slug: "generator-must-be-hermitian",
    title: "The Generator of Time Evolution",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["time-evolution", "schrodinger-equation"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What property must the generator H of unitary time evolution U(t)=e^{-iHt/ℏ} have, and why?",
    options: [
      { id: "a", text: "Hermitian, because unitarity of U(t) requires it" },
      { id: "b", text: "Unitary, because it generates a unitary operator" },
      { id: "c", text: "Anti-Hermitian, to cancel the i in the exponent" },
      { id: "d", text: "Real-valued (as a matrix), to keep the equation simple" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "H itself isn't unitary — H is what gets exponentiated (with a factor of i) to produce the unitary U(t).",
      c: "It's the opposite: Hermitian H combined with the factor of -i in the exponent is exactly what produces a unitary U(t).",
      d: "H can have complex off-diagonal entries (like Pauli-Y) and still be perfectly valid, as long as it's Hermitian.",
    },
    defaultIncorrectFeedback: "Expand U(dt)=I-iHdt/ℏ and impose U†U=I to first order — what condition on H falls out?",
  },
  hints: [
    { text: "This is exactly the derivation at the start of the lesson." },
  ],
  solution: {
    steps: [
      { description: "Expanding $U^\\dagger(dt)U(dt)=I$ to first order in $dt$ forces $H^\\dagger=H$." },
    ],
    finalAnswer: "H must be Hermitian.",
  },
  explanation: {
    correctIdea: "Unitarity of the evolution operator is what forces its generator to be Hermitian.",
    whyCorrect: "This is a direct consequence of Postulate 4, not a separate assumption.",
    whyWrong: ["H itself is never required to be unitary — that property belongs to U(t), the operator built from H."],
  },
};
