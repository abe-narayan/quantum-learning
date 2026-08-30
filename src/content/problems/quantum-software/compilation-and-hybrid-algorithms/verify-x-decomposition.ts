import { PAULI_X, rotationY, rotationZ } from "@/lib/quantum/gates";
import { matricesEqualUpToGlobalPhase } from "@/lib/quantum/gateDecomposition";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const composed = rotationZ(Math.PI).mul(rotationY(Math.PI));
if (!matricesEqualUpToGlobalPhase(composed, PAULI_X)) {
  throw new Error("verify-x-decomposition: expected Rz(pi)Ry(pi) to equal X up to global phase.");
}

export const verifyXDecomposition: MultipleChoiceProblem = {
  meta: {
    slug: "verify-x-decomposition",
    title: "Does Rz(π)Ry(π) Equal X?",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["gate-decomposition"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Does the composed matrix Rz(π)·Ry(π) equal the X gate, up to global phase?",
    options: [
      { id: "a", text: "Yes: the product is X up to an overall phase, so the two act identically on every input state" },
      { id: "b", text: "No: Ry(π) already flips the basis states, so composing with Rz(π) overshoots and lands on Z" },
      { id: "c", text: "Yes at the poles of the Bloch sphere, but not as a general matrix identity for every state" },
      { id: "d", text: "No, the order is backwards: only Ry(π)·Rz(π) gives X, and matrix products do not commute" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Ry(π) alone maps |0⟩ to |1⟩ and |1⟩ to −|0⟩, so it is X only up to a sign on one column. The Rz(π) is what fixes that sign, and the composed matrix is X, not Z.",
      c: "Two matrices either agree up to a phase or they do not; there is no basis in which the question is settled state by state. Multiply them out and compare all four entries.",
      d: "Order does matter for matrix products in general, and this particular product is the one that works. Rz(π)·Ry(π) comes out as i·X, and reversing the order gives −i·X, a different global phase on the same gate.",
    },
    defaultIncorrectFeedback: "Write Rz(π) = diag(−i, i) and Ry(π) = [[0, −1], [1, 0]], multiply, and compare the result to X entry by entry, allowing an overall phase.",
  },
  hints: [
    { text: "Rz(π) = diag(e^{−iπ/2}, e^{iπ/2}) = diag(−i, i), and Ry(π) = [[0, −1], [1, 0]]." },
    { text: "Multiply the two 2×2 matrices out before comparing anything." },
    { text: "Compare the product with X = [[0, 1], [1, 0]] and ask whether a single overall factor accounts for any difference." },
  ],
  solution: {
    steps: [{ description: "Rz(π)·Ry(π) = diag(−i, i)·[[0, −1], [1, 0]] = [[0, i], [i, 0]] = i·X. The two matrices differ by the global phase i, which no measurement can detect, so the decomposition holds." }],
    finalAnswer: "Yes: the product works out to i·X, which is X up to an undetectable global phase.",
  },
  explanation: {
    correctIdea: "A decomposition is checked at the level of the operators, comparing all four matrix entries and allowing one overall phase factor, not by trying a few input states.",
    whyCorrect: "The product evaluates to i·X, and matricesEqualUpToGlobalPhase confirms it to machine precision in this platform's gateDecomposition suite.",
    whyWrong: [
      { optionId: "b", text: "Stops at Ry(π), which is X only up to a sign on one column, and misreads what the Rz(π) is there to fix." },
      { optionId: "c", text: "Treats an operator identity as state-dependent. Two matrices agreeing up to phase agree on every input." },
      { optionId: "d", text: "Reaches for non-commutativity, which is real but does not break this identity. Reversing the order changes the global phase, not the gate." },
    ],
  },
};
