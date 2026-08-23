import type { NumericProblem } from "@/lib/problems/types";

// General n-qubit state: 2*(2^n) real numbers, minus 1 for normalization,
// minus 1 for global phase. Product of n single-qubit states: 2 real
// parameters (theta, phi) per qubit factor.
const n = 4;
const generalStateParameters = 2 * 2 ** n - 1 - 1;
const productStateParameters = 2 * n;
const gap = generalStateParameters - productStateParameters;

export const fourQubitParameterGap: NumericProblem = {
  meta: {
    slug: "four-qubit-parameter-gap",
    title: "The Parameter Gap for Four Qubits",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["entanglement", "parameter-counting"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"],
  },
  question: {
    type: "numeric",
    prompt:
      "For a general normalized 4-qubit state (after removing normalization and global phase), how many MORE real parameters does it have compared to a product of four independent single-qubit states? (Compute both counts, then subtract.)",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: gap,
    tolerance: 0.5,
    incorrectFeedback:
      "First compute the general 4-qubit state's parameter count ($2\\times2^4$ real numbers, minus 1 for normalization, minus 1 for global phase), then the product-state count (2 real parameters per qubit factor, times 4), then subtract.",
  },
  hints: [
    { text: "A general 4-qubit state has $2^4=16$ complex amplitudes, i.e. 32 real numbers, before any constraints." },
    { text: "Subtract 1 for normalization and 1 for the unobservable global phase." },
    { text: "A product of 4 single-qubit states needs only 2 real parameters (θ, φ) per qubit, so $4\\times2=8$ total." },
  ],
  solution: {
    steps: [
      { description: "General 4-qubit state: $2\\times2^4=32$ real numbers, minus normalization, minus global phase.", latex: `2\\times2^4 - 1 - 1 = ${generalStateParameters}` },
      { description: "Product of 4 single-qubit states: 2 real parameters per factor.", latex: `4\\times2 = ${productStateParameters}` },
      { description: "The gap between them:", latex: `${generalStateParameters} - ${productStateParameters} = ${gap}` },
    ],
    finalAnswer: `${gap} real parameters — states in this gap are exactly the entangled 4-qubit states.`,
  },
  explanation: {
    correctIdea: "The gap between the general state space and the product-state subset grows with the number of qubits, showing entanglement becomes an even larger share of the full state space as systems get bigger.",
    whyCorrect: "This is the same counting argument the lesson makes for 2 qubits (6 vs. 4, a gap of 2), scaled up: the general count grows exponentially ($2^{n+1}-2$) while the product count only grows linearly ($2n$).",
    whyWrong: ["Forgetting to subtract both normalization AND global phase from the general count is the most common arithmetic slip here."],
  },
};
