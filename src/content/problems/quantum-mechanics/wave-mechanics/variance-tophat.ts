import type { NumericProblem } from "@/lib/problems/types";

export const varianceTophat: NumericProblem = {
  meta: {
    slug: "variance-tophat",
    title: "Position Uncertainty of a Top-Hat Wavefunction",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/expectation-values-in-position-space",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["expectation-value", "variance", "uncertainty"],
    prerequisites: ["quantum-mechanics/wave-mechanics/expectation-values-in-position-space"],
  },
  question: {
    type: "numeric",
    prompt: "A normalized wavefunction is uniform on an interval of width L = 6. Find the position uncertainty Delta x = sqrt(<x^2> - <x>^2).",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 1.7320508,
    tolerance: 0.01,
    incorrectFeedback: "For a uniform distribution of width L, the variance is L^2/12 — a standard result you can derive directly from the two expectation-value integrals.",
    nearMisses: [
      { value: Math.sqrt(12), tolerance: 0.02, feedback: "That is √(L²/3), from ⟨x²⟩ alone. Subtracting ⟨x⟩² first is what turns the second moment into a variance." },
      { value: 3, feedback: "3 is L²/12 for L=6, that is the variance itself. Take its square root to get the uncertainty." },
      { value: 6, feedback: "6 is the full width. A uniform distribution's standard deviation is smaller, L/(2√3)." },
    ],
  },
  hints: [
    { text: "Place the interval as [0, L] without loss of generality — variance doesn't depend on where the interval is centered." },
    { text: "Compute <x> = L/2 and <x^2> = L^2/3, then subtract the square." },
  ],
  solution: {
    steps: [
      { description: "$\\langle x\\rangle = L/2$, $\\langle x^2\\rangle = \\int_0^L x^2/L\\,dx = L^2/3$." },
      { description: "$(\\Delta x)^2 = L^2/3 - L^2/4 = L^2/12$.", latex: "\\Delta x = \\frac{L}{2\\sqrt3}" },
      { description: "Substitute $L=6$.", latex: "\\Delta x = \\frac{6}{2\\sqrt3} = \\sqrt{3} \\approx 1.732" },
    ],
    finalAnswer: "$\\Delta x \\approx 1.732$",
  },
  explanation: {
    correctIdea: "Variance is <x^2> minus <x>^2, not <(x-<x>)> or <x>^2 alone.",
    whyCorrect: "Direct integration of both expectation values, for a uniform density, reproduces the well-known L^2/12 uniform-distribution variance.",
    whyWrong: ["Computing only <x^2>=L^2/3 and reporting sqrt(L^2/3) as the answer skips subtracting <x>^2, overestimating the true spread."],
  },
};
