import type { ConceptualProblem } from "@/lib/problems/types";

export const sharedEigenbasisImpliesCommuteRecap: ConceptualProblem = {
  meta: {
    slug: "shared-eigenbasis-implies-commute-recap",
    title: "Why a Shared Eigenbasis Forces Commuting",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["commutators", "compatible-observables"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why AB and BA must agree on every basis vector if {|e_i>} is a shared eigenbasis for both A and B, and why that's enough to conclude AB = BA everywhere.",
    placeholder: "Explain the shared-eigenbasis-implies-commute argument...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["rescale", "multiply by the eigenvalues", "AB|e_i> = a_i b_i |e_i>"],
      ["linearity", "any vector is a combination of basis vectors", "extends to the whole space"],
    ],
    incorrectFeedback: "Name both pieces: that applying A then B (or B then A) to a shared eigenvector just multiplies by the two eigenvalues in either order, and that agreeing on a basis extends to agreeing everywhere by linearity.",
    partialFeedback: "You're partway there — be explicit about why agreeing on a basis is enough (linearity).",
  },
  hints: [{ text: "What does AB|e_i> equal, in terms of the eigenvalues a_i and b_i?" }],
  solution: {
    steps: [
      { description: "$AB|e_i\\rangle = a_ib_i|e_i\\rangle = b_ia_i|e_i\\rangle = BA|e_i\\rangle$ — ordinary number multiplication commutes, so the order of applying A and B doesn't matter on a shared eigenvector." },
      { description: "Since any vector is a linear combination of the $|e_i\\rangle$'s, and both $AB$ and $BA$ are linear, agreeing on the basis forces $AB=BA$ on every vector." },
    ],
    finalAnswer: "AB and BA both equal a_i*b_i on each shared eigenvector (ordinary numbers commute), and linearity extends this from the basis to the whole space.",
  },
  explanation: {
    correctIdea: "This is the easy direction of the commute-iff-shared-eigenbasis theorem.",
    whyCorrect: "It only needs the eigenvalue equations and linearity — no additional assumptions.",
    whyWrong: ["Trying to argue this by checking it 'seems true' for a specific matrix example isn't a proof — the argument must work for the eigenbasis in general, which is exactly what the eigenvalue-multiplication step provides."],
  },
};
