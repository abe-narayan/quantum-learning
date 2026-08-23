import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisWhatCompleteMeans: ConceptualProblem = {
  meta: {
    slug: "synthesis-what-complete-means",
    title: "Synthesis: What 'Complete' Means in CSCO",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["synthesis", "csco"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In your own words, explain what 'complete' means in 'complete set of commuting observables' -- complete with respect to what, specifically?",
    placeholder: "Explain what completeness means for a CSCO...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["uniquely label", "uniquely identify", "distinguishes every basis state"],
      ["joint eigenvalues", "the whole set together", "no two states share the same tuple"],
    ],
    incorrectFeedback: "Name both pieces: that 'complete' means the joint eigenvalues uniquely identify every basis state, and that this is a property of the whole set of observables together, not any one of them alone.",
    partialFeedback: "You're partway there — be explicit that completeness is about the joint eigenvalue tuple, not any single observable.",
  },
  hints: [{ text: "Look back at the table from the Complete Sets lesson — what had to be true of every row?" }],
  solution: {
    steps: [
      { description: "A set of mutually commuting observables is 'complete' if no two distinct basis states share the same tuple of joint eigenvalues across the whole set." },
      { description: "This is a property of the *set as a whole* — individual observables in the set can (and often do) have degenerate spectra on their own." },
    ],
    finalAnswer: "Complete means the joint eigenvalues of the whole set, taken together, uniquely label every basis state — even though no single observable in the set needs to do this alone.",
  },
  explanation: {
    correctIdea: "Completeness is exactly the property that resolves all degeneracy when the observables are considered jointly.",
    whyCorrect: "Matches the CSCO lesson's own N,M example and the Bell-state Z_0,Z_1 example directly.",
    whyWrong: ["Saying 'complete' means the observables span the whole Hilbert space (a statement about vectors, not eigenvalue tuples) confuses completeness of a basis with completeness of a *labeling* — related ideas, but not the same claim."],
  },
};
