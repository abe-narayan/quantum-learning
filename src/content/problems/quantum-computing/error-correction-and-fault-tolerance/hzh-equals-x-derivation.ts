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
      ["multiply both sides", "left.multiply", "h\\(hxh\\)h"],
      ["h.2.*=.*i", "hh=i", "identity"],
    ],
    incorrectFeedback: "Multiply both sides of HXH=Z by H on the left and by H on the right, then simplify using HH=I.",
    partialFeedback: "Good — now finish simplifying using H²=I to isolate X.",
  },
  hints: [
    { text: "Start with HXH=Z." },
    { text: "Multiply both sides on the left by H and on the right by H: H(HXH)H = HZH." },
    { text: "Simplify the left side using HH=I twice." },
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
