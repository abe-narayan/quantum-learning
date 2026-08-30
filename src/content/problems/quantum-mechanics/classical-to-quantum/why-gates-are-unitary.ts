import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whyGatesAreUnitary: MultipleChoiceProblem = {
  meta: {
    slug: "why-gates-are-unitary",
    title: "Synthesis: Why Every Quantum Gate Is Unitary",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["synthesis", "postulates", "quantum-computing"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Using this course's own derivation (not just 'that's the rule'), why must every quantum gate be a unitary matrix?",
    options: [
      { id: "a", text: "A gate is a discrete step of unitary time evolution, which must preserve normalization" },
      { id: "b", text: "Unitary matrices are easier to multiply together when composing a long circuit" },
      { id: "c", text: "Gates must be unitary so that their eigenvalues come out real and measurable" },
      { id: "d", text: "It's a convention chosen for convenience in the circuit model, not a physical requirement" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Computational convenience is not the physical reason. The requirement traces to Postulate 4 and normalization preservation.",
      c: "Real eigenvalues is the Hermitian requirement (for observables), not the unitary requirement (for dynamics). Those are different postulates.",
      d: "It's a genuine physical requirement, derived from unitarity being necessary and sufficient for preserving total probability.",
    },
    defaultIncorrectFeedback: "Recall the Time Evolution lesson's identification of a gate as a fixed-duration step of U(t).",
  },
  hints: [
    { text: "Ask what a gate is, physically, before asking what constraint it satisfies." },
    { text: "A gate is U(t) evaluated at one fixed, useful time interval, so whatever constrains U constrains it." },
    { text: "Postulate 4 required unitary evolution for a reason. Recall which quantity it was protecting." },
  ],
  solution: {
    steps: [
      { description: "A gate is a discrete instance of the continuous evolution operator $U(t)=e^{-iHt/\\hbar}$." },
      { description: "Postulate 4 requires evolution to be unitary specifically because normalization (total probability) must be preserved." },
    ],
    finalAnswer: "Gates are unitary because they're evolution operators, and evolution must preserve normalization.",
  },
  explanation: {
    correctIdea: "There is nothing quantum-computing-specific about the unitarity requirement; it is this course's Postulate 4 applied to a specific time interval.",
    whyCorrect: "This directly reuses the Time Evolution lesson's derivation rather than treating it as a separate rule.",
    whyWrong: [
      { optionId: "b", text: "Gives a computational reason for a physical constraint. Ease of multiplication would not force anything." },
      { optionId: "c", text: "Swaps the two postulates: real eigenvalues is what Hermiticity buys for observables, and unitarity is what dynamics needs." },
      { optionId: "d", text: "Calls it a convention. Unitarity is necessary and sufficient for preserving total probability, so nothing else would do." },
    ],
  },
};
