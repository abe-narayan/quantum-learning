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
      {
        phrases: ["strictly greater", "e_i > e_0", "any nonzero", "increases the sum", "raises the sum", "pushes the sum", "strictly above", "strictly larger"],
        missingFeedback:
          "Suppose some coefficient other than c_0 is not zero. Say what that particular term contributes to the weighted sum, compared with what the ground term contributes.",
      },
      {
        phrases: ["only when", "only if", "if and only if", "all weight on", "all the weight", "c_0=1", "c0=1", "pure ground state", "entirely the ground", "exactly the ground", "is the ground state", "equals the ground state", "no weight on", "every other coefficient"],
        missingFeedback:
          "You have shown that excited weight pushes the value up. Now state the equality case itself: what must be true of every coefficient for the two sides to agree exactly?",
      },
    ],
    incorrectFeedback: "You proved the inequality again rather than its equality case. Take a state with some weight somewhere other than the lowest level and show the sum cannot land on E₀; then check the converse direction separately.",
    partialFeedback: "You have one direction. Supply the other: show that putting weight anywhere but the lowest level pushes the average up, which leaves equality no room.",
    modelAnswers: [
      "Write the expectation as a weighted average of the eigenvalues. Every E_i above the ground level is strictly greater than E_0, so any nonzero c_i raises the sum strictly above E_0. Equality therefore holds only when all the weight sits on the ground state, that is c_0=1 and every other coefficient zero.",
      "Since the excited levels are strictly larger than E_0, putting any weight there pushes the sum up. So you get E_0 exactly if and only if the state is entirely the ground eigenstate, with no weight on anything else.",
    ],
  },
  hints: [
    { text: "Write the expansion out with its two facts: the weighted sum, and the fact that the weights add to 1." },
    { text: "Suppose one weight above the lowest level fails to vanish. Compare that term with what the same weight would contribute sitting on the lowest level instead." },
    { text: "Add the comparison up over every term and see whether the total can still equal the lowest level. Then check the reverse: what does the state look like if it does?" },
  ],
  solution: {
    steps: [
      { description: "If |ψ⟩=|φ₀⟩ exactly, c₀=1 and every other cᵢ=0, giving ⟨ψ|H|ψ⟩=E₀ directly." },
      { description: "If any cᵢ≠0 for i≠0 (with Eᵢ>E₀ strictly, no degeneracy), that term contributes |cᵢ|²Eᵢ, strictly more than |cᵢ|²E₀ would." },
      { description: "Summing, the total is then strictly greater than E₀·(Σ|cᵢ|²)=E₀·1=E₀." },
    ],
    finalAnswer: "Equality holds when all the weight sits on |φ₀⟩ (c₀=1, every other cᵢ=0). Any nonzero weight elsewhere raises the expectation value strictly above E₀.",
  },
  explanation: {
    correctIdea: "The inequality in the variational principle's proof is strict unless the state is entirely the ground eigenstate.",
    whyCorrect: "This precisely explains why VQE's optimizer is actually looking for something specific (the ground state itself), not just 'a low-ish energy.'",
    whyWrong: ["Without the no-degeneracy assumption, a state could be any superposition within the degenerate ground-energy eigenspace and still achieve equality. That is the one caveat to an otherwise clean result."],
  },
};
