import type { NumericProblem } from "@/lib/problems/types";

export const momentumWidthFromPositionWidth: NumericProblem = {
  meta: {
    slug: "momentum-width-from-position-width",
    title: "Momentum-Space Width From Position-Space Width",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["fourier-transform", "gaussian"],
    prerequisites: ["quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform"],
  },
  question: {
    type: "numeric",
    prompt: "A Gaussian wave packet has position-space width sigma = 1.5. Find its momentum-space width Delta k = 1/(2*sigma).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.333333,
    tolerance: 0.001,
    incorrectFeedback: "Delta k = 1/(2*sigma) directly — substitute sigma=1.5.",
  },
  hints: [
    { text: "Use the direct formula Delta k = 1/(2*sigma) derived from the Gaussian Fourier transform pair." },
  ],
  solution: {
    steps: [
      { description: "$\\Delta k = \\dfrac{1}{2\\sigma} = \\dfrac{1}{2\\times1.5} = \\dfrac{1}{3} \\approx 0.3333$." },
    ],
    finalAnswer: "$\\Delta k \\approx 0.3333$",
  },
  explanation: {
    correctIdea: "Position-space and momentum-space widths of a Gaussian packet are inversely related.",
    whyCorrect: "This is a direct application of the Fourier transform pair derived in the lesson.",
    whyWrong: ["Multiplying sigma by 2 instead of dividing (getting 3 instead of 1/3) inverts the actual relationship."],
  },
};
