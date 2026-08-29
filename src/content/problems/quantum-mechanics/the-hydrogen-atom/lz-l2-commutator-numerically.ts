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
    incorrectFeedback: "The title already tells you what to expect here. If you found something else, check that you formed the commutator as Lz L² minus L² Lz in that order, and that both matrices are the j=1 representations. Any surviving entry traces to an arithmetic slip, not to the physics.",
  },
  hints: [
    { text: "You are asked for the largest entry of a commutator matrix. Before grinding through the multiplication, ask what the symmetry of L² predicts about its commutator with any single component." },
    { text: "L² = Lx² + Ly² + Lz² treats the three axes on an equal footing, and Lz generates rotations about the z axis. An operator that is rotationally invariant commutes with every rotation generator." },
    { text: "So symmetry fixes what every entry of [Lz, L²] must be. Run the j=1 matrices through the commutator and confirm that the largest magnitude matches the prediction, up to floating-point rounding." },
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
    correctIdea: "This is the same commuting-operator fact Central Potentials relies on to argue energy eigenstates can be simultaneous L², Lz eigenstates, verified here directly against the matrices rather than asserted abstractly.",
    whyCorrect: "The engine's actual matrix commutator, computed from independently-verified Jx, Jy, Jz matrices, comes out to zero.",
    whyWrong: ["Any nonzero answer would indicate a real bug in either the ladder-operator construction or the commutator computation."],
  },
};
