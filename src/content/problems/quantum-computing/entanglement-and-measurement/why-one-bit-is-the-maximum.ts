import type { ConceptualProblem } from "@/lib/problems/types";

export const whyOneBitIsTheMaximum: ConceptualProblem = {
  meta: {
    slug: "why-one-bit-is-the-maximum",
    title: "Why a Qubit's Entropy Can't Exceed 1 Bit",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["von-neumann-entropy", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/purity-entropy-and-information"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why S(ρ)=1 bit is the maximum possible von Neumann entropy for a single qubit's density matrix, using the fact that its two eigenvalues are nonnegative and sum to 1.",
    placeholder: "Think about how Shannon entropy of a two-outcome distribution is maximized...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["two eigenvalues", "sum to 1", "0.5 and 0.5", "both 0.5", "both equal", "equal eigenvalues", "equal split", "50/50", "50-50", "half and half", "p=0.5", "p = 0.5", "1/2 and 1/2", "two outcome", "two-outcome", "coin"],
      ["maxim", "largest", "biggest", "greatest", "highest", "peak", "balanced", "most uncertain", "most mixed", "hardest to predict"],
    ],
    incorrectFeedback: "Think of a general distribution over a pair of outcomes and ask which split of probability makes the result hardest to guess, then translate that into eigenvalues.",
    partialFeedback: "Good direction. Connect this to the eigenvalues of ρ, which behave exactly like a classical probability pair.",
  },
  hints: [
    { text: "A qubit's two eigenvalues are nonnegative and add up to 1. What familiar classical object do they form?" },
    { text: "For a biased coin with bias p, which p makes the outcome hardest to guess?" },
    { text: "Evaluate the entropy formula at that special p. How many bits come out?" },
  ],
  solution: {
    steps: [
      { description: "A qubit's density matrix has exactly two eigenvalues, λ and 1-λ (since they must be nonnegative and sum to 1)." },
      { description: "This is exactly a two-outcome probability distribution, and Shannon entropy -p log₂p - (1-p)log₂(1-p) is maximized at p=0.5." },
      { description: "At p=0.5, S = -0.5log₂(0.5) - 0.5log₂(0.5) = 1 bit, the maximum, reached only at the maximally mixed state." },
    ],
    finalAnswer: "1 bit is the maximum because it's exactly the maximum of Shannon entropy over all two-outcome distributions, reached at the balanced 50/50 case.",
  },
  explanation: {
    correctIdea: "A qubit's eigenvalues form a two-outcome probability distribution, and von Neumann entropy inherits Shannon entropy's maximum at the balanced case.",
    whyCorrect: "This directly explains why I/2 (eigenvalues 0.5, 0.5) is the unique maximum-entropy single-qubit state.",
    whyWrong: ["Claiming entropy could exceed 1 bit ignores that a qubit only ever has two eigenvalues to begin with, capping the number of distinguishable 'outcomes' the entropy formula sums over."],
  },
};
