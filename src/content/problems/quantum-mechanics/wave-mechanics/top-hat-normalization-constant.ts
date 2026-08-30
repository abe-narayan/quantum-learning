import type { NumericProblem } from "@/lib/problems/types";

export const topHatNormalizationConstant: NumericProblem = {
  meta: {
    slug: "top-hat-normalization-constant",
    title: "Normalizing a Top-Hat Wavefunction",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["normalization", "wavefunction"],
    prerequisites: ["quantum-mechanics/wave-mechanics/what-is-a-wavefunction"],
  },
  question: {
    type: "numeric",
    prompt: "A particle's wavefunction is psi(x) = A for 0 <= x <= 8, and 0 elsewhere. Find A (take A real and positive).",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.353553,
    tolerance: 0.001,
    incorrectFeedback: "Normalization requires the integral of |A|^2 over the interval to equal 1: |A|^2 * L = 1, so A = 1/sqrt(L).",
    nearMisses: [
      { value: 0.125, feedback: "0.125 is 1/L. Normalization constrains |A|², so A picks up a square root: A = 1/√L." },
      { value: 8, feedback: "8 is the interval length. A shrinks as the interval grows, since the same total probability spreads further." },
    ],
  },
  hints: [
    { text: "Normalization is a statement about total probability, which is the area under the squared modulus rather than under psi itself." },
    { text: "Set the integral of the squared modulus over the region where psi is nonzero equal to 1. With psi constant, that integral is a single multiplication." },
    { text: "What that gives you is A squared. If your answer came out as 0.125, the root is still outstanding." },
  ],
  solution: {
    steps: [
      { description: "Normalization: $\\int_0^8 |A|^2\\,dx = |A|^2 \\cdot 8 = 1$." },
      { description: "Solve for $A$.", latex: "A = \\frac{1}{\\sqrt{8}} \\approx 0.3536" },
    ],
    finalAnswer: "$A \\approx 0.3536$",
  },
  explanation: {
    correctIdea: "Normalization fixes the overall scale of a wavefunction by requiring total probability to equal 1.",
    whyCorrect: "$A=1/\\sqrt{L}$ makes $\\int_0^L|A|^2dx=1$ exactly, for any interval length $L$.",
    whyWrong: ["Forgetting to take the square root (using $A=1/L$ instead of $1/\\sqrt L$) is the most common slip: normalization involves $|A|^2$, not $A$."],
  },
};
