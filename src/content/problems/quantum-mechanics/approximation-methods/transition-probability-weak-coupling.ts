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
    inputHint: "as a small decimal, to 6 decimal places",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.00002,
    incorrectFeedback: "Compute 4(0.01)²sin²(1.5)/1² directly.",
    nearMisses: [
      { value: 4 * 0.0001 * Math.sin(3), tolerance: 0.000005, feedback: "The sine's argument is ωt/2 = 1.5, not ωt = 3, and it is squared before multiplying." },
      { value: 0.0001, tolerance: 0.000005, feedback: "|V|² alone is 10⁻⁴. The formula carries a factor of 4 in front." },
    ],
  },
  hints: [
    { text: "The argument of the sine is ωt/2, which is 1.5 radians here, not 3." },
    { text: "sin(1.5 rad) ≈ 0.9975, so sin² of it is very close to 1: the whole answer is set by the 4|V|²/ω² prefactor." },
    { text: "Evaluate 4|V|²/ω² and scale it by that sin² factor. The result should match the lesson's worked-example table entry for V=0.01, t=3." },
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
