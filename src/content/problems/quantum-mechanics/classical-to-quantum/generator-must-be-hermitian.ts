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
      b: "H itself is not unitary. H is what gets exponentiated (with a factor of i) to produce the unitary U(t).",
      c: "It is the opposite: a Hermitian H combined with the factor of -i in the exponent is what produces a unitary U(t).",
      d: "H can have complex off-diagonal entries (like Pauli-Y) and still be perfectly valid, as long as it's Hermitian.",
    },
    defaultIncorrectFeedback: "Expand U(dt)=I-iHdt/ℏ and impose U†U=I to first order. What condition on H falls out?",
  },
  hints: [
    { text: "The requirement on U is unitarity, U†U = I. Start there and work backwards to H." },
    { text: "Take an infinitesimal step: U(dt) ≈ I − iH dt/ℏ, and write down its adjoint." },
    { text: "Multiply the two and keep terms to first order in dt. The dt terms must cancel, and that cancellation is a condition on H." },
  ],
  solution: {
    steps: [
      { description: "For an infinitesimal step, $U(dt)=I-iH\\,dt/\\hbar$ and $U^\\dagger(dt)=I+iH^\\dagger dt/\\hbar$." },
      { description: "Multiplying and keeping first order in $dt$ gives $U^\\dagger U = I + i(H^\\dagger - H)dt/\\hbar$. Unitarity demands this equal $I$, so $H^\\dagger = H$." },
    ],
    finalAnswer: "H must be Hermitian, which is what unitarity of U(t) forces.",
  },
  explanation: {
    correctIdea: "Hermiticity of the generator is not an extra assumption. It falls out of requiring the evolution it generates to be unitary.",
    whyCorrect: "The first-order expansion of U†U = I leaves H† − H = 0 as its only surviving condition.",
    whyWrong: [
      { optionId: "b", text: "Assigns U's property to H. H is what gets exponentiated; the exponential is the unitary one." },
      { optionId: "c", text: "Reverses the roles of the two factors. It is the −i in the exponent together with a Hermitian H that makes U unitary." },
      { optionId: "d", text: "Confuses real entries with Hermiticity. Pauli-Y has imaginary off-diagonal entries and is Hermitian." },
    ],
  },
};
