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
      ["two eigenvalues", "sum to 1", "0.5 and 0.5", "equal"],
      ["maximized", "maximum", "balanced", "most uncertain"],
    ],
    incorrectFeedback: "Think about a general two-outcome probability distribution (p, 1-p) — for which value of p is its Shannon entropy largest?",
    partialFeedback: "Good direction — connect this directly to the eigenvalues of ρ summing to 1, exactly like a two-outcome probability distribution.",
  },
  hints: [
    { text: "A qubit's two eigenvalues, λ and 1-λ, form a two-outcome probability distribution." },
    { text: "Shannon entropy of (p, 1-p) is maximized when p=0.5, giving exactly 1 bit." },
    { text: "Any other split (like 0.9/0.1) has less 'balanced' uncertainty and lower entropy." },
  ],
  solution: {
    steps: [
      { description: "A qubit's density matrix has exactly two eigenvalues, λ and 1-λ (since they must be nonnegative and sum to 1)." },
      { description: "This is exactly a two-outcome probability distribution, and Shannon entropy -p log₂p - (1-p)log₂(1-p) is maximized at p=0.5." },
      { description: "At p=0.5, S = -0.5log₂(0.5) - 0.5log₂(0.5) = 1 bit — the maximum, reached only at the maximally mixed state." },
    ],
    finalAnswer: "1 bit is the maximum because it's exactly the maximum of Shannon entropy over all two-outcome distributions, reached at the balanced 50/50 case.",
  },
  explanation: {
    correctIdea: "A qubit's eigenvalues form a two-outcome probability distribution, and von Neumann entropy inherits Shannon entropy's maximum at the balanced case.",
    whyCorrect: "This directly explains why I/2 (eigenvalues 0.5, 0.5) is the unique maximum-entropy single-qubit state.",
    whyWrong: ["Claiming entropy could exceed 1 bit ignores that a qubit only ever has two eigenvalues to begin with, capping the number of distinguishable 'outcomes' the entropy formula sums over."],
  },
};
