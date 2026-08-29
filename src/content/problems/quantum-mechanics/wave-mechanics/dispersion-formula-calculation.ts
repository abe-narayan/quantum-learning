import type { NumericProblem } from "@/lib/problems/types";

export const dispersionFormulaCalculation: NumericProblem = {
  meta: {
    slug: "dispersion-formula-calculation",
    title: "Wave Packet Spreading Over Time",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["dispersion", "wave-packet"],
    prerequisites: ["quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"],
  },
  question: {
    type: "numeric",
    prompt: "A free-particle Gaussian packet starts with width sigma_0 = 1 (natural units, hbar = m = 1). Find its width sigma(t) at t = 4.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 2.236068,
    tolerance: 0.001,
    incorrectFeedback: "sigma(t)^2 = sigma_0^2 + (t/(2*sigma_0))^2. Substitute sigma_0=1, t=4, then take the square root at the end.",
    nearMisses: [
      { value: 5, tolerance: 0.005, feedback: "5 is σ(4)², the sum before the square root." },
      { value: 2, feedback: "2 is the spreading term t/(2σ₀) on its own. The widths add in quadrature with the initial σ₀, so the total exceeds 2." },
      { value: 3, feedback: "3 adds σ₀ and the spreading term directly. They combine in quadrature, not linearly." },
    ],
  },
  hints: [
    { text: "sigma(t)^2 = sigma_0^2 + (t/(2*sigma_0))^2 in natural units." },
    { text: "Substitute sigma_0=1, t=4: sigma(4)^2 = 1 + (4/2)^2 = 1+4 = 5." },
  ],
  solution: {
    steps: [
      { description: "$\\sigma(4)^2 = 1^2 + \\left(\\dfrac{4}{2\\times1}\\right)^{\\!2} = 1+4 = 5$." },
      { description: "Take the square root.", latex: "\\sigma(4) = \\sqrt5 \\approx 2.236" },
    ],
    finalAnswer: "$\\sigma(4) \\approx 2.236$",
  },
  explanation: {
    correctIdea: "A free-particle wave packet's width grows quadratically in time, eventually dominating the initial width.",
    whyCorrect: "Direct substitution into the derived dispersion formula.",
    whyWrong: ["Forgetting to add sigma_0^2 (reporting just the second term's square root, sqrt(4)=2) omits the packet's own initial width."],
  },
};
