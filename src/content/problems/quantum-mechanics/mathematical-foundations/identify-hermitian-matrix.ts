import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const identifyHermitianMatrix: MultipleChoiceProblem = {
  meta: {
    slug: "identify-hermitian-matrix",
    title: "Identifying a Hermitian Matrix",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/hermitian-operators",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["hermitian-operators", "adjoint"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/hermitian-operators"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following matrices is Hermitian?",
    options: [
      { id: "a", text: "$\\begin{pmatrix}1&i\\\\i&1\\end{pmatrix}$" },
      { id: "b", text: "$\\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$" },
      { id: "c", text: "$\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$" },
      { id: "d", text: "$\\begin{pmatrix}i&0\\\\0&i\\end{pmatrix}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "Its conjugate transpose has -i in the off-diagonal spots, not i — this matrix does not equal its own adjoint.",
      c: "This is real but not symmetric (its transpose flips the signs) — its adjoint is not itself.",
      d: "A Hermitian matrix must have real diagonal entries; i is not real, so this fails immediately.",
    },
    defaultIncorrectFeedback: "Check the diagonal entries are real, and that swapping-and-conjugating the off-diagonal entries reproduces the same matrix.",
  },
  hints: [
    { text: "A Hermitian matrix's diagonal entries must be real — check that first." },
    { text: "Then check that conjugating and transposing gives back the exact same matrix." },
  ],
  solution: {
    steps: [
      {
        description: "Compute the adjoint of $\\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$: transpose, then conjugate.",
        latex: "M^T = \\begin{pmatrix}1&-i\\\\i&1\\end{pmatrix} \\quad\\Longrightarrow\\quad M^\\dagger = \\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}",
      },
      { description: "$M^\\dagger$ matches $M$ exactly — Hermitian confirmed." },
    ],
    finalAnswer: "$\\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$ is Hermitian.",
  },
  explanation: {
    correctIdea: "Hermitian means A = A†; real diagonal entries are a necessary (but not sufficient) quick check.",
    whyCorrect: "Direct computation of the adjoint reproduces the original matrix exactly.",
    whyWrong: ["Option (a) is the classic 'off by a sign' trap — swapping i and -i in the wrong spot breaks Hermiticity."],
  },
};
