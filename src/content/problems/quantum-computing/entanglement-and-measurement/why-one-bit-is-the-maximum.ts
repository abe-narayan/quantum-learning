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
      {
        phrases: ["0.5 and 0.5", "both 0.5", "both equal", "equal eigenvalues", "equal split", "evenly split", "even split", "50/50", "50-50", "half and half", "p=0.5", "p = 0.5", "1/2 and 1/2", "both one half", "each one half", "balanced", "fair coin", "unbiased coin"],
        missingFeedback:
          "You have said where the entropy peaks in general. Now say what the two eigenvalues have to be at that peak, given that they are nonnegative and add to one.",
      },
      {
        phrases: ["entropy is largest", "largest when", "largest at", "maximized when", "maximised when", "maximum when", "maximum at", "maximum of shannon", "maximum of the shannon", "peaks when", "peaks at", "top of the curve", "most uncertain", "most mixed", "hardest to predict", "least predictable", "highest at", "greatest when"],
        missingFeedback:
          "You have named the even case. Now say why that case is the answer: what is it about a two-outcome distribution's entropy that makes that point special?",
      },
    ],
    incorrectFeedback: "Think of a general distribution over a pair of outcomes and ask which split of probability makes the result hardest to guess, then translate that into eigenvalues.",
    partialFeedback: "Connect this to the eigenvalues of ρ, which behave like a classical probability pair.",
    modelAnswers: [
      "The two eigenvalues are a probability distribution over two outcomes, and Shannon entropy for two outcomes is largest when the two are equal. Both 0.5 gives 1 bit, and nothing can beat it.",
      "Entropy is maximized when the distribution is as even as it can be. For a qubit that means eigenvalues 1/2 and 1/2, the most uncertain case, which gives exactly 1 bit.",
    ],
  },
  hints: [
    { text: "The two numbers on the diagonal after diagonalizing are nonnegative and add up to 1. What familiar classical object is that?" },
    { text: "Treat p as a dial. Where along its range from 0 to 1 does the classical entropy function reach its top?" },
    { text: "Evaluate the entropy formula at that value of p. How many bits come out?" },
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
