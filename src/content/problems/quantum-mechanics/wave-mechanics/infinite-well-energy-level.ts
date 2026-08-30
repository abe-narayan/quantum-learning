import type { NumericProblem } from "@/lib/problems/types";

export const infiniteWellEnergyLevel: NumericProblem = {
  meta: {
    slug: "infinite-well-energy-level",
    title: "Infinite Well Energy Level",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    difficulty: "beginner",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["infinite-square-well", "energy-levels"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-infinite-square-well"],
  },
  question: {
    type: "numeric",
    prompt: "For an infinite square well of width L = 6 (natural units, hbar = m = 1), find the energy E_2 of the n = 2 level.",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.548311,
    tolerance: 0.001,
    incorrectFeedback: "E_n = n^2*pi^2/(2*L^2). Substitute n=2, L=6 carefully: L is squared in the denominator.",
    nearMisses: [
      { value: (4 * Math.PI ** 2) / 12, tolerance: 0.005, feedback: "The width is squared in the denominator: 2L² = 72, not 2L = 12." },
      { value: Math.PI ** 2 / 72, tolerance: 0.002, feedback: "That is E₁. The level index enters as n², so E₂ is four times larger." },
      { value: (2 * Math.PI ** 2) / 72, tolerance: 0.002, feedback: "n enters squared, not linearly: the numerator is n²π² = 4π²." },
    ],
  },
  hints: [
    { text: "The walls force the wavefunction to vanish at both ends, so only wavenumbers fitting a whole number of half wavelengths across the well survive. Start from the wavenumber the n = 2 state must carry." },
    { text: "Convert that wavenumber into an energy with the free-particle relation, which in these units is E = k^2/2." },
    { text: "The quantum number enters squared and the width enters squared in the denominator. Confirm both exponents before evaluating pi^2 numerically." },
  ],
  solution: {
    steps: [
      { description: "$E_2 = \\dfrac{2^2\\pi^2}{2\\times6^2} = \\dfrac{4\\pi^2}{72} = \\dfrac{\\pi^2}{18}$" },
      { description: "Evaluate numerically.", latex: "E_2 \\approx 0.5483" },
    ],
    finalAnswer: "$E_2 \\approx 0.5483$",
  },
  explanation: {
    correctIdea: "Infinite well energies scale as n^2 and inversely as L^2.",
    whyCorrect: "Direct substitution into the derived formula.",
    whyWrong: ["Using L instead of L^2 in the denominator, or forgetting to square n, both give the wrong scaling."],
  },
};
