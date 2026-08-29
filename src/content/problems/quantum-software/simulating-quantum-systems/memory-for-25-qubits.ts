import { stateVectorMemoryBytes } from "@/lib/quantum/simulationCost";
import type { NumericProblem } from "@/lib/problems/types";

const value = stateVectorMemoryBytes(25);

export const memoryFor25Qubits: NumericProblem = {
  meta: {
    slug: "memory-for-25-qubits",
    title: "Exact Memory Required for 25-Qubit Simulation",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["computational-cost"],
    prerequisites: ["quantum-software/simulating-quantum-systems/computational-cost-and-scaling"],
  },
  question: {
    type: "numeric",
    prompt: "Using 16×2ⁿ bytes, what is the exact memory (in bytes) required for a 25-qubit state-vector simulation?",
    inputHint: "in bytes",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1000,
    incorrectFeedback: "Compute 16 × 2^25.",
    nearMisses: [
      { value: 2 ** 25, tolerance: 1000, feedback: "That is the amplitude count. Each complex amplitude takes 16 bytes, two double-precision floats." },
      { value: 8 * 2 ** 25, tolerance: 1000, feedback: "8 bytes covers one double. A complex amplitude needs two of them, real and imaginary." },
    ],
  },
  hints: [
    { text: "2^25 = 33,554,432." },
    { text: "Each complex amplitude takes 16 bytes (two doubles), so multiply the amplitude count by 16." },
    { text: "Work the product out in full: the question asks for an exact byte count. Sanity check the scale against the lesson's ranges, which put 25 qubits at roughly half a gigabyte." },
  ],
  solution: {
    steps: [{ description: "16 × 2^25 = 16 × 33,554,432 = 536,870,912 bytes ≈ 512 MB." }],
    finalAnswer: "536,870,912 bytes (≈512 MB)",
  },
  explanation: {
    correctIdea: "This sits comfortably within the lesson's 'runs on a laptop' range (20 qubits) and well below the 'needs a cluster' 30-qubit mark — a good illustration of the exponential growth's specific location.",
    whyCorrect: "Matches stateVectorMemoryBytes(25) computed directly from the engine.",
    whyWrong: ["Forgetting the factor of 16 bytes per amplitude (using just 2^25 as the answer) would understate the true memory requirement by 16×."],
  },
};
