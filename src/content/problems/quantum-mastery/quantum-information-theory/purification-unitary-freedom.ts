import type { ConceptualProblem } from "@/lib/problems/types";

export const purificationUnitaryFreedom: ConceptualProblem = {
  meta: {
    slug: "purification-unitary-freedom",
    title: "Why Purifications of the Same State Are Related by a Unitary on B Alone",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["purification", "non-uniqueness"],
    prerequisites: ["quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Two purifications |psi>_AB and |phi>_AB of the same mixed state rho_A are always related by some unitary W acting only on system B (never on A). Explain why acting with W only on B can never change rho_A, and why a unitary acting on A instead generally would.",
    placeholder: "Think about what partial trace over B does to a unitary applied only to B...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["trace", "partial trace", "traced out", "tr_b"],
      ["unitary", "cancels", "cyclic", "w w-dagger", "identity"],
    ],
    incorrectFeedback:
      "Write rho_A = Tr_B[(I⊗W)|psi><psi|(I⊗W)^dagger] and use the cyclic property of partial trace/trace to show the W's cancel exactly when they act only on the traced-out system.",
    partialFeedback: "Good start -- now make explicit why the cancellation only works when W acts on B, not on A.",
  },
  hints: [
    { text: "Write the new purification as (I_A ⊗ W_B)|psi>_AB for some unitary W_B." },
    { text: "Compute Tr_B[(I⊗W)|psi><psi|(I⊗W)^dagger] using the cyclic property of trace on the B factor." },
    { text: "The W and W-dagger factors are entirely inside the trace over B and cancel via WW^dagger = I." },
  ],
  solution: {
    steps: [
      { description: "Let $|\\phi\\rangle_{AB} = (I_A\\otimes W_B)|\\psi\\rangle_{AB}$ for unitary $W_B$ acting only on $B$." },
      { description: "$\\text{Tr}_B(|\\phi\\rangle\\langle\\phi|) = \\text{Tr}_B\\big[(I\\otimes W)|\\psi\\rangle\\langle\\psi|(I\\otimes W^\\dagger)\\big]$" },
      { description: "The partial trace over B can absorb the B-only unitary via its cyclic property, and $W^\\dagger W=I$ cancels it exactly, leaving $\\text{Tr}_B(|\\psi\\rangle\\langle\\psi|)=\\rho_A$ unchanged." },
    ],
    finalAnswer: "Any unitary acting only on B leaves rho_A = Tr_B(|psi><psi|) exactly unchanged, since the partial trace over B can absorb and cancel it via WW-dagger=I; a unitary on A instead would directly conjugate rho_A itself, generally changing it.",
  },
  explanation: {
    correctIdea: "Partial trace over B is exactly the operation that makes a B-only unitary invisible to A's reduced state.",
    whyCorrect: "Tr_B[(I⊗W)σ(I⊗W)^dagger] = Tr_B(σ) for any σ and unitary W on B -- a direct consequence of the trace's cyclic property restricted to the B factor, independent of what σ is.",
    whyWrong: ["A unitary applied to A instead would appear directly as U rho_A U^dagger after the partial trace, generally a different state unless U happens to commute with rho_A."],
  },
};
