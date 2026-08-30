import type { ConceptualProblem } from "@/lib/problems/types";

export const bosonsVsFermionsClustering: ConceptualProblem = {
  meta: {
    slug: "bosons-vs-fermions-clustering",
    title: "Why Bosons Can Cluster and Fermions Cannot",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["pauli-exclusion", "conceptual"],
    prerequisites: ["quantum-mechanics/identical-particles/the-pauli-exclusion-principle"],
  },
  question: {
    type: "conceptual",
    prompt: "Contrast symmetrize(a,a) and antisymmetrize(a,a) directly. What does each give, and what does this imply about bosons versus fermions occupying the same state?",
    placeholder: "symmetrize(a,a) gives... while antisymmetrize(a,a) gives...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["nonzero", "non-zero", "not zero", "valid state", "gives 2", "equals 2", "factor of 2", "twice", "doubl", "survives"],
        missingFeedback:
          "Do the symmetric case first: say what it actually evaluates to, and whether that is a legitimate state.",
      },
      // Bare "zero" is a substring of "nonzero", so an answer that named only
      // the boson case ("symmetrize(a,a) is nonzero, so bosons can share")
      // satisfied the fermion group too and graded as fully correct.
      {
        phrases: ["antisymmetrize", "is zero", "gives zero", "equals zero", "the zero vector", "zero vector", "vanishes", "vanish", "does not exist", "cannot exist"],
        missingFeedback:
          "You have the symmetric case. Now do the other one, say what it evaluates to, and say what that means for two fermions in one state.",
      },
    ],
    incorrectFeedback: "You described the exclusion principle instead of computing. Take the two combining rules and feed each the same single-particle state into both of its slots. Write down the literal expression each one produces, then read the physics off those two expressions.",
    partialFeedback: "Now make the contrast between the two explicit, and connect it to bosons versus fermions.",
    modelAnswers: [
      "symmetrize(a,a) gives 2|a>|a>, a perfectly valid nonzero state, so two bosons can sit in the same state. antisymmetrize(a,a) gives the zero vector, which is not a state at all, so two fermions in the same state cannot exist.",
      "The symmetric combination survives with a factor of 2; the antisymmetric one vanishes identically. That is why bosons can share a state and fermions cannot.",
    ],
  },
  hints: [
    { text: "Both rules take |a⟩ and |b⟩ and combine them. Write each rule out in full before substituting anything." },
    { text: "Now set b = a in each. One of the two expressions adds two identical things; the other subtracts them." },
    { text: "Look at what each result is as a vector, and ask which of the two can be normalized. That is the whole difference between the two particle families." },
  ],
  solution: {
    steps: [
      { description: "symmetrize(a,a) = |a⟩⊗|a⟩+|a⟩⊗|a⟩ = 2|a⟩⊗|a⟩, a nonzero vector that normalizes without any issue." },
      { description: "antisymmetrize(a,a) = |a⟩⊗|a⟩−|a⟩⊗|a⟩ = 0, the zero vector, which cannot represent any physical state." },
      { description: "Since bosons use the symmetric combination, two bosons CAN occupy the same state; since fermions use the antisymmetric combination, two fermions CANNOT. That is the Pauli exclusion principle, read directly off the two constructions." },
    ],
    finalAnswer: "symmetrize(a,a)=2|a⟩⊗|a⟩ (valid, nonzero); antisymmetrize(a,a)=0 (invalid). So bosons can share a state and fermions cannot.",
  },
  explanation: {
    correctIdea: "Placing both cases side by side makes the asymmetry between bosons and fermions completely explicit, rather than treating exclusion as an isolated fact about fermions alone.",
    whyCorrect: "Matches both this lesson's and the previous lesson's constructions.",
    whyWrong: ["Describing only the fermion case misses that the SAME mathematical operation, applied to bosons, gives the opposite, unrestricted conclusion. The contrast is the point."],
  },
};
