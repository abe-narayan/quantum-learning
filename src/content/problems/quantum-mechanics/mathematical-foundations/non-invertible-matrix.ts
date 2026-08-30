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
      { id: "a", text: "$\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$" },
      { id: "b", text: "$\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$" },
      { id: "c", text: "$\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix}$" },
      { id: "d", text: "$\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "One sign apart from the singular one, and that sign is the whole difference. Its rows (1,1) and (1,-1) are not multiples of each other, and applying it to (1,-1) gives (0,2), not (0,0). This is the unnormalized Hadamard; its inverse is itself over 2.",
      c: "This is invertible: its inverse is diag(1/2, 1/2).",
      d: "This is invertible: it is its own inverse, since applying it twice gives back the identity.",
    },
    defaultIncorrectFeedback: "Look for a matrix that sends some nonzero vector to zero. That is the signature of non-invertibility.",
  },
  hints: [
    { text: "A matrix fails to be invertible exactly when it collapses some nonzero vector onto zero, because that collapse is what cannot be undone." },
    { text: "Rather than computing four determinants, look for the matrix whose two rows carry the same information as each other." },
    { text: "Test a candidate by feeding it $(1,-1)$. If that nonzero input comes out as the zero vector, the map has thrown information away." },
  ],
  solution: {
    steps: [
      {
        description: "Apply $\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ to the nonzero vector $(1,-1)$.",
        latex: "\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}\\begin{pmatrix}1\\\\-1\\end{pmatrix} = \\begin{pmatrix}1-1\\\\1-1\\end{pmatrix} = \\begin{pmatrix}0\\\\0\\end{pmatrix}",
      },
      { description: "A nonzero input maps to zero, so this matrix cannot be undone and has no inverse." },
    ],
    finalAnswer: "$\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ is not invertible.",
  },
  explanation: {
    correctIdea: "Invertibility fails exactly when some nonzero vector is sent to zero, destroying the information about it.",
    whyCorrect: "The two rows of this matrix are identical, so it collapses the (1,-1) direction entirely.",
    whyWrong: [
      { optionId: "a", text: "Matched on the shape rather than the signs. Flipping one entry to −1 makes the rows orthogonal instead of identical, and the matrix invertible." },
      { optionId: "c", text: "A uniform scaling by 2, undone by scaling by 1/2." },
      { optionId: "d", text: "A swap of the two components, undone by swapping again." },
    ],
  },
};
