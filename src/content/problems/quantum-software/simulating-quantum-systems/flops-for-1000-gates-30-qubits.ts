import { estimatedGateFlops } from "@/lib/quantum/simulationCost";
import type { NumericProblem } from "@/lib/problems/types";

const value = estimatedGateFlops(30, 1000);

export const flopsFor1000Gates30Qubits: NumericProblem = {
  meta: {
    slug: "flops-for-1000-gates-30-qubits",
    title: "Estimated Operations for 1000 Gates on 30 Qubits",
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
    prompt: "Using numGates × 2ⁿ, estimate the total floating-point operations for a 1000-gate circuit on 30 qubits.",
    inputHint: "as a number (scientific notation is fine)",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.02,
    toleranceType: "relative",
    incorrectFeedback: "Compute 1000 × 2^30.",
    nearMisses: [
      { value: 2 ** 30, tolerance: 0.02, feedback: "That is 2^30, the cost of a single gate. Every gate touches the whole state vector, so the total multiplies by the gate count." },
      { value: 1000 * 30, tolerance: 0.02, feedback: "That treats the cost as linear in the qubit count. State-vector simulation touches 2^n amplitudes per gate, not n." },
    ],
  },
  hints: [
    { text: "The cost per gate is one pass over the whole state vector, so it scales as 2^n rather than n." },
    { text: "2^30 ≈ 1.074 × 10⁹ amplitudes." },
    { text: "Multiply that by the gate count. Sanity check against the lesson's 35-qubit, 500-gate case: this circuit should come out substantially cheaper." },
  ],
  solution: {
    steps: [{ description: "1000 × 2^30 ≈ 1000 × 1.074×10⁹ ≈ 1.074×10¹² operations." }],
    finalAnswer: "≈1.07×10¹²",
  },
  explanation: {
    correctIdea: "At about 10¹² operations per second, the worked example's assumed hardware speed, this circuit would take roughly 1 second. That is a useful comparison point against the worked example's 35-qubit, 500-gate case, at about 17 seconds.",
    whyCorrect: "Each gate touches every amplitude, and there are 2³⁰ ≈ 1.07 × 10⁹ of them, so the work scales as gates × 2ⁿ. A thousand gates therefore costs about 10¹² operations, and one more qubit doubles the bill. estimatedGateFlops(30,1000) returns the same figure.",
    whyWrong: ["Forgetting the multiplication by numGates (using just 2^30 alone) would understate the total cost by a factor of 1000."],
  },
};
