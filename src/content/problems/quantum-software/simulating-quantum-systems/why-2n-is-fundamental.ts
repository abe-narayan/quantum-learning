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
    prompt: "Using the tensor-product dimension-counting idea from Mathematical Foundations, explain why an n-qubit state genuinely has 2ⁿ independent degrees of freedom — a fact about quantum mechanics itself, not this platform's engine implementation.",
    placeholder: "Each additional qubit doubles the dimension of the state space because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["tensor product", "combined system", "doubles"],
      ["genuine degrees of freedom", "not an artifact", "any correct representation"],
    ],
    incorrectFeedback: "Connect specifically to the tensor-product structure of combining quantum systems, and be explicit that ANY correct representation (not just this platform's) faces the same count.",
    partialFeedback: "Good — now be explicit that this rules out ANY implementation choice avoiding the 2ⁿ count, not just this specific engine.",
  },
  hints: [
    { text: "Combining two quantum systems uses the TENSOR PRODUCT of their individual state spaces (Mathematical Foundations)." },
    { text: "A single qubit has a 2-dimensional state space; combining n qubits multiplies dimensions: 2×2×...×2 (n times) = 2ⁿ." },
    { text: "This dimension count is a fact about how quantum systems combine, true for ANY correct representation, not specific to how this platform's engine happens to be built." },
  ],
  solution: {
    steps: [
      { description: "A single qubit has a 2-dimensional complex state space; combining n qubits uses the tensor product of n such spaces (Mathematical Foundations)." },
      { description: "Tensor product dimensions multiply: 2×2×...×2 (n times) = 2ⁿ — this is the genuine dimension of the combined system's state space." },
      { description: "Since this dimension count follows directly from how quantum mechanics combines systems (not from any specific software choice), ANY correct, exact representation of a generic n-qubit state needs (at least) this many independent numbers — the 2ⁿ cost is fundamental, not an artifact of this platform's particular StateVector implementation." },
    ],
    finalAnswer: "n qubits combine via tensor product, multiplying dimensions to 2ⁿ — a fact about quantum mechanics' own structure, so any correct exact representation (not just this platform's) requires storing that many independent numbers.",
  },
  explanation: {
    correctIdea: "This grounds the entire course's cost analysis in a specific, already-established mathematical fact, rather than leaving '2ⁿ growth' as an unexplained empirical observation.",
    whyCorrect: "Matches the lesson's explicit Physical Interpretation section and Mathematical Foundations' tensor-product dimension-counting.",
    whyWrong: ["Suggesting a cleverer engine implementation could avoid the 2ⁿ cost for a GENERIC state misunderstands that this is a lower bound from quantum mechanics itself, not a specific coding limitation (Tensor Network Methods' next lesson addresses the one real exception: states with LIMITED, not generic, entanglement)."],
  },
};
