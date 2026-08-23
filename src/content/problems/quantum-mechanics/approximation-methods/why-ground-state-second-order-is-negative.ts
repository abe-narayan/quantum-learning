import type { ConceptualProblem } from "@/lib/problems/types";

export const whyGroundStateSecondOrderIsNegative: ConceptualProblem = {
  meta: {
    slug: "why-ground-state-second-order-is-negative",
    title: "Why the Ground State's Second-Order Correction Is Always ≤0",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["perturbation-theory", "conceptual"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-independent-perturbation-theory"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the formula E_n^(2)=Σ_{m≠n}|H'_mn|²/(E_n^(0)-E_m^(0)), explain why E_0^(2) (the GROUND state's second-order correction specifically) can never be positive.",
    placeholder: "For the ground state, every other E_m^(0) is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["every other", "all m", "E_m", "greater", "higher"],
      ["denominator", "negative", "each term"],
    ],
    incorrectFeedback: "Address what sign E_0^(0)-E_m^(0) has for every m≠0, given that 0 is the ground state.",
    partialFeedback: "Good — now connect that sign directly to the sign of each term, and hence the whole sum.",
  },
  hints: [
    { text: "The ground state has the LOWEST energy, by definition — every other E_m^(0) > E_0^(0)." },
    { text: "So E_0^(0)-E_m^(0) is negative for every m≠0 in the sum." },
    { text: "|H'_m0|² is always ≥0, so each term (positive)/(negative) is ≤0 — and a sum of non-positive terms is non-positive." },
  ],
  solution: {
    steps: [
      { description: "Since 0 labels the ground state, E_0^(0) < E_m^(0) for every other m, so the denominator E_0^(0)-E_m^(0) is strictly negative in every term of the sum." },
      { description: "The numerator |H'_m0|² is a squared magnitude, always ≥0." },
      { description: "Each term is therefore (non-negative)/(negative) ≤ 0, so the whole sum E_0^(2) ≤ 0." },
    ],
    finalAnswer: "Every term in the sum has a negative denominator (since E_0 is the lowest energy) and a non-negative numerator, so E_0^(2) ≤ 0 always.",
  },
  explanation: {
    correctIdea: "This is a general structural fact about second-order perturbation theory applied specifically to the ground state — not something that needs checking case by case.",
    whyCorrect: "Matches the sign argument directly, and is consistent with the anharmonic oscillator worked example's negative E_0^(2) value.",
    whyWrong: ["This sign argument does NOT generalize to excited states — for n>0, some E_m^(0) are below E_n^(0) and some above, so E_n^(2) can have either sign."],
  },
};
