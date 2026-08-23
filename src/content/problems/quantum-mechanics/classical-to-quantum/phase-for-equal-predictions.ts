import type { NumericProblem } from "@/lib/problems/types";

export const phaseForEqualPredictions: NumericProblem = {
  meta: {
    slug: "phase-for-equal-predictions",
    title: "Where Quantum and Classical Predictions Agree",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["complex-amplitudes", "interference"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/why-complex-amplitudes"],
  },
  question: {
    type: "numeric",
    prompt:
      "For equal-magnitude amplitudes $\\psi_1=0.4$ and $\\psi_2=0.4e^{i\\theta}$, find the value of $\\theta$ in $(0,\\pi)$ where the quantum and classical predictions coincide, as a multiple of $\\pi$ (e.g. enter 0.5 for $\\theta=\\pi/2$).",
    inputHint: "as a decimal multiple of π",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.02,
    incorrectFeedback: "The cross term is proportional to cos(θ) — find where cos(θ)=0 in that range.",
  },
  hints: [
    { text: "The quantum and classical predictions differ only by the cross term, proportional to cos(θ)." },
    { text: "They coincide exactly when the cross term is zero." },
    { text: "cos(θ)=0 at θ=π/2 within (0,π)." },
  ],
  solution: {
    steps: [
      { description: "The cross term $2\\psi_1\\psi_2\\cos\\theta$ vanishes exactly when $\\cos\\theta=0$." },
      { description: "Within $(0,\\pi)$, that happens at $\\theta=\\pi/2$." },
    ],
    finalAnswer: "$\\theta = \\pi/2$ (i.e. $0.5\\pi$)",
  },
  explanation: {
    correctIdea: "The interference term is what separates the quantum and classical predictions, and it's proportional to cos(θ).",
    whyCorrect: "At θ=π/2, cos(θ)=0, so the cross term vanishes and both predictions equal |ψ1|²+|ψ2|² exactly.",
    whyWrong: ["θ=0 and θ=π are the extremes (fully constructive/destructive), not where the two predictions agree."],
  },
};
