import { firstOrderTransitionProbability, exactTwoLevelTransitionProbability } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const pert = firstOrderTransitionProbability(0.5, 1, 3);
const exact = exactTwoLevelTransitionProbability(0, 1, 0.5, 3, 4000);
const value = pert - exact;

export const strongCouplingBreakdownGap: NumericProblem = {
  meta: {
    slug: "strong-coupling-breakdown-gap",
    title: "How Far Off Is Perturbation Theory at Strong Coupling?",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["time-dependent-perturbation-theory"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"],
  },
  question: {
    type: "numeric",
    prompt: "For V=0.5, ω=1, t=3, subtract the exact (Runge-Kutta) transition probability from the first-order perturbative one. How large is this gap?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.02,
    incorrectFeedback: "You reported one of the two probabilities rather than the distance between them, or subtracted them in the opposite order. The first-order formula has no upper bound built into it and overshoots badly here, while the exact Rabi solution keeps sharing its weight between the two levels.",
    nearMisses: [
      { value: pert, tolerance: 0.02, feedback: "That is the perturbative estimate on its own. The question asks how far it sits from the exact result, so the exact value still has to be subtracted from it." },
      { value: exact, tolerance: 0.02, feedback: "That is the exact result on its own, not the gap between the two methods." },
      { value: -value, tolerance: 0.02, feedback: "The subtraction went the other way round. The prompt asks for perturbative minus exact, and here it is the perturbative estimate that is the larger of the two." },
    ],
  },
  hints: [
    { text: "The first-order formula P = 4|V|²sin²(ωt/2)/ω² has no upper bound built into it, so at V=0.5 it can climb close to 1. The exact two-level solution is a Rabi oscillation, which shares its weight between the two levels." },
    { text: "Evaluate both quantities at these parameters: the first-order formula directly, and the exact two-level solution from the lesson's worked example." },
    { text: "Subtract in the order the prompt states, perturbative minus exact. The sign tells you which method overshoots, and the size is what marks this as a breakdown rather than a small correction." },
  ],
  solution: {
    steps: [{ description: "0.995 - 0.363 ≈ 0.632, a discrepancy far outside what could be trusted as a small correction." }],
    finalAnswer: "≈0.63",
  },
  explanation: {
    correctIdea: "The SIZE of this gap (over half a probability unit) is itself the point: it is not a small correction to distrust slightly, it is a qualitative failure of the approximation.",
    whyCorrect: "Matches the difference between the engine's firstOrderTransitionProbability and exactTwoLevelTransitionProbability for this (V,t) pair.",
    whyWrong: ["A small computed gap here would be inconsistent with the lesson's own worked-example table, which documents this as the strong-coupling breakdown case."],
  },
};
