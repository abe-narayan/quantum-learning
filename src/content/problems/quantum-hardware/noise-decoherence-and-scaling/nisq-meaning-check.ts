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
      { id: "a", text: "The current era of hardware: tens to a few thousand qubits, without full error correction" },
      { id: "b", text: "A specific quantum algorithm for factoring large numbers" },
      { id: "c", text: "A permanent theoretical limit on how large a quantum computer can ever be" },
      { id: "d", text: "A specific hardware platform, like superconducting or trapped-ion qubits" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "NISQ describes an ERA of hardware capability, not any specific algorithm — VQE and QAOA are examples of algorithms designed FOR this era, not what NISQ itself means.",
      c: "NISQ describes the CURRENT state of hardware honestly, not a permanent ceiling — the lesson explicitly frames it as a description of now, not a claim about the future.",
      d: "NISQ applies across platforms (superconducting, trapped ion, etc.) — it describes a scale/capability regime, not any one specific technology.",
    },
    defaultIncorrectFeedback: "NISQ names the current hardware era: devices with tens to a few thousand qubits, lacking full error correction — not an algorithm, platform, or permanent limit.",
  },
  hints: [
    { text: "N = Noisy, I = Intermediate-Scale, Q = Quantum." },
    { text: "It's a description of a hardware CAPABILITY regime, not any specific technology or algorithm." },
    { text: "The lesson explicitly distinguishes this from a permanent limitation." },
  ],
  solution: {
    steps: [{ description: "NISQ names the current era: noisy, intermediate-scale devices without full error correction. It is a description of where hardware stands now, not an algorithm, a platform, or a permanent ceiling." }],
    finalAnswer: "The current era of hardware: tens to a few thousand qubits, running without full error correction.",
  },
  explanation: {
    correctIdea: "NISQ is a label for a hardware capability regime, so it names a moment in the technology's development rather than a technique or a theoretical bound.",
    whyCorrect: "Matches the lesson's explicit definition.",
    whyWrong: [
      { optionId: "b", text: "Names an algorithm. VQE and QAOA were designed for the NISQ era, but the term describes the machines, not the code run on them." },
      { optionId: "c", text: "Reads a snapshot as a ceiling. The lesson frames NISQ as where hardware is today, with fault tolerance as the stated destination." },
      { optionId: "d", text: "Ties the term to one technology. Superconducting, trapped-ion and neutral-atom devices are all NISQ devices right now." },
    ],
  },
};
