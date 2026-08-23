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
    steps: [{ description: "(2I)†(2I)=4I²=4I≠I, so K₀=2I fails trace-preservation, while I, X, H are all genuinely unitary and pass." }],
    finalAnswer: "(a) K₀ = 2·I",
  },
  explanation: {
    correctIdea: "This directly extends the lesson's own 'K scaled by 2' counter-example, applied to a slightly larger set of familiar operators.",
    whyCorrect: "4I≠I is a straightforward direct computation.",
    whyWrong: ["I, X, and H are all standard unitary gates already used throughout this platform's Quantum Computing courses — each automatically satisfies the trace-preservation condition as a single-operator channel."],
  },
};
