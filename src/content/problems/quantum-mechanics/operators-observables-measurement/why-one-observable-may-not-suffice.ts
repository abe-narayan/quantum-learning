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
      {
        phrases: ["same eigenvalue", "equal eigenvalues", "identical eigenvalue", "repeated eigenvalue", "multiple eigenvectors", "multiple states", "more than one state", "more than one eigenvector", "more than one basis", "several states", "two or more states", "shared by multiple", "shared by more than one", "whole eigenspace", "eigenspace", "spans a subspace"],
        missingFeedback:
          "Say what a degenerate eigenvalue means about how many states carry it.",
      },
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
          "You have identified the degeneracy. Draw the consequence: with the number in hand, list what you now know about the state and what you still do not, and say what would have to be measured next to close the gap.",
      },
    ],
    incorrectFeedback: "You restated the definition of degeneracy without drawing a consequence. Take a concrete case: two basis vectors carrying equal eigenvalues, and a reader holding only the measured number. Say precisely what that reader is entitled to conclude, and what remains open.",
    modelAnswers: [
      "A degenerate eigenvalue is shared by more than one basis state, so the number you measure only locates the state somewhere in that whole eigenspace. It cannot tell you which of those states you actually have.",
      "Several states carry the same eigenvalue, so the result is ambiguous: it does not tell you which one, only that you are somewhere inside the eigenspace they span.",
    ],
  },
  hints: [
    { text: "Write down two distinct basis vectors that the observable assigns equal numbers to. Such a pair exists precisely because the eigenvalue is degenerate." },
    { text: "Now imagine you are handed only the measured number. Which of your two vectors does it point to?" },
    { text: "The same holds for every superposition of those two. Say what has to be measured next, and what property it must have relative to the first observable." },
  ],
  solution: {
    steps: [
      { description: "A degenerate eigenvalue has more than one eigenvector spanning its eigenspace." },
      { description: "Knowing only that eigenvalue tells you the state lies *somewhere* in that eigenspace, but not which specific vector (or superposition) within it." },
    ],
    finalAnswer: "A degenerate eigenvalue is shared by multiple states, so measuring it alone can't distinguish which of those states (or which combination) you actually have.",
  },
  explanation: {
    correctIdea: "A degenerate eigenvalue is shared by more than one basis state, so the measured number cannot tell you which of them the system is in. It locates the state somewhere inside that eigenspace and no further.",
    whyCorrect: "The lesson's N=diag(1,1,2) is the smallest case that shows it: the first two basis vectors both return 1, so the number 1 on its own is compatible with either of them and with every superposition of the two.",
    whyWrong: ["Saying 'because the observable isn't Hermitian' is wrong: degeneracy has nothing to do with Hermiticity. Even a perfectly valid Hermitian observable can have repeated eigenvalues."],
  },
};
