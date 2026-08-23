import type { NumericProblem } from "@/lib/problems/types";

export const postulateProbabilityCalculation: NumericProblem = {
  meta: {
    slug: "postulate-probability-calculation",
    title: "Applying the Measurement Postulate",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["postulates", "born-rule"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"],
  },
  question: {
    type: "numeric",
    prompt:
      "A two-level system with eigenvalues $+1,-1$ (eigenvectors $|e_+\\rangle,|e_-\\rangle$) is in state $|\\psi\\rangle=\\cos(\\pi/3)|e_+\\rangle+\\sin(\\pi/3)|e_-\\rangle$. Find $P(+1)$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.25,
    tolerance: 0.01,
    incorrectFeedback: "P(+1) = |cos(π/3)|², not cos(π/3) itself. cos(π/3) = 0.5.",
  },
  hints: [
    { text: "cos(π/3) = 0.5." },
    { text: "By the Born rule, P(+1) = |cos(π/3)|²." },
  ],
  solution: {
    steps: [
      { description: "Identify the coefficient on $|e_+\\rangle$.", latex: "\\cos(\\pi/3) = 0.5" },
      { description: "Apply the Born rule.", latex: "P(+1) = 0.5^2 = 0.25" },
    ],
    finalAnswer: "$P(+1) = 0.25$",
  },
  explanation: {
    correctIdea: "Postulate 3 gives outcome probability as the squared magnitude of the overlap with the eigenvector.",
    whyCorrect: "0.5² = 0.25 directly, and P(-1) = sin²(π/3) = 0.75, summing correctly to 1.",
    whyWrong: ["Using cos(π/3)=0.5 directly as the probability skips the Born rule's squaring step."],
  },
};
