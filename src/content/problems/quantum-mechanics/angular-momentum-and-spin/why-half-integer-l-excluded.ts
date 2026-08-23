import type { ConceptualProblem } from "@/lib/problems/types";

export const whyHalfIntegerLExcluded: ConceptualProblem = {
  meta: {
    slug: "why-half-integer-l-excluded",
    title: "Why Half-Integer Orbital Angular Momentum Is Excluded",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["spherical-harmonics", "conceptual"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, using single-valuedness of the wavefunction under φ→φ+2π, why m=1/2 is excluded for orbital angular momentum, showing the specific numeric check that fails.",
    placeholder: "Substitute m=1/2 into e^{im2π} and evaluate...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["e\\^\\{i\\\\pi\\}", "e^{i pi}", "-1", "not equal to 1"],
      ["multi-valued", "different value", "not single-valued"],
    ],
    incorrectFeedback: "Compute e^{i(1/2)(2π)} directly and compare it to 1.",
    partialFeedback: "Good — now state explicitly what this means for the wavefunction's validity.",
  },
  hints: [
    { text: "Single-valuedness requires e^{im2π}=1." },
    { text: "For m=1/2: e^{i(1/2)(2π)}=e^{iπ}." },
    { text: "e^{iπ}=−1≠1." },
  ],
  solution: {
    steps: [
      { description: "For m=1/2, single-valuedness requires e^{i(1/2)(2π)}=e^{iπ}=1." },
      { description: "But e^{iπ}=−1, not 1 — the condition fails." },
      { description: "This means Φ_{1/2}(φ+2π)=−Φ_{1/2}(φ)≠Φ_{1/2}(φ): the function takes two different values at the same physical point, so it isn't a valid wavefunction." },
    ],
    finalAnswer: "e^{iπ}=−1≠1, so m=1/2 fails single-valuedness — the wavefunction would disagree with itself at the same physical point.",
  },
  explanation: {
    correctIdea: "This is a concrete, checkable numerical failure, not just an abstract rule — computing the specific number e^{iπ} makes the exclusion explicit.",
    whyCorrect: "This directly reproduces the lesson's general argument for this one specific, easily-checked case.",
    whyWrong: ["Simply stating 'half-integers are excluded' without doing the e^{iπ}=−1 computation doesn't demonstrate the actual mechanism."],
  },
};
