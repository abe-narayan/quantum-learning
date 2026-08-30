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
      { id: "d", text: "$-i$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Check the sign: cos(π) is -1, not 1.",
      c: "That would be e^{iπ/2}, not e^{iπ}.",
      d: "That is a quarter turn past the answer, at θ = 3π/2 (equivalently −π/2). At θ = π you have gone half way round the circle and landed on the negative real axis, where sin vanishes, so the answer has no imaginary part at all.",
    },
    defaultIncorrectFeedback: "Apply Euler's formula: e^{iθ} = cos(θ) + i sin(θ), with θ = π.",
  },
  hints: [
    { text: "Euler's formula puts $e^{i\\theta}$ on the unit circle, so whatever the answer is, it has modulus 1. That alone does not separate the four options." },
    { text: "Write $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$ and set $\\theta=\\pi$, which is a half turn around that circle." },
    { text: "Evaluate the sine at a half turn first. If it vanishes, so does the whole imaginary part, which settles two of the four options immediately." },
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
    whyWrong: [
      { optionId: "b", text: "Takes cos(π) as +1. It is −1; +1 is the value at θ=0 or θ=2π." },
      { optionId: "c", text: "Lands a quarter turn short. That is e^{iπ/2}, where cos vanishes and sin is 1." },
      { optionId: "d", text: "Overshoots by a quarter turn. −i sits at θ = 3π/2; half a turn stops on the negative real axis, not the imaginary one." },
    ],
  },
};
