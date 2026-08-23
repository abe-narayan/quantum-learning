import type { ConceptualProblem } from "@/lib/problems/types";

export const stationaryStateInfiniteTimescale: ConceptualProblem = {
  meta: {
    slug: "stationary-state-infinite-timescale",
    title: "Why a Stationary State Has Infinite Delta t",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["energy-time-uncertainty", "stationary-states"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In two or three sentences, explain why a stationary state (Delta E = 0) is consistent with Delta t_A = infinity for every observable A, using both the energy-time bound and the direct fact that stationary states don't change.",
    placeholder: "Explain the consistency between the two facts...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["delta E = 0", "zero energy uncertainty", "energy eigenstate"],
      ["d<A>/dt = 0", "doesn't change", "expectation values constant"],
    ],
    incorrectFeedback: "Name both pieces: that a stationary state has exactly zero energy uncertainty, and that its expectation values (for every observable) are exactly constant in time, making Delta t_A's denominator zero.",
    partialFeedback: "You're partway there — connect this explicitly to both the bound and the direct stationary-state fact.",
  },
  hints: [
    { text: "What is d<A>/dt for a stationary state, for any observable A?" },
    { text: "What does Delta t_A = Delta A / |d<A>/dt| become when the denominator is zero?" },
  ],
  solution: {
    steps: [
      { description: "A stationary state has $\\Delta E=0$ exactly, and every $\\langle A\\rangle$ is time-independent, so $d\\langle A\\rangle/dt=0$ for every observable." },
      { description: "$\\Delta t_A=\\Delta A/|d\\langle A\\rangle/dt|$ then has a zero denominator, giving $\\Delta t_A=\\infty$ — consistent with the bound $\\Delta E\\,\\Delta t_A\\ge\\hbar/2$ holding as $0\\times\\infty$, an indeterminate form resolved by the direct physical fact that nothing changes." },
    ],
    finalAnswer: "Delta E=0 and d<A>/dt=0 both hold exactly for a stationary state, giving Delta t_A=infinity for every observable, consistent with (rather than violating) the energy-time bound.",
  },
  explanation: {
    correctIdea: "The energy-time relation's extreme limit exactly reproduces an already-known, independently-derived fact about stationary states.",
    whyCorrect: "This cross-check between two different derivations (Ehrenfest-based uncertainty and direct stationary-state analysis) is real evidence the theory is self-consistent.",
    whyWrong: ["Treating Delta E * Delta t_A = 0 * infinity as a genuine contradiction misses that this is a standard indeterminate form, correctly resolved by the direct, independent stationary-state calculation rather than by the limit alone."],
  },
};
