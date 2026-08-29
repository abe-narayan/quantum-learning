import { Complex } from "@/lib/quantum/complex";
import { Matrix } from "@/lib/quantum/matrix";
import { angularMomentumZ } from "@/lib/quantum/angularMomentum";
import type { NumericProblem } from "@/lib/problems/types";

const Sz = angularMomentumZ(0.5);
const I2 = Matrix.identity(2);
const Jz = Sz.tensor(I2).add(I2.tensor(Sz));
const tripletUp = [Complex.ONE, Complex.ZERO, Complex.ZERO, Complex.ZERO];
const result = Jz.apply(tripletUp);
const value = result[0].re;

export const tripletUpJzEigenvalue: NumericProblem = {
  meta: {
    slug: "triplet-up-jz-eigenvalue",
    title: "Jz Eigenvalue of |↑↑⟩",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["addition-of-angular-momentum"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"],
  },
  question: {
    type: "numeric",
    prompt: "Compute Jz|↑↑⟩ using Jz=Sz⊗I+I⊗Sz. What is the resulting eigenvalue (in units of ħ)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Sz reads off plus a half from each spin-up factor. If you answered a half, you counted only one particle's contribution; both spins contribute to the total Jz.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 counts one particle. Jz = Sz⊗I + I⊗Sz sums both, and both spins are up." },
      { value: 2, feedback: "Each spin-1/2 contributes ħ/2, not ħ. Two of them sum to ħ, so the answer in units of ħ is 1." },
      { value: 0, feedback: "0 is the m value of the singlet and of the middle triplet state, where the two spins oppose. Here they align." },
    ],
  },
  hints: [
    { text: "Jz is a sum of two operators, each acting on its own particle. Apply each piece to the state separately, then add the two contributions." },
    { text: "Each Sz contributes plus a half (in units of ħ) when it acts on its own spin-up factor, and both spins here point up." },
    { text: "Add the two equal contributions. The result should match the m label the triplet notation assigns this state." },
  ],
  solution: {
    steps: [{ description: "Both particles contribute +1/2 each, summing to exactly 1." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This matches the triplet's m=1 label directly: |↑↑⟩ is the |1,1⟩ state.",
    whyCorrect: "Confirmed directly by the engine's tensor-product construction of the total Jz operator.",
    whyWrong: ["Answering 0.5 would forget that both particles contribute to the total Jz, not just one."],
  },
};
