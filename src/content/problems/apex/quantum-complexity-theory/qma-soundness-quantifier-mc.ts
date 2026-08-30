import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const qmaSoundnessQuantifierMc: MultipleChoiceProblem = {
  meta: {
    slug: "qma-soundness-quantifier-mc",
    title: "QMA's Soundness Condition, Stated Precisely",
    course: "quantum-complexity-theory",
    lesson: "apex/quantum-complexity-theory/qma-and-quantum-verification",
    difficulty: "master",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["qma", "definitions", "soundness", "quantifiers"],
    prerequisites: ["apex/quantum-complexity-theory/qma-and-quantum-verification"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Which statement correctly and completely captures QMA's soundness condition for a NO instance x?",
    options: [
      {
        id: "a",
        text: "There exists at least one poly-qubit state the verifier accepts with probability <= 1/3, and the rest need no check at all.",
      },
      {
        id: "b",
        text: "Every poly-qubit quantum state Merlin might send, including states entangled across all qubits, is accepted with probability <= 1/3.",
      },
      {
        id: "c",
        text: "The witness state that mimics a real proof most closely is accepted with probability <= 1/3, and a rational Merlin sends nothing else.",
      },
      {
        id: "d",
        text: "Only computational-basis witnesses, that is classical strings encoded as states, need checking, since QMA generalizes NP itself.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "This is the wrong quantifier direction. It says only that some bad witness is rejected, not that every possible witness is, which is too weak to be a soundness guarantee at all.",
      c: "This checks only the witness Merlin was 'supposed' to send. Soundness has to hold against every possible state a fully adversarial Merlin might send, however exotic or entangled.",
      d: "Restricting to basis states would only re-derive NP's own soundness. QMA's definition quantifies over all quantum states, including highly entangled superpositions with no classical analogue, which is why amplifying the soundness side needs more care than the completeness side.",
    },
    defaultIncorrectFeedback:
      "Recall the lesson's emphasis on stating QMA's soundness condition with the same universal-quantifier care NP's own soundness condition demands.",
  },
  hints: [
    { text: "Completeness is existential (some witness works); soundness is the opposite quantifier." },
    { text: "Soundness must rule out every possible state Merlin could send for a NO instance, not just a plausible-looking cheating strategy." },
    { text: "This is why the soundness side of the amplification argument is more subtle than the completeness side: an adversarial state need not be a product of independent registers." },
  ],
  solution: {
    steps: [
      { description: "QMA's definition requires: for x not in L, for every p(n)-qubit state |psi>, the verifier accepts with probability <= 1/3." },
      { description: "This is a universal quantifier over the entire space of possible witness states, not just classical basis states or one 'intended' cheating strategy." },
    ],
    finalAnswer: "Every poly-qubit state Merlin could send, however entangled, is accepted with probability <= 1/3.",
  },
  explanation: {
    correctIdea: "QMA soundness is a universal statement over every possible quantum witness, mirroring NP's own soundness quantifier.",
    whyCorrect:
      "Getting this quantifier backwards, or narrowing its scope, does not merely weaken the definition. It stops defining soundness at all: if only some witness has to be rejected, a cheating prover simply hands over a different one.",
    whyWrong: [
      { optionId: "a", text: "Inverts the quantifier. Saying some state is rejected is an existential claim, far too weak to rule out a cheating Merlin." },
      { optionId: "c", text: "Restricts the space of witnesses to the one Merlin was supposed to send. Soundness has to hold against every state an adversarial Merlin might send." },
      { optionId: "d", text: "Restricts the space of witnesses to computational basis states, which only re-derives NP's soundness. QMA quantifies over all quantum states, entangled superpositions included." },
    ],
  },
};
