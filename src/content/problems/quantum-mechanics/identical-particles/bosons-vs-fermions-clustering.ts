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
    prompt: "Contrast symmetrize(a,a) and antisymmetrize(a,a) directly — what does each give, and what does this imply about bosons vs. fermions occupying the same state?",
    placeholder: "symmetrize(a,a) gives... while antisymmetrize(a,a) gives...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["symmetrize", "2", "nonzero", "valid state"],
      ["antisymmetrize", "zero", "vanishes", "does not exist"],
    ],
    incorrectFeedback: "State the explicit result of BOTH symmetrize(a,a) and antisymmetrize(a,a), not just one of them.",
    partialFeedback: "Good — now make the contrast between the two explicit, and connect it to bosons vs. fermions.",
  },
  hints: [
    { text: "symmetrize(a,a): |a⟩⊗|a⟩+|a⟩⊗|a⟩=2|a⟩⊗|a⟩ — nonzero, normalizes fine." },
    { text: "antisymmetrize(a,a): |a⟩⊗|a⟩−|a⟩⊗|a⟩=0 — the zero vector, cannot be normalized." },
    { text: "Bosons use the symmetric combination (no restriction); fermions use the antisymmetric one (exclusion)." },
  ],
  solution: {
    steps: [
      { description: "symmetrize(a,a) = |a⟩⊗|a⟩+|a⟩⊗|a⟩ = 2|a⟩⊗|a⟩ — a nonzero vector that normalizes without any issue." },
      { description: "antisymmetrize(a,a) = |a⟩⊗|a⟩−|a⟩⊗|a⟩ = 0 — the zero vector, which cannot represent any physical state." },
      { description: "Since bosons use the symmetric combination, two bosons CAN occupy the same state; since fermions use the antisymmetric combination, two fermions CANNOT — this is the Pauli exclusion principle, read directly off the two constructions." },
    ],
    finalAnswer: "symmetrize(a,a)=2|a⟩⊗|a⟩ (valid, nonzero); antisymmetrize(a,a)=0 (invalid) — so bosons can share a state, fermions cannot.",
  },
  explanation: {
    correctIdea: "Placing both cases side by side makes the asymmetry between bosons and fermions completely explicit, rather than treating exclusion as an isolated fact about fermions alone.",
    whyCorrect: "Matches both this lesson's and the previous lesson's explicit constructions exactly.",
    whyWrong: ["Describing only the fermion case misses that the SAME mathematical operation, applied to bosons, gives the opposite (unrestricted) conclusion — the contrast is the point."],
  },
};
