import type { ConceptualProblem } from "@/lib/problems/types";

export const commutatorAntisymmetryPositionMomentum: ConceptualProblem = {
  meta: {
    slug: "commutator-antisymmetry-position-momentum",
    title: "Why [p,x] = -[x,p]",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["commutator", "position-operator", "momentum-operator"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the definition of a commutator, explain in one sentence why [p-hat, x-hat] must equal -[x-hat, p-hat] for any two operators, without recomputing either commutator from scratch.",
    placeholder: "Explain the general antisymmetry of the commutator...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["definition", "AB - BA", "swap the operators", "reverses the subtraction"],
    ],
    incorrectFeedback: "Use the commutator's definition [A,B] = AB - BA directly: swapping A and B swaps the two terms, which flips the sign of the subtraction.",
  },
  hints: [
    { text: "Write out [p,x] using the general definition [A,B] = AB - BA, then compare term by term to [x,p]." },
  ],
  solution: {
    steps: [
      { description: "$[\\hat p,\\hat x] = \\hat p\\hat x - \\hat x\\hat p = -(\\hat x\\hat p - \\hat p\\hat x) = -[\\hat x,\\hat p]$, by the definition alone." },
    ],
    finalAnswer: "[p,x] = -[x,p] follows directly from the commutator's definition, for any two operators — no calculation specific to x and p is needed.",
  },
  explanation: {
    correctIdea: "The commutator is antisymmetric under swapping its two arguments, as an algebraic identity.",
    whyCorrect: "AB - BA and BA - AB are negatives of each other by simple algebra, regardless of what A and B are.",
    whyWrong: ["Believing this requires redoing the full calculus derivation of [x,p]=i*hbar misses that the antisymmetry is a general algebraic fact, true for any pair of operators."],
  },
};
