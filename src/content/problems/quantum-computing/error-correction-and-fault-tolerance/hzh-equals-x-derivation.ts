import type { ConceptualProblem } from "@/lib/problems/types";

export const hzhEqualsXDerivation: ConceptualProblem = {
  meta: {
    slug: "hzh-equals-x-derivation",
    title: "Deriving HZH=X from HXH=Z",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["quantum-error-correction", "phase-flip-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code"],
  },
  question: {
    type: "conceptual",
    prompt: "Starting from HXH=Z and H²=I, derive HZH=X algebraically (without recomputing the matrix product from scratch).",
    placeholder: "Left- and right-multiply both sides of HXH=Z by H...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Bare "sandwich" and bare "conjugate" are gone. They named the move
      // without making it, which is how the two-word gesture "Sandwich it."
      // used to clear this group; the operation has to be stated on both
      // sides for it to count.
      {
        phrases: ["multiply both sides", "multiply each side", "multiply on the left", "left multiply", "left-multiply", "right multiply", "right-multiply", "multiply by h", "multiplying by h", "hit both sides", "apply h to both sides", "apply h on the left", "h on the left and h on the right", "h on both sides", "both sides by h", "sandwich both sides", "sandwich it between", "sandwich hxh", "conjugate both sides", "conjugate by h", "conjugating by h", "h(hxh)h", "h (hxh) h", "hhxhh"],
        missingFeedback:
          "You know what the outer gates do once they are there, but not how they got there. Say what you did to the equation you were handed, and say that you did it at both ends.",
      },
      // The old second group asked only for H²=I restated, which the prompt
      // supplies ("Starting from HXH=Z and H²=I"), so "H squared is the
      // identity" scored a full mark for repeating the question. What the
      // derivation actually needs is the *consequence*: the outer pair
      // collapses and X is what is left. "ixi" is a whole token a student only
      // writes after doing the substitution.
      {
        phrases: ["ixi", "i x i", "(hh)x(hh)", "collapse", "cancel", "drop out", "drops out", "dropped out", "disappear", "vanish", "leaves x", "leaving x", "left with x", "left side is x", "left hand side is x", "lhs is x", "gives x", "you get x", "get x back", "becomes x", "reduces to x", "just x", "outer h", "outer hadamard", "two adjacent h", "adjacent h", "the pair of h"],
        missingFeedback:
          "You set the equation up correctly but stopped before reading it. Say what happens to the two H's that now sit next to each other at each end, and what single matrix is left standing on that side.",
      },
    ],
    incorrectFeedback: "You recomputed the matrix product, which the question asks you not to do. Treat HXH=Z as an equation you are allowed to operate on from both sides, and pick the operation that moves Z into the middle.",
    partialFeedback: "You made the right first move. Now clear the outer gates using what H composed with itself gives, and read the result off.",
    modelAnswers: [
      "HXH=Z. Apply H on the left and H on the right of both sides: H(HXH)H = HZH. The left side is (HH)X(HH) = IXI = X. So X = HZH.",
      "Multiply both sides of HXH=Z by H on the left and on the right. On the left the two pairs of H's cancel, because H is its own inverse, so you are left with X, and the right side is HZH. Hence HZH = X.",
      "Sandwich both sides of HXH=Z between two H's. The outer H's collapse to the identity and X is what is left over on that side, giving X = HZH.",
    ],
  },
  hints: [
    { text: "You want an equation with Z between two H's. What can you do to each side of the equation you were given to arrange that?" },
    { text: "Having done it, group the H's that now sit next to each other on the left-hand side." },
    { text: "Two adjacent H's collapse to something. Use that fact at both ends and read off what is left standing beside Z." },
  ],
  solution: {
    steps: [
      { description: "H(HXH)H = HZH, i.e. (HH)X(HH) = HZH." },
      { description: "Since HH=I: IXI = HZH, so X = HZH." },
    ],
    finalAnswer: "HZH = X, derived directly from HXH=Z and H²=I.",
  },
  explanation: {
    correctIdea: "This algebraic shortcut avoids a second full matrix multiplication, reusing the already-established identity.",
    whyCorrect: "Matches the direct matrix computation (HZH=X) exactly, confirming the shortcut is valid.",
    whyWrong: ["Simply asserting HZH=X by symmetry without the derivation skips exactly what this question asks for."],
  },
};
