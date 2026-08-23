import type { NumericProblem } from "@/lib/problems/types";

export const infiniteWellNodeCount: NumericProblem = {
  meta: {
    slug: "infinite-well-node-count",
    title: "Counting Nodes in an Infinite Well Eigenstate",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["infinite-square-well", "eigenstates"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-infinite-square-well"],
  },
  question: {
    type: "numeric",
    prompt: "The n-th infinite well eigenstate is psi_n(x) = sqrt(2/L)*sin(n*pi*x/L). How many internal nodes (zero crossings strictly inside the well, not counting the boundaries) does psi_5 have?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 4,
    tolerance: 0.001,
    incorrectFeedback: "sin(n*pi*x/L) crosses zero n-1 times strictly between the boundaries — count where n*pi*x/L equals pi, 2*pi, ..., (n-1)*pi.",
  },
  hints: [
    { text: "sin(theta) is zero at theta = 0, pi, 2*pi, 3*pi, ... — the endpoints theta=0 and theta=n*pi are the well's boundaries, not internal nodes." },
    { text: "Count the zeros strictly between theta=0 and theta=n*pi." },
  ],
  solution: {
    steps: [
      { description: "$\\sin(n\\pi x/L)=0$ at $x=0, L/n, 2L/n, \\ldots, L$ — that's $n+1$ zeros total, including both boundaries." },
      { description: "Excluding the two boundary zeros leaves $n-1$ internal nodes.", latex: "n-1 = 5-1 = 4" },
    ],
    finalAnswer: "$4$ internal nodes",
  },
  explanation: {
    correctIdea: "The n-th eigenstate has exactly n-1 internal nodes — more nodes for higher energy levels.",
    whyCorrect: "Direct counting of sin's zeros within the well, excluding the two boundary zeros that are required by the boundary conditions anyway.",
    whyWrong: ["Counting all n+1 zeros including the two boundaries (reporting 6 instead of 4) miscounts what 'internal' means in the question."],
  },
};
