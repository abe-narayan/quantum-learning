import type { NumericProblem } from "@/lib/problems/types";

export const trotterErrorOrder: NumericProblem = {
  meta: {
    slug: "trotter-error-order",
    title: "The Order of the Symmetric Split-Operator Error",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["split-operator", "numerical-methods"],
    prerequisites: ["quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"],
  },
  question: {
    type: "numeric",
    prompt: "The lesson shows a naive (non-symmetric) operator split has per-step error of order Delta t^2. The platform's symmetric (Strang) split cancels the leading term, leaving error of what order in Delta t?",
    inputHint: "an integer power",
  },
  answer: {
    type: "numeric",
    value: 3,
    tolerance: 0.001,
    incorrectFeedback: "The symmetric split cancels the O(Delta t^2) term entirely, leaving the next order up as the leading error.",
    nearMisses: [
      { value: 2, feedback: "2 is the naive split's order. Symmetrizing the half-step, full-step, half-step arrangement is what cancels that term." },
      { value: 1, feedback: "Order 1 would be worse than the naive split. Symmetrizing improves the accuracy, it does not degrade it." },
    ],
  },
  hints: [{ text: "If the O(Delta t^2) term cancels by symmetry, what's the next power of Delta t in the Taylor expansion?" }],
  solution: {
    steps: [
      { description: "The naive split's leading error is $O(\\Delta t^2)$, proportional to the commutator $[\\hat T,\\hat V]$." },
      { description: "The symmetric (half-step, full-step, half-step) arrangement cancels this term exactly, leaving $O(\\Delta t^3)$ as the leading per-step error." },
    ],
    finalAnswer: "Order 3 ($O(\\Delta t^3)$)",
  },
  explanation: {
    correctIdea: "Symmetric (Strang) splitting is a standard technique for cancelling the leading-order error in operator splitting.",
    whyCorrect: "This is exactly why the platform's SplitOperatorEvolver uses the half-step/full-step/half-step structure rather than a naive single ordering.",
    whyWrong: ["Reporting order 2 (the naive split's error) ignores that symmetrizing specifically cancels that term."],
  },
};
