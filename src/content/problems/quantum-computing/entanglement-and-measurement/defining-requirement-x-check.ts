import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { PAULI_X } from "@/lib/quantum/gates";
import { Matrix } from "@/lib/quantum/matrix";
import { pureStateDensityMatrix, densityMatrixExpectationValue } from "@/lib/quantum/densityMatrix";
import { reducedDensityMatrixQubit0 } from "@/lib/quantum/partialTrace";
import type { NumericProblem } from "@/lib/problems/types";

const theta = 0.3;
const state = new StateVector([new Complex(Math.cos(theta)), Complex.ZERO, Complex.ZERO, new Complex(Math.sin(theta))]);
const rho = pureStateDensityMatrix(state);
const identity = Matrix.identity(2);
const globalExpectation = densityMatrixExpectationValue(rho, PAULI_X.tensor(identity)).re;
const reducedA = reducedDensityMatrixQubit0(rho);
const reducedExpectation = densityMatrixExpectationValue(reducedA, PAULI_X).re;
if (Math.abs(globalExpectation - reducedExpectation) > 1e-9) {
  throw new Error("definingRequirementXCheck: global and reduced expectation values should agree exactly.");
}

export const definingRequirementXCheck: NumericProblem = {
  meta: {
    slug: "defining-requirement-x-check",
    title: "Checking the Partial Trace's Defining Requirement with X",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["partial-trace", "expectation-value"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "For $|\\psi(\\theta)\\rangle=\\cos\\theta|00\\rangle+\\sin\\theta|11\\rangle$ with $\\theta=0.3$, compute $\\langle X\\otimes I\\rangle$ using the reduced state's formula $\\text{Tr}(\\rho_A X)$, where $\\rho_A=\\text{diag}(\\cos^2\\theta,\\sin^2\\theta)$.",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: reducedExpectation,
    tolerance: 0.01,
    incorrectFeedback: "If you got something θ-dependent, you likely computed the Z-observable case from the lesson instead. Look at the structure: ρ_A is diagonal while X carries all of its weight off the diagonal, and the trace only ever sees diagonal entries.",
    nearMisses: [
      {
        value: Math.cos(2 * theta),
        feedback:
          "cos(2θ) is the answer for ⟨Z⊗I⟩, the case the lesson worked through. Z is diagonal so it survives the trace against a diagonal ρ_A; X is not, so it does not.",
      },
      {
        value: 2 * Math.cos(theta) * Math.sin(theta),
        tolerance: 0.005,
        feedback:
          "That is 2 sinθ cosθ, which would be ⟨X⊗X⟩: the coherence between |00⟩ and |11⟩ shows up only when both qubits are flipped. Acting with X on one qubit alone leaves nothing on ρ_A's diagonal.",
      },
    ],
  },
  hints: [
    { text: "You could multiply everything out numerically, but look at the structure first. ρ_A is diagonal, while X has all of its weight off the diagonal. The trace only ever sees diagonal entries." },
    { text: "Write out the product ρ_A X: multiplying a diagonal matrix by X swaps its columns, moving every entry off the diagonal." },
    { text: "Tr(ρ_A X) sums the diagonal entries of ρ_A X. After the column swap, ask what is left on the diagonal to sum." },
  ],
  solution: {
    steps: [
      { description: "$\\rho_A X = \\text{diag}(\\cos^2\\theta,\\sin^2\\theta)\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix} = \\begin{pmatrix}0&\\cos^2\\theta\\\\\\sin^2\\theta&0\\end{pmatrix}$" },
      { description: "This matrix's diagonal is entirely zero, so $\\text{Tr}(\\rho_AX)=0$ regardless of θ." },
    ],
    finalAnswer: "Tr(ρ_A X) = 0",
  },
  explanation: {
    correctIdea: "Multiplying a diagonal matrix by X (which has zero diagonal) always produces a result with zero diagonal, so its trace is 0.",
    whyCorrect: "This matches ⟨X⊗I⟩ computed directly on the global state, confirming the partial trace's defining requirement for this particular observable.",
    whyWrong: ["Answering cos(2θ) confuses this with the Z-observable case worked out in the lesson. X behaves differently since it's off-diagonal."],
  },
};
