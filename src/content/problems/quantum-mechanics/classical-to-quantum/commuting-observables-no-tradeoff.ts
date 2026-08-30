import type { ConceptualProblem } from "@/lib/problems/types";

export const commutingObservablesNoTradeoff: ConceptualProblem = {
  meta: {
    slug: "commuting-observables-no-tradeoff",
    title: "Why Commuting Observables Have No Uncertainty Trade-off",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["uncertainty", "commutators"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain, using the general uncertainty relation, why two commuting observables ($[A,B]=0$) are never forced into an uncertainty trade-off.",
    placeholder: "Explain using the formula...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["commutator is zero", "[a,b]=0", "commute", "right-hand side is zero", "bound is zero"],
        missingFeedback:
          "The relation has a right-hand side built out of a specific object. Say what that object is for two observables like these, and what its value comes out to.",
      },
      {
        phrases: ["no restriction", "can both be sharp", "simultaneously definite", "no trade-off", "no constraint"],
        missingFeedback:
          "You have the value of the bound. Now say what a bound of that size actually forbids, and what that means for measuring both sharply.",
      },
    ],
    incorrectFeedback: "You said commuting observables 'are compatible', which renames the conclusion. Substitute a vanishing commutator into the general relation, evaluate its right-hand side, and then say what an inequality with that right-hand side actually forbids.",
    partialFeedback: "Now connect the vanishing commutator to what it means for ΔA and ΔB.",
    modelAnswers: [
      "The general uncertainty relation bounds the product of the spreads by half the magnitude of the expectation of the commutator. If [A,B]=0 then the right-hand side is zero, so the bound is zero and there is no constraint at all: both can be sharp at once.",
      "Two observables that commute make the right-hand side of the inequality vanish, so the relation only says the product of uncertainties is at least zero, which is no restriction. They can be simultaneously definite.",
    ],
  },
  hints: [
    { text: "Write the general relation down with its right-hand side intact, before assuming anything about A and B." },
    { text: "Now impose the hypothesis on the right-hand side alone. What number does it become?" },
    { text: "You are left with a product of two non-negative quantities being at least that number. Ask which pairs of values that rules out, and answer honestly: which ones does it actually exclude?" },
  ],
  solution: {
    steps: [
      { description: "The uncertainty relation is $\\Delta A\\,\\Delta B \\ge \\tfrac12|\\langle[A,B]\\rangle|$." },
      { description: "If $[A,B]=0$, the right-hand side is exactly $0$ for every state." },
      { description: "$\\Delta A\\,\\Delta B \\ge 0$ is trivially true and imposes no lower bound, so both uncertainties can be made arbitrarily small (even simultaneously zero, at a shared eigenstate) without contradiction." },
    ],
    finalAnswer: "Commuting observables have a vanishing right-hand side, so the relation imposes no trade-off at all.",
  },
  explanation: {
    correctIdea: "Uncertainty trade-offs are a consequence specifically of non-commuting observables.",
    whyCorrect: "The derivation shows the bound comes entirely from the commutator's expectation value: zero commutator, zero bound.",
    whyWrong: ["Claiming commuting observables are 'always' simultaneously definite for every state overstates it. The relation says only that they CAN be, for instance at a shared eigenstate, not that they always are in an arbitrary state."],
  },
};
