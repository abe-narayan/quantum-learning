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
      a: "Its conjugate transpose has -i in the off-diagonal spots, not i, so this matrix does not equal its own adjoint.",
      c: "This is real but not symmetric (its transpose flips the signs), so its adjoint is not itself.",
      d: "A Hermitian matrix must have real diagonal entries; i is not real, so this fails immediately.",
    },
    defaultIncorrectFeedback: "Check the diagonal entries are real, and that swapping-and-conjugating the off-diagonal entries reproduces the same matrix.",
  },
  hints: [
    { text: "A Hermitian matrix equals its own adjoint, and one consequence is cheap to check first: every diagonal entry must be real." },
    { text: "For whatever survives that check, take the adjoint properly: transpose the matrix, then conjugate every entry." },
    { text: "Compare the adjoint against the original entry by entry. The off-diagonal pair is where the remaining candidates differ, so watch what conjugation does to an entry of $i$ and where the transpose then puts it." },
  ],
  solution: {
    steps: [
      {
        description: "Compute the adjoint of $\\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$: transpose, then conjugate.",
        latex: "M^T = \\begin{pmatrix}1&-i\\\\i&1\\end{pmatrix} \\quad\\Longrightarrow\\quad M^\\dagger = \\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}",
      },
      { description: "$M^\\dagger$ matches $M$ entry for entry, so the matrix is Hermitian." },
    ],
    finalAnswer: "$\\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$ is Hermitian.",
  },
  explanation: {
    correctIdea: "Hermitian means A = A†; real diagonal entries are a necessary (but not sufficient) quick check.",
    whyCorrect: "Direct computation of the adjoint reproduces the original matrix exactly.",
    whyWrong: [
      { optionId: "a", text: "The classic off-by-a-sign trap: its conjugate transpose carries -i in the off-diagonal spots, so it does not equal its own adjoint." },
      { optionId: "c", text: "Real but not symmetric. Transposing flips the off-diagonal signs, so the adjoint is not the matrix itself." },
      { optionId: "d", text: "A Hermitian matrix needs real diagonal entries, and i is not real." },
    ],
  },
};
