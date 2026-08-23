import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const eulersIdentity: MultipleChoiceProblem = {
  meta: {
    slug: "eulers-identity",
    title: "Euler's Identity",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["complex-numbers", "eulers-formula"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What is $e^{i\\pi}$?",
    options: [
      { id: "a", text: "$-1$" },
      { id: "b", text: "$1$" },
      { id: "c", text: "$i$" },
      { id: "d", text: "$0$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Check the sign — cos(π) is -1, not 1.",
      c: "That would be e^{iπ/2}, not e^{iπ}.",
      d: "e^{iθ} always has modulus 1, so it can never equal 0.",
    },
    defaultIncorrectFeedback: "Apply Euler's formula: e^{iθ} = cos(θ) + i sin(θ), with θ = π.",
  },
  hints: [
    { text: "Euler's formula: e^{iθ} = cos(θ) + i sin(θ)." },
    { text: "Evaluate at θ = π: what are cos(π) and sin(π)?" },
  ],
  solution: {
    steps: [
      { description: "Apply Euler's formula at $\\theta=\\pi$.", latex: "e^{i\\pi} = \\cos\\pi + i\\sin\\pi" },
      { description: "Evaluate $\\cos\\pi=-1$ and $\\sin\\pi=0$.", latex: "e^{i\\pi} = -1 + i\\cdot0 = -1" },
    ],
    finalAnswer: "$e^{i\\pi} = -1$",
  },
  explanation: {
    correctIdea: "Euler's identity, e^{iπ}+1=0, is just Euler's formula evaluated at θ=π.",
    whyCorrect: "cos(π)=-1 and sin(π)=0, so the imaginary part vanishes and only -1 remains.",
    whyWrong: ["e^{iθ} always has modulus 1 (|e^{iθ}|=1 for every real θ), so it can never be 0 — ruling out that option immediately, regardless of θ."],
  },
};
