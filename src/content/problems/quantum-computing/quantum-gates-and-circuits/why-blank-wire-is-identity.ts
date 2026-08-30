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
      {
        phrases: ["contributes an I factor", "an explicit I in the product", "a factor of I", "identity factor", "identity matrix on that wire", "I on that wire", "stands in for the qubit", "placeholder for that wire", "leaves that qubit unchanged", "acts trivially on that qubit"],
        missingFeedback:
          "Say what the blank wire actually puts into the column's tensor product, and what that piece does to the qubit riding on that wire.",
      },
      {
        phrases: ["dimension", "matrix size", "combined operator", "sizes must agree", "wrong size", "too small", "2^n", "full matrix", "would not line up", "would not match"],
        missingFeedback:
          "You have said what the blank wire stands for. Now say what breaks if you simply omit it: what goes wrong with the operator you build for that column?",
      },
    ],
    incorrectFeedback:
      "You said the blank wire 'does nothing', which is right and is not the question. The question is why doing nothing still needs a symbol. Build the column's operator explicitly and count how many factors it must have, and how large the result is.",
    partialFeedback: "Name the operator that stands for doing nothing, and say why the column's construction needs a symbol in that slot at all.",
    modelAnswers: [
      "The column operator is a tensor product with one factor per qubit, so the blank wire has to contribute a factor of I. Leave it out and the combined operator is the wrong size: you would get a 2x2 where you need a 4x4, and the dimensions would not line up with the state vector.",
      "A blank wire means identity on that wire, not nothing at all. You need an explicit I in the product so the full matrix comes out 2^n by 2^n, and that factor leaves that qubit unchanged.",
    ],
  },
  hints: [
    { text: "The column's full operator is assembled from one piece per wire. Write the assembly rule down." },
    { text: "That rule has no notion of a missing slot. Ask what operator you would put in a slot where nothing happens." },
    { text: "Now count. With one slot dropped, how many factors would you have, and what size matrix would come out compared with the state it has to act on?" },
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
        description: "The identity $I$ is the operator that changes nothing, so writing $I$ for the blank wire keeps the tensor product's dimension correct while doing nothing to that qubit.",
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
