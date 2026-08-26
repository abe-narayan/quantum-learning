import type { ConceptualProblem } from "@/lib/problems/types";

export const dataProcessingLoccEntanglement: ConceptualProblem = {
  meta: {
    slug: "data-processing-locc-entanglement",
    title: "Why LOCC Can Never Increase Entanglement",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["data-processing-inequality", "locc", "entanglement-monotone"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/the-data-processing-inequality"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Alice and Bob share an entangled pair. Using the data-processing inequality for mutual information, explain why any sequence of local operations Bob performs on his own qubit (plus classical messages to Alice, which carry no quantum state) can never increase A-B correlation, and hence never increase their entanglement.",
    placeholder: "Treat Bob's local operation as a channel N acting on B alone, so B' = N(B) is exactly the Markov-chain setup...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["channel", "N(B)", "local operation", "acts on B alone", "acts only on B"],
      ["I(A:B)", "mutual information", "correlation"],
      ["cannot increase", "never increase", "can only decrease", "monotonic", "data-processing"],
      ["classical communication", "classical message", "no quantum state"],
    ],
    incorrectFeedback:
      "Be explicit about all four pieces: that Bob's local step is exactly the channel N in the A->B->B' setup, that I(A:B) is the quantity being bounded, that the data-processing inequality forces I(A:B')<=I(A:B), and that classical messages don't change the argument since they carry no quantum state for the inequality to act on.",
    partialFeedback:
      "Good start -- now connect this explicitly to the data-processing inequality's Markov-chain structure (A -> B -> B'), and note that classical communication alone doesn't reintroduce any quantum correlation the local channel destroyed.",
  },
  hints: [
    { text: "Bob's local operation, whatever it physically is, is some CPTP map N acting only on his own qubit -- exactly the channel in the lesson's A -> B -> B' Markov chain." },
    { text: "The lesson's corollary says I(A:B') <= I(A:B) whenever B' = N(B) for a channel touching B alone." },
    { text: "Classical messages from Bob to Alice carry no quantum state at all, so they cannot feed back into the quantum mutual information the inequality bounds -- they can only help Alice and Bob use the correlation that already survived, not add to it." },
  ],
  solution: {
    steps: [
      { description: "Model Bob's local operation as a channel N acting on his qubit B alone, producing B' = N(B): exactly the Markov chain A -> B -> B' the lesson's corollary requires." },
      { description: "The corollary I(A:B') <= I(A:B) then applies directly, with equality only for a reversible (unitary) local operation." },
      { description: "Classical communication carries no quantum state, so it cannot restore any quantum correlation a local channel destroyed -- at best it lets Alice and Bob coordinate how to use whatever correlation remains." },
    ],
    finalAnswer: "Any local channel on B satisfies I(A:B') <= I(A:B) by the data-processing corollary; classical messages add nothing quantum to reverse this, so no LOCC protocol can ever increase A-B entanglement.",
  },
  explanation: {
    correctIdea:
      "LOCC monotonicity is not a separate postulate -- it is the data-processing inequality for mutual information, applied one local step at a time, with classical communication contributing nothing the inequality doesn't already account for.",
    whyCorrect:
      "Every physically realizable local operation is a CPTP map, exactly the channel class the lesson's monotonicity theorem covers; chaining any number of such steps (with classical messages interleaved) still only ever composes non-increasing steps.",
    whyWrong: [
      "Arguing LOCC can't increase entanglement just because 'no new particles are entangled' skips the actual mechanism -- the data-processing inequality is what makes this precise and quantitative, and is what generalizes to noisy or probabilistic local operations, not just idealized ones.",
    ],
  },
};
