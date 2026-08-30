import type { NumericProblem } from "@/lib/problems/types";

export const threeQubitDimensionSynthesis: NumericProblem = {
  meta: {
    slug: "three-qubit-dimension-synthesis",
    title: "Synthesis: Three-Qubit State Space Dimension",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["synthesis", "tensor-products", "quantum-computing"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"],
  },
  question: {
    type: "numeric",
    prompt: "Three qubits, each a 2-dimensional Hilbert space, are combined via the tensor product. What is the dimension of the combined state space?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 8,
    tolerance: 0.001,
    incorrectFeedback: "Tensor-product dimensions multiply: dim(V⊗W⊗X) = dim(V)·dim(W)·dim(X), not add.",
    nearMisses: [
      { value: 6, feedback: "6 adds the three dimensions. Tensor-product dimensions multiply, which is why the state space grows exponentially in the qubit count rather than linearly." },
      { value: 3, feedback: "3 is the number of qubits. Each contributes a factor of 2 to the dimension." },
    ],
  },
  hints: [
    { text: "The tensor product does not set the three spaces side by side. It builds one space whose basis vectors are the combinations of the three factors' basis labels." },
    { text: "Count those combinations: each qubit contributes an independent choice between its two basis labels." },
    { text: "That count is a product of three factors, not a sum of them. If your answer came out near 6, check which operation you used." },
  ],
  solution: {
    steps: [
      { description: "Apply the tensor-product dimension rule.", latex: "\\dim = 2\\times2\\times2 = 8" },
    ],
    finalAnswer: "$8$",
  },
  explanation: {
    correctIdea: "This is the Mathematical Foundations course's tensor-product rule, applied directly to qubits.",
    whyCorrect: "2×2×2=8, matching a 3-qubit state vector's 8 amplitudes exactly.",
    whyWrong: ["Adding instead of multiplying (2+2+2=6) gives a far smaller count. Dimensions of composite quantum systems multiply, which is why simulating many qubits classically gets hard so fast."],
  },
};
