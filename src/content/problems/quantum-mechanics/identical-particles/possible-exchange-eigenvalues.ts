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
      { id: "d", text: "Any real number" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This would be the answer for a general unitary operator, but P₁₂²=I is a stronger constraint than unitarity alone — it pins λ² to exactly 1, not just |λ|=1.",
      c: "0 is not possible: P₁₂ is invertible (it's its own inverse), so it cannot have a zero eigenvalue.",
      d: "λ²=1 restricts real λ to exactly ±1, not any real number.",
    },
    defaultIncorrectFeedback: "Use λ²=1 (from P₁₂²=I applied to an eigenstate) to narrow down the possible eigenvalues.",
  },
  hints: [
    { text: "If P₁₂ψ=λψ, then P₁₂²ψ=λ²ψ." },
    { text: "But P₁₂²=I, so P₁₂²ψ=ψ, meaning λ²ψ=ψ, so λ²=1." },
    { text: "λ²=1 has exactly two solutions: λ=+1 or λ=−1." },
  ],
  solution: {
    steps: [{ description: "P₁₂²=I forces λ²=1 for any eigenvalue λ, giving exactly λ=+1 or λ=−1." }],
    finalAnswer: "(a) +1 and −1",
  },
  explanation: {
    correctIdea: "This is exactly the algebraic argument the lesson's Mathematical Development section makes, and is the reason bosons/fermions are the only two possibilities.",
    whyCorrect: "λ²=1 has precisely two real solutions.",
    whyWrong: ["Any answer including a value other than ±1 contradicts the λ²=1 constraint derived directly from P₁₂²=I."],
  },
};
