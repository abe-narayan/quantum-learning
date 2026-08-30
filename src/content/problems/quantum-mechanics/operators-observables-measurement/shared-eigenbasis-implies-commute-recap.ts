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
      {
        phrases: ["rescale", "multiply by the eigenvalues", "multiplies by the eigenvalue", "scalars commute", "numbers commute", "eigenvalues commute"],
        missingFeedback:
          "Apply both operators to one shared eigenvector and say what each of them does to it. The reason the order stops mattering is a fact about the objects that come out.",
      },
      {
        phrases: ["linearity", "linear", "any vector is a combination of basis vectors", "extends to the whole space"],
        missingFeedback:
          "You have shown the two agree on each basis vector. Now say what lets you get from agreeing on a basis to agreeing on every vector.",
      },
    ],
    incorrectFeedback: "You asserted the conclusion, or you checked one vector and stopped. Two separate steps are needed: what each of AB and BA actually does to a single shared eigenvector, and why an identity holding on a basis is enough to hold on every vector in the space.",
    partialFeedback: "You have the single-eigenvector step. The other half is the jump from a basis to the whole space: name the property of operators that lets an identity verified on basis vectors extend to every vector.",
    modelAnswers: [
      "On a shared eigenvector, A just multiplies by the eigenvalue a_i and B by b_i, so AB and BA both give a_i b_i times the same vector; ordinary numbers commute, so the two agree there. Since any vector is a combination of basis vectors, linearity extends the agreement to the whole space.",
      "Both operators only rescale each shared eigenvector, and eigenvalues are scalars that commute, so the order does not matter on any basis vector. By linearity that is enough to conclude AB = BA everywhere.",
    ],
  },
  hints: [
    { text: "Apply B to a shared eigenvector first. What comes out, and how does it differ from the vector you started with?" },
    { text: "Now apply A to that. Do the same in the other order and compare the two results as expressions, not as words." },
    { text: "You now know AB and BA agree on each of the |e_i>. Write an arbitrary vector in terms of that basis and ask what property of A and B lets you carry the agreement across." },
  ],
  solution: {
    steps: [
      { description: "$AB|e_i\\rangle = a_ib_i|e_i\\rangle = b_ia_i|e_i\\rangle = BA|e_i\\rangle$, since ordinary number multiplication commutes, so the order of applying A and B does not matter on a shared eigenvector." },
      { description: "Since any vector is a linear combination of the $|e_i\\rangle$'s, and both $AB$ and $BA$ are linear, agreeing on the basis forces $AB=BA$ on every vector." },
    ],
    finalAnswer: "AB and BA both equal a_i*b_i on each shared eigenvector (ordinary numbers commute), and linearity extends this from the basis to the whole space.",
  },
  explanation: {
    correctIdea: "This is the easy direction of the commute-iff-shared-eigenbasis theorem.",
    whyCorrect: "It needs only the eigenvalue equations and linearity, with no additional assumptions.",
    whyWrong: ["Checking that it 'seems true' for one specific matrix is not a proof. The argument has to work for the eigenbasis in general, which is what the eigenvalue-multiplication step provides."],
  },
};
