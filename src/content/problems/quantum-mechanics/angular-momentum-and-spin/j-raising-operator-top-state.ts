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
    nearMisses: [
      { value: 1.7320508075688772, tolerance: 0.01, feedback: "√3 is the raising coefficient one rung down, at m = 1/2. At the top rung the quantity under the root, j(j+1) − m(m+1), is what has to be evaluated." },
      { value: 1.9364916731037085, tolerance: 0.01, feedback: "That is √(j(j+1)), the length of the total angular momentum vector. It is not what the raising operator produces from the top rung." },
      { value: 1.5, tolerance: 0.01, feedback: "1.5 is m itself. The question asks for the length of the vector J+ returns, not the quantum number labelling the state it acted on." },
    ],
    incorrectFeedback: "Think about what the boundedness derivation requires of the top rung: if J+ produced anything of nonzero length there, one more application would push m past its bound. Your numeric answer should reflect that requirement.",
  },
  hints: [
    { text: "J+ raises m by one unit. Ask what state it would have to hand back here, and whether the spectrum of J_z contains such a state at all." },
    { text: "The boundedness derivation gave m² ≤ j(j+1), which caps m at j. A state with m = j+1 would break that cap, so the algebra cannot let J+ produce one." },
    { text: "The raising coefficient is √(j(j+1) − m(m+1)). Evaluate it at m = j = 3/2 and report the magnitude that leaves." },
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
