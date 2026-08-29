import type { NumericProblem } from "@/lib/problems/types";

export const crossBasisProbability: NumericProblem = {
  meta: {
    slug: "cross-basis-probability",
    title: "A Cross-Basis Measurement Probability",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["interference", "superposition"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|\\psi\\rangle=\\frac{1}{\\sqrt2}(|0\\rangle+e^{i\\varphi}|1\\rangle)$ with $\\varphi=\\pi/3$, find $P(+)=\\frac{1+\\cos\\varphi}{2}$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.75,
    tolerance: 0.01,
    incorrectFeedback: "cos(π/3) = 0.5. Substitute directly into (1+cosφ)/2.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 is P(−), which uses (1 − cos φ)/2. The two outcomes sum to 1; check which sign the |+⟩ overlap carries." },
      { value: 0.5, feedback: "0.5 is the φ = π/2 case, where the interference term vanishes. At φ = π/3 the cosine is positive, so P(+) rises above a half." },
      { value: Math.PI / 3, tolerance: 0.01, feedback: "You substituted φ where the formula wants cos φ." },
    ],
  },
  hints: [
    { text: "cos(π/3) = 0.5." },
    { text: "P(+) = (1 + 0.5) / 2." },
  ],
  solution: {
    steps: [
      { description: "Substitute $\\cos(\\pi/3)=0.5$.", latex: "P(+) = \\frac{1+0.5}{2} = 0.75" },
    ],
    finalAnswer: "$P(+) = 0.75$",
  },
  explanation: {
    correctIdea: "The derived cross-basis formula gives a direct, exact answer once φ is known.",
    whyCorrect: "Direct substitution of the known cosine value.",
    whyWrong: ["Using φ itself instead of cos(φ) in the formula is a common substitution error."],
  },
};
