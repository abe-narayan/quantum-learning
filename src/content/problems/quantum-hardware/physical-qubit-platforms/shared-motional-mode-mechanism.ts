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
      { id: "a", text: "One ion's internal state briefly excites the chain's shared vibrational (motional) mode, which the other ion's internal state can then sense" },
      { id: "b", text: "The ions directly touch and exchange charge" },
      { id: "c", text: "A shared laser beam directly links their internal states with no intermediate mechanism" },
      { id: "d", text: "The ions' electric charges directly flip each other's spin" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Ions never touch — they're held apart by Coulomb repulsion within the trap; charge exchange isn't the mechanism.",
      c: "Lasers address individual ions' internal states, but the coupling BETWEEN ions specifically goes through the shared motional mode, not a direct laser-to-laser link.",
      d: "The ions' charge repulsion is what couples their MOTION into a shared vibrational mode — it's this shared mode, not a direct charge-to-spin interaction, that transmits the entangling effect.",
    },
    defaultIncorrectFeedback: "The key intermediate step is the shared vibrational (motional) mode of the ion chain, which couples the ions' internal states indirectly.",
  },
  hints: [
    { text: "Ions in a chain share collective vibrational modes, like coupled pendulums." },
    { text: "A gate uses one ion's internal state to briefly excite this shared motion." },
    { text: "The other ion's internal state can then sense that shared motion, creating the entangling coupling." },
  ],
  solution: {
    steps: [{ description: "The shared motional mode is the intermediary: one ion's internal state couples to it, and the other ion's internal state senses it, entangling them without direct contact." }],
    finalAnswer: "(a) via the shared vibrational (motional) mode",
  },
  explanation: {
    correctIdea: "This is the specific mechanism the lesson names for trapped-ion all-to-all connectivity, distinct from every other platform's gate mechanism.",
    whyCorrect: "Matches the lesson's explicit description of two-qubit gates in trapped-ion systems.",
    whyWrong: ["The other options either misdescribe the physical mechanism (direct contact, charge exchange) or skip the essential intermediate role of the shared motional mode."],
  },
};
