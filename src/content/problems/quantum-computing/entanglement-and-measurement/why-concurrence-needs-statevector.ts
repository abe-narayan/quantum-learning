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
      "Explain, citing the specific type signatures involved, why concurrenceOfPureState takes a StateVector rather than a Matrix (density matrix) as its argument, and why that is a feature rather than an oversight.",
    placeholder: "Think about what formula concurrenceOfPureState actually implements...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["amplitudes", "a,b,c,d", "ad-bc", "ad - bc", "2|ad", "pure-state formula", "pure state formula", "determinant"],
        missingFeedback:
          "You have said what the type stops you doing. Say why: name the formula the function implements and the objects that formula is written in terms of.",
      },
      {
        phrases: ["mixed", "wrong answer", "not defined", "undefined", "meaningless", "prevent", "impossible", "cannot be called", "can't be called", "type error", "compile", "silently", "misuse"],
        missingFeedback:
          "You have named the formula. Now say what would go astray if the function accepted a density matrix, and why catching that at the type level beats catching it at runtime.",
      },
    ],
    incorrectFeedback: "Ask what the function's formula reads off from its argument, and whether every density matrix can supply that.",
    partialFeedback: "Add the design payoff: say what the strict signature rules out before the program ever runs.",
    modelAnswers: [
      "The formula it implements, 2|ad - bc|, is written in terms of the four pure-state amplitudes, so a StateVector is the only input it makes sense for. Taking a Matrix would let you hand it a mixed state and get a silently wrong answer; the type signature makes that misuse impossible instead.",
      "concurrenceOfPureState computes the pure state formula from a, b, c, d. A density matrix has no such amplitudes, so on a mixed state the result would be meaningless. Requiring a StateVector turns that into a compile-time type error rather than a silent bug.",
    ],
  },
  hints: [
    { text: "Look at the formula the function implements. What ingredients does it read directly from its input?" },
    { text: "Does a general density matrix contain those ingredients? Consider what information is lost when a state is not pure." },
    { text: "If the function accepted any matrix, what would happen when someone passed a state it cannot handle? What does the stricter signature do instead?" },
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
