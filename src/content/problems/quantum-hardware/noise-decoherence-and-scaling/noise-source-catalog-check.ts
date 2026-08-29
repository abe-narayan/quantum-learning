import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const noiseSourceCatalogCheck: MultipleChoiceProblem = {
  meta: {
    slug: "noise-source-catalog-check",
    title: "Which Noise Source Is Modeled by dephasingChannel?",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["noise-sources"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson's catalog, which physical noise source is modeled by this platform's dephasingChannel?",
    options: [
      { id: "a", text: "Random phase kicks from fluctuating fields (e.g. flux noise), an incoherent error" },
      { id: "b", text: "Stale calibration values, a coherent error" },
      { id: "c", text: "Unwanted rotation leaking onto a neighboring qubit" },
      { id: "d", text: "Misclassification during readout" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Stale calibration is a coherent error, mentioned in this lesson but modeled by recalibration procedures (Control & Readout), not dephasingChannel.",
      c: "That's crosstalk, covered in a later lesson of this course, modeled with the gate engine directly, not dephasingChannel.",
      d: "That's readout error, covered in Control & Readout's Qubit Readout Techniques lesson.",
    },
    defaultIncorrectFeedback: "dephasingChannel specifically models random, incoherent phase kicks — e.g. from fluctuating magnetic flux in superconducting qubits.",
  },
  hints: [
    { text: "dephasingChannel is one of the two Kraus channels from Advanced Topics in Quantum Mechanics." },
    { text: "It models loss of PHASE coherence, not energy." },
    { text: "This lesson's catalog names flux noise as a concrete physical example of this kind of dephasing." },
  ],
  solution: {
    steps: [{ description: "dephasingChannel models random, incoherent phase kicks, such as those from fluctuating magnetic flux." }],
    finalAnswer: "Random phase kicks from fluctuating fields, such as flux noise: an incoherent error.",
  },
  explanation: {
    correctIdea: "dephasingChannel is the Kraus model for randomized phase, so it maps onto physical mechanisms that scramble phase without moving energy.",
    whyCorrect: "Matches the lesson's catalog entry for dephasing.",
    whyWrong: [
      { optionId: "b", text: "Names a coherent error. A stale calibration is a deterministic offset, undone by recalibration rather than modeled as a random channel." },
      { optionId: "c", text: "Names crosstalk, which is a unitary leak onto a neighbour and is modeled with the gate engine directly." },
      { optionId: "d", text: "Names readout error, which happens in the classical discrimination step after the state is already measured." },
    ],
  },
};
