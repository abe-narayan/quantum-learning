import type { NumericProblem } from "@/lib/problems/types";

export const bornRuleProbability: NumericProblem = {
  meta: {
    slug: "born-rule-probability",
    title: "A Born Rule Calculation",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["born-rule", "measurement"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/probability-and-quantum-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "A Hermitian observable has eigenvalues $+1,-1$ with eigenvectors $|e_+\\rangle,|e_-\\rangle$. A system is in state $|\\psi\\rangle$ with $\\langle e_+|\\psi\\rangle=0.6$ and $\\langle e_-|\\psi\\rangle=0.8$ (both real). What is $P(+1)$?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.36,
    tolerance: 0.01,
    incorrectFeedback: "The Born rule is P(λ) = |⟨e|ψ⟩|², not ⟨e|ψ⟩ itself.",
  },
  hints: [
    { text: "The Born rule: P(outcome) = |overlap with that eigenvector|²." },
    { text: "Here the overlap is 0.6 — square it." },
  ],
  solution: {
    steps: [
      { description: "Apply the Born rule.", latex: "P(+1) = |\\langle e_+|\\psi\\rangle|^2 = |0.6|^2" },
      { description: "Simplify.", latex: "P(+1) = 0.36" },
    ],
    finalAnswer: "$P(+1) = 0.36$",
  },
  explanation: {
    correctIdea: "Probabilities come from squared overlaps with eigenvectors, exactly as the Born rule states.",
    whyCorrect: "0.6² = 0.36 directly. (Check: P(-1)=0.8²=0.64, and 0.36+0.64=1, consistent with normalization.)",
    whyWrong: ["Using 0.6 directly as a probability skips the squaring the Born rule requires."],
  },
};
