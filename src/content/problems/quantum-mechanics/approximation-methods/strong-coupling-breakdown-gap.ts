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
    incorrectFeedback: "Use the lesson's table: perturbative ≈0.995, exact ≈0.363 for this (V,t) pair.",
  },
  hints: [
    { text: "The first-order formula P = 4|V|²sin²(ωt/2)/ω² has no upper bound built into it, so at V=0.5 it can climb close to 1. The exact two-level solution is a Rabi oscillation, which shares its weight between the two levels." },
    { text: "From the lesson's worked-example table: perturbative ≈0.995, exact ≈0.363." },
    { text: "Subtract in the order the prompt states, perturbative minus exact. Expect a gap of over half a probability unit: the size of it is what marks this as a breakdown rather than a small correction." },
  ],
  solution: {
    steps: [{ description: "0.995 - 0.363 ≈ 0.632, a large discrepancy — well outside what should be trusted as a small correction." }],
    finalAnswer: "≈0.63",
  },
  explanation: {
    correctIdea: "The SIZE of this gap (over half a probability unit) is itself the point: it's not a small correction to distrust slightly, it's a qualitative failure of the approximation.",
    whyCorrect: "Matches the difference between the engine's firstOrderTransitionProbability and exactTwoLevelTransitionProbability for this (V,t) pair.",
    whyWrong: ["A small computed gap here would actually be inconsistent with the lesson's own worked-example table, which explicitly documents this as the strong-coupling breakdown case."],
  },
};
