import type { ConceptualProblem } from "@/lib/problems/types";

export const whyConcurrenceNeedsStatevector: ConceptualProblem = {
  meta: {
    slug: "why-concurrence-needs-statevector",
    title: "Why concurrenceOfPureState Takes a StateVector, Not a Matrix",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["concurrence", "scope", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain, citing the specific type signatures involved, why concurrenceOfPureState takes a StateVector rather than a Matrix (density matrix) as its argument — and why this is a feature, not an oversight.",
    placeholder: "Think about what formula concurrenceOfPureState actually implements...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["amplitudes", "a,b,c,d", "pure-state formula", "determinant"],
      ["mixed", "wrong answer", "not defined", "prevents"],
    ],
    incorrectFeedback: "Think about what quantity concurrenceOfPureState's formula, C=2|ad-bc|, actually needs as its input — and what a mixed ρ doesn't have.",
    partialFeedback: "You're close — connect this to the type system actively preventing a call that would silently compute a meaningless number.",
  },
  hints: [
    { text: "C=2|ad-bc| needs the four amplitudes a,b,c,d of a pure state directly." },
    { text: "A mixed density matrix has no such amplitudes — there's no 'a,b,c,d' to extract from a general ρ." },
    { text: "Requiring a StateVector argument makes it impossible to accidentally call this function on a mixed state and get a meaningless number back." },
  ],
  solution: {
    steps: [
      { description: "concurrenceOfPureState's formula, C=2|ad-bc|, is defined directly in terms of a pure state's four amplitudes." },
      { description: "A mixed density matrix has no state vector and hence no a,b,c,d to plug into that formula at all." },
      { description: "Requiring a StateVector argument (rather than a general Matrix) makes calling this on a mixed state a compile-time type error, not a silent wrong answer at runtime." },
    ],
    finalAnswer: "It requires a StateVector because the formula is defined in terms of pure-state amplitudes, and this makes misuse on a mixed state impossible rather than silently wrong.",
  },
  explanation: {
    correctIdea: "The type signature encodes the formula's actual mathematical scope, turning a conceptual limitation into an enforced one.",
    whyCorrect: "This is exactly the same discipline as entanglementEntropy's type signature, and it directly enacted the honesty this course insists on around measure scope.",
    whyWrong: ["Saying it's 'just a design choice with no deeper reason' misses that it directly encodes a real mathematical restriction, not an arbitrary API preference."],
  },
};
