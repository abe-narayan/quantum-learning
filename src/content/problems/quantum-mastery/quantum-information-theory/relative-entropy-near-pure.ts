import type { NumericProblem } from "@/lib/problems/types";

export const relativeEntropyNearPure: NumericProblem = {
  meta: {
    slug: "relative-entropy-near-pure",
    title: "Relative Entropy for a Nearly Pure State vs. the Maximally Mixed State",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["relative-entropy", "klein-inequality"],
    prerequisites: ["quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"],
  },
  question: {
    type: "numeric",
    prompt:
      "Compute S(rho||sigma) in bits for rho=diag(0.99, 0.01) and sigma=I/2 (both already diagonal in the same basis).",
    inputHint: "bits, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.919207,
    tolerance: 0.001,
    incorrectFeedback:
      "Since rho and sigma commute (both diagonal), S(rho||sigma) = sum_i p_i log2(p_i/q_i) = 0.99*log2(0.99/0.5) + 0.01*log2(0.01/0.5).",
  },
  hints: [
    { text: "rho and sigma are simultaneously diagonal, so the general definition reduces to the classical KL divergence between (0.99,0.01) and (0.5,0.5)." },
    { text: "0.99*log2(1.98) + 0.01*log2(0.02)." },
  ],
  solution: {
    steps: [
      { description: "$S(\\rho\\|\\sigma)=0.99\\log_2(0.99/0.5)+0.01\\log_2(0.01/0.5)$" },
      { description: "$=0.99\\log_2(1.98)+0.01\\log_2(0.02)\\approx0.99(0.985578)+0.01(-5.643856)$" },
      { description: "$\\approx0.975722-0.056439$" },
    ],
    finalAnswer: "S(rho||sigma) ≈ 0.919 bits.",
  },
  explanation: {
    correctIdea: "For commuting states, quantum relative entropy reduces exactly to the classical KL divergence of the shared eigenbasis's probability distributions.",
    whyCorrect: "This is strictly larger than the diag(0.9,0.1) example worked in the lesson (≈0.531 bits), consistent with rho being further from the maximally mixed sigma.",
  },
};
