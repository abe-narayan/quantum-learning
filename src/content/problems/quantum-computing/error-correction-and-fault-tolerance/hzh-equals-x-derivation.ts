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
      ["multiply both sides", "left multiply", "left-multiply", "multiply on the left", "multiply each side", "multiply by h", "h(hxh)h", "hhxhh", "sandwich", "conjugate"],
      ["h²", "h^2", "h squared", "hh=i", "hh = i", "self-inverse", "self inverse", "own inverse", "identity"],
    ],
    incorrectFeedback: "Take the known equation HXH=Z and act on it with one more H at each end, then use the fact that H undoes itself.",
    partialFeedback: "You made the right first move. Now clear the outer gates using the property that applying H twice does nothing, and read off the result.",
  },
  hints: [
    { text: "You want an equation with Z sitting between two H's. What can you do to each side of HXH=Z to arrange that?" },
    { text: "After that move, what does the other side look like? Group the H's that sit next to each other." },
    { text: "What is H composed with itself? Use that twice to collapse one side down to X." },
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
