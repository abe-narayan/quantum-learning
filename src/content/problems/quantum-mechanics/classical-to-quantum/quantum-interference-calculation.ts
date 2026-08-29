import type { NumericProblem } from "@/lib/problems/types";

export const quantumInterferenceCalculation: NumericProblem = {
  meta: {
    slug: "quantum-interference-calculation",
    title: "A Quantum Interference Calculation",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["interference", "probability"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability"],
  },
  question: {
    type: "numeric",
    prompt:
      "Two paths contribute amplitudes $\\psi_1=0.3$ and $\\psi_2=0.3e^{i2\\pi/3}$. Compute the quantum probability $|\\psi_1+\\psi_2|^2$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.09,
    tolerance: 0.005,
    incorrectFeedback: "Convert ψ2 to rectangular form first (cos120°=-0.5, sin120°≈0.866), add to ψ1, then square the magnitude of the sum.",
    nearMisses: [
      { value: 0.18, feedback: "0.18 is the classical prediction |ψ₁|² + |ψ₂|². The quantum answer adds the cross term 2|ψ₁||ψ₂|cos(120°), which is negative here and removes half of it." },
      { value: 0.36, feedback: "0.36 is (0.3 + 0.3)², treating the second amplitude as if its phase were zero. At 120° the two amplitudes partly cancel instead." },
      { value: 0.3, feedback: "0.3 is the magnitude of one amplitude. The answer is a probability, so it comes from squaring the magnitude of the summed amplitude." },
    ],
  },
  hints: [
    { text: "ψ2 = 0.3(cos 120° + i sin 120°) = -0.15 + 0.2598i." },
    { text: "Add ψ1=0.3 to this: 0.15 + 0.2598i." },
    { text: "Square its magnitude: 0.15² + 0.2598²." },
  ],
  solution: {
    steps: [
      { description: "Convert $\\psi_2$ to rectangular form.", latex: "\\psi_2 = 0.3(\\cos120°+i\\sin120°) \\approx -0.15+0.2598i" },
      { description: "Add the two amplitudes.", latex: "\\psi_1+\\psi_2 \\approx 0.15+0.2598i" },
      { description: "Square the magnitude.", latex: "|\\psi_1+\\psi_2|^2 \\approx 0.15^2+0.2598^2 \\approx 0.09" },
    ],
    finalAnswer: "$\\approx 0.09$",
  },
  explanation: {
    correctIdea: "Amplitudes add as complex numbers before the probability is computed by squaring the magnitude.",
    whyCorrect: "The cross-term formula gives the same result directly: |ψ1|²+|ψ2|²+2|ψ1||ψ2|cos(120°) = 0.18 - 0.09 = 0.09.",
    whyWrong: ["Adding the two probabilities |ψ1|² and |ψ2|² directly (0.18) skips the interference cross term entirely — that's the classical prediction, not the quantum one."],
  },
};
