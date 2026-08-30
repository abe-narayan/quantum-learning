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
    incorrectFeedback: "Two things to check. Evaluate 3p - 1 in full before dividing by 2. And apply the max(0, ·) only if the inside came out negative; at this p the state sits above the separability threshold, so the concurrence must be positive.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 is 3p − 1 before the division by 2." },
      { value: 0, feedback: "Zero would mean the state is separable. That happens only below p = 1/3; at p = 0.5 the bracket is positive, so the max leaves it alone." },
      { value: 0.55, tolerance: 0.005, feedback: "0.55 is the lesson's p = 0.7 value. Less mixing weight on the singlet means less entanglement." },
    ],
  },
  hints: [
    { text: "This is a substitution problem: the closed form C(p) is given in the prompt. The one conceptual care point is the max with zero, which asks whether the state at this value of p is entangled at all." },
    { text: "Evaluate (3p - 1)/2 at p = 0.5, then check the sign. Only a negative inside would be clipped to zero by the max." },
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
    whyCorrect: "The result sits below the lesson's own value at p=0.7 (C=0.55), which is the right direction of travel: a smaller mixing weight leaves less entanglement for the concurrence to find.",
  },
};
