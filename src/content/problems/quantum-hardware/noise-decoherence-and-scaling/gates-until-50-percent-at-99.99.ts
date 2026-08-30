import type { NumericProblem } from "@/lib/problems/types";

const p = 0.9999;
const value = Math.log(0.5) / Math.log(p);

export const gatesUntil50PercentAt9999: NumericProblem = {
  meta: {
    slug: "gates-until-50-percent-at-99.99",
    title: "How Many Gates at 99.99% Fidelity Before 50% Success?",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["scaling"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"],
  },
  question: {
    type: "numeric",
    prompt:
      "A device runs sequential gates at 99.99% per-gate fidelity, and the gates fail independently. Derive the depth at which the whole circuit's success probability first falls to 50%, and report that gate count. No formula is supplied: work out how per-gate survival compounds, then invert it.",
    inputHint: "as a number of gates",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 5,
    incorrectFeedback: "Survival compounds as a product of per-gate factors, so inverting it needs a logarithm rather than a division of probabilities. If your answer is off by roughly a factor of ten, check whether you used the lesson example's 99.9% fidelity instead of 99.99%.",
    nearMisses: [
      { value: Math.log(0.5) / Math.log(0.999), tolerance: 10, feedback: "That is the lesson's 99.9% answer. This device's per-gate error is ten times smaller, so its usable depth is about ten times longer." },
      { value: 5000, tolerance: 20, feedback: "5000 comes from 0.5/(1−p), a linear estimate. Survival compounds multiplicatively, so the depth is set by ln(0.5)/ln(p)." },
      { value: 10000, tolerance: 20, feedback: "10,000 is 1/(1−p), the depth at which the expected number of errors reaches one. Half the runs have already failed well before that." },
    ],
  },
  hints: [
    { text: "Independent gates do not each subtract a fixed amount of success. Write down what N of them do to the probability that every one of them worked." },
    { text: "You now have p raised to the Nth power on one side and the target on the other. Taking the logarithm of both sides brings N down from the exponent, where it can be solved for." },
    { text: "Carry out that solve. Sanity check before trusting the number: it should land about ten times the lesson's 99.9% worked example, since the per-gate error fell tenfold." },
  ],
  solution: {
    steps: [{ description: "N = ln(0.5)/ln(0.9999) ≈ 6931 gates." }],
    finalAnswer: "≈6931 gates",
  },
  explanation: {
    correctIdea: "This is very nearly 10× the worked example's 693-gate result for 99.9% fidelity: a checkable illustration that a 10× reduction in per-gate error buys roughly a 10× increase in usable circuit depth.",
    whyCorrect: "Success multiplies as p^N, so the half-life in gates is ln(0.5)/ln(p). Since ln(0.9999) ≈ −10⁻⁴, the count lands near 0.693 × 10⁴, and each additional nine of fidelity multiplies the budget by ten.",
    whyWrong: ["Assuming fidelity improvements give only marginal circuit-depth gains misses this roughly-proportional relationship near p≈1."],
  },
};
