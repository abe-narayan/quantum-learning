import type { ConceptualProblem } from "@/lib/problems/types";

export const whyBlankWireIsIdentity: ConceptualProblem = {
  meta: {
    slug: "why-blank-wire-is-identity",
    title: "What a Blank Wire Actually Means",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["circuits", "identity", "tensor-product"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"],
  },
  question: {
    type: "conceptual",
    prompt:
      "In a circuit column where some wires have gates and one wire is blank, why does that blank wire need to be treated as an explicit identity operator in the column's tensor product, rather than simply ignored?",
    placeholder: "Explain in a sentence or two...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["identity"],
      ["tensor", "dimension", "matrix size", "combined operator"],
    ],
    incorrectFeedback:
      "Think about what building the full column's operator as a tensor product actually requires dimensionally.",
    partialFeedback: "You're close — be explicit about the identity operator and why the tensor product needs it.",
  },
  hints: [
    { text: "The column's full operator is a tensor product of one operator per wire." },
    { text: "A tensor product needs a factor for every wire, with no gaps — what operator does 'nothing' correspond to?" },
    { text: "Leaving a wire out entirely would change the total number of tensor factors, and the resulting matrix size." },
  ],
  solution: {
    steps: [
      {
        description:
          "A circuit column's full operator is the tensor product of one single-qubit operator per wire, e.g. for 2 qubits, some $A\\otimes B$.",
      },
      {
        description: "If one wire had no operator at all, the tensor product would be missing a factor, and the result wouldn't have the right dimension to act on the full multi-qubit state.",
      },
      {
        description: "The identity $I$ is the operator that changes nothing, so writing $I$ for the blank wire keeps the tensor product's dimension correct while genuinely doing nothing to that qubit.",
      },
    ],
    finalAnswer: "A blank wire contributes an explicit $I$ factor to the column's tensor product, keeping the operator's dimensions consistent while leaving that qubit unchanged.",
  },
  explanation: {
    correctIdea: "The full circuit operator for a column is a tensor product with one factor per qubit; a blank wire's factor is the identity.",
    whyCorrect: "Without an explicit I, the tensor product would have too few factors and wouldn't match the dimension of the full multi-qubit state it needs to act on.",
    whyWrong: [
      "Treating a blank wire as 'nothing happens, so skip it in the math' ignores that the operator still has to be a valid matrix of the right size to multiply the full state vector.",
    ],
  },
};
