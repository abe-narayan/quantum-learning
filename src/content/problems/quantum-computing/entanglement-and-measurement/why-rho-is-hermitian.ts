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
    placeholder: "Start from the general rule for |a⟩⟨b|, then set a = b...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["dagger", "conjugate transpose", "conjugate-transpose", "adjoint", "hermitian conjugate", "conjugate and transpose"],
        missingFeedback:
          "You have described what reversing an outer product does. Name the operation you were reversing it under, the one this whole claim is a statement about.",
      },
      {
        phrases: ["outer product", "reverses", "reversing", "swaps the two", "swaps ket and bra", "swapping the ket", "exchanges the two", "flips the order", "flips", "same ket", "same state", "same vector", "identical matrix", "identical operator", "gives back the same", "unchanged", "symmetric"],
        missingFeedback:
          "You have named the operation. Now apply it to this particular object and say what comes back, given that nothing distinguishes the ket from the bra here.",
      },
    ],
    incorrectFeedback: "Try the general rule first: apply the operation to |a⟩⟨b| and see what comes out, then specialize.",
    partialFeedback: "Specialize the general rule to the case a=b=ψ, then compare the result with what you started from.",
    modelAnswers: [
      "Taking the dagger of an outer product reverses it: (|a><b|)-dagger = |b><a|. Here the ket and the bra are built from one state, so reversing gives back the identical operator, which is exactly what rho-dagger = rho means.",
      "The Hermitian conjugate of |psi><psi| swaps the ket and the bra, but both are psi, so nothing changes and you get the same matrix back.",
    ],
  },
  hints: [
    { text: "Start from a general |a⟩⟨b|. What is (|a⟩⟨b|)†, according to the rule from the lesson?" },
    { text: "Now set |a⟩=|b⟩=|ψ⟩, as in the definition of ρ." },
    { text: "What does the rule's output become when the two kets coincide?" },
  ],
  solution: {
    steps: [
      { description: "In general, $(|a\\rangle\\langle b|)^\\dagger=|b\\rangle\\langle a|$." },
      { description: "Set $|a\\rangle=|b\\rangle=|\\psi\\rangle$: $\\rho^\\dagger=(|\\psi\\rangle\\langle\\psi|)^\\dagger=|\\psi\\rangle\\langle\\psi|=\\rho$." },
    ],
    finalAnswer: "ρ†=ρ because reversing an outer product built from the same ket on both sides gives back the identical matrix.",
  },
  explanation: {
    correctIdea: "The dagger of |a⟩⟨b| is |b⟩⟨a|; with a=b=ψ that leaves the operator unchanged.",
    whyCorrect: "This holds for any |ψ⟩ at all, with no special property required beyond ρ being built from a single ket outer-producted with itself.",
    whyWrong: ["Checking Hermiticity on one specific example (like |0⟩ or |+⟩) doesn't prove it holds in general."],
  },
};
