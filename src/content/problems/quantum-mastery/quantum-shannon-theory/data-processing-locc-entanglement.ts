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
      {
        phrases: ["channel", "cptp", "local operation", "acts on B alone", "acts only on B", "applies to B alone"],
        missingFeedback:
          "Before you can apply the inequality you have to say what Bob's step is, mathematically. Name the object it is, and be precise about which system it touches.",
      },
      {
        phrases: ["mutual information", "correlation", "shared information"],
        missingFeedback:
          "You have the operation. Now name the quantity the inequality actually bounds, the one measuring how much A and B share.",
      },
      {
        phrases: ["cannot increase", "never increase", "can only decrease", "monotonic", "data-processing"],
        missingFeedback:
          "You have the operation and the quantity. Now state the inequality's direction: say which way that quantity is allowed to move under Bob's step.",
      },
      {
        phrases: ["carries no quantum state", "sends no quantum state", "no entanglement is sent", "cannot create entanglement", "adds nothing for the bound"],
        missingFeedback:
          "You have handled Bob's quantum step. The protocol also lets him send messages: say what those messages do and do not carry, and why the bound is untroubled by them.",
      },
    ],
    incorrectFeedback:
      "Four things have to be on the page. Name what Bob's local step is, in the vocabulary the lesson's B -> B' arrow uses. Name the quantity being bounded. Name the inequality that bounds it, and state which direction it runs. And say why sending bits back and forth cannot undo the bound, which turns on what a bit does and does not carry.",
    partialFeedback:
      "Good start. Two things are still missing: the Markov-chain shape the inequality needs (A then B then B'), and the reason exchanging bits does not reopen what the local step closed.",
    modelAnswers: [
      "Bob's local step is a CPTP channel acting on B alone, so A, B, B' is exactly the Markov chain the data-processing inequality wants, and it gives I(A:B') <= I(A:B). His mutual information with Alice can only decrease, never increase. A classical message carries no quantum state, so it adds nothing for the bound to act on, and no LOCC protocol can create entanglement.",
      "Treat the local operation as a channel on B only. Data-processing says the correlation cannot increase under it, so the shared information can only decrease. The classical messages send no quantum state, so they cannot create entanglement either.",
    ],
  },
  hints: [
    { text: "Bob's local operation, whatever it physically is, is some CPTP map N acting only on his own qubit: the channel in the lesson's A -> B -> B' Markov chain." },
    { text: "The lesson's corollary says I(A:B') <= I(A:B) whenever B' = N(B) for a channel touching B alone." },
    { text: "Classical messages from Bob to Alice carry no quantum state, so they cannot feed back into the quantum mutual information the inequality bounds. They can only help Alice and Bob use the correlation that already survived, not add to it." },
  ],
  solution: {
    steps: [
      { description: "Model Bob's local operation as a channel N acting on his qubit B alone, producing B' = N(B): exactly the Markov chain A -> B -> B' the lesson's corollary requires." },
      { description: "The corollary I(A:B') <= I(A:B) then applies directly, with equality only for a reversible (unitary) local operation." },
      { description: "Classical communication carries no quantum state, so it cannot restore any quantum correlation a local channel destroyed. At best it lets Alice and Bob coordinate how to use whatever correlation remains." },
    ],
    finalAnswer: "Bob's local step is a channel acting on B alone, so the data-processing inequality gives I(A:B') <= I(A:B): his own operation can only lower the mutual information A shares with him. A classical message carries no quantum state, so it adds nothing for the bound to act on, and no LOCC protocol can ever increase A-B entanglement.",
  },
  explanation: {
    correctIdea:
      "LOCC monotonicity is not a separate postulate. It is the data-processing inequality for mutual information, applied one local step at a time, with classical communication contributing nothing the inequality does not already account for.",
    whyCorrect:
      "Every physically realizable local operation is a CPTP map, the channel class the lesson's monotonicity theorem covers; chaining any number of such steps, with classical messages interleaved, still only ever composes non-increasing steps.",
    whyWrong: [
      "Arguing LOCC cannot increase entanglement just because 'no new particles are entangled' skips the mechanism. The data-processing inequality is what makes this precise and quantitative, and what generalizes to noisy or probabilistic local operations rather than idealized ones.",
    ],
  },
};
