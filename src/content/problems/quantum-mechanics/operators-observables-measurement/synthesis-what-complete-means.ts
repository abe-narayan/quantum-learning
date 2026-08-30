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
      "In your own words, explain what 'complete' means in 'complete set of commuting observables'. Complete with respect to what, specifically?",
    placeholder: "Explain what completeness means for a CSCO...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["uniquely label", "uniquely identify", "distinguishes every basis state"],
        missingFeedback:
          "Complete is complete with respect to something. Say what job the set is supposed to finish, in terms of the basis states.",
      },
      {
        phrases: ["joint eigenvalues", "the whole set together", "no two states share the same tuple"],
        missingFeedback:
          "You have the job. Now be precise about who does it: say whether it is one observable or the set acting in concert, and what quantity carries the labelling.",
      },
    ],
    incorrectFeedback: "You defined 'complete' as 'enough observables' or 'covers everything', which does not say complete with respect to what. Point at a specific thing that must come out different for every basis state, and say who has to supply it: a single observable, or all of them at once.",
    partialFeedback: "One half is there. The other half is whose property completeness is: check whether any single member of the set can have it on its own, or whether it belongs only to the collection acting at once.",
    modelAnswers: [
      "Complete means complete with respect to labelling the basis: the joint eigenvalues of the whole set together uniquely identify every basis state, so no two states share the same tuple. No single observable in the set has to do that on its own.",
      "It means the set taken together uniquely labels each state. Individually each observable may be degenerate, but the joint eigenvalues distinguish every basis state.",
    ],
  },
  hints: [
    { text: "Go back to the table from the Complete Sets lesson and read down its rows. Each row is one basis state; what is written across it?" },
    { text: "Compare any two rows. What has to be true of them for the set of observables to be doing its job?" },
    { text: "Now check whether any one column, on its own, achieves that. Say what completeness therefore is a property of." },
  ],
  solution: {
    steps: [
      { description: "A set of mutually commuting observables is 'complete' if no two distinct basis states share the same tuple of joint eigenvalues across the whole set." },
      { description: "This is a property of the *set as a whole*; individual observables in the set can (and often do) have degenerate spectra on their own." },
    ],
    finalAnswer: "Complete means the joint eigenvalues of the whole set, taken together, uniquely label every basis state, even though no single observable in the set needs to do so alone.",
  },
  explanation: {
    correctIdea: "Completeness is the property that resolves all degeneracy when the observables are considered jointly.",
    whyCorrect: "Matches the CSCO lesson's own N,M example and the Bell-state Z_0,Z_1 example directly.",
    whyWrong: ["Saying 'complete' means the observables span the whole Hilbert space (a statement about vectors, not eigenvalue tuples) confuses completeness of a basis with completeness of a *labeling*: related ideas, but not the same claim."],
  },
};
