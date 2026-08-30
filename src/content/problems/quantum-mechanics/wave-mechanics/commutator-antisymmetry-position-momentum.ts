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
      // The mechanism: the definition's two products are the same pair either
      // way round, and only which of them is subtracted changes.
      {
        phrases: ["AB - BA", "AB-BA", "same two products", "same two terms", "same pair of products", "exchang", "swapping", "swaps the two", "swap the two", "swapped", "trades places", "trade places", "reverses the order", "reversing the order", "reverse the order", "which product is subtracted", "which one is subtracted", "change places"],
        missingFeedback:
          "Write out both brackets from the definition. Say what the two expressions have in common, and what exactly differs between them.",
      },
      // The consequence: the two brackets are negatives of one another.
      {
        phrases: ["negative of each other", "negatives of each other", "negative of the other", "flips the sign", "flip the sign", "sign flips", "changes sign", "overall minus", "minus sign", "opposite sign", "negat", "antisymmet", "times -1", "factor of -1"],
        missingFeedback:
          "You have said what differs between the two. Now say what that difference does to the value, as a relationship between the two brackets.",
      },
    ],
    incorrectFeedback: "You reached for the value of the commutator instead of its shape. Nothing you know about position and momentum is doing any work here: the claim holds for any two operators at all, and it follows from the definition's single subtraction.",
    modelAnswers: [
      "By definition the bracket is AB - BA, so the reversed one is built from the same two products with the roles swapped: which product is subtracted changes. That flips the sign, so the two brackets are negatives of each other, for any operators at all.",
      "Swapping the two arguments reverses the order of the subtraction, which multiplies the whole thing by -1. Nothing specific to position or momentum enters, so the antisymmetry is completely general.",
    ],
  },
  hints: [
    { text: "The statement is asked for any two operators, so nothing specific to position or momentum can appear in the answer." },
    { text: "Write both brackets out from the definition, one underneath the other, and line up what appears on each side of the subtraction." },
    { text: "The two lines contain identical pieces, sitting on opposite sides of the subtraction. Say what relationship that forces between the two lines, then apply it to the value you were given." },
  ],
  solution: {
    steps: [
      { description: "$[\\hat p,\\hat x] = \\hat p\\hat x - \\hat x\\hat p = -(\\hat x\\hat p - \\hat p\\hat x) = -[\\hat x,\\hat p]$, by the definition alone." },
    ],
    finalAnswer: "The definition builds [p,x] from the same two products as [x,p] but exchanges which one is subtracted, so the two brackets are negatives of each other. Nothing specific to position or momentum enters, so this holds for any pair of operators.",
  },
  explanation: {
    correctIdea: "The commutator is antisymmetric under swapping its two arguments, as an algebraic identity.",
    whyCorrect: "AB - BA and BA - AB are negatives of each other by simple algebra, regardless of what A and B are.",
    whyWrong: ["Believing this requires redoing the full calculus derivation of [x,p]=i*hbar misses that the antisymmetry is a general algebraic fact, true for any pair of operators."],
  },
};
