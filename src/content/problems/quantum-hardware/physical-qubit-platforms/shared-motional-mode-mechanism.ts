import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const sharedMotionalModeMechanism: MultipleChoiceProblem = {
  meta: {
    slug: "shared-motional-mode-mechanism",
    title: "How Do Two Trapped Ions Become Entangled?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/trapped-ions",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["trapped-ions"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
  },
  question: {
    type: "multiple-choice",
    prompt: "How does a two-qubit gate entangle two trapped ions that aren't in direct contact?",
    options: [
      { id: "a", text: "One ion's internal state briefly excites the chain's shared vibrational mode, which the other ion's internal state then senses" },
      { id: "b", text: "Their Coulomb repulsion couples the internal states directly, since both ions carry the same charge" },
      { id: "c", text: "One laser beam illuminates both ions at once, and the shared drive field links their internal states directly" },
      { id: "d", text: "A photon emitted by the first ion is reabsorbed by the second, carrying the state across the gap" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Coulomb repulsion is real and it does the first half of the job: it couples the ions' motion into shared modes. It does not reach the internal states, which is why the motional mode has to carry the gate.",
      c: "A laser drives each ion's internal state against the motion; it does not link two internal states to each other. Take the shared mode away and the beam entangles nothing.",
      d: "Spontaneously emitted photons scatter in every direction and destroy coherence rather than carrying it. Photon exchange is how you network separate traps, not how a gate inside one chain works.",
    },
    defaultIncorrectFeedback: "The gate goes through an intermediary: the shared vibrational mode of the ion chain, which couples the two internal states without the ions ever touching.",
  },
  hints: [
    { text: "Ions in one trap sit in a chain, held apart by their mutual repulsion, and vibrate together like coupled pendulums." },
    { text: "That collective motion is a quantum degree of freedom in its own right, and a laser can couple an ion's internal state to it." },
    { text: "Excite the shared motion conditionally on one ion's state, then let the other ion respond to that motion." },
  ],
  solution: {
    steps: [{ description: "The shared motional mode is the intermediary: one ion's internal state couples into it, the other ion's internal state responds to it, and the two end up entangled without ever touching." }],
    finalAnswer: "Through the chain's shared vibrational mode, which carries the coupling from one ion's internal state to the other's.",
  },
  explanation: {
    correctIdea: "Trapped-ion gates route through a collective degree of freedom, the chain's motion, which is why any pair in the chain can be coupled and connectivity is all-to-all.",
    whyCorrect: "Matches the lesson's description of two-qubit gates in trapped-ion systems.",
    whyWrong: [
      { optionId: "b", text: "Stops at the Coulomb coupling of the motion, which is the setup rather than the gate. Repulsion alone touches no internal state." },
      { optionId: "c", text: "Removes the intermediary. A shared beam addresses each ion separately; it does not connect them." },
      { optionId: "d", text: "Substitutes photon exchange, which is the mechanism for linking separate traps and is lossy and decohering inside one." },
    ],
  },
};
