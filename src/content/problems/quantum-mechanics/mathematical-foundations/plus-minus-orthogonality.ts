import type { NumericProblem } from "@/lib/problems/types";

export const plusMinusOrthogonality: NumericProblem = {
  meta: {
    slug: "plus-minus-orthogonality",
    title: "Are |+⟩ and |−⟩ Orthogonal?",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["inner-products", "orthogonality"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  question: {
    type: "numeric",
    prompt:
      "Let $|+\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle+|1\\rangle)$ and $|-\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle-|1\\rangle)$. Compute $\\langle+|-\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0,
    tolerance: 0.01,
    incorrectFeedback: "Expand both states in the computational basis and use orthonormality. The most common slip is dropping the minus sign in the second state's expansion; keep it and watch what happens to the surviving terms.",
    nearMisses: [
      { value: 1, feedback: "1 is what you get by dropping the minus sign in |−⟩, which turns the calculation into ⟨+|+⟩. With the sign kept, the two surviving terms cancel." },
      { value: 0.5, feedback: "0.5 keeps only one of the two surviving terms. Both ⟨0|0⟩ and ⟨1|1⟩ contribute, with opposite signs." },
    ],
  },
  hints: [
    { text: "Expand the bra and the ket in the computational basis and multiply out, keeping all four cross terms. Do not drop the minus sign carried by the second state." },
    { text: "Orthonormality kills the two cross terms immediately, leaving the two like-with-like terms, one from each half of the expansion." },
    { text: "Look at the signs on the two surviving terms: equal in size, opposite in sign. Combine them." },
  ],
  solution: {
    steps: [
      {
        description: "Expand the inner product using orthonormality of $|0\\rangle,|1\\rangle$.",
        latex: "\\langle+|-\\rangle = \\frac12(\\langle0|0\\rangle - \\langle0|1\\rangle + \\langle1|0\\rangle - \\langle1|1\\rangle)",
      },
      { description: "Substitute the known values: 1, 0, 0, 1.", latex: "\\langle+|-\\rangle = \\frac12(1-0+0-1) = 0" },
    ],
    finalAnswer: "$\\langle+|-\\rangle = 0$",
  },
  explanation: {
    correctIdea: "|+⟩ and |−⟩ form a different orthonormal basis of the same space as |0⟩, |1⟩.",
    whyCorrect: "The cross terms ⟨0|1⟩ and ⟨1|0⟩ vanish, and the remaining ⟨0|0⟩=1, ⟨1|1⟩=1 terms cancel with opposite signs.",
    whyWrong: ["Forgetting the minus sign in |−⟩'s expansion would incorrectly give 1 instead of 0."],
  },
};
