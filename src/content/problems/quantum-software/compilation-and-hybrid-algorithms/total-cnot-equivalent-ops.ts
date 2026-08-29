import { swapOverheadForLinearChain } from "@/lib/quantum/transpilation";
import type { NumericProblem } from "@/lib/problems/types";

const swaps = swapOverheadForLinearChain(0, 5);
const value = swaps * 3 + 1;

export const totalCnotEquivalentOps: NumericProblem = {
  meta: {
    slug: "total-cnot-equivalent-ops",
    title: "Total CNOT-Equivalent Operations After Transpilation",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["transpilation"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"],
  },
  question: {
    type: "numeric",
    prompt: "For the worked example (control=0, target=5, needing 8 SWAP gates), each SWAP is 3 CNOTs. Including the original logical CNOT, how many total CNOT-equivalent operations does the transpiled circuit contain?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "8 SWAPs × 3 CNOTs each, plus the 1 original CNOT.",
    nearMisses: [
      { value: 24, feedback: "24 counts the SWAPs' CNOT-equivalents only. The logical CNOT the circuit was there to perform still has to be added." },
      { value: 9, feedback: "9 adds the SWAP count to the logical CNOT without expanding each SWAP into its 3 CNOTs." },
    ],
  },
  hints: [
    { text: "8 SWAPs × 3 CNOTs/SWAP = 24 CNOT-equivalents from the SWAPs alone." },
    { text: "Plus the original logical CNOT itself: +1." },
    { text: "Add the single original logical CNOT to the twenty-four CNOT-equivalents from the SWAPs." },
  ],
  solution: {
    steps: [{ description: "8×3 + 1 = 24 + 1 = 25 total CNOT-equivalent operations." }],
    finalAnswer: "25",
  },
  explanation: {
    correctIdea: "This shows the real multiplicative cost of transpilation: one logical two-qubit gate becomes 25 physical CNOT-equivalent operations for a distant qubit pair.",
    whyCorrect: "Direct application of the lesson's own SWAP-to-CNOT decomposition count.",
    whyWrong: ["Forgetting to add the original logical CNOT (answering just 24) undercounts the true total by one operation."],
  },
};
