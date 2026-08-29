import type { NumericProblem } from "@/lib/problems/types";

export const rabiProbabilityAtTime: NumericProblem = {
  meta: {
    slug: "rabi-probability-at-time",
    title: "Precession Probability at a Given Time",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["time-evolution", "schrodinger-equation"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $H=\\frac{\\hbar\\omega}{2}Z$ and $|\\psi(0)\\rangle=|+\\rangle$, find the probability of measuring $|+\\rangle$ again at the time when $\\omega t = \\pi/3$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.75,
    tolerance: 0.01,
    incorrectFeedback: "P = cos²(ωt/2). Substitute ωt = π/3, so the angle inside is π/6.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 is cos²(π/3), using ωt where the formula wants ωt/2. Halving the angle is what makes the period 2π/ω rather than 4π/ω." },
      { value: Math.sqrt(3) / 2, tolerance: 0.01, feedback: "√3/2 is cos(π/6), the amplitude. The probability squares it." },
    ],
  },
  hints: [
    { text: "The formula from the lesson is P(t) = cos²(ωt/2)." },
    { text: "With ωt = π/3, the argument of cosine is π/6." },
    { text: "cos(π/6) = √3/2 — square it." },
  ],
  solution: {
    steps: [
      { description: "Apply the formula with $\\omega t/2 = \\pi/6$.", latex: "P = \\cos^2(\\pi/6) = \\left(\\frac{\\sqrt3}{2}\\right)^2" },
      { description: "Simplify.", latex: "P = \\frac34 = 0.75" },
    ],
    finalAnswer: "$P = 0.75$",
  },
  explanation: {
    correctIdea: "Time evolution under this Hamiltonian precesses the state, and the probability of returning to |+⟩ follows cos²(ωt/2).",
    whyCorrect: "Direct substitution and the standard value cos(π/6)=√3/2 give 0.75.",
    whyWrong: ["Using ωt directly instead of ωt/2 inside the cosine is the most common slip here."],
  },
};
