import type { NumericProblem } from "@/lib/problems/types";

const n = 20;
const value = 2 ** n;

export const amplitudesFor20Qubits: NumericProblem = {
  meta: {
    slug: "amplitudes-for-20-qubits",
    title: "How Many Amplitudes for 20-Qubit Exact Simulation?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["simulators"],
    prerequisites: ["quantum-software/programming-quantum-computers/simulators-vs-real-hardware"],
  },
  question: {
    type: "numeric",
    prompt: "How many complex amplitudes does exact state-vector simulation of a 20-qubit circuit require?",
    inputHint: "as a number",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1000,
    incorrectFeedback: "Compute 2^20.",
  },
  hints: [
    { text: "State-vector simulation needs 2^n amplitudes for n qubits." },
    { text: "2^20 = 2^10 × 2^10 = 1024 × 1024." },
    { text: "≈1,048,576." },
  ],
  solution: {
    steps: [{ description: "2^20 = 1,048,576 amplitudes — about a million, still very manageable classically." }],
    finalAnswer: "1,048,576 (≈10⁶)",
  },
  explanation: {
    correctIdea: "This is still small (a modern computer handles a million complex numbers trivially) — the exponential wall becomes serious only much later (30-50+ qubits), exactly the point the lesson makes about WHERE the limit actually bites.",
    whyCorrect: "Direct computation of 2^20.",
    whyWrong: ["Confusing 2^n growth with linear growth would badly underestimate how fast this quantity grows for larger n, even though 20 qubits alone is still tractable."],
  },
};
