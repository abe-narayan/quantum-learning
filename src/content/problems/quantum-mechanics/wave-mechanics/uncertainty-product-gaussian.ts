import type { NumericProblem } from "@/lib/problems/types";

export const uncertaintyProductGaussian: NumericProblem = {
  meta: {
    slug: "uncertainty-product-gaussian",
    title: "The Uncertainty Product for a Gaussian Packet",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["fourier-transform", "uncertainty", "gaussian"],
    prerequisites: ["quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform"],
  },
  question: {
    type: "numeric",
    prompt: "A stationary Gaussian wave packet has position-space width sigma = 2. Using Delta k = 1/(2*sigma), find the uncertainty product Delta x * Delta p (natural units, hbar = 1).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.001,
    incorrectFeedback: "Delta x = sigma, and Delta p = Delta k = 1/(2*sigma) in these units. Multiply the two together.",
    nearMisses: [
      { value: 4, feedback: "4 is σ², using σ for both factors. Δp is inversely related to σ, so the σ dependence cancels in the product." },
      { value: 0.25, feedback: "0.25 is Δp on its own. The product multiplies it by Δx = σ = 2." },
      { value: 1, feedback: "1 would be ħ rather than ħ/2. A Gaussian saturates the bound exactly at ħ/2." },
    ],
  },
  hints: [
    { text: "Delta x for a Gaussian packet is exactly its width parameter, sigma." },
    { text: "Delta p equals Delta k = 1/(2*sigma) in natural units (hbar=1)." },
  ],
  solution: {
    steps: [
      { description: "$\\Delta x = \\sigma = 2$." },
      { description: "$\\Delta p = \\Delta k = \\dfrac{1}{2\\sigma} = \\dfrac{1}{4} = 0.25$." },
      { description: "$\\Delta x\\,\\Delta p = 2 \\times 0.25 = 0.5$." },
    ],
    finalAnswer: "$\\Delta x\\,\\Delta p = 0.5$",
  },
  explanation: {
    correctIdea: "A Gaussian wave packet exactly saturates the minimum uncertainty bound Delta x * Delta p = hbar/2.",
    whyCorrect: "This matches hbar/2=0.5 exactly (natural units), confirming the Gaussian is a minimum-uncertainty state.",
    whyWrong: ["Using sigma directly as Delta p (forgetting the inverse relationship Delta k = 1/(2*sigma)) inflates the product well above the true minimum."],
  },
};
