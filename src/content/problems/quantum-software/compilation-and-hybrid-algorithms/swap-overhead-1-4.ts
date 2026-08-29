import { swapOverheadForLinearChain } from "@/lib/quantum/transpilation";
import type { NumericProblem } from "@/lib/problems/types";

const value = swapOverheadForLinearChain(1, 4);

export const swapOverhead14: NumericProblem = {
  meta: {
    slug: "swap-overhead-1-4",
    title: "SWAP Overhead for Control=1, Target=4",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["transpilation"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"],
  },
  question: {
    type: "numeric",
    prompt: "Using 2(d-1), how many SWAP gates does bridging control=1, target=4 need on a linear chain?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "d = |1-4| = 3, so overhead = 2(3-1).",
    nearMisses: [
      { value: 6, feedback: "6 is 2d. Adjacent qubits need no swaps at all, so the formula uses d−1." },
      { value: 2, feedback: "2 is d−1, the number of hops one way. The factor of 2 covers walking the qubit back afterwards." },
      { value: 3, feedback: "3 is the distance d itself, not the swap count it costs." },
    ],
  },
  hints: [
    { text: "d = |1-4| = 3." },
    { text: "overhead = 2(d-1) = 2(2)." },
    { text: "Substitute your d into 2(d-1) and evaluate. Adjacent qubits would need no swaps at all; each extra step of distance adds two." },
  ],
  solution: {
    steps: [{ description: "d=3, overhead=2(3-1)=4 SWAP gates." }],
    finalAnswer: "4",
  },
  explanation: {
    correctIdea: "This applies the lesson's own formula to a new control/target pair, distinct from the worked example's control=0,target=5 case.",
    whyCorrect: "Matches swapOverheadForLinearChain(1,4) computed directly from the engine.",
    whyWrong: ["Using d instead of d-1 (forgetting that adjacent qubits need 0 swaps) would give an incorrect answer of 6 instead of 4."],
  },
};
