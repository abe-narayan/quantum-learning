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
      ["commutator is zero", "[a,b]=0", "commute", "right-hand side is zero", "bound is zero"],
      ["no restriction", "can both be sharp", "simultaneously definite", "no trade-off", "no constraint"],
    ],
    incorrectFeedback: "Start from ΔA·ΔB ≥ ½|⟨[A,B]⟩| — what happens to the right-hand side when [A,B]=0?",
    partialFeedback: "You're close — connect the vanishing commutator explicitly to what that means for ΔA and ΔB.",
  },
  hints: [
    { text: "Set [A,B]=0 directly into the uncertainty relation's right-hand side." },
    { text: "A bound of ΔA·ΔB ≥ 0 places what kind of restriction on ΔA and ΔB individually?" },
  ],
  solution: {
    steps: [
      { description: "The uncertainty relation is $\\Delta A\\,\\Delta B \\ge \\tfrac12|\\langle[A,B]\\rangle|$." },
      { description: "If $[A,B]=0$, the right-hand side is exactly $0$ for every state." },
      { description: "$\\Delta A\\,\\Delta B \\ge 0$ is trivially true and imposes no lower bound — both uncertainties can be made arbitrarily small (even simultaneously zero, at a shared eigenstate) without contradiction." },
    ],
    finalAnswer: "Commuting observables have a vanishing right-hand side, so the relation imposes no trade-off at all.",
  },
  explanation: {
    correctIdea: "Uncertainty trade-offs are a consequence specifically of non-commuting observables.",
    whyCorrect: "The derivation shows the bound comes entirely from the commutator's expectation value — zero commutator, zero bound.",
    whyWrong: ["Claiming commuting observables are 'always' simultaneously definite for every state overstates it — the relation only says they CAN be, e.g. at a shared eigenstate, not that they always are for an arbitrary state."],
  },
};
