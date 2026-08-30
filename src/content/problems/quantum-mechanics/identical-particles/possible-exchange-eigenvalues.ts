import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const possibleExchangeEigenvalues: MultipleChoiceProblem = {
  meta: {
    slug: "possible-exchange-eigenvalues",
    title: "What Eigenvalues Can P₁₂ Have?",
    course: "identical-particles",
    lesson: "quantum-mechanics/identical-particles/indistinguishability",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["exchange-operator"],
    prerequisites: ["quantum-mechanics/identical-particles/indistinguishability"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Given P₁₂²=I, what are the only possible eigenvalues of the exchange operator P₁₂?",
    options: [
      { id: "a", text: "+1 and −1" },
      { id: "b", text: "Any complex number with magnitude 1" },
      { id: "c", text: "0 and 1" },
      { id: "d", text: "+1 only" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This would be the answer for a general unitary operator, but P₁₂²=I is a stronger constraint than unitarity alone: it pins λ² to exactly 1, not just |λ| to 1.",
      c: "0 is not possible: P₁₂ is invertible (it's its own inverse), so it cannot have a zero eigenvalue.",
      d: "That would follow if P₁₂²=I forced P₁₂=I, but squaring to the identity does not make an operator the identity: λ²=1 has a second root, λ=−1, and a state can perfectly well pick up that sign. Discarding it would leave no fermions.",
    },
    defaultIncorrectFeedback: "Use λ²=1 (from P₁₂²=I applied to an eigenstate) to narrow down the possible eigenvalues.",
  },
  hints: [
    { text: "Start from an eigenstate: suppose P₁₂ψ = λψ, and apply P₁₂ a second time." },
    { text: "That gives P₁₂²ψ = λ²ψ. Now use the fact you were given about P₁₂²." },
    { text: "You are left with an equation in λ alone. Solve it over the complex numbers." },
  ],
  solution: {
    steps: [{ description: "Applying P₁₂ twice to an eigenstate gives λ²ψ, and P₁₂² = I gives ψ. So λ² = 1, whose only solutions are λ = +1 and λ = −1. Those two eigenvalues are what bosons and fermions are." }],
    finalAnswer: "+1 and −1, the only solutions of λ² = 1.",
  },
  explanation: {
    correctIdea: "One algebraic constraint, P₁₂² = I, is what leaves exactly two kinds of identical particle. There is no third option to look for.",
    whyCorrect: "λ² = 1 has precisely two solutions.",
    whyWrong: [
      { optionId: "b", text: "Applies the weaker constraint. Unitarity gives |λ| = 1; squaring to the identity gives λ² = 1, which is stronger." },
      { optionId: "c", text: "Allows a zero eigenvalue on an operator that is its own inverse, and an invertible operator has none." },
      { optionId: "d", text: "Solves λ² = 1 halfway. Keeping only the positive root reads P₁₂² = I as P₁₂ = I and erases fermions from the theory." },
    ],
  },
};
