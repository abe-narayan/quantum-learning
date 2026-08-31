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
      {
        phrases: ["expand", "expansion", "eigenbasis", "eigenstate basis", "energy eigenstates", "expansion coefficients"],
        missingFeedback:
          "You cannot work with the trial state as it stands. Say which set of states you write it as a combination of, even though you do not know them explicitly.",
      },
      {
        phrases: ["greater than or equal", "at least e_0", "no smaller than", "lowest eigenvalue", "smallest eigenvalue", "ground energy is the smallest", "every e_n is at least", "none of them is below"],
        missingFeedback:
          "You have the weighted sum. Now use the one thing you know about the ground energy, and say how each energy in the sum compares with it.",
      },
      // Bare "sum of" matched any sentence containing "sum of the ..."; the
      // group is about Σ|c_n|²=1 specifically, so every phrase names what sums.
      {
        phrases: ["sum of the squared", "sum of |c", "coefficients sum", "normalization", "normalized", "sums to 1", "sums to one", "sum to 1", "sum to one", "add to 1", "add up to 1", "squared coefficients sum", "total weight is 1"],
        missingFeedback:
          "You have the inequality on each level. Now say what the weights add up to, and why that is what turns the bound into exactly E_0.",
      },
    ],
    incorrectFeedback: "You asserted the inequality or appealed to 'the ground state is lowest' without a calculation. Three ingredients have to appear and be used: a way of writing an arbitrary trial state in terms of H's own true eigenstates, a fact about how E_0 compares with the rest of the spectrum, and the constraint that the trial state is of unit length.",
    partialFeedback: "Some of the argument is there. Check it has all three moving parts: the change of basis, the comparison of E_0 with each E_n, and the length constraint on the trial state. Name whichever you left out.",
    modelAnswers: [
      "Expand the trial state in H's own eigenbasis: psi = sum c_n |n>. Then the expectation value is sum |c_n|^2 E_n. Every E_n is at least E_0 because E_0 is the lowest eigenvalue, and the squared coefficients sum to 1 by normalization, so the whole thing is greater than or equal to E_0.",
      "Write the trial function as an expansion over the energy eigenstates. The expectation value becomes a weighted average of the eigenvalues with weights that add up to 1. Since none of them is below the smallest eigenvalue, the average is no smaller than E_0.",
    ],
  },
  hints: [
    { text: "You do not need to know what H's true eigenvectors are, only that a complete set of them exists. Use that to rewrite the trial state." },
    { text: "Act with H on the rewritten state and take the inner product with itself. Orthogonality kills every cross term; write down what survives." },
    { text: "You now have a weighted average of the E_n. Ask what the smallest weight-bearing value in that average could be, and what the weights add up to." },
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
    correctIdea: "The proof needs no knowledge of what the true eigenstates are. It uses only that they exist and that E_0 is the smallest eigenvalue, by definition.",
    whyCorrect: "Matches the derivation in the lesson's Mathematical Development section.",
    whyWrong: ["Arguing from a specific trial family, such as the Gaussian, rather than a general expansion does not establish the theorem for all possible trial states."],
  },
};
