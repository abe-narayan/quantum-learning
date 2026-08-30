import type { ConceptualProblem } from "@/lib/problems/types";

export const why2nIsFundamental: ConceptualProblem = {
  meta: {
    slug: "why-2n-is-fundamental",
    title: "Why 2ⁿ Growth Is Physics, Not an Implementation Choice",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["computational-cost", "conceptual"],
    prerequisites: ["quantum-software/simulating-quantum-systems/computational-cost-and-scaling"],
  },
  question: {
    type: "conceptual",
    prompt: "Using the tensor-product dimension-counting idea from Mathematical Foundations, explain why an n-qubit state genuinely has 2ⁿ independent degrees of freedom, a fact about quantum mechanics itself rather than about this platform's engine implementation.",
    placeholder: "Each additional qubit doubles the dimension of the state space because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["combined system", "doubles", "multiplies dimensions", "dimensions multiply", "product of the spaces"],
        missingFeedback:
          "Do the dimension counting first. Say what happens to the size of the state space when you put one more qubit alongside the others, and why.",
      },
      {
        phrases: ["genuine degrees of freedom", "not an artifact", "any correct representation"],
        missingFeedback:
          "You have the count. Now say why it is a claim about quantum mechanics rather than about this codebase: what would be true of any other correct implementation?",
      },
    ],
    incorrectFeedback: "Do not argue from the engine's source code; argue from the mathematics of how quantum systems join together. Say what operation builds the state space of n qubits out of n single-qubit spaces, what that operation does to dimension, and then draw the conclusion that matters here: whether a different implementation could ever dodge the count.",
    partialFeedback: "Good. Now be explicit that this rules out any implementation choice avoiding the 2ⁿ count, not just this particular engine.",
    modelAnswers: [
      "Combining systems is a tensor product, and tensor product dimensions multiply, so each extra qubit doubles the dimension of the combined system and you reach 2^n. That is a fact about the structure of quantum mechanics itself, not an artifact of how this engine stores things, so any correct representation needs that many independent numbers.",
      "The state space of the whole is the product of the spaces of the parts, so dimensions multiply and you get 2^n. Those are genuine degrees of freedom, and any correct exact representation has to carry all of them.",
    ],
  },
  hints: [
    { text: "Combining two quantum systems uses the tensor product of their individual state spaces (Mathematical Foundations)." },
    { text: "One qubit has a 2-dimensional space. Multiply n of those together and read off the dimension." },
    { text: "Ask whether that count is a fact about the engine or a fact about quantum mechanics, and what follows for every other implementation." },
  ],
  solution: {
    steps: [
      { description: "A single qubit has a 2-dimensional complex state space; combining n qubits uses the tensor product of n such spaces (Mathematical Foundations)." },
      { description: "Tensor product dimensions multiply: 2×2×...×2 (n times) = 2ⁿ, the genuine dimension of the combined system's state space." },
      { description: "Since this dimension count follows from how quantum mechanics combines systems, not from any software choice, any correct exact representation of a generic n-qubit state needs at least this many independent numbers. The 2ⁿ cost is intrinsic, not an artifact of this platform's StateVector implementation." },
    ],
    finalAnswer: "n qubits combine by tensor product, so the dimensions multiply and reach 2ⁿ. That is a fact about quantum mechanics' own structure, so any correct exact representation, not just this platform's, requires storing that many independent numbers.",
  },
  explanation: {
    correctIdea: "This grounds the entire course's cost analysis in a specific, already-established mathematical fact, rather than leaving '2ⁿ growth' as an unexplained empirical observation.",
    whyCorrect: "Combining systems multiplies dimensions, so n two-dimensional spaces give 2ⁿ. The count follows from the tensor product itself rather than from any storage decision, which is why no exact representation of a generic n-qubit state can be smaller.",
    whyWrong: ["Suggesting a cleverer engine implementation could avoid the 2ⁿ cost for a generic state misunderstands that this is a lower bound from quantum mechanics itself, not a coding limitation. The Tensor Network Methods lesson addresses the one real exception: states with limited, rather than generic, entanglement."],
  },
};
