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
  },
  hints: [
    { text: "dim(V⊗W⊗X) = dim(V) × dim(W) × dim(X)." },
    { text: "Here all three factors are 2-dimensional." },
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
    whyWrong: ["Adding instead of multiplying (2+2+2=6) gives the wrong, much smaller count — dimensions of composite quantum systems multiply, which is exactly why simulating many qubits classically gets hard fast."],
  },
};
