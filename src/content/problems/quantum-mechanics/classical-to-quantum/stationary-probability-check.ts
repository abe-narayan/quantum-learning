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
    incorrectFeedback: "An energy eigenstate only ever accumulates an overall phase, and a pure phase never changes any measurement probability. If your answer varies with t, you are treating the state as a superposition of different energies, which it is not.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 is what a Z eigenstate gives when measured in the X basis, or what a two-energy superposition averages to. Here the measurement basis contains the state itself." },
      { value: 0, feedback: "0 is the probability of the orthogonal outcome |0⟩. The prompt asks for the outcome the system started in." },
    ],
  },
  hints: [
    { text: "Ask what time evolution does to an energy eigenstate: it multiplies the state by a phase factor and nothing else. The vector itself never rotates into anything new." },
    { text: "A global phase has unit modulus, so it drops out of every Born-rule probability. Write $|\\psi(t)\\rangle$ out and check which parts of it can survive into the modulus." },
    { text: "The question asks for the probability of finding the same state you began in. If the state vector never leaves the ray it started on, that probability has nowhere to move to." },
  ],
  solution: {
    steps: [
      { description: "$|1\\rangle$ is an eigenstate of $H$, so $|\\psi(t)\\rangle = e^{-iE_1t/\\hbar}|1\\rangle$ for all $t$." },
      { description: "The overall phase factor has modulus 1 and never affects any Born-rule probability." },
    ],
    finalAnswer: "$P = 1$ for every $t$.",
  },
  explanation: {
    correctIdea: "This is the defining property of a stationary state: probabilities never change.",
    whyCorrect: "The state vector accrues phase but stays proportional to |1⟩ forever, so measuring in the |1⟩ basis always gives certainty.",
    whyWrong: ["Assuming the probability decays or oscillates confuses this with a superposition of different energy eigenstates, which does precess."],
  },
};
