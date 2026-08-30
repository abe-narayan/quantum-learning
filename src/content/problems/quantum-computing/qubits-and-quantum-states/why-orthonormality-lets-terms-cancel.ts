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
      {
        phrases: ["orthonormal", "orthogonal", "zero overlap", "perpendicular"],
        missingFeedback:
          "You have identified which terms drop out. Now name the property of the basis that makes their overlaps come out to zero.",
      },
      // "⟨0|1⟩" strips to the two tokens "0 1", which the validator will match
      // against any answer that mentions |0⟩ somewhere before |1⟩, which is
      // every answer to this question. Naming both brackets together keeps the
      // symbolic route open without making the group free.
      {
        phrases: ["cross term", "cross-term", "mixed term", "off-diagonal term", "⟨0|1⟩ and ⟨1|0⟩", "0|1⟩ and ⟨1|0", "two middle terms"],
        missingFeedback:
          "You have named the property of the basis. Now say which of the four terms it actually kills, so it is clear where the zeros land.",
      },
    ],
    incorrectFeedback:
      "Think about which specific terms vanish: the ones pairing |0⟩ from one ket with |1⟩ from the other. What property of the basis makes those specific overlaps zero?",
    partialFeedback:
      "Name which of the four terms vanish, and then name the property of the basis that makes exactly those two disappear.",
    modelAnswers: [
      "The two cross terms involve <0|1> and <1|0>, and both of those are zero because the computational basis is orthonormal. So only the two matching terms survive.",
      "When you distribute, the mixed terms pair up different basis states, and different basis states are orthogonal, so their overlap is zero. That is what makes the two middle terms vanish.",
    ],
  },
  hints: [
    { text: "Distribute both kets and write all four resulting brackets out, each with its coefficient." },
    { text: "Two of the four brackets pair a |0⟩ from one side with a |1⟩ from the other. Mark those two." },
    { text: "Evaluate those two brackets using the defining property of the computational basis. What number do they give?" },
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
    whyWrong: ["Attributing the cancellation to normalization alone misses the point. Normalization is a separate condition (⟨ψ|ψ⟩=1) about a single state, not about the mutual overlap of two different basis states."],
  },
};
