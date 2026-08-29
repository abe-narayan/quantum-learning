import type { NumericProblem } from "@/lib/problems/types";

export const meanPositionTophat: NumericProblem = {
  meta: {
    slug: "mean-position-tophat",
    title: "Mean Position of a Top-Hat Wavefunction",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/expectation-values-in-position-space",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["expectation-value", "position"],
    prerequisites: ["quantum-mechanics/wave-mechanics/expectation-values-in-position-space"],
  },
  question: {
    type: "numeric",
    prompt: "A normalized wavefunction is uniform on [2, 8] and zero elsewhere. Find <x>.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 5,
    tolerance: 0.01,
    incorrectFeedback: "<x> = integral of x*|psi(x)|^2 dx. For a uniform density on an interval, this is just the interval's midpoint.",
    nearMisses: [
      { value: 6, feedback: "6 is the interval's width. The mean is its centre, halfway between the two endpoints." },
      { value: 3, feedback: "3 is half the width. The interval starts at 2, not at 0, so the midpoint is shifted." },
    ],
  },
  hints: [
    { text: "The density |psi(x)|^2 is constant (uniform) across [2,8]." },
    { text: "For a uniform density, <x> is exactly the midpoint of the interval." },
  ],
  solution: {
    steps: [
      { description: "For a uniform density on $[a,b]$, $\\langle x\\rangle = \\dfrac{a+b}{2}$ by symmetry." },
      { description: "Substitute $a=2, b=8$.", latex: "\\langle x\\rangle = \\frac{2+8}{2} = 5" },
    ],
    finalAnswer: "$\\langle x\\rangle = 5$",
  },
  explanation: {
    correctIdea: "A uniform probability density's mean is its interval's midpoint, by symmetry.",
    whyCorrect: "The weighted average of x over a symmetric, uniform distribution is exactly the center of the interval.",
    whyWrong: ["Using the interval's width (6) instead of its midpoint (5) confuses the interval's length with its center."],
  },
};
