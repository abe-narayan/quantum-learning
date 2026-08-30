import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const nisqMeaningCheck: MultipleChoiceProblem = {
  meta: {
    slug: "nisq-meaning-check",
    title: "What Does NISQ Actually Describe?",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["fault-tolerance"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What does 'NISQ' (Noisy Intermediate-Scale Quantum) describe?",
    options: [
      { id: "a", text: "A stage of hardware development: a few thousand noisy, uncorrected qubits" },
      { id: "b", text: "A specific quantum algorithm designed for factoring on today's devices" },
      { id: "c", text: "A permanent theoretical ceiling on how large a quantum computer can get" },
      { id: "d", text: "A specific hardware platform, such as superconducting or trapped-ion qubits" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "NISQ describes an era of hardware capability, not any specific algorithm. VQE and QAOA are algorithms designed for this era, not what NISQ itself means.",
      c: "NISQ describes the current state of hardware honestly, not a permanent ceiling. The lesson frames it as a description of now, not a claim about the future.",
      d: "NISQ applies across platforms, superconducting and trapped-ion alike. It describes a scale and capability regime, not any one specific technology.",
    },
    defaultIncorrectFeedback: "NISQ names the current hardware era: devices with tens to a few thousand qubits, lacking full error correction. It is not an algorithm, a platform, or a permanent limit.",
  },
  hints: [
    { text: "N = Noisy, I = Intermediate-Scale, Q = Quantum." },
    { text: "It describes a hardware capability regime, not any specific technology or algorithm." },
    { text: "The lesson explicitly distinguishes this from a permanent limitation." },
  ],
  solution: {
    steps: [{ description: "NISQ names the current era: noisy, intermediate-scale devices without full error correction. It is a description of where hardware stands now, not an algorithm, a platform, or a permanent ceiling." }],
    finalAnswer: "A stage of hardware development: tens to a few thousand qubits, running without full error correction.",
  },
  explanation: {
    correctIdea: "NISQ is a label for a hardware capability regime, so it names a moment in the technology's development rather than a technique or a theoretical bound.",
    whyCorrect: "The acronym names a period in hardware history, fixed by two facts about present devices: qubit counts in the hundreds to thousands, and no working error correction. It picks out neither an algorithm nor a platform, and it asserts nothing about the future.",
    whyWrong: [
      { optionId: "b", text: "Names an algorithm. VQE and QAOA were designed for the NISQ era, but the term describes the machines, not the code run on them." },
      { optionId: "c", text: "Reads a snapshot as a ceiling. The lesson frames NISQ as where hardware is today, with fault tolerance as the stated destination." },
      { optionId: "d", text: "Ties the term to one technology. Superconducting, trapped-ion and neutral-atom devices are all NISQ devices right now." },
    ],
  },
};
