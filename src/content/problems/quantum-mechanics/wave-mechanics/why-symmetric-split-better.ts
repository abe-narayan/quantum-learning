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
      {
        phrases: ["cancel", "cancels the leading error", "higher order accuracy"],
        missingFeedback:
          "Say what the symmetric arrangement actually buys you numerically. Compare the size of the error left behind with what the plainer ordering leaves.",
      },
      {
        phrases: ["symmetric", "half-step", "Strang splitting"],
        missingFeedback:
          "You have the benefit. Now name the arrangement that produces it, and describe the shape of the step sequence.",
      },
    ],
    incorrectFeedback: "You said it is 'more accurate' or 'more stable' without saying in what sense. The comparison is between two error terms: work out the per-step error of each arrangement in powers of Delta t and compare the leading powers.",
    partialFeedback: "Say explicitly that the improvement is in the order of accuracy, not merely 'more careful' evolution.",
    modelAnswers: [
      "The symmetric ordering, half a potential step on each side of a full kinetic step, makes the leading Trotter error terms cancel between the two halves. That is Strang splitting, and it buys higher order accuracy for the same number of transforms.",
      "Splitting the potential into two half-steps around the kinetic step is symmetric in time, so the leading error cancels and you get higher order accuracy at the same cost.",
    ],
  },
  hints: [
    { text: "Two operators that do not commute cannot be exponentiated one at a time for free. Write down the size of that cost for the naive arrangement, in powers of Delta t." },
    { text: "Now do the same for the arrangement that applies the potential in two pieces around the kinetic step. Expand both one order beyond where they first differ." },
    { text: "The two expansions agree at leading order and part company after that. Ask which term dropped out of the second one, and what it is about the arrangement's mirror structure that removed it." },
  ],
  solution: {
    steps: [
      { description: "The naive (single-ordering) split has $O(\\Delta t^2)$ error, from the commutator $[\\hat T,\\hat V]$." },
      { description: "Splitting the potential step symmetrically around the kinetic step cancels this leading term, giving $O(\\Delta t^3)$ error for the same computational cost per step." },
    ],
    finalAnswer: "The symmetric ordering cancels the leading-order Trotter error, giving higher accuracy (O(dt^3) instead of O(dt^2)) for the same cost.",
  },
  explanation: {
    correctIdea: "A small change in ordering (splitting the potential step in half) is a genuine, well-known accuracy improvement in numerical time evolution.",
    whyCorrect: "This is why SplitOperatorEvolver.step() is implemented as potential-half, kinetic, potential-half.",
    whyWrong: ["Saying the symmetric version 'preserves norm better' is incorrect: both orderings preserve norm exactly, since each factor is a pure phase. The difference is in accuracy, not norm conservation."],
  },
};
