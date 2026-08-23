import { firstOrderTransitionProbability } from "@/lib/quantum/approximationMethods";
import type { NumericProblem } from "@/lib/problems/types";

const value = firstOrderTransitionProbability(0.01, 1, 3);

export const transitionProbabilityWeakCoupling: NumericProblem = {
  meta: {
    slug: "transition-probability-weak-coupling",
    title: "Transition Probability for V=0.01, ω=1, t=3",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["time-dependent-perturbation-theory"],
    prerequisites: ["quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"],
  },
  question: {
    type: "numeric",
    prompt: "Using P(t)=4|V|²sin²(ωt/2)/ω² with V=0.01, ω=1, t=3, what is the first-order transition probability?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.00002,
    incorrectFeedback: "Compute 4(0.01)²sin²(1.5)/1² directly.",
  },
  hints: [
    { text: "sin(1.5 rad) ≈ 0.9975." },
    { text: "4(0.0001)(0.9975)²/1 ≈ 0.000398." },
    { text: "This matches the lesson's worked-example table entry for V=0.01, t=3." },
  ],
  solution: {
    steps: [{ description: "P(3) = 4(0.01)²sin²(1.5)/1² ≈ 4(0.0001)(0.995) ≈ 0.000398." }],
    finalAnswer: "≈0.000398",
  },
  explanation: {
    correctIdea: "This reproduces one entry of the lesson's own comparison table directly from the closed-form formula.",
    whyCorrect: "Matches firstOrderTransitionProbability(0.01,1,3) from the engine exactly.",
    whyWrong: ["Forgetting to square sin(ωt/2), or using sin(ωt) instead of sin(ωt/2), gives a substantially different (and wrong) number."],
  },
};
