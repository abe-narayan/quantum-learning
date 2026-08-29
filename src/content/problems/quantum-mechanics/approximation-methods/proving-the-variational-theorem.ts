import type { ConceptualProblem } from "@/lib/problems/types";

export const provingTheVariationalTheorem: ConceptualProblem = {
  meta: {
    slug: "proving-the-variational-theorem",
    title: "Proving ⟨H⟩ ≥ E₀ for Any Normalized State",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/the-variational-method",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["variational-method", "conceptual"],
    prerequisites: ["quantum-mechanics/approximation-methods/the-variational-method"],
  },
  question: {
    type: "conceptual",
    prompt: "Sketch the proof that ⟨ψ_trial|H|ψ_trial⟩≥E₀ for any normalized ψ_trial, by expanding ψ_trial in H's own (unknown) true eigenbasis.",
    placeholder: "Expand ψ_trial = Σ c_n|n⟩. Then ⟨H⟩ = ...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["expand", "expansion", "sum", "eigenbasis", "eigenstate basis", "energy eigenstates", "expansion coefficients"],
      ["greater than or equal", "at least e_0", "no smaller than", "lowest eigenvalue", "smallest eigenvalue", "ground energy is the smallest", "every e_n is at least", "none of them is below"],
      ["sum of", "normalization", "normalized", "sums to 1", "sums to one", "sum to 1", "sum to one", "squared coefficients sum", "total weight is 1"],
    ],
    incorrectFeedback: "Write out the expansion ψ_trial=Σc_n|n⟩, compute ⟨H⟩ in terms of |c_n|² and E_n, and use E_n≥E_0 for every n plus Σ|c_n|²=1.",
    partialFeedback: "Good — make sure every piece (expansion, E_n≥E_0, normalization) appears explicitly in the argument.",
  },
  hints: [
    { text: "Any normalized state can be written as ψ_trial=Σ_n c_n|n⟩ in H's true eigenbasis, with Σ|c_n|²=1." },
    { text: "⟨H⟩=Σ_n|c_n|²E_n, since H|n⟩=E_n|n⟩ and the cross terms vanish by orthogonality." },
    { text: "Since E_n≥E_0 for every n (E_0 is the smallest), Σ|c_n|²E_n≥Σ|c_n|²E_0=E_0·Σ|c_n|²=E_0." },
  ],
  solution: {
    steps: [
      { description: "Expand ψ_trial=Σ_n c_n|n⟩ in H's own true (unknown) eigenbasis, with Σ_n|c_n|²=1 by normalization." },
      { description: "⟨ψ_trial|H|ψ_trial⟩=Σ_n|c_n|²E_n, using H|n⟩=E_n|n⟩ and orthogonality of distinct |n⟩." },
      { description: "Since E_0 is by definition the smallest eigenvalue, E_n≥E_0 for every n, so Σ|c_n|²E_n≥Σ|c_n|²E_0=E_0." },
      { description: "Therefore ⟨ψ_trial|H|ψ_trial⟩≥E_0, for any normalized ψ_trial." },
    ],
    finalAnswer: "⟨H⟩=Σ|c_n|²E_n≥Σ|c_n|²E_0=E_0, using E_n≥E_0 for all n and Σ|c_n|²=1.",
  },
  explanation: {
    correctIdea: "The proof needs no knowledge of what the true eigenstates actually ARE — it only uses that they exist and that E_0 is the smallest eigenvalue, by definition.",
    whyCorrect: "Matches the lesson's Mathematical Development section's derivation exactly.",
    whyWrong: ["Arguing from a SPECIFIC trial family (like the Gaussian) rather than a general expansion doesn't establish the theorem for all possible trial states."],
  },
};
