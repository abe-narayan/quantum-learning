import type { ConceptualProblem } from "@/lib/problems/types";

export const whyOneObservableMayNotSuffice: ConceptualProblem = {
  meta: {
    slug: "why-one-observable-may-not-suffice",
    title: "Why One Observable Doesn't Always Suffice",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["csco", "degeneracy"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why a single observable with a degenerate eigenvalue cannot, by itself, fully identify a unique basis state.",
    placeholder: "Explain why a degenerate observable alone is insufficient...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["same eigenvalue", "multiple eigenvectors", "more than one state"],
      {
        phrases: [
          "can't distinguish",
          "cannot distinguish",
          "can't tell",
          "cannot tell",
          "doesn't tell you which",
          "does not tell you which",
          "ambiguous",
          "ambiguity",
          "not enough",
          "insufficient",
          "underdetermined",
          "which one",
          "leaves it open",
          "still unresolved",
        ],
        missingFeedback:
          "You have identified the degeneracy. Draw the consequence: the measured eigenvalue does not pick out a single state within that eigenspace, so one observable leaves the system's state ambiguous and a second, commuting observable is needed to resolve it.",
      },
    ],
    incorrectFeedback: "Name both pieces: that a degenerate eigenvalue has more than one eigenvector, and that knowing only the eigenvalue can't tell you which of those eigenvectors (or superposition within that subspace) you actually have.",
  },
  hints: [{ text: "If two different basis states share the same eigenvalue, does measuring that eigenvalue distinguish between them?" }],
  solution: {
    steps: [
      { description: "A degenerate eigenvalue has more than one eigenvector spanning its eigenspace." },
      { description: "Knowing only that eigenvalue tells you the state lies *somewhere* in that eigenspace, but not which specific vector (or superposition) within it." },
    ],
    finalAnswer: "A degenerate eigenvalue is shared by multiple states, so measuring it alone can't distinguish which of those states (or which combination) you actually have.",
  },
  explanation: {
    correctIdea: "This is exactly the motivation for needing a complete set of commuting observables rather than relying on one.",
    whyCorrect: "Matches the lesson's own N=diag(1,1,2) example directly.",
    whyWrong: ["Saying 'because the observable isn't Hermitian' is wrong — degeneracy has nothing to do with Hermiticity; even a perfectly valid Hermitian observable can have repeated eigenvalues."],
  },
};
