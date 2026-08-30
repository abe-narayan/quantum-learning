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
      "A student claims: \"If two qubits have never interacted, meaning no gate has ever connected them, their combined state must be a product state.\" Is this true, given the tools this course has covered so far (single-qubit gates and two-qubit gates like CNOT)? Explain your reasoning.",
    placeholder: "Yes, because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      // Bare "true" is a substring of "not true" and bare "correct" of
      // "incorrect", so an answer arguing the opposite verdict used to satisfy
      // this group. These phrases only appear in an answer that actually agrees.
      {
        phrases: ["the claim holds", "the claim is true", "the claim is correct", "this is true", "that is true", "it is true", "the student is right", "the student is correct", "student is right", "student is correct", "agree with the student", "yes the claim", "yes the student", "yes this is", "yes it is true", "stays a product", "stay a product", "remains a product", "remain a product", "still a product", "never entangle", "cannot entangle", "can not entangle", "no way to entangle"],
        missingFeedback:
          "The question asks for a verdict first. Say plainly whether it survives with the gates this course has given you, and what kind of state the pair is left in.",
      },
      {
        phrases: ["single-qubit gate", "independently", "separately", "own qubit"],
        missingFeedback:
          "You have the verdict. Now justify it from the gate side: say what a gate acting on one wire alone can and cannot do to the pair.",
      },
      {
        phrases: ["two-qubit gate", "cnot", "genuine interaction", "connecting"],
        missingFeedback:
          "You have said what one-wire gates cannot do. Now name the kind of gate that can, and say what makes it different.",
      },
    ],
    incorrectFeedback:
      "You judged the claim without showing what fixes it. Take a product input, apply an arbitrary gate to each wire on its own, and check by hand whether the output still factors. Then say which kind of gate is missing from that picture.",
    partialFeedback: "Say whether the claim is true, and name the kind of gate required to break it.",
    modelAnswers: [
      "Yes, the claim is true with these tools. Single-qubit gates each act independently on their own qubit, so they map a product state to another product state. You need a two-qubit gate like CNOT connecting the wires to create entanglement at all.",
      "The student is right. Entanglement requires a genuine interaction, a two-qubit gate such as CNOT. Any number of gates applied separately to each qubit leaves the state a product state.",
    ],
  },
  hints: [
    { text: "Start with a state that factors and apply an arbitrary gate to the first wire and another to the second, with nothing joining them. Expand the result." },
    { text: "Look at the coefficient pattern you got. Does it still pass the factorization test from earlier in this course?" },
    { text: "So the claim survives, given only what this course has built. Name the one kind of gate whose absence is doing the work, and what it would take to break the claim." },
  ],
  solution: {
    steps: [
      { description: "Starting from a product state, applying any single-qubit gate to one factor changes only that factor. The result is $(\\text{new }|a\\rangle)\\otimes(\\text{unchanged }|b\\rangle)$, still a product state." },
      { description: "This holds no matter how many single-qubit gates are applied, to either qubit, in any order. The state stays a product state throughout." },
      { description: "Only a gate that couples the two qubits together, such as CNOT, can produce the specific correlated coefficient pattern (as in the Bell-numerator proof) that no product state can reproduce." },
    ],
    finalAnswer:
      "The claim holds, given this course's tools: entanglement requires a genuine two-qubit gate connecting the wires. Any sequence of single-qubit gates, each acting independently on its own qubit, keeps a product state a product state.",
  },
  explanation: {
    correctIdea: "Entanglement does not emerge from qubits merely existing near each other. Creating it requires a joint, non-factorizable gate.",
    whyCorrect: "This matches every example in this course: H alone, applied to either or both qubits of a product state, never entangles it; CNOT, which reads one qubit's value to decide what happens to the other, is what creates the Bell state.",
  },
};
