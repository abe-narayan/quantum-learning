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
      // "one term per eigenvalue" did not match "one projector per distinct
      // eigenvalue" (the interposed "distinct" is fine, but "projector" is not
      // "term"), so this problem rejected its own model answer.
      {
        phrases: ["same eigenvalue", "sharing an eigenvalue", "share an eigenvalue", "same measurement outcome", "same outcome", "one physical outcome", "indistinguishable by that observable"],
        missingFeedback:
          "Say what two eigenvectors belonging to one repeated eigenvalue have in common as far as a measurement is concerned.",
      },
      {
        phrases: ["sum over distinct eigenvalues", "one term per eigenvalue", "one projector per eigenvalue", "one projector per distinct", "one term per distinct", "per distinct eigenvalue", "distinct eigenvalue", "one projector each", "indexed by eigenvalue", "not per eigenvector"],
        missingFeedback:
          "You have said why they are not distinguishable. Now say what the decomposition is keyed on as a result: how many terms are there, and what does each one correspond to?",
      },
    ],
    incorrectFeedback: "You described what the decomposition looks like without saying what fixes its shape. The organizing question is physical: how many different things can a single measurement of this observable actually report, and does the reader of that report ever learn which eigenvector was involved?",
    partialFeedback: "You have one half. The other half is the bookkeeping: say how many terms the sum should have, and what each index runs over, and check that no two terms could ever be told apart by an experiment.",
    modelAnswers: [
      "Eigenvectors carrying one repeated eigenvalue all give the same measurement outcome, so a measurement cannot tell them apart. The decomposition is indexed by what is physically distinguishable, which means one projector per distinct eigenvalue rather than one per eigenvector.",
      "Because they all correspond to one physical outcome. So the sum is over distinct eigenvalues, with a single projector onto the whole eigenspace, not per eigenvector.",
    ],
  },
  hints: [
    { text: "A measurement of this observable returns a number. Two eigenvectors with equal eigenvalues return which numbers?" },
    { text: "So an experiment cannot tell those two apart. Ask whether a formula that assigns them separate terms is recording a real difference or an arbitrary choice of basis." },
    { text: "Rewrite the decomposition so its index runs over the things an experiment can actually see. What object stands in for each group of eigenvectors that share a value?" },
  ],
  solution: {
    steps: [
      { description: "Eigenvectors sharing an eigenvalue correspond to the same measurement outcome; that eigenvalue is the only thing a measurement of the observable can tell you." },
      { description: "So the decomposition is naturally organized by distinct eigenvalues (one projector each), with each projector spanning the full eigenspace for that outcome." },
    ],
    finalAnswer: "Eigenvectors sharing an eigenvalue give the same measurement outcome, so the decomposition groups them into one projector per distinct eigenvalue.",
  },
  explanation: {
    correctIdea: "The spectral decomposition's structure directly mirrors what's physically distinguishable by a measurement.",
    whyCorrect: "This is why the generalized measurement postulate (a later lesson) can define P(a_i) using a single projector per eigenvalue.",
    whyWrong: ["Saying 'because they're linearly dependent' is wrong: degenerate eigenvectors are linearly independent, spanning a multi-dimensional subspace, and merely share a measurement outcome."],
  },
};
