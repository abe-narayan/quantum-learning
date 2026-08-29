import type { NumericProblem } from "@/lib/problems/types";

export const distillationRateFromEntanglementEntropy: NumericProblem = {
  meta: {
    slug: "distillation-rate-from-entanglement-entropy",
    title: "Distillable Bell Pairs from Entanglement Concentration",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["entanglement-distillation", "entanglement-concentration", "typical-subspace"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"],
  },
  question: {
    type: "numeric",
    prompt:
      "Alice and Bob share n=500 copies of |psi> = sqrt(0.7)|00> + sqrt(0.3)|11>. Using the entanglement-concentration protocol (project onto the typical subspace, then relabel), approximately how many near-perfect Bell pairs can they distill via LOCC? Give the nearest whole number of Bell pairs.",
    inputHint: "nearest whole number of Bell pairs; use the asymptotic rate m ~ n*H(p)",
  },
  answer: {
    type: "numeric",
    value: 440.645,
    tolerance: 1,
    incorrectFeedback:
      "The entanglement-concentration protocol's asymptotic rate is m ~ n*H(p) Bell pairs, where H(p) is the binary Shannon entropy of the Schmidt coefficients. Compute H(0.7) = -0.7 log2(0.7) - 0.3 log2(0.3) first, then multiply by n=500.",
    nearMisses: [
      { value: 500, tolerance: 1, feedback: "500 assumes each copy yields a full Bell pair. That holds only for a maximally entangled source, where H = 1 bit; here H(0.7) ≈ 0.88." },
      { value: 350, tolerance: 1, feedback: "350 uses the Schmidt coefficient 0.7 as the per-copy rate. The rate is the entropy those coefficients carry, not the coefficient itself." },
      { value: 0.881291, tolerance: 0.003, feedback: "That is H(0.7), the per-copy rate in ebits. Multiply by the 500 copies." },
    ],
  },
  hints: [
    { text: "The lesson's key result: projecting onto the typical subspace and relabeling distills m ~ n*H(p) near-perfect Bell pairs, where H(p) is the source state's entanglement entropy S(rho_A)." },
    { text: "Compute H(0.7) = -0.7 log2(0.7) - 0.3 log2(0.3) first." },
    { text: "Then multiply by n=500 copies." },
  ],
  solution: {
    steps: [
      { description: "The state |psi> = sqrt(0.7)|00> + sqrt(0.3)|11> is already in Schmidt form with Schmidt coefficients 0.7 and 0.3, so its entanglement entropy equals the binary Shannon entropy H(0.7)." },
      { description: "$H(0.7) = -0.7\\log_2(0.7) - 0.3\\log_2(0.3) \\approx 0.360201 + 0.521090 \\approx 0.881291$ bits." },
      { description: "Entanglement concentration's asymptotic rate is $m \\approx n H(p)$, so $m \\approx 500 \\times 0.881291 \\approx 440.645$." },
    ],
    finalAnswer: "m ≈ 441 near-perfect Bell pairs (exact asymptotic value ≈ 440.645).",
  },
  explanation: {
    correctIdea:
      "Entanglement concentration converts n copies of a pure partially-entangled state into approximately n*H(p) near-perfect Bell pairs by projecting onto the typical subspace and relabeling -- the same H(p) that is the state's own entanglement entropy.",
    whyCorrect:
      "The typical subspace has dimension approximately 2^(nH(p)), and since it is nearly maximally entangled within itself, relabeling its basis into qubits yields approximately nH(p) qubits' worth of near-perfect Bell pairs per side -- the lesson's worked p=0.9, n=6 example demonstrates the same formula on numbers small enough to check by hand.",
    whyWrong: [
      "Using n directly as the answer (500 Bell pairs) ignores that the state is only partially entangled -- only n=500 perfect Bell pairs would be extractable if p were already 0.5 (H(0.5)=1), not for p=0.7.",
      "Using p itself (0.7) or 1-p (0.3) as a per-copy rate instead of the Shannon entropy H(p) confuses the Schmidt coefficient with the entropy those coefficients determine.",
    ],
  },
};
