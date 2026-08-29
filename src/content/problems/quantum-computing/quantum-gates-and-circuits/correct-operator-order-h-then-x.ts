import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const correctOperatorOrderHThenX: MultipleChoiceProblem = {
  meta: {
    slug: "correct-operator-order-h-then-x",
    title: "Diagram Order vs. Operator Order",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["circuits", "operator-order"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "A single-qubit circuit has $H$ in column 1 (drawn first, leftmost) and $X$ in column 2 (drawn second). Which operator expression correctly describes the full circuit?",
    options: [
      { id: "a", text: "$X \\cdot H$" },
      { id: "b", text: "$H \\cdot X$" },
      { id: "c", text: "$H + X$" },
      { id: "d", text: "$XH^{-1}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This reads the operator product in the same order as the diagram, left to right — but operator products compose right to left. H, being drawn first, must be the rightmost (first-applied) factor.",
      c: "Gates compose by multiplication (matrix product), not addition — addition doesn't even preserve normalization in general.",
      d: "There's no inverse involved here; both gates are actually applied, not undone.",
    },
    defaultIncorrectFeedback: "Remember: a circuit reads left to right, but its operator product is written and multiplied right to left.",
  },
  hints: [
    { text: "The gate drawn first (leftmost) in the diagram is applied first to the state." },
    { text: "In operator notation, whichever operator is applied first goes on the right, since it acts on the ket first." },
    { text: "H is drawn first, so H must be the rightmost factor in the product." },
  ],
  solution: {
    steps: [
      { description: "H is drawn first (leftmost column), so it's applied first to the input state." },
      {
        description: "An operator applied first sits closest to the ket, i.e. on the right of the product.",
        latex: "\\text{full circuit} = X\\cdot H",
      },
    ],
    finalAnswer: "$X \\cdot H$",
  },
  explanation: {
    correctIdea: "The leftmost gate in a diagram is applied first, which means it's the rightmost factor in the operator product.",
    whyCorrect: "Operators act on a ket by matrix multiplication from the left, so the first-applied operator must be closest to the ket, on the right of any product of two.",
    whyWrong: [
      { optionId: "b", text: "Writing $H\\cdot X$ applies X first and H second, the reverse of what the diagram shows. X and H don't commute, so this computes a different final state." },
      { optionId: "c", text: "Gates compose by matrix product, not addition; adding them doesn't even preserve normalization." },
      { optionId: "d", text: "No inverse appears anywhere here. Both gates are applied, neither is undone." },
    ],
  },
};
