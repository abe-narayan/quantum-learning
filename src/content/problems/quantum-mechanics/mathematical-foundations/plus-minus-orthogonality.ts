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
    incorrectFeedback: "Expand both bra and ket in the |0⟩, |1⟩ basis and use ⟨0|0⟩=⟨1|1⟩=1, ⟨0|1⟩=⟨1|0⟩=0.",
  },
  hints: [
    { text: "Write ⟨+| = (1/√2)(⟨0|+⟨1|) and expand the product with |−⟩ term by term." },
    { text: "Use orthonormality: ⟨0|0⟩=1, ⟨0|1⟩=0, ⟨1|0⟩=0, ⟨1|1⟩=1." },
    { text: "Two of the four terms cancel against the other two." },
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
