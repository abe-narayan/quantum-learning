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
      {
        phrases: ["every other", "all m", "greater", "higher", "above the ground", "excited"],
        missingFeedback:
          "Look at the levels being summed over. For this particular state, say where each of the remaining unperturbed energies sits relative to it.",
      },
      {
        phrases: ["denominator", "negative", "each term"],
        missingFeedback:
          "You have the ordering of the levels. Now push it into the formula: say what sign the top and the bottom of one summand carry, and therefore what sign the whole sum has.",
      },
    ],
    incorrectFeedback: "You checked the numerator and stopped, or you assumed corrections are small and therefore harmless. The sign lives elsewhere: work out, for the ground state specifically, what sign E_0^(0) minus E_m^(0) carries for each m in the sum.",
    partialFeedback: "You have the sign of the difference. Carry it through: say what sign that gives every summand, and what the total of a collection of quantities that all share one sign has to be.",
    modelAnswers: [
      "For the ground state every other unperturbed level is higher, so E_0 minus E_m is negative in every term of the sum. The numerator is a squared magnitude and so is never negative, so each term is negative or zero and the total cannot be positive.",
      "All m other than the ground state sit above the ground energy, which makes every denominator negative while the numerators are non-negative. Therefore the correction is at most zero.",
    ],
  },
  hints: [
    { text: "Look only at what sits underneath each fraction. It is E_0^(0) minus the energy of some other level." },
    { text: "Which level is E_0^(0)? Use the definition to decide how it compares with every E_m^(0) appearing in the sum." },
    { text: "The top of each fraction is a squared modulus. Combine the two signs and say what the whole sum can and cannot be." },
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
    correctIdea: "This is a general structural fact about second-order perturbation theory applied to the ground state, not something that needs checking case by case.",
    whyCorrect: "Matches the sign argument directly, and is consistent with the anharmonic oscillator worked example's negative E_0^(2) value.",
    whyWrong: ["This sign argument does NOT generalize to excited states. For n>0, some E_m^(0) lie below E_n^(0) and some above, so E_n^(2) can have either sign."],
  },
};
