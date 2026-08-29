import type { NumericProblem } from "@/lib/problems/types";

export const expectationValueCalculation: NumericProblem = {
  meta: {
    slug: "expectation-value-calculation",
    title: "Computing an Expectation Value",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/hermitian-operators",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["hermitian-operators", "expectation-value"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/hermitian-operators"],
  },
  question: {
    type: "numeric",
    prompt:
      "For the Hermitian operator $Z=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$ and the normalized state $|\\psi\\rangle=(\\sqrt{0.6},\\sqrt{0.4})$ (both entries real and positive), compute $\\langle\\psi|Z|\\psi\\rangle$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: 0.2,
    tolerance: 0.01,
    incorrectFeedback: "For a diagonal Hermitian operator, ⟨ψ|Z|ψ⟩ = |α|²·(top eigenvalue) + |β|²·(bottom eigenvalue) — weight each eigenvalue by the corresponding probability.",
    nearMisses: [
      { value: Math.sqrt(0.6) - Math.sqrt(0.4), tolerance: 0.01, feedback: "That weights the eigenvalues by the amplitudes rather than the probabilities. Square each entry before weighting." },
      { value: 1, feedback: "1 would require all the weight on the +1 eigenvalue. Here 0.4 of it sits on −1, which pulls the average down." },
      { value: 0, feedback: "0 is the unweighted average of +1 and −1. The two outcomes are not equally likely: 0.6 against 0.4." },
    ],
  },
  hints: [
    { text: "Since Z is diagonal, ⟨ψ|Z|ψ⟩ = |α|²(+1) + |β|²(-1) where |ψ⟩=(α,β)." },
    { text: "Here |α|² = 0.6 and |β|² = 0.4 directly (the entries are already given as square roots of these)." },
  ],
  solution: {
    steps: [
      { description: "Apply the sandwich formula for a diagonal operator.", latex: "\\langle\\psi|Z|\\psi\\rangle = |\\alpha|^2(+1) + |\\beta|^2(-1)" },
      { description: "Substitute $|\\alpha|^2=0.6$, $|\\beta|^2=0.4$.", latex: "\\langle Z\\rangle = 0.6 - 0.4 = 0.2" },
    ],
    finalAnswer: "$\\langle Z\\rangle = 0.2$",
  },
  explanation: {
    correctIdea: "Expectation value is a probability-weighted average of the eigenvalues.",
    whyCorrect: "0.6 of the 'weight' sits on eigenvalue +1 and 0.4 on eigenvalue -1, giving 0.6-0.4=0.2.",
    whyWrong: ["Using α and β directly instead of |α|² and |β|² skips the Born-rule squaring step this whole course has emphasized."],
  },
};
