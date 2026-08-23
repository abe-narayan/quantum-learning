import type { ConceptualProblem } from "@/lib/problems/types";

export const maximallyMixedInvarianceProof: ConceptualProblem = {
  meta: {
    slug: "maximally-mixed-invariance-proof",
    title: "Proving U(I/2)U† = I/2 for Any Unitary U",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["unitary-evolution", "proof"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"],
  },
  question: {
    type: "conceptual",
    prompt: "Prove that U(I/2)U†=I/2 for any unitary U, not just Hadamard — using only UU†=I and linearity of scalar multiplication.",
    placeholder: "Factor the 1/2 out and simplify UU†...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["factor", "1/2 out", "scalar", "uu†", "uu^\\dagger"],
      ["identity", "= i", "unitary"],
    ],
    incorrectFeedback: "Pull the scalar 1/2 out of U(I/2)U† first, then simplify what's left using the definition of unitary.",
    partialFeedback: "Good — now be explicit that UIU†=UU† and that this equals I by the definition of unitarity.",
  },
  hints: [
    { text: "U(I/2)U† = (1/2) U I U† — the scalar 1/2 factors out freely." },
    { text: "UIU† = UU† since multiplying by the identity does nothing." },
    { text: "UU† = I by the very definition of a unitary matrix." },
  ],
  solution: {
    steps: [
      { description: "$U(I/2)U^\\dagger = \\tfrac12 UIU^\\dagger$ — the scalar factors out of matrix multiplication." },
      { description: "$UIU^\\dagger = UU^\\dagger$, since multiplying by the identity matrix changes nothing." },
      { description: "$UU^\\dagger = I$ by the defining property of a unitary matrix, so the whole expression is $\\tfrac12I=I/2$." },
    ],
    finalAnswer: "U(I/2)U† = (1/2)UU† = (1/2)I = I/2, for any unitary U whatsoever.",
  },
  explanation: {
    correctIdea: "The proof uses nothing specific to any particular gate — only that U is unitary, meaning UU†=I by definition.",
    whyCorrect: "This shows the maximally mixed state's invariance under Hadamard (checked in the lesson) is a special case of a fully general fact.",
    whyWrong: ["Checking this only for H, X, Y, Z individually would only establish it for those specific gates, not for every unitary as the question asks."],
  },
};
