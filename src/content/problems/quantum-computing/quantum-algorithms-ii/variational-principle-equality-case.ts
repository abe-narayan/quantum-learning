import type { ConceptualProblem } from "@/lib/problems/types";

export const variationalPrincipleEqualityCase: ConceptualProblem = {
  meta: {
    slug: "variational-principle-equality-case",
    title: "When Does ⟨ψ|H|ψ⟩ Exactly Equal E₀?",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["vqe", "variational-principle"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the eigenbasis expansion ⟨ψ|H|ψ⟩=Σᵢ|cᵢ|²Eᵢ, prove that equality (⟨ψ|H|ψ⟩=E₀ exactly) holds if and only if |ψ⟩=|φ₀⟩ (assuming no degeneracy at E₀).",
    placeholder: "Consider what happens to the sum if any cᵢ for i≠0 is nonzero...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["strictly greater", "e_i > e_0", "any nonzero", "increases the sum"],
      ["only when", "all weight on", "c_0=1", "pure ground state"],
    ],
    incorrectFeedback: "Consider: if any coefficient c_i (i≠0) is nonzero, does that term's contribution to the sum ever equal what it would contribute if all the weight were on E₀ instead?",
    partialFeedback: "Good — now state explicitly why any nonzero weight on an excited state strictly increases the sum above E₀.",
  },
  hints: [
    { text: "⟨ψ|H|ψ⟩=Σᵢ|cᵢ|²Eᵢ, and Σᵢ|cᵢ|²=1." },
    { text: "If any cᵢ≠0 for i≠0, that term contributes |cᵢ|²Eᵢ > |cᵢ|²E₀ (since Eᵢ>E₀, no degeneracy)." },
    { text: "This makes the whole sum strictly greater than E₀·Σ|cᵢ|²=E₀." },
  ],
  solution: {
    steps: [
      { description: "If |ψ⟩=|φ₀⟩ exactly, c₀=1 and every other cᵢ=0, giving ⟨ψ|H|ψ⟩=E₀ directly." },
      { description: "If any cᵢ≠0 for i≠0 (with Eᵢ>E₀ strictly, no degeneracy), that term contributes |cᵢ|²Eᵢ, strictly more than |cᵢ|²E₀ would." },
      { description: "Summing, the total is then strictly greater than E₀·(Σ|cᵢ|²)=E₀·1=E₀." },
    ],
    finalAnswer: "Equality holds exactly when all the weight is on |φ₀⟩ (c₀=1, all other cᵢ=0) — any nonzero weight elsewhere strictly increases the expectation value above E₀.",
  },
  explanation: {
    correctIdea: "The inequality in the variational principle's proof is strict unless the state is entirely the ground eigenstate.",
    whyCorrect: "This precisely explains why VQE's optimizer is actually looking for something specific (the ground state itself), not just 'a low-ish energy.'",
    whyWrong: ["Without the no-degeneracy assumption, a state could be any superposition purely within the degenerate ground-energy eigenspace and still achieve equality — worth noting as the one caveat to this otherwise clean result."],
  },
};
