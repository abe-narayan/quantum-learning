import { Complex } from "@/lib/quantum/complex";
import { angularMomentumRaising } from "@/lib/quantum/angularMomentum";
import type { NumericProblem } from "@/lib/problems/types";

const jPlus = angularMomentumRaising(1.5);
const top = [Complex.ONE, Complex.ZERO, Complex.ZERO, Complex.ZERO]; // m=j=3/2
const result = jPlus.apply(top);
const value = Math.max(...result.map((a) => a.magnitude()));

export const jRaisingOperatorTopState: NumericProblem = {
  meta: {
    slug: "j-raising-operator-top-state",
    title: "J+ Acting on the Top Rung, j=3/2",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["angular-momentum", "ladder-operators"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum"],
  },
  question: {
    type: "numeric",
    prompt: "What is the magnitude of J+|j=3/2, m=3/2⟩ (the raising operator acting on the top rung)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Think about what the boundedness derivation requires of the top rung: if J+ produced anything of nonzero length there, one more application would push m past its bound. Your numeric answer should reflect that requirement.",
  },
  hints: [
    { text: "The top rung, m=j, is defined by J+ annihilating it." },
    { text: "If J+ didn't annihilate it, applying J+ again would give m=j+1, violating m²≤j(j+1)." },
    { text: "Combine the two previous hints: the algebra leaves J+ acting on the top rung only one consistent output. Report its magnitude." },
  ],
  solution: {
    steps: [{ description: "By the boundedness argument, J+ must annihilate the top rung exactly, so the resulting magnitude is 0." }],
    finalAnswer: "0",
  },
  explanation: {
    correctIdea: "This is a direct consequence of the boundedness derivation, not a separate assumption.",
    whyCorrect: "Confirmed directly by this platform's engine implementation, which builds J+ from the same matrix-element formula the derivation predicts.",
    whyWrong: ["A nonzero answer would mean the raising operator could push m past its theoretical bound, contradicting the derivation."],
  },
};
