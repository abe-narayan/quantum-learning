import type { NumericProblem } from "@/lib/problems/types";

export const probabilityInSubregion: NumericProblem = {
  meta: {
    slug: "probability-in-subregion",
    title: "Probability of Being in a Subregion",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["probability-density", "normalization"],
    prerequisites: ["quantum-mechanics/wave-mechanics/probability-density-and-normalization"],
  },
  question: {
    type: "numeric",
    prompt: "A normalized wavefunction is psi(x) = 1/sqrt(10) for 0 <= x <= 10, and 0 elsewhere. Find P(2 <= x <= 5).",
    inputHint: "a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: 0.3,
    tolerance: 0.001,
    incorrectFeedback: "P(a<=x<=b) = integral from a to b of |psi(x)|^2 dx. Here |psi(x)|^2 = 1/10 is constant, so the probability is just (b-a)/10.",
    nearMisses: [
      { value: 3, feedback: "3 is the subregion's width. It still has to be weighted by the density 1/10." },
      { value: 0.5, feedback: "0.5 uses the endpoint 5 rather than the width 5 − 2. The integral runs from 2, not from 0." },
      { value: 0.2, feedback: "0.2 is 2/10, weighting the lower endpoint rather than the width. The region runs from 2 to 5, so the width is 5 − 2 = 3." },
    ],
  },
  hints: [
    { text: "The probability of finding the particle somewhere is the area under the density there, not the value of psi itself." },
    { text: "Square psi to get the density, note that it is constant, then integrate it across the subregion." },
    { text: "For a constant density that integral is density times width. Work the subregion's width out carefully: it runs from 2 to 5, not from 0 to 5." },
  ],
  solution: {
    steps: [
      { description: "$P(2\\le x\\le5) = \\int_2^5 |\\psi(x)|^2\\,dx = \\int_2^5 \\frac{1}{10}\\,dx$" },
      { description: "Evaluate the integral.", latex: "P = \\frac{5-2}{10} = 0.3" },
    ],
    finalAnswer: "$P = 0.3$",
  },
  explanation: {
    correctIdea: "For a uniform probability density, the probability of a subregion is just its fraction of the total width.",
    whyCorrect: "|psi(x)|^2=1/10 is constant on [0,10], so integrating over any subinterval just scales by that subinterval's width.",
    whyWrong: ["Using the full interval's width (10) instead of the subregion's width (3) in the numerator, or forgetting to divide by the total interval length, both give wrong answers."],
  },
};
