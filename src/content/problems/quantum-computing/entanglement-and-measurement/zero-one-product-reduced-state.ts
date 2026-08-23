import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { reducedDensityMatrixQubit1 } from "@/lib/quantum/partialTrace";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const state = StateVector.basis(2, 1); // |01>
const rho = pureStateDensityMatrix(state);
const reducedB = reducedDensityMatrixQubit1(rho);
if (reducedB.get(1, 1).re < 0.99) {
  throw new Error("zeroOneProductReducedState: expected qubit 1's reduced state to be |1><1|.");
}

export const zeroOneProductReducedState: MultipleChoiceProblem = {
  meta: {
    slug: "zero-one-product-reduced-state",
    title: "Reduced State of |01⟩'s Qubit 1",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["partial-trace", "reduced-state"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"],
  },
  question: {
    type: "multiple-choice",
    prompt: "For the product state $|01\\rangle$, what is $\\text{Tr}_A(\\rho)$ — qubit 1's reduced state?",
    options: [
      { id: "a", text: "$|1\\rangle\\langle1|$" },
      { id: "b", text: "$|0\\rangle\\langle0|$" },
      { id: "c", text: "$I/2$" },
      { id: "d", text: "$|+\\rangle\\langle+|$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "That's qubit 0's state (|0⟩), not qubit 1's — |01⟩ has qubit 0 = |0⟩ and qubit 1 = |1⟩.",
      c: "$I/2$ (maximally mixed) only arises from tracing out an entangled partner — |01⟩ is a product state, so both reduced states stay pure.",
      d: "Nothing in |01⟩ involves the X basis — its qubits are both in computational-basis eigenstates.",
    },
    defaultIncorrectFeedback: "|01⟩ is a product state — its reduced states are just the individual factors, unchanged.",
  },
  hints: [
    { text: "|01⟩ = |0⟩ (qubit 0) ⊗ |1⟩ (qubit 1) — a product state." },
    { text: "For a product state, the partial trace returns the untouched factor exactly." },
    { text: "Which factor is qubit 1's part of |01⟩?" },
  ],
  solution: {
    steps: [
      { description: "$|01\\rangle=|0\\rangle\\otimes|1\\rangle$ — a product state, with qubit 1 in state $|1\\rangle$." },
      { description: "Tracing out qubit 0 from a product state returns qubit 1's factor unchanged: $\\text{Tr}_A(\\rho)=|1\\rangle\\langle1|$." },
    ],
    finalAnswer: "$\\text{Tr}_A(\\rho)=|1\\rangle\\langle1|$",
  },
  explanation: {
    correctIdea: "A product state's reduced states are simply its individual factors, unchanged by the partial trace.",
    whyCorrect: "This is the sanity-check property partial trace must satisfy, verified directly in this lesson.",
    whyWrong: ["Option c would only be correct if |01⟩ were entangled, which it isn't."],
  },
};
