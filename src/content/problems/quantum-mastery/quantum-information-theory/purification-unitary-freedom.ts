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
      {
        phrases: ["trace", "partial trace", "traced out", "tracing out"],
        missingFeedback:
          "The reduced state is not the whole state. Say what operation you apply to the global projector to get it, because that operation is what makes W invisible.",
      },
      {
        phrases: ["unitary", "cancels", "cyclic", "w w-dagger", "identity"],
        missingFeedback:
          "You have named the operation. Now say what happens to W and its dagger underneath it, and what they come to when they meet.",
      },
    ],
    incorrectFeedback:
      "Do the computation rather than asserting the answer. Write down what rho_A is in terms of the new purification, then move the W and its adjoint around inside the operation that produces rho_A and see what they do to each other. Then ask the mirror question: had W acted on A instead, what would be left sitting on either side of rho_A?",
    partialFeedback: "Good start. The answer is not finished until you say why the cancellation depends on which side W sits. Run the same computation with W acting on A and say what survives.",
    modelAnswers: [
      "rho_A is the partial trace over B, and under that trace a unitary acting only on B can be moved around by cyclicity so that W and W-dagger meet and cancel to the identity. So rho_A is untouched. A unitary on A is not traced over at all; it conjugates rho_A directly, which generally changes it.",
      "Tracing out B kills any B-only unitary: W W-dagger becomes the identity inside the trace, so nothing about A's reduced state changes. On the A side there is no trace to absorb it, so the state really is conjugated.",
    ],
  },
  hints: [
    { text: "Write the new purification as (I_A ⊗ W_B)|psi>_AB for some unitary W_B." },
    { text: "Compute rho_A from that state. The B-side operators sit inside an operation that acts only on B; ask whether they can be moved past each other there." },
    { text: "What is WW^dagger, and where does that factor end up?" },
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
    whyCorrect: "Tr_B[(I⊗W)σ(I⊗W)^dagger] = Tr_B(σ) for any σ and any unitary W on B, a direct consequence of the trace's cyclic property restricted to the B factor, independent of what σ is.",
    whyWrong: ["A unitary applied to A instead would appear directly as U rho_A U^dagger after the partial trace, generally a different state unless U happens to commute with rho_A."],
  },
};
