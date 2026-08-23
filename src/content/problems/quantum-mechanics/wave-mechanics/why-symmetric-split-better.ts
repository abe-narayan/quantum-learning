import type { ConceptualProblem } from "@/lib/problems/types";

export const whySymmetricSplitBetter: ConceptualProblem = {
  meta: {
    slug: "why-symmetric-split-better",
    title: "Why the Split-Operator Method Uses a Symmetric Ordering",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["split-operator", "numerical-methods"],
    prerequisites: ["quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In one or two sentences, explain why the platform's SplitOperatorEvolver applies the potential phase as two half-steps surrounding a single full kinetic step, rather than one full potential step followed by one full kinetic step.",
    placeholder: "Explain the benefit of the symmetric ordering...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["cancel", "cancels the leading error", "higher order accuracy"],
      ["symmetric", "half-step", "Strang splitting"],
    ],
    incorrectFeedback: "Name both pieces: that the arrangement is called a symmetric (Strang) splitting, and that this symmetry specifically cancels the leading-order Trotter error.",
    partialFeedback: "You're partway there — be explicit that the improvement is in the order of accuracy, not just 'more careful' evolution.",
  },
  hints: [{ text: "How does the per-step error's order in Delta t change between a naive split and a symmetric one?" }],
  solution: {
    steps: [
      { description: "The naive (single-ordering) split has $O(\\Delta t^2)$ error, from the commutator $[\\hat T,\\hat V]$." },
      { description: "Splitting the potential step symmetrically around the kinetic step cancels this leading term, giving $O(\\Delta t^3)$ error for the same computational cost per step." },
    ],
    finalAnswer: "The symmetric ordering cancels the leading-order Trotter error, giving higher accuracy (O(dt^3) instead of O(dt^2)) for the same cost.",
  },
  explanation: {
    correctIdea: "A small change in ordering (splitting the potential step in half) is a genuine, well-known accuracy improvement in numerical time evolution.",
    whyCorrect: "This matches exactly why SplitOperatorEvolver.step() is implemented as potential-half, kinetic, potential-half.",
    whyWrong: ["Saying the symmetric version 'preserves norm better' is incorrect — both orderings preserve norm exactly (each factor is a pure phase); the difference is purely in accuracy, not norm conservation."],
  },
};
