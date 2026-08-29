import type { NumericProblem } from "@/lib/problems/types";

export const synthesisBeatFrequencyCalculation: NumericProblem = {
  meta: {
    slug: "synthesis-beat-frequency-calculation",
    title: "Synthesis: Beat Frequency of a Superposition",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/wave-mechanics-challenge",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["synthesis", "superposition", "infinite-square-well"],
    prerequisites: ["quantum-mechanics/wave-mechanics/wave-mechanics-challenge"],
  },
  question: {
    type: "numeric",
    prompt: "An infinite well of width L = 10 (natural units, hbar = m = 1) holds an equal superposition of its n=1 and n=2 eigenstates. Find the beat angular frequency omega_beat = (E2 - E1)/hbar.",
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.148044,
    tolerance: 0.001,
    incorrectFeedback: "First find E_1 and E_2 using E_n = n^2*pi^2/(2*L^2), then subtract.",
    nearMisses: [
      { value: (5 * Math.PI ** 2) / 200, tolerance: 0.002, feedback: "That is E₂ + E₁. The beat frequency comes from the gap between the levels, not their total." },
      { value: (4 * Math.PI ** 2) / 200, tolerance: 0.002, feedback: "That is E₂ alone. Subtract E₁ to get the gap that sets the oscillation." },
      { value: Math.PI ** 2 / 200, tolerance: 0.002, feedback: "That is E₁ alone. The beat frequency is E₂ − E₁." },
    ],
  },
  hints: [
    { text: "Compute E_1 = pi^2/(2*100) and E_2 = 4*pi^2/(2*100) separately." },
    { text: "The beat frequency is exactly E_2 - E_1 (hbar=1)." },
  ],
  solution: {
    steps: [
      { description: "$E_1 = \\dfrac{\\pi^2}{200} \\approx 0.04935$, $E_2 = \\dfrac{4\\pi^2}{200} \\approx 0.19739$." },
      { description: "$\\omega_{\\rm beat} = E_2-E_1 \\approx 0.19739 - 0.04935 = 0.14804$." },
    ],
    finalAnswer: "$\\omega_{\\rm beat} \\approx 0.1480$",
  },
  explanation: {
    correctIdea: "A superposition's probability density oscillates at a frequency set exactly by the energy gap between the two superposed levels.",
    whyCorrect: "This is exactly the beat pattern visible in the Wavefunction Explorer's superposition preset, computed directly from the analytical energy formula.",
    whyWrong: ["Using the sum E_1+E_2 instead of the difference E_2-E_1 confuses the average energy with the beat frequency, which depends on the energy gap, not the total."],
  },
};
