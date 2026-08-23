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
  },
  hints: [
    { text: "1000 × 10." },
    { text: "= 10,000." },
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
