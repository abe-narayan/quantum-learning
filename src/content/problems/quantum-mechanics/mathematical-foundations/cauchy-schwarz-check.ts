import type { NumericProblem } from "@/lib/problems/types";

export const cauchySchwarzCheck: NumericProblem = {
  meta: {
    slug: "cauchy-schwarz-check",
    title: "A Cauchy-Schwarz Calculation",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["inner-products", "cauchy-schwarz"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $u=(1,0)$ and $v=\\frac{1}{\\sqrt2}(1,1)$, compute $|\\langle u,v\\rangle|^2$ (the squared magnitude of their inner product).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.01,
    incorrectFeedback: "First compute ⟨u,v⟩ itself (a single number here, since both vectors are real), then square its magnitude.",
    nearMisses: [
      { value: Math.SQRT1_2, tolerance: 0.01, feedback: "1/√2 is ⟨u,v⟩ itself. The question asks for its squared magnitude." },
      { value: 1, feedback: "1 is ‖u‖²‖v‖², the Cauchy-Schwarz upper bound. The actual overlap falls strictly below it, since u and v are not parallel." },
    ],
  },
  hints: [
    { text: "⟨u,v⟩ = u1*·v1 + u2*·v2, with u=(1,0) and v=(1/√2, 1/√2)." },
    { text: "Since u2 = 0, only the first term contributes." },
    { text: "⟨u,v⟩ = 1/√2 — now square it." },
  ],
  solution: {
    steps: [
      {
        description: "Compute the inner product; only the first term survives since $u_2=0$.",
        latex: "\\langle u,v\\rangle = 1\\cdot\\tfrac{1}{\\sqrt2} + 0\\cdot\\tfrac{1}{\\sqrt2} = \\tfrac{1}{\\sqrt2}",
      },
      { description: "Square its magnitude.", latex: "|\\langle u,v\\rangle|^2 = \\left(\\tfrac{1}{\\sqrt2}\\right)^2 = \\tfrac12" },
    ],
    finalAnswer: "$|\\langle u,v\\rangle|^2 = 0.5$",
  },
  explanation: {
    correctIdea: "Cauchy-Schwarz says this squared overlap can never exceed ‖u‖²‖v‖² = 1·1 = 1, and 0.5 respects that bound.",
    whyCorrect: "Direct computation of the inner product, then squaring its magnitude, gives exactly 0.5.",
    whyWrong: ["Squaring u and v's norms instead of the inner product itself would give 1, not the actual overlap of 0.5."],
  },
};
