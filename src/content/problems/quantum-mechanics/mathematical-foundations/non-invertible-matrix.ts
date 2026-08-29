import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const nonInvertibleMatrix: MultipleChoiceProblem = {
  meta: {
    slug: "non-invertible-matrix",
    title: "Spotting a Non-Invertible Matrix",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/linear-operators",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["linear-operators", "invertibility"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/linear-operators"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following matrices is NOT invertible?",
    options: [
      { id: "a", text: "$\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$" },
      { id: "b", text: "$\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$" },
      { id: "c", text: "$\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix}$" },
      { id: "d", text: "$\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "The identity matrix is always invertible (it's its own inverse).",
      c: "This is invertible — its inverse is diag(1/2, 1/2).",
      d: "This is invertible — it's its own inverse (applying it twice gives back the identity).",
    },
    defaultIncorrectFeedback: "Look for a matrix that sends some nonzero vector to zero — that's the sign of non-invertibility.",
  },
  hints: [
    { text: "A matrix fails to be invertible exactly when it sends some nonzero vector to the zero vector." },
    { text: "Try applying each matrix to (1,-1) and see which one gives (0,0)." },
  ],
  solution: {
    steps: [
      {
        description: "Apply $\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ to the nonzero vector $(1,-1)$.",
        latex: "\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}\\begin{pmatrix}1\\\\-1\\end{pmatrix} = \\begin{pmatrix}1-1\\\\1-1\\end{pmatrix} = \\begin{pmatrix}0\\\\0\\end{pmatrix}",
      },
      { description: "A nonzero input maps to zero, so this matrix cannot be undone — it has no inverse." },
    ],
    finalAnswer: "$\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ is not invertible.",
  },
  explanation: {
    correctIdea: "Invertibility fails exactly when some nonzero vector is sent to zero — information about that vector is destroyed.",
    whyCorrect: "The two rows of this matrix are identical, so it collapses the (1,-1) direction entirely.",
    whyWrong: [
      { optionId: "a", text: "The identity is its own inverse, so it undoes itself." },
      { optionId: "c", text: "A uniform scaling by 2, undone by scaling by 1/2." },
      { optionId: "d", text: "A swap of the two components, undone by swapping again." },
    ],
  },
};
