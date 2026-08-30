import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const candidateA = new StateVector([new Complex(0.6), new Complex(0.8)]);
const candidateB = new StateVector([new Complex(0.5), new Complex(0.5)]);
const candidateC = new StateVector([new Complex(Math.SQRT1_2), new Complex(0, Math.SQRT1_2)]);
const candidateD = new StateVector([new Complex(0.5, 0.5), new Complex(0.5, -0.5)]);

export const whichStateFailsNormalization: MultipleChoiceProblem = {
  meta: {
    slug: "which-state-fails-normalization",
    title: "Which State Fails Normalization?",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["normalization", "vector-space"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of these is NOT a valid (normalized) quantum state?",
    options: [
      { id: "a", text: "$0.6|0\\rangle + 0.8|1\\rangle$" },
      { id: "b", text: "$0.5|0\\rangle + 0.5|1\\rangle$" },
      { id: "c", text: "$\\frac{1}{\\sqrt2}|0\\rangle + \\frac{i}{\\sqrt2}|1\\rangle$" },
      { id: "d", text: "$\\frac{1+i}{2}|0\\rangle + \\frac{1-i}{2}|1\\rangle$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "Check again: 0.6² + 0.8² = 0.36 + 0.64 = 1. This one IS normalized.",
      c: "The i on the second term doesn't change its modulus: |i/√2|² = 1/2, same as the first term, and 1/2+1/2=1. This one IS normalized.",
      d: "Squaring a complex coefficient is not squaring its modulus: ((1+i)/2)² is i/2, but |(1+i)/2|² = (1²+1²)/4 = 1/2. Each term contributes 1/2 and the two sum to 1, so this one IS normalized.",
    },
    defaultIncorrectFeedback: "Check each option's |α|²+|β|² and see which one doesn't sum to 1.",
  },
  hints: [
    { text: "Normalization is a condition on the squared magnitudes, not the coefficients themselves." },
    { text: "Compute |α|² + |β|² for each option and check whether it equals 1." },
    { text: "Watch the option whose coefficients look like they should already add to 1. Squaring changes what they add to." },
  ],
  solution: {
    steps: [
      { description: "Test $0.5|0\\rangle+0.5|1\\rangle$: $0.5^2+0.5^2 = 0.25+0.25 = 0.5 \\neq 1$." },
      { description: "The other three each check out to 1: $0.6|0\\rangle+0.8|1\\rangle$ gives $0.36+0.64=1$; $\\tfrac{1}{\\sqrt2}|0\\rangle+\\tfrac{i}{\\sqrt2}|1\\rangle$ gives $\\tfrac12+\\tfrac12=1$; $\\tfrac{1+i}{2}|0\\rangle+\\tfrac{1-i}{2}|1\\rangle$ gives $\\tfrac12+\\tfrac12=1$." },
    ],
    finalAnswer: `$0.5|0\\rangle+0.5|1\\rangle$: $|0.5|^2+|0.5|^2 = ${(candidateB.norm() ** 2).toFixed(2)} \\neq 1$`,
  },
  explanation: {
    correctIdea: "Normalization requires |α|²+|β|² = 1 exactly. Coefficients that look reasonable are not normalized by virtue of looking reasonable.",
    whyCorrect: `Directly checked with this platform's engine: candidateA.isNormalized() = ${candidateA.isNormalized()}, candidateB.isNormalized() = ${candidateB.isNormalized()}, candidateC.isNormalized() = ${candidateC.isNormalized()}, candidateD.isNormalized() = ${candidateD.isNormalized()}.`,
    whyWrong: [
      { optionId: "a", text: "The 3-4-5 triangle in disguise: 0.36 + 0.64 = 1, so this one is normalized." },
      { optionId: "c", text: "The i changes the phase and not the magnitude: |i/√2|² is still 1/2, and the two halves sum to 1." },
      { optionId: "d", text: "Squares the coefficient instead of its modulus. ((1+i)/2)² = i/2 looks alarming, but |(1+i)/2|² = 1/2, and the halves sum to 1." },
    ],
  },
};
