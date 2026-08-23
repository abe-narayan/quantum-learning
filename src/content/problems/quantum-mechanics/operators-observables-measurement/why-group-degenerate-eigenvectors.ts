import type { ConceptualProblem } from "@/lib/problems/types";

export const whyGroupDegenerateEigenvectors: ConceptualProblem = {
  meta: {
    slug: "why-group-degenerate-eigenvectors",
    title: "Why Degenerate Eigenvectors Share One Projector",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["projectors", "degeneracy", "spectral-decomposition"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why the spectral decomposition groups all eigenvectors sharing one eigenvalue into a single projector, rather than writing a separate term for each eigenvector.",
    placeholder: "Explain why degenerate eigenvectors are grouped together...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["same eigenvalue", "one physical outcome", "indistinguishable by that observable"],
      ["sum over distinct eigenvalues", "one term per eigenvalue", "not per eigenvector"],
    ],
    incorrectFeedback: "Name both pieces: that eigenvectors sharing an eigenvalue correspond to the same measurement outcome, and that the decomposition is organized as one term per distinct eigenvalue, not per eigenvector.",
    partialFeedback: "You're partway there — connect this explicitly to the decomposition being indexed by distinct eigenvalues.",
  },
  hints: [{ text: "What measurement outcome do two eigenvectors sharing an eigenvalue correspond to?" }],
  solution: {
    steps: [
      { description: "Eigenvectors sharing an eigenvalue correspond to the exact same measurement outcome — that eigenvalue is the only thing a measurement of the observable can tell you." },
      { description: "So the decomposition is naturally organized by distinct eigenvalues (one projector each), with each projector spanning the full eigenspace for that outcome." },
    ],
    finalAnswer: "Eigenvectors sharing an eigenvalue give the same measurement outcome, so the decomposition groups them into one projector per distinct eigenvalue.",
  },
  explanation: {
    correctIdea: "The spectral decomposition's structure directly mirrors what's physically distinguishable by a measurement.",
    whyCorrect: "This is exactly why the generalized measurement postulate (a later lesson) can define P(a_i) using a single projector per eigenvalue.",
    whyWrong: ["Saying 'because they're linearly dependent' is wrong — degenerate eigenvectors are linearly independent (they span a genuine multi-dimensional subspace), just associated with identical measurement outcomes."],
  },
};
