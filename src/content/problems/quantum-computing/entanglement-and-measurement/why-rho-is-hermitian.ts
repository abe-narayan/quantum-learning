import type { ConceptualProblem } from "@/lib/problems/types";

export const whyRhoIsHermitian: ConceptualProblem = {
  meta: {
    slug: "why-rho-is-hermitian",
    title: "Why ρ=|ψ⟩⟨ψ| Is Always Hermitian",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["density-matrix", "hermitian", "proof"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why ρ=|ψ⟩⟨ψ| is Hermitian (ρ†=ρ) for every normalized state |ψ⟩, without picking a specific example.",
    placeholder: "Explain using the dagger of an outer product...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["dagger", "conjugate transpose", "adjoint"],
      ["outer product", "reverses", "same", "|ψ⟩⟨ψ|"],
    ],
    incorrectFeedback: "Try again — focus on what taking the dagger of an outer product |a⟩⟨b| does in general.",
    partialFeedback: "You're on the right track — be explicit about applying the general outer-product dagger rule to a=b=ψ.",
  },
  hints: [
    { text: "In general, (|a⟩⟨b|)† = |b⟩⟨a| — the dagger reverses the order and conjugates." },
    { text: "Now set |a⟩=|b⟩=|ψ⟩ specifically, as in ρ=|ψ⟩⟨ψ|." },
    { text: "What does |b⟩⟨a| become when a and b are the same ket?" },
  ],
  solution: {
    steps: [
      { description: "In general, $(|a\\rangle\\langle b|)^\\dagger=|b\\rangle\\langle a|$." },
      { description: "Set $|a\\rangle=|b\\rangle=|\\psi\\rangle$: $\\rho^\\dagger=(|\\psi\\rangle\\langle\\psi|)^\\dagger=|\\psi\\rangle\\langle\\psi|=\\rho$." },
    ],
    finalAnswer: "ρ†=ρ because reversing an outer product built from the same ket on both sides gives back the identical matrix.",
  },
  explanation: {
    correctIdea: "The dagger of |a⟩⟨b| is |b⟩⟨a|; with a=b=ψ this is literally unchanged.",
    whyCorrect: "This holds for any |ψ⟩ at all, with no special property required beyond ρ being built from a single ket outer-producted with itself.",
    whyWrong: ["Checking Hermiticity on one specific example (like |0⟩ or |+⟩) doesn't prove it holds in general."],
  },
};
