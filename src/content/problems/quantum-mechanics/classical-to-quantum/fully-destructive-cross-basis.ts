import type { NumericProblem } from "@/lib/problems/types";

export const fullyDestructiveCrossBasis: NumericProblem = {
  meta: {
    slug: "fully-destructive-cross-basis",
    title: "Fully Destructive Interference in a Different Basis",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["interference", "superposition"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|\\psi\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle+e^{i\\varphi}|1\\rangle)$ with $\\varphi=\\pi$, find $P(+)$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0,
    tolerance: 0.01,
    incorrectFeedback: "cos(π) = -1. Substitute into (1+cosφ)/2.",
    nearMisses: [
      { value: 1, feedback: "1 is P(−). At φ = π the state is |−⟩, so all the weight sits on the other X-basis outcome." },
      { value: 0.5, feedback: "0.5 is the φ = π/2 case, where the interference term drops out. At φ = π the term is at its most negative and cancels the 1 entirely." },
    ],
  },
  hints: [
    { text: "cos(π) = -1." },
    { text: "P(+) = (1 + (-1)) / 2." },
  ],
  solution: {
    steps: [
      { description: "Substitute $\\cos(\\pi)=-1$.", latex: "P(+) = \\frac{1+(-1)}{2} = 0" },
    ],
    finalAnswer: "$P(+) = 0$",
  },
  explanation: {
    correctIdea: "At φ=π, the interference is fully destructive in the |+⟩ direction — the state is exactly |−⟩.",
    whyCorrect: "1/√2(|0⟩ - |1⟩) is exactly |−⟩, which has zero overlap with |+⟩ by orthogonality.",
    whyWrong: ["Answering 0.5 would be the 'no interference' case (φ=π/2), not the fully destructive case."],
  },
};
