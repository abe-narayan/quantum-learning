import type { ConceptualProblem } from "@/lib/problems/types";

export const noInteractionMeansNoEntanglement: ConceptualProblem = {
  meta: {
    slug: "no-interaction-means-no-entanglement",
    title: "Can Qubits Entangle Without a Shared Gate?",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["entanglement", "product-states"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A student claims: \"If two qubits have never interacted — no gate has ever connected them — their combined state must be a product state.\" Is this true, given the tools this course has covered so far (single-qubit gates and genuinely two-qubit gates like CNOT)? Explain your reasoning.",
    placeholder: "This is true, because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["true", "correct", "yes"],
      ["single-qubit gate", "independently", "separately", "own qubit"],
      ["two-qubit gate", "cnot", "genuine interaction", "connecting"],
    ],
    incorrectFeedback:
      "State clearly whether the claim is true or false, then explain specifically why single-qubit gates applied independently can never produce an entangled result, while a genuine two-qubit gate can.",
    partialFeedback: "Good start — make sure you explicitly say whether the claim is true, and name the specific kind of gate that's required to break it.",
  },
  hints: [
    { text: "If each qubit only ever has single-qubit gates applied to it, its factor evolves entirely on its own, independently of the other qubit." },
    { text: "A product state acted on by (gate on qubit A) ⊗ (gate on qubit B) stays a product state — apply this to each factor separately." },
    { text: "Only a gate that genuinely acts on both qubits together, like CNOT, can produce the coefficient pattern that fails the factorization test." },
  ],
  solution: {
    steps: [
      { description: "Starting from a product state, applying any single-qubit gate to one factor only changes that factor — the result is still $(\\text{new }|a\\rangle)\\otimes(\\text{unchanged }|b\\rangle)$, still a product state." },
      { description: "This holds no matter how many single-qubit gates are applied, to either qubit, in any order — the state stays a product state throughout." },
      { description: "Only a gate that genuinely couples the two qubits together (like CNOT) can produce the specific correlated coefficient pattern (as in the Bell-numerator proof) that no product state can reproduce." },
    ],
    finalAnswer:
      "True, given this course's tools: entanglement specifically requires a genuine multi-qubit gate connecting the two qubits. Any sequence of purely single-qubit gates, applied independently, keeps a product state a product state.",
  },
  explanation: {
    correctIdea: "Entanglement isn't something that emerges from qubits simply existing near each other — it requires a specific kind of operation (a genuinely joint, non-factorizable gate) to create.",
    whyCorrect: "This matches every example in this course: H alone, applied to either or both qubits of a product state, never entangles it; CNOT, which genuinely reads one qubit's value to decide what happens to the other, is what creates the Bell state.",
  },
};
