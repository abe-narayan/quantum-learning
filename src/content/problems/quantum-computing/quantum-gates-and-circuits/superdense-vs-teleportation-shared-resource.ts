import type { ConceptualProblem } from "@/lib/problems/types";

export const superdenseVsTeleportationSharedResource: ConceptualProblem = {
  meta: {
    slug: "superdense-vs-teleportation-shared-resource",
    title: "Comparing Teleportation's and Superdense Coding's Resources",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["superdense-coding", "quantum-teleportation", "entanglement"],
    prerequisites: [
      "quantum-computing/quantum-gates-and-circuits/superdense-coding",
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "Quantum Teleportation needs two classical bits sent over an ordinary channel, on top of a quantum channel used only for the initial Bell pair. Superdense coding needs one qubit sent over a quantum channel, on top of a quantum channel used only for the initial Bell pair. Compare what kind of 'before you start' resource each protocol shares in advance, and what each one is actually built to transmit later.",
    placeholder: "Both protocols begin the same way, with...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      [
        "pre-shared bell pair",
        "pre-shared",
        "shared entangled pair in advance",
        "shared entanglement",
        "bell pair",
        "entangled pair",
        "epr pair",
        "shared in advance",
        "in advance",
        "beforehand",
        "ahead of time",
        "distribute the bell pair beforehand",
        "already holds half the pair",
        "half the pair",
        "one half each",
      ],
      ["classical bits", "classical channel", "ordinary channel", "two classical bits"],
      ["one qubit", "quantum channel", "a single qubit", "sends her qubit"],
    ],
    incorrectFeedback:
      "Be explicit about all three pieces: (1) the identical resource both protocols share in advance (a Bell pair), (2) what teleportation transmits afterward and over what kind of channel, and (3) what superdense coding transmits afterward and over what kind of channel.",
    partialFeedback:
      "Good — make sure you've named the advance resource both protocols share, and contrasted what each one actually moves afterward.",
  },
  hints: [
    { text: "Both protocols start from the exact same 'before you start' resource: a Bell pair, distributed and shared in advance, one half to each party." },
    { text: "Teleportation moves an unknown quantum state using that pair plus two classical bits sent afterward, over an ordinary (non-quantum) channel." },
    { text: "Superdense coding moves two known classical bits using that pair plus one qubit sent afterward, over a quantum channel." },
  ],
  solution: {
    steps: [
      { description: "Both protocols share the identical advance resource: one Bell pair, distributed ahead of time, with each party holding one half." },
      { description: "Teleportation then transmits an unknown quantum state, using the pair plus two classical bits sent afterward over an ordinary classical channel." },
      { description: "Superdense coding then transmits two known classical bits, using the pair plus one qubit sent afterward over a quantum channel — the roles of 'what's quantum' and 'what's classical' in the later transmission are swapped between the two protocols." },
    ],
    finalAnswer:
      "Both protocols pre-share a Bell pair; teleportation later sends an unknown quantum state via two classical bits, while superdense coding later sends two known classical bits via one qubit — a mirror-image trade of what's moved and over which kind of channel.",
  },
  explanation: {
    correctIdea:
      "The two protocols are built from the same entangled resource but spend it in opposite directions: one moves quantum information using classical bits, the other moves classical information using a qubit.",
    whyCorrect:
      "Both derivations in this course reuse the identical Bell-pair-plus-CNOT-and-H circuit primitives; only the direction of what's transmitted afterward, and over which kind of channel, differs.",
    whyWrong: [
      "Saying the two protocols are 'basically the same' misses the actual point of comparison: they move different kinds of information (quantum vs. classical) using different kinds of channels for the later transmission.",
    ],
  },
};
