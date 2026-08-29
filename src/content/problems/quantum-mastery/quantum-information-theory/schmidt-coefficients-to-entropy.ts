import type { NumericProblem } from "@/lib/problems/types";

export const schmidtCoefficientsToEntropy: NumericProblem = {
  meta: {
    slug: "schmidt-coefficients-to-entropy",
    title: "Entanglement Entropy from Schmidt Coefficients",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["schmidt-decomposition", "entanglement-entropy"],
    prerequisites: ["quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"],
  },
  question: {
    type: "numeric",
    prompt:
      "A bipartite pure state has Schmidt coefficients λ1=0.8, λ2=0.2 (and no others -- Schmidt rank 2). Compute its entanglement entropy S(ρ_A), in bits.",
    inputHint: "bits, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.721928,
    tolerance: 0.001,
    incorrectFeedback:
      "Since ρ_A is already diagonal in the Schmidt basis with eigenvalues λ1, λ2, its von Neumann entropy is just the Shannon entropy of (0.8, 0.2): -0.8 log2(0.8) - 0.2 log2(0.2).",
    nearMisses: [
      { value: 1, feedback: "1 bit is the maximum for Schmidt rank 2, reached only by equal coefficients. A 0.8/0.2 split carries less." },
      { value: 0.500402, tolerance: 0.002, feedback: "That is the same entropy in nats, from using the natural log. The question asks for bits, so use log base 2; dividing your answer by ln 2 converts it." },
      { value: 2, feedback: "2 is the Schmidt rank, not the entropy. Entropy is bounded above by log₂(rank) = 1 bit here." },
    ],
  },
  hints: [
    { text: "Schmidt Decomposition and Purification proved rho_A = sum_k lambda_k |u_k><u_k|, already diagonal in the Schmidt basis." },
    { text: "Von Neumann entropy of a diagonal matrix is just the Shannon entropy of its diagonal entries." },
    { text: "S = -0.8 log2(0.8) - 0.2 log2(0.2)." },
  ],
  solution: {
    steps: [
      { description: "rho_A is diagonal in the Schmidt basis with eigenvalues 0.8 and 0.2 (proved in this lesson, not merely asserted)." },
      { description: "$S(\\rho_A) = -0.8\\log_2(0.8) - 0.2\\log_2(0.2)$" },
      { description: "$= 0.8(0.321928) + 0.2(2.321928) \\approx 0.257542 + 0.464386$" },
    ],
    finalAnswer: "S(rho_A) ≈ 0.721928 bits.",
  },
  explanation: {
    correctIdea: "Once Schmidt coefficients are known, entanglement entropy is exactly the Shannon entropy of those coefficients -- no further diagonalization needed.",
    whyCorrect: "This is the direct payoff of the lesson's proof: rho_A = sum_k lambda_k |u_k><u_k| is automatically in diagonal (eigenbasis) form, so its eigenvalues are read off immediately.",
    whyWrong: ["Treating the raw amplitude matrix entries (a,b,c,d) as if they were the Schmidt coefficients directly would give a wrong, generally non-normalized result."],
  },
};
