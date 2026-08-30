import type { NumericProblem } from "@/lib/problems/types";

export const barrierTransmissionCalculation: NumericProblem = {
  meta: {
    slug: "barrier-transmission-calculation",
    title: "Transmission Through an Off-Resonance Barrier",
    course: "one-dimensional-systems",
    lesson: "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["scattering", "barrier", "resonance"],
    prerequisites: ["quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"],
  },
  question: {
    type: "numeric",
    prompt: "For E = 6, V0 = 3, and barrier width L = 1 (natural units), find the transmission probability T.",
    inputHint: "a decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.95156,
    tolerance: 0.0005,
    incorrectFeedback: "Compute k2=sqrt(2(E-V0)) first, then T = [1 + V0^2*sin^2(k2*L)/(4*E*(E-V0))]^(-1).",
    nearMisses: [
      { value: 0.0484, tolerance: 0.001, feedback: "That is R = 1 − T, the reflection probability. The question asks for transmission." },
      { value: 1, feedback: "T = 1 happens only on resonance, where sin(k₂L) vanishes. Here k₂L ≈ 2.45 radians, so the sine is nowhere near zero and a little flux reflects." },
    ],
  },
  hints: [
    { text: "The energy sits above the barrier top here, so the wavenumber inside the barrier is real. Transmission oscillates with the width rather than decaying exponentially." },
    { text: "Get the inside wavenumber from the reduced kinetic energy $E-V_0$, then form the barrier's phase: that wavenumber times the width." },
    { text: "The transmission is the reciprocal of one plus a term built from $\\sin^2$ of that phase. Take the sine of an argument in radians, not degrees." },
  ],
  solution: {
    steps: [
      { description: "$k_2=\\sqrt6\\approx2.4495$, $\\sin(k_2\\cdot1)\\approx\\sin(2.4495)\\approx0.6382$." },
      { description: "$T = \\left[1+\\dfrac{9\\times0.6382^2}{4\\times6\\times3}\\right]^{-1} \\approx 0.9516$." },
    ],
    finalAnswer: "$T \\approx 0.9516$",
  },
  explanation: {
    correctIdea: "Away from resonance, transmission is high but not exactly 1 for this moderately thin barrier.",
    whyCorrect: "Direct substitution into the derived closed-form formula.",
    whyWrong: ["Using the E<V0 tunneling formula (exponential decay) instead of this E>V0 formula would give a qualitatively wrong, and much smaller, answer. The physics differs between the two regimes."],
  },
};
