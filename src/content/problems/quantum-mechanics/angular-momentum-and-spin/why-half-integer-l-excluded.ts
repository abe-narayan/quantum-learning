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
      ["e^{i pi}", "e^{ipi}", "e^{iπ}", "e^(i pi)", "e^(iπ)", "e^ipi", "e^iπ", "-1", "−1", "minus one", "minus 1", "not equal to 1", "≠1", "≠ 1", "not 1"],
      ["multi-valued", "multivalued", "multi valued", "double-valued", "double valued", "two values", "two different values", "different value", "not single-valued", "not single valued", "fails single", "disagree", "inconsistent", "ill-defined", "not well-defined", "not well defined"],
    ],
    incorrectFeedback: "Substitute m=1/2 into the condition the wavefunction must satisfy after a full 2π turn, evaluate the resulting number, and say what its value means for the function.",
    partialFeedback: "Good. Now state explicitly what this means for the wavefunction's validity at a single physical point.",
  },
  hints: [
    { text: "Single-valuedness requires e^{im2π}=1." },
    { text: "Substitute m=1/2. What does the exponent become?" },
    { text: "Evaluate that exponential with Euler's formula. Does it satisfy the requirement from the first hint?" },
  ],
  solution: {
    steps: [
      { description: "For m=1/2, single-valuedness requires e^{i(1/2)(2π)}=e^{iπ}=1." },
      { description: "But e^{iπ}=−1, not 1, so the condition fails." },
      { description: "This means Φ_{1/2}(φ+2π)=−Φ_{1/2}(φ)≠Φ_{1/2}(φ): the function takes two different values at the same physical point, so it isn't a valid wavefunction." },
    ],
    finalAnswer: "e^{iπ}=−1≠1, so m=1/2 fails single-valuedness. The wavefunction would disagree with itself at the same physical point.",
  },
  explanation: {
    correctIdea: "This is a concrete, checkable numerical failure, not just an abstract rule. Computing the specific number e^{iπ} makes the exclusion explicit.",
    whyCorrect: "This directly reproduces the lesson's general argument for this one specific, easily-checked case.",
    whyWrong: ["Simply stating 'half-integers are excluded' without doing the e^{iπ}=−1 computation doesn't demonstrate the actual mechanism."],
  },
};
