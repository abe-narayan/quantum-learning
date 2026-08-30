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
    prompt: "Prove that U(I/2)U†=I/2 for any unitary U, not just Hadamard, using only UU†=I and linearity of scalar multiplication.",
    placeholder: "Factor the 1/2 out and simplify UU†...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // The question says "prove", so the wording a student who did the work
      // actually types is the symbolic chain, not prose about it. "1/2 u" and
      // "1/2 uu" carry that: they normalize to the whole tokens 1, 2, u, which
      // the prompt cannot supply (it writes I/2, never 1/2), so writing the
      // scalar in front of the matrices is what matches.
      {
        phrases: ["1/2 out", "half out", "pull out", "pulls out", "pulled out", "pull it out", "pull the scalar", "just a number", "just a scalar", "only a scalar", "move the 1/2", "factor the 1/2 out", "take the half outside", "comes out front", "out in front", "commutes with the matrices", "scalars commute", "scalar commutes", "1/2 u", "1/2 uu", "1/2 (u", "(1/2)u"],
        missingFeedback:
          "You applied the property U has by definition, but the plain number sitting inside the matrix product is still where it started. Say what you are allowed to do with such a number, and do that first.",
      },
      // "= i" and "=i" are gone: both strip to the single token "i", which is a
      // substring of nearly every English sentence, so this group matched any
      // submission at all. Bare "unitar" and "identity" are gone too: the prompt
      // hands the student "using only UU†=I". What is back is the *dagger*
      // forms ("u u dagger", "uu dagger"), which the prompt cannot supply,
      // because "U†" normalizes to a bare "u" and leaves no "dagger" token at
      // all. A student who writes UU^dagger has written the step; the question
      // never did.
      {
        phrases: ["defining property", "by definition of a unitary", "definition of unitarity", "what U satisfies by definition", "collapses to the identity", "collapses to I", "leaves the identity", "leaves behind the identity", "becomes the identity", "reduces to the identity", "is the identity", "gives the identity", "u u dagger", "uu dagger", "u dagger u", "unitarity", "unitary condition", "conjugate transpose", "adjoint", "inverse of u"],
        missingFeedback:
          "You dealt with the number, then stopped. Two matrices now sit next to each other; write down the equation they satisfy for every U, not just for H, and substitute it.",
      },
    ],
    incorrectFeedback: "You checked it for the Hadamard, or asserted that the maximally mixed state stays put no matter which gate acts on it. Neither is a proof. Two moves finish it: deal with the number sitting inside the matrix product, then apply the equation U satisfies by definition to what remains.",
    partialFeedback: "You have one of the two moves. The other is either taking the number outside the product, or applying the equation U satisfies by definition to what is left. State both.",
    modelAnswers: [
      "U(I/2)U^dagger = (1/2) U I U^dagger = (1/2) U U^dagger = (1/2) I = I/2.",
      "The 1/2 is only a scalar so it comes out front, leaving (1/2)UU†. UU† is the identity by unitarity, so you get (1/2)I which is I/2, and nothing in that used H.",
      "Scalars commute with matrices, so you can pull the half out. What is left is U times U dagger, and that is the identity by definition of a unitary, so the whole thing is I/2 again for any U you like.",
    ],
  },
  hints: [
    { text: "There is a plain number sitting inside a product of matrices. Ask what you are allowed to do with such a thing." },
    { text: "Once it is outside, simplify the product of the gate with the two-by-two matrix that does nothing, and see which two matrices finish next to each other." },
    { text: "Write down the equation U and its conjugate transpose satisfy, and apply it to that adjacent pair." },
  ],
  solution: {
    steps: [
      { description: "$U(I/2)U^\\dagger = \\tfrac12 UIU^\\dagger$: the scalar factors out of matrix multiplication." },
      { description: "$UIU^\\dagger = UU^\\dagger$, since multiplying by the identity matrix changes nothing." },
      { description: "$UU^\\dagger = I$ by the defining property of a unitary matrix, so the whole expression is $\\tfrac12I=I/2$." },
    ],
    finalAnswer: "The 1/2 is just a number, so it pulls out front: U(I/2)U† = (1/2)UU†. The remaining product is exactly what the defining property of a unitary collapses to the identity, leaving (1/2)I = I/2, for any U whatsoever.",
  },
  explanation: {
    correctIdea: "The proof uses nothing specific to any particular gate: only that U is unitary, meaning UU†=I by definition.",
    whyCorrect: "This shows the maximally mixed state's invariance under Hadamard (checked in the lesson) is a special case of a fully general fact.",
    whyWrong: ["Checking this only for H, X, Y, Z individually would only establish it for those specific gates, not for every unitary as the question asks."],
  },
};
