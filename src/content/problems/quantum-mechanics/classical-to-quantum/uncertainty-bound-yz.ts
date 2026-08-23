import type { NumericProblem } from "@/lib/problems/types";

export const uncertaintyBoundYZ: NumericProblem = {
  meta: {
    slug: "uncertainty-bound-yz",
    title: "The Uncertainty Bound for Y and Z",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["uncertainty", "commutators"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using $[Y,Z]=2iX$, compute the uncertainty-relation bound $\\tfrac12|\\langle[Y,Z]\\rangle|$ in the state $|+\\rangle$ (where $\\langle X\\rangle=1$).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.01,
    incorrectFeedback: "⟨[Y,Z]⟩ = 2i⟨X⟩. Take its magnitude, then multiply by ½.",
  },
  hints: [
    { text: "⟨[Y,Z]⟩ = 2i⟨X⟩ = 2i(1) = 2i." },
    { text: "|2i| = 2." },
    { text: "Multiply by ½." },
  ],
  solution: {
    steps: [
      { description: "Compute the commutator expectation.", latex: "\\langle[Y,Z]\\rangle = 2i\\langle X\\rangle = 2i" },
      { description: "Take its magnitude and halve it.", latex: "\\tfrac12|2i| = 1" },
    ],
    finalAnswer: "$1$",
  },
  explanation: {
    correctIdea: "Combined with the companion problem (ΔY=1, and ΔZ=1 by the same argument), this bound is exactly saturated: ΔY·ΔZ = 1 = bound.",
    whyCorrect: "This is the expected behavior for |+⟩, a special minimum-uncertainty state for the Y,Z pair.",
    whyWrong: ["Forgetting the ½ factor, or the magnitude of i, are the most common slips."],
  },
};
