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
      {
        phrases: ["delta E = 0", "zero energy uncertainty", "energy eigenstate"],
        missingFeedback:
          "Start with the energy side. Say what kind of state this is and what its energy spread comes to.",
      },
      {
        phrases: ["d<A>/dt = 0", "doesn't change", "expectation values constant", "never changes", "never change", "does not evolve", "nothing evolves", "no evolution", "stays the same", "stay the same", "frozen"],
        missingFeedback:
          "You have the energy side. Now say what such a state does over time, in terms of what happens to the expectation value of an arbitrary observable.",
      },
    ],
    incorrectFeedback: "You said the state is stationary and left it there. The question wants the two halves joined: what the numerator of the energy-time bound is for such a state, and what the denominator of Delta t_A is, computed directly rather than inferred from the bound.",
    partialFeedback: "One route is there. Supply the other: either compute the numerator from the energy spread, or differentiate an expectation value directly and see what the denominator becomes.",
    modelAnswers: [
      "A stationary state is an energy eigenstate, so its energy uncertainty is zero exactly. It also does not change: d<A>/dt = 0 for every observable, so expectation values are constant and the characteristic time for anything to shift is infinite. The bound is then satisfied trivially rather than violated.",
      "With zero energy uncertainty nothing evolves, so no observable's expectation value ever changes and the characteristic time is infinite for all of them. That is exactly what the energy-time bound predicts, so the two facts agree.",
    ],
  },
  hints: [
    { text: "Delta t_A is a ratio. Write down what sits on top and what sits underneath before evaluating either." },
    { text: "Compute the denominator directly for a state whose only time dependence is an overall factor of unit modulus. What happens to every expectation value?" },
    { text: "A ratio with a vanishing denominator has no finite value. Say what that means for the time A takes to shift appreciably, and check it against what the bound predicts from the energy side." },
  ],
  solution: {
    steps: [
      { description: "A stationary state has $\\Delta E=0$ exactly, and every $\\langle A\\rangle$ is time-independent, so $d\\langle A\\rangle/dt=0$ for every observable." },
      { description: "$\\Delta t_A=\\Delta A/|d\\langle A\\rangle/dt|$ then has a zero denominator, giving $\\Delta t_A=\\infty$, consistent with the bound $\\Delta E\\,\\Delta t_A\\ge\\hbar/2$ holding as $0\\times\\infty$, an indeterminate form resolved by the direct physical fact that nothing changes." },
    ],
    finalAnswer: "Delta E=0 and d<A>/dt=0 both hold exactly for a stationary state, giving Delta t_A=infinity for every observable, consistent with (rather than violating) the energy-time bound.",
  },
  explanation: {
    correctIdea: "The energy-time relation's extreme limit reproduces an already-known, independently derived fact about stationary states.",
    whyCorrect: "This cross-check between two different derivations (Ehrenfest-based uncertainty and direct stationary-state analysis) is real evidence the theory is self-consistent.",
    whyWrong: ["Treating Delta E * Delta t_A = 0 * infinity as a genuine contradiction misses that this is a standard indeterminate form, correctly resolved by the direct, independent stationary-state calculation rather than by the limit alone."],
  },
};
