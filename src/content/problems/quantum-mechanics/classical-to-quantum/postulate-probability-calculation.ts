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
    nearMisses: [
      { value: 0.5, feedback: "0.5 is cos(π/3), the amplitude. The Born rule squares it." },
      { value: 0.75, feedback: "0.75 is P(−1) = sin²(π/3). The question asks for the +1 outcome, whose coefficient is the cosine." },
    ],
  },
  hints: [
    { text: "The number multiplying $|e_+\\rangle$ is an amplitude, not a probability. The Born rule is what converts one into the other." },
    { text: "Pick out the coefficient sitting on $|e_+\\rangle$, then apply the Born rule to that coefficient alone." },
    { text: "Evaluate the cosine first, then square it. Squaring a number smaller than 1 makes it smaller still, which is a useful check on the result." },
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
