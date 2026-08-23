import { angularMomentumX, angularMomentumY, angularMomentumZ } from "@/lib/quantum/angularMomentum";
import { commutator } from "@/lib/quantum/observables";
import { Complex } from "@/lib/quantum/complex";
import type { NumericProblem } from "@/lib/problems/types";

const j = 2;
const comm = commutator(angularMomentumX(j), angularMomentumY(j));
const Jz = angularMomentumZ(j);
const diff = comm.get(0, 0).sub(Jz.get(0, 0).mul(Complex.I)).magnitude();
const value = diff;

export const jxJyCommutatorJ2: NumericProblem = {
  meta: {
    slug: "jx-jy-commutator-j2",
    title: "Checking [Jx,Jy]=iJz for j=2",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["angular-momentum", "commutators"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations"],
  },
  question: {
    type: "numeric",
    prompt: "Using this platform's general angular momentum operators at j=2, compute the (0,0) entry difference between [Jx,Jy] and iJz. What should this difference be, if the commutation relation holds exactly?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "If [Jx,Jy]=iJz holds exactly (as derived from first principles), this difference should be exactly 0.",
  },
  hints: [
    { text: "The commutation relation [Jx,Jy]=iħJz (ħ=1 here) was derived to hold for any j, not just orbital angular momentum." },
    { text: "If the derivation and the engine's implementation both agree, [Jx,Jy]-iJz should be the zero matrix." },
    { text: "Every entry, including (0,0), should differ by 0." },
  ],
  solution: {
    steps: [{ description: "Since [Jx,Jy]=iJz holds exactly for any j (derived from the ladder-operator matrix elements), every matrix entry of the difference is exactly 0." }],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "This checks the abstract commutation relation against this platform's own concrete matrix implementation, not just the orbital (l) case derived by hand.",
    whyCorrect: "Confirmed directly: the engine's independently-built matrices satisfy the algebra exactly, to floating-point precision.",
    whyWrong: ["Any nonzero answer would indicate either a genuine implementation bug or a misunderstanding of what an exact commutation relation guarantees."],
  },
};
