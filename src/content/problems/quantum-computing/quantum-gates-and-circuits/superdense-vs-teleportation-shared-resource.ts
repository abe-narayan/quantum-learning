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
      {
        phrases: ["both pre-share", "both share the same", "the same resource", "identical resource", "same shared resource", "same starting resource", "both start from a bell pair", "both start with", "both begin with", "the shared resource is the same", "already holds half the pair", "half the pair", "one half each"],
        missingFeedback:
          "Deal with what is held in advance before you deal with the transmission. Say what each protocol must have in hand before anything is sent, and whether the two answers differ.",
      },
      {
        phrases: ["unknown quantum state", "unknown state", "state it does not know", "state she does not know", "a qubit's state", "moves a quantum state", "transmits a state", "sends a state", "carries a state"],
        missingFeedback:
          "You have the advance resource. Now say what teleportation is built to move afterwards, and be specific about whether the sender knows what it is.",
      },
      {
        phrases: ["two known classical bits", "known classical bits", "two bits of information", "two bits using one qubit", "two classical bits via one qubit", "one qubit carries two bits", "two bits with a single qubit"],
        missingFeedback:
          "You have teleportation's job. Now say what superdense coding sends instead, counting both what is transmitted and what it is carried on.",
      },
    ],
    incorrectFeedback:
      "You described the two protocols separately instead of comparing them. Lay out three items: the resource both hold before anything starts, what teleportation puts on the wire afterwards and over what sort of wire, and the same two facts for superdense coding.",
    partialFeedback:
      "Name the resource both protocols hold before they begin, then contrast what each one puts on the wire once they do.",
    modelAnswers: [
      "Both protocols start with the same shared resource, a Bell pair, with each party already holding half the pair. After that they run in opposite directions: teleportation moves an unknown quantum state using two classical bits, while superdense coding sends two known classical bits using one qubit.",
      "The resource held in advance is identical: both begin with an entangled pair split between them. What they transmit later is a mirror image. Teleportation carries a state Alice does not know; superdense coding gets two bits of information across with a single qubit.",
    ],
  },
  hints: [
    { text: "Both protocols need something set up before either message exists. Name it, and say how it is divided between the two parties." },
    { text: "Now teleportation. Once Alice has measured, what does she put on the wire, how many of them, and is that wire quantum or ordinary?" },
    { text: "Now superdense coding. Same three questions: what goes on the wire, how much of it, and what kind of wire." },
  ],
  solution: {
    steps: [
      { description: "Both protocols share the identical advance resource: one Bell pair, distributed ahead of time, with each party holding one half." },
      { description: "Teleportation then transmits an unknown quantum state, using the pair plus two classical bits sent afterward over an ordinary classical channel." },
      { description: "Superdense coding then transmits two known classical bits, using the pair plus one qubit sent afterwards over a quantum channel. Between the two protocols, the roles of what is quantum and what is classical in that later transmission are swapped." },
    ],
    finalAnswer:
      "Both protocols pre-share a Bell pair; teleportation later sends an unknown quantum state via two classical bits, while superdense coding later sends two known classical bits via one qubit: a mirror-image trade of what moves and over which kind of channel.",
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
