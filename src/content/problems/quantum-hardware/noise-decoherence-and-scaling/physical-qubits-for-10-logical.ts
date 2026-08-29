import type { NumericProblem } from "@/lib/problems/types";

const overheadPerLogicalQubit = 1000;
const logicalQubits = 10;
const value = overheadPerLogicalQubit * logicalQubits;

export const physicalQubitsFor10Logical: NumericProblem = {
  meta: {
    slug: "physical-qubits-for-10-logical",
    title: "Physical Qubits Needed for 10 Logical Qubits",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["fault-tolerance"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"],
  },
  question: {
    type: "numeric",
    prompt: "Using the lesson's representative estimate of 1000 physical qubits per logical qubit, how many physical qubits would a 10-logical-qubit fault-tolerant algorithm need?",
    inputHint: "as a number",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 10,
    incorrectFeedback: "Multiply 1000 physical qubits per logical qubit by 10 logical qubits.",
    nearMisses: [
      { value: 1000, feedback: "1000 is the overhead for a single logical qubit. Ten of them cost ten times that." },
      { value: 10, tolerance: 0.5, feedback: "10 is the logical qubit count. Each one is encoded across about a thousand physical qubits." },
    ],
  },
  hints: [
    { text: "The overhead is quoted per logical qubit, so it multiplies the logical count rather than being shared across it." },
    { text: "Multiply the two figures. Sanity check against the lesson's own example, which needed 50,000 physical qubits for 50 logical ones: yours should come out five times smaller." },
  ],
  solution: {
    steps: [{ description: "1000 × 10 = 10,000 physical qubits." }],
    finalAnswer: "10,000",
  },
  explanation: {
    correctIdea: "This directly applies the lesson's own worked-example methodology (50 logical qubits → 50,000 physical) to a smaller, still substantial target.",
    whyCorrect: "Direct multiplication, matching the lesson's stated overhead estimate.",
    whyWrong: ["Confusing logical and physical qubit counts (answering just 10) misses the entire point of the overhead multiplier this lesson introduces."],
  },
};
