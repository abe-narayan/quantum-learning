import { angularMomentumZ, totalAngularMomentumSquared } from "@/lib/quantum/angularMomentum";
import { commutator } from "@/lib/quantum/observables";
import type { NumericProblem } from "@/lib/problems/types";

const j = 1;
const comm = commutator(angularMomentumZ(j), totalAngularMomentumSquared(j));
let maxAbs = 0;
for (let r = 0; r < comm.rows; r++) {
  for (let c = 0; c < comm.cols; c++) {
    maxAbs = Math.max(maxAbs, comm.get(r, c).magnitude());
  }
}
const value = maxAbs;

export const lzL2CommutatorNumerically: NumericProblem = {
  meta: {
    slug: "lz-l2-commutator-numerically",
    title: "Checking [Lz, L²]=0 Numerically for j=1",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/central-potentials",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["commutator", "angular-momentum"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/central-potentials"],
  },
  question: {
    type: "numeric",
    prompt: "Compute [Lz, L²] using the actual j=1 matrix representations from Angular Momentum & Spin. What is the largest entry magnitude in the resulting commutator matrix?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "L² commutes with every component of angular momentum, including Lz — the commutator matrix should be exactly zero.",
  },
  hints: [
    { text: "L² is built symmetrically from Lx²+Ly²+Lz² — it doesn't privilege any one axis." },
    { text: "An operator that treats x, y, z symmetrically commutes with any single component, including Lz." },
    { text: "The answer is 0 (up to floating-point rounding)." },
  ],
  solution: {
    steps: [
      { description: "L²=Lx²+Ly²+Lz² is rotationally invariant by construction (it's the same combination in any rotated frame)." },
      { description: "Lz generates rotations about z; a rotationally invariant operator is unchanged by any rotation, so [Lz,L²]=0." },
      { description: "Computing this directly with the j=1 matrices confirms every entry of the commutator is 0, to floating-point precision." },
    ],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "This is the same commuting-operator fact Central Potentials relies on to argue energy eigenstates can be simultaneous L², Lz eigenstates — verified here directly against the matrices, not just asserted abstractly.",
    whyCorrect: "The engine's actual matrix commutator, computed from independently-verified Jx, Jy, Jz matrices, comes out to zero.",
    whyWrong: ["Any nonzero answer would indicate a real bug in either the ladder-operator construction or the commutator computation."],
  },
};
