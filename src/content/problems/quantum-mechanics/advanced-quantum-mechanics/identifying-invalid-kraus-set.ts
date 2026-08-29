import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const identifyingInvalidKrausSet: MultipleChoiceProblem = {
  meta: {
    slug: "identifying-invalid-kraus-set",
    title: "Which Kraus Set Is NOT Trace-Preserving?",
    course: "advanced-quantum-mechanics",
    lesson: "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["open-systems", "kraus-operators"],
    prerequisites: ["quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of these single-operator Kraus sets {K₀} is NOT a valid (trace-preserving) quantum channel?",
    options: [
      { id: "a", text: "K₀ = 2·I (the identity matrix scaled by 2)" },
      { id: "b", text: "K₀ = I (the identity matrix)" },
      { id: "c", text: "K₀ = X (the Pauli-X matrix)" },
      { id: "d", text: "K₀ = H (the Hadamard matrix)" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "K₀†K₀=I†I=I — trace-preserving.",
      c: "X is unitary (X†X=I), so this is trace-preserving.",
      d: "H is unitary (H†H=I), so this is trace-preserving.",
    },
    defaultIncorrectFeedback: "Check K₀†K₀ for each option — any UNITARY single operator automatically satisfies K₀†K₀=I, but a scaled (non-unitary) operator generally does not.",
  },
  hints: [
    { text: "A single Kraus operator K₀ is trace-preserving exactly when K₀†K₀=I, i.e. K₀ is unitary." },
    { text: "I, X, and H are all unitary matrices." },
    { text: "2I is NOT unitary: (2I)†(2I)=4I≠I." },
  ],
  solution: {
    steps: [{ description: "(2I)†(2I) = 4I ≠ I, so K₀ = 2I fails the trace-preservation condition. I, X and H are unitary, so each satisfies K₀†K₀ = I and passes." }],
    finalAnswer: "K₀ = 2·I, since (2I)†(2I) = 4I rather than I.",
  },
  explanation: {
    correctIdea: "For a single-operator Kraus set, trace preservation reduces to K₀†K₀ = I, which is the definition of unitarity. Scaling any unitary by a factor other than a phase breaks it.",
    whyCorrect: "4I ≠ I is a direct computation.",
    whyWrong: [
      { optionId: "b", text: "The identity satisfies I†I = I, so it is the trivial do-nothing channel." },
      { optionId: "c", text: "X is unitary, so X†X = I and the channel is a valid bit flip." },
      { optionId: "d", text: "H is unitary, so H†H = I and the channel is a valid basis change." },
    ],
  },
};
