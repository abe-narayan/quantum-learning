import type { NumericProblem } from "@/lib/problems/types";

export const wernerConcurrenceAtHalf: NumericProblem = {
  meta: {
    slug: "werner-concurrence-at-half",
    title: "Werner-State Concurrence at p=0.5",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["concurrence", "werner-state"],
    prerequisites: ["quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the verified closed form C(p) = max(0, (3p-1)/2) for the Werner state rho = p|Psi-><Psi-| + (1-p) I/4, compute the concurrence at p=0.5.",
    inputHint: "exact value",
  },
  answer: {
    type: "numeric",
    value: 0.25,
    tolerance: 0.001,
    incorrectFeedback: "(3*0.5-1)/2 = (1.5-1)/2 = 0.5/2.",
  },
  hints: [
    { text: "3*0.5 - 1 = 0.5" },
    { text: "0.5 / 2 = 0.25, and this is positive so the max(0,.) clipping doesn't activate." },
  ],
  solution: {
    steps: [
      { description: "$(3\\times0.5-1)/2 = 0.5/2 = 0.25$" },
      { description: "Since $0.25>0$, the $\\max(0,\\cdot)$ clipping is inactive." },
    ],
    finalAnswer: "C(0.5) = 0.25.",
  },
  explanation: {
    correctIdea: "The Werner-state concurrence formula is linear in p above the p=1/3 separability threshold.",
    whyCorrect: "This is below the lesson's own worked value at p=0.7 (C=0.55), consistent with less entanglement at a smaller mixing weight p.",
  },
};
