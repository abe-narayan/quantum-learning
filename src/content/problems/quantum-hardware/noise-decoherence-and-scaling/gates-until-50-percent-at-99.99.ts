import type { NumericProblem } from "@/lib/problems/types";

const p = 0.9999;
const value = Math.log(0.5) / Math.log(p);

export const gatesUntil50PercentAt9999: NumericProblem = {
  meta: {
    slug: "gates-until-50-percent-at-99.99",
    title: "How Many Gates at 99.99% Fidelity Before 50% Success?",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["scaling"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"],
  },
  question: {
    type: "numeric",
    prompt: "Using N=ln(0.5)/ln(p), how many sequential gates at 99.99% per-gate fidelity can run before success probability drops below 50%?",
    inputHint: "as a number of gates",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 50,
    incorrectFeedback: "Take the ratio of the two logarithms, not of the probabilities themselves. If your answer is off by roughly a factor of ten, check whether you used the lesson example's 99.9% fidelity instead of 99.99%.",
    nearMisses: [
      { value: Math.log(0.5) / Math.log(0.999), tolerance: 10, feedback: "That is the lesson's 99.9% answer. This device's per-gate error is ten times smaller, so its usable depth is about ten times longer." },
      { value: 5000, tolerance: 20, feedback: "5000 comes from 0.5/(1−p), a linear estimate. Survival compounds multiplicatively, so the depth is set by ln(0.5)/ln(p)." },
      { value: 10000, tolerance: 20, feedback: "10,000 is 1/(1−p), the depth at which the expected number of errors reaches one. Half the runs have already failed well before that." },
    ],
  },
  hints: [
    { text: "Success decays geometrically: each gate multiplies the survival probability by p. You want the depth at which the running product first dips below a half, and logarithms turn that product into a division." },
    { text: "N = ln(0.5)/ln(0.9999), and ln(0.9999) is very close to -0.0001." },
    { text: "Divide the two logarithms. Sanity check: the result should come out about ten times the lesson's 99.9% worked example, since the per-gate error dropped tenfold." },
  ],
  solution: {
    steps: [{ description: "N = ln(0.5)/ln(0.9999) ≈ 6931 gates." }],
    finalAnswer: "≈6931 gates",
  },
  explanation: {
    correctIdea: "This is exactly 10× the worked example's 693-gate result for 99.9% fidelity: a checkable illustration that a 10× reduction in per-gate error buys roughly a 10× increase in usable circuit depth.",
    whyCorrect: "Matches the lesson's own worked-example methodology, extended to a higher fidelity target.",
    whyWrong: ["Assuming fidelity improvements give only marginal circuit-depth gains misses this roughly-proportional relationship near p≈1."],
  },
};
