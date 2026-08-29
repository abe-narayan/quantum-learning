import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const superdenseNonOrthogonalMessagesConsequence: MultipleChoiceProblem = {
  meta: {
    slug: "superdense-non-orthogonal-messages-consequence",
    title: "Why Alice's Four Encodings Must Be Orthogonal",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["superdense-coding", "bell-states", "distinguishability"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/superdense-coding"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Alice's four gates ($I$, $X$, $Z$, $ZX$) produce four mutually orthogonal joint states. Suppose instead two of Alice's four possible messages produced non-orthogonal (partially overlapping) joint states. What would go wrong?",
    options: [
      { id: "a", text: "Nothing — Bob could still always distinguish all four messages with certainty." },
      { id: "b", text: "Bob's measurement could assign nonzero probability to more than one of those two messages, making them not perfectly distinguishable." },
      { id: "c", text: "The protocol would still work, but Alice would need to send two qubits instead of one." },
      { id: "d", text: "It would violate the no-cloning theorem." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "Perfect distinguishability by measurement specifically requires orthogonality; non-orthogonal states generally cannot be told apart with certainty by any measurement.",
      c: "The number of qubits Alice sends (one) doesn't change — what breaks is Bob's ability to tell two specific messages apart reliably, not the qubit count.",
      d: "No-cloning is about copying an unknown state, not about the distinguishability of two known, fixed candidate states — it isn't the relevant obstruction here.",
    },
    defaultIncorrectFeedback:
      "Think about what orthogonality buys a measurement: it's exactly the condition that makes a set of quantum states perfectly, reliably distinguishable.",
  },
  hints: [
    { text: "A measurement can perfectly distinguish a set of quantum states only if those states are mutually orthogonal." },
    { text: "If two of Alice's messages produced non-orthogonal states, some measurement outcomes would have nonzero probability under both." },
    { text: "Bob's decode circuit ends in a measurement — so those two messages would sometimes be reported as the wrong one, or as ambiguous." },
  ],
  solution: {
    steps: [
      { description: "Perfect distinguishability by measurement requires the candidate states to be mutually orthogonal." },
      { description: "If two of Alice's four messages produced non-orthogonal joint states, Bob's decode-then-measure circuit would sometimes yield outcomes consistent with either message." },
      { description: "That ambiguity means Bob could no longer recover both classical bits with certainty for those two messages." },
    ],
    finalAnswer: "Non-orthogonal encodings would make two of the four messages sometimes indistinguishable to Bob's measurement.",
  },
  explanation: {
    correctIdea: "Orthogonality of the four joint states is exactly what makes them perfectly distinguishable by a single measurement.",
    whyCorrect: "This is a general fact about quantum measurement, not specific to superdense coding: only orthogonal states can be perfectly discriminated.",
    whyWrong: [
      { optionId: "a", text: "Grants perfect discrimination without orthogonality, which no measurement can deliver for overlapping states." },
      { optionId: "c", text: "Changes the qubit count. Alice still sends one qubit; what degrades is Bob's ability to read it reliably." },
      { optionId: "d", text: "Reaches for no-cloning, which is about copying an unknown state rather than telling two known states apart." },
    ],
  },
};
