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
    steps: [{ description: "NISQ describes the current era: noisy, intermediate-scale devices without full error correction — a description of now, not an algorithm, platform, or permanent ceiling." }],
    finalAnswer: "(a) The current era of hardware: tens to a few thousand qubits, without full error correction",
  },
  explanation: {
    correctIdea: "This tests basic recall of the lesson's defined term, guarding against common conflations (NISQ as an algorithm, or as a permanent limit).",
    whyCorrect: "Matches the lesson's explicit definition.",
    whyWrong: ["VQE/QAOA are algorithms SUITED to the NISQ era, not NISQ itself; and the lesson explicitly warns against treating NISQ as a permanent limitation."],
  },
};
