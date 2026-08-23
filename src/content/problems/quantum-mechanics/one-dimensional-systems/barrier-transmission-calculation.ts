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
    inputHint: "a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.95156,
    tolerance: 0.0005,
    incorrectFeedback: "Compute k2=sqrt(2(E-V0)) first, then T = [1 + V0^2*sin^2(k2*L)/(4*E*(E-V0))]^(-1).",
  },
  hints: [
    { text: "k2 = sqrt(2*(6-3)) = sqrt(6) ≈ 2.4495." },
    { text: "Substitute into T = [1 + V0^2*sin^2(k2*L)/(4*E*(E-V0))]^(-1)." },
  ],
  solution: {
    steps: [
      { description: "$k_2=\\sqrt6\\approx2.4495$, $\\sin(k_2\\cdot1)\\approx\\sin(2.4495)\\approx0.6367$." },
      { description: "$T = \\left[1+\\dfrac{9\\times0.6367^2}{4\\times6\\times3}\\right]^{-1} \\approx 0.9516$." },
    ],
    finalAnswer: "$T \\approx 0.9516$",
  },
  explanation: {
    correctIdea: "Away from resonance, transmission is high but not exactly 1 for this moderately thin barrier.",
    whyCorrect: "Direct substitution into the derived closed-form formula.",
    whyWrong: ["Using the E<V0 tunneling formula (exponential decay) instead of this E>V0 formula would give a qualitatively wrong (and much smaller) answer — the physics genuinely differs between the two regimes."],
  },
};
