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
    incorrectFeedback: "Sz gives +1/2 on each |↑⟩ factor — add the two contributions.",
  },
  hints: [
    { text: "Sz(1)|↑↑⟩ contributes +1/2 (acting on the first particle)." },
    { text: "Sz(2)|↑↑⟩ contributes +1/2 (acting on the second particle)." },
    { text: "Sum: 1/2 + 1/2 = 1." },
  ],
  solution: {
    steps: [{ description: "Both particles contribute +1/2 each, summing to exactly 1." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This matches the triplet's m=1 label directly — |↑↑⟩ is the |1,1⟩ state.",
    whyCorrect: "Confirmed directly by the engine's tensor-product construction of the total Jz operator.",
    whyWrong: ["Answering 0.5 would forget that both particles contribute to the total Jz, not just one."],
  },
};
