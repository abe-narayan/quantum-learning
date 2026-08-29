import type { NumericProblem } from "@/lib/problems/types";

export const compositeSystemDimension: NumericProblem = {
  meta: {
    slug: "composite-system-dimension",
    title: "Dimension of a Composite System",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["tensor-products", "dimension"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems"],
  },
  question: {
    type: "numeric",
    prompt:
      "System A has a 3-dimensional state space and system B has a 4-dimensional state space. What is the dimension of the combined system's state space $A\\otimes B$?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: 12,
    tolerance: 0.001,
    incorrectFeedback: "The tensor product's dimension is the product (not the sum) of the two factors' dimensions.",
    nearMisses: [
      { value: 7, feedback: "7 adds the two dimensions. A basis of the tensor product pairs every basis vector of A with every basis vector of B, so the counts multiply." },
    ],
  },
  hints: [
    { text: "dim(V⊗W) = dim(V) · dim(W), not dim(V) + dim(W)." },
    { text: "3 × 4 = ?" },
  ],
  solution: {
    steps: [
      { description: "Apply the tensor-product dimension rule.", latex: "\\dim(A\\otimes B) = \\dim(A)\\cdot\\dim(B) = 3\\times4" },
    ],
    finalAnswer: "$12$",
  },
  explanation: {
    correctIdea: "Composite quantum systems multiply dimensions, not add them — this is the mathematical origin of the exponential growth seen in multi-qubit systems.",
    whyCorrect: "Directly applying dim(V⊗W)=dim(V)·dim(W) with 3 and 4 gives 12.",
    whyWrong: ["Adding 3+4=7 would be the dimension of a classical Cartesian-product-style pairing, not the tensor product a quantum composite system actually needs."],
  },
};
