import type { NumericProblem } from "@/lib/problems/types";

export const stationaryProbabilityCheck: NumericProblem = {
  meta: {
    slug: "stationary-probability-check",
    title: "A Stationary State's Probability Over Time",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/stationary-states",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["stationary-states"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/stationary-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $H=\\frac{\\hbar\\omega}{2}Z$ and initial state $|\\psi(0)\\rangle=|1\\rangle$ (an eigenstate of $H$), what is $P(\\text{measure } |1\\rangle)$ at any later time $t$?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 1,
    tolerance: 0.001,
    incorrectFeedback: "An energy eigenstate only accumulates an overall phase — a factor with |·|=1 — which never changes any measurement probability.",
  },
  hints: [
    { text: "|ψ(t)⟩ = e^{-iE_1t/ℏ}|1⟩ for some energy E_1 — the same vector |1⟩, times a phase." },
    { text: "Global phase never changes a Born-rule probability." },
  ],
  solution: {
    steps: [
      { description: "$|1\\rangle$ is an eigenstate of $H$, so $|\\psi(t)\\rangle = e^{-iE_1t/\\hbar}|1\\rangle$ for all $t$." },
      { description: "The overall phase factor has modulus 1 and never affects any Born-rule probability." },
    ],
    finalAnswer: "$P = 1$ for every $t$.",
  },
  explanation: {
    correctIdea: "This is the defining property of a stationary state — probabilities never change.",
    whyCorrect: "The state vector accrues phase but stays proportional to |1⟩ forever, so measuring in the |1⟩ basis always gives certainty.",
    whyWrong: ["Assuming the probability decays or oscillates confuses this with a superposition of different energy eigenstates, which does precess."],
  },
};
