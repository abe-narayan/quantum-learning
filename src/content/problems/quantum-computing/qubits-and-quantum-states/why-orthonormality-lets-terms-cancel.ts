import type { ConceptualProblem } from "@/lib/problems/types";

export const whyOrthonormalityLetsTermsCancel: ConceptualProblem = {
  meta: {
    slug: "why-orthonormality-lets-terms-cancel",
    title: "Why Orthonormality Simplifies Inner Products",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/dirac-notation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["dirac-notation", "orthonormality", "inner-product"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/dirac-notation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "When you expand $\\langle\\phi|\\psi\\rangle$ by distributing both kets into basis-state terms, two of the four resulting terms vanish. Explain why, and what property of the computational basis makes this happen.",
    placeholder: "Two of the cross terms involve...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["orthonormal", "orthogonal", "zero overlap", "perpendicular"],
      ["cross term", "cross-term", "mixed term", "⟨0|1⟩", "⟨1|0⟩"],
    ],
    incorrectFeedback:
      "Think about which specific terms vanish: the ones pairing |0⟩ from one ket with |1⟩ from the other. What property of the basis makes those specific overlaps zero?",
    partialFeedback:
      "You're close — be explicit about which terms vanish (the cross terms, like ⟨0|1⟩) and why (orthonormality of the basis).",
  },
  hints: [
    { text: "Distributing ⟨φ|ψ⟩ produces four terms: ⟨0|0⟩, ⟨0|1⟩, ⟨1|0⟩, and ⟨1|1⟩, each multiplied by the appropriate coefficients." },
    { text: "Two of these four terms mix a |0⟩ from one side with a |1⟩ from the other — the 'cross terms'." },
    { text: "Orthonormality says exactly these cross terms are zero." },
  ],
  solution: {
    steps: [
      {
        description:
          "Expanding $\\langle\\phi|\\psi\\rangle=(\\phi_0^*\\langle0|+\\phi_1^*\\langle1|)(\\psi_0|0\\rangle+\\psi_1|1\\rangle)$ produces four terms: $\\phi_0^*\\psi_0\\langle0|0\\rangle$, $\\phi_0^*\\psi_1\\langle0|1\\rangle$, $\\phi_1^*\\psi_0\\langle1|0\\rangle$, $\\phi_1^*\\psi_1\\langle1|1\\rangle$.",
      },
      {
        description:
          "The two middle 'cross terms' contain $\\langle0|1\\rangle$ and $\\langle1|0\\rangle$, both of which are zero because the computational basis is orthonormal (each basis state has zero overlap with the other).",
      },
    ],
    finalAnswer: "The cross terms vanish because $\\langle0|1\\rangle=\\langle1|0\\rangle=0$: the basis states are orthonormal.",
  },
  explanation: {
    correctIdea:
      "Orthonormality (⟨0|0⟩=⟨1|1⟩=1, ⟨0|1⟩=⟨1|0⟩=0) is exactly the property that lets any inner product collapse to a simple formula without doing full matrix multiplication.",
    whyCorrect:
      "This is why ⟨φ|ψ⟩ = φ₀*ψ₀ + φ₁*ψ₁ works directly: the two surviving terms are the ones pairing matching basis states, weighted by ⟨0|0⟩=⟨1|1⟩=1.",
    whyWrong: ["Attributing the cancellation to normalization alone misses the point — normalization is a separate condition (⟨ψ|ψ⟩=1) about a single state, not about two different basis states' mutual overlap."],
  },
};
