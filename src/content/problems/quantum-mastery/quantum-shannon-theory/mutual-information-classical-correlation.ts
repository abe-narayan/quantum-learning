import type { NumericProblem } from "@/lib/problems/types";

export const mutualInformationClassicalCorrelation: NumericProblem = {
  meta: {
    slug: "mutual-information-classical-correlation",
    title: "Mutual Information of an Asymmetric Classically Correlated State",
    course: "quantum-shannon-theory",
    lesson: "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["quantum-mutual-information", "von-neumann-entropy", "classical-correlation"],
    prerequisites: ["quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures"],
  },
  question: {
    type: "numeric",
    prompt:
      "Consider rho_AB = 0.8|00><00| + 0.2|11><11| -- a classical (no coherence) mixture, so A and B always agree but are not entangled. Compute the quantum mutual information I(A:B) = S(rho_A) + S(rho_B) - S(rho_AB), in bits.",
    inputHint: "bits, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.721928,
    tolerance: 0.001,
    incorrectFeedback:
      "rho_AB is already diagonal with eigenvalues (0.8, 0, 0, 0.2), so S(rho_AB) = -0.8log2(0.8) - 0.2log2(0.2). Tracing out either qubit leaves the same distribution (0.8, 0.2) on the other, so S(rho_A) = S(rho_B) = S(rho_AB) exactly -- making I(A:B) equal to that same single Shannon entropy.",
  },
  hints: [
    { text: "rho_AB is diagonal in the computational basis, with eigenvalues 0.8, 0, 0, 0.2 -- read off S(rho_AB) directly as a Shannon entropy." },
    { text: "Tracing out qubit B from |00><00| leaves |0><0|, and from |11><11| leaves |1><1|, so rho_A = 0.8|0><0| + 0.2|1><1| -- and symmetrically for rho_B." },
    { text: "S(rho_A) = S(rho_B) = S(rho_AB) = H(0.8, 0.2), so I(A:B) = S(rho_A) + S(rho_B) - S(rho_AB) collapses to just H(0.8,0.2) itself." },
  ],
  solution: {
    steps: [
      { description: "$\\rho_{AB}$ is already diagonal: eigenvalues $(0.8, 0, 0, 0.2)$, so $S(\\rho_{AB}) = H(0.8,0.2) = -0.8\\log_2(0.8) - 0.2\\log_2(0.2) \\approx 0.721928$ bits." },
      { description: "Partial trace over either qubit of a state that is a mixture of $|00\\rangle\\langle00|$ and $|11\\rangle\\langle11|$ reproduces the same $(0.8,0.2)$ distribution on the remaining qubit: $\\rho_A=\\rho_B=\\text{diag}(0.8,0.2)$, so $S(\\rho_A)=S(\\rho_B)\\approx0.721928$ bits too." },
      { description: "$I(A:B) = S(\\rho_A)+S(\\rho_B)-S(\\rho_{AB}) = 0.721928+0.721928-0.721928 = 0.721928$ bits." },
    ],
    finalAnswer: "I(A:B) ≈ 0.721928 bits.",
  },
  explanation: {
    correctIdea: "For a state where A and B are perfectly, classically correlated (always equal, never entangled), all three entropies S(rho_A), S(rho_B), and S(rho_AB) coincide, so I(A:B) reduces to exactly that single shared value.",
    whyCorrect: "This is the quantum mutual information reducing to its classical Shannon-theory counterpart for two perfectly correlated classical bits: knowing B tells you A completely, and the 'total correlation' I(A:B) is exactly the entropy of either variable, since there is no independent uncertainty left over once you condition on the other.",
    whyWrong: ["Assuming this state is entangled because I(A:B) > 0: mutual information alone cannot distinguish classical correlation from entanglement -- both give a positive number. This exact state is separable (it is a probabilistic mixture of two unentangled product states), unlike the Bell state's I(A:B)=2 bits."],
  },
};
