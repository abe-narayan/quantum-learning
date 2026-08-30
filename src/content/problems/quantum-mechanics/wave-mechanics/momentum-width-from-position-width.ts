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
    prompt: "A Gaussian wave packet has position-space width sigma = 1.5. Find its momentum-space width Delta k.",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.333333,
    tolerance: 0.001,
    incorrectFeedback: "Delta k = 1/(2*sigma). Substitute sigma=1.5 and divide.",
    nearMisses: [
      { value: 3, feedback: "3 is 2σ. The relationship is inverse: a wider packet in position is narrower in momentum." },
      { value: 1 / 1.5, tolerance: 0.002, feedback: "That is 1/σ, missing the factor of 2 in the denominator." },
      { value: 0.75, feedback: "0.75 is σ/2. The width parameter belongs in the denominator, not the numerator." },
    ],
  },
  hints: [
    { text: "A Gaussian's Fourier transform is another Gaussian, and the two widths move in opposite directions: narrow the packet in position and it broadens in momentum." },
    { text: "The lesson's transform pair fixes the product $\\sigma\\,\\Delta k$ at a constant. Write that constant down, then solve for $\\Delta k$." },
    { text: "That constant is one half, not one. Settle the factor of 2 before dividing." },
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
