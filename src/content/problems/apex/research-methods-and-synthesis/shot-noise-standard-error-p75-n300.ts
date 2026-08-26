import type { NumericProblem } from "@/lib/problems/types";

export const shotNoiseStandardErrorP75N300: NumericProblem = {
  meta: {
    slug: "shot-noise-standard-error-p75-n300",
    title: "Standard Error of an Estimated Probability from Shot Count",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["shot-noise", "standard-error", "reproducibility", "statistics"],
    prerequisites: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },
  question: {
    type: "numeric",
    prompt:
      "A circuit is run N=300 times, and the target outcome's estimated probability is p=0.75. Using the standard binomial-proportion standard error formula SE = sqrt(p(1-p)/N), compute SE.",
    inputHint: "decimal, to 3 decimal places",
  },
  answer: {
    type: "numeric",
    value: 0.025,
    tolerance: 0.001,
    incorrectFeedback:
      "SE = sqrt(p(1-p)/N) = sqrt(0.75 * 0.25 / 300) = sqrt(0.1875 / 300) = sqrt(0.000625) = 0.025.",
  },
  hints: [
    { text: "This is exactly the formula this lesson derived: SE(p̂) = sqrt(p(1-p)/N), the standard deviation of the sample-proportion ESTIMATOR itself, not of a single trial." },
    { text: "Compute p(1-p) first: 0.75 × 0.25 = 0.1875." },
    { text: "Divide by N=300, then take the square root: sqrt(0.1875 / 300) = sqrt(0.000625)." },
  ],
  solution: {
    steps: [
      { description: "$p(1-p) = 0.75 \\times 0.25 = 0.1875$" },
      { description: "$p(1-p)/N = 0.1875 / 300 = 0.000625$" },
      { description: "$\\text{SE} = \\sqrt{0.000625} = 0.025$" },
    ],
    finalAnswer: "SE ≈ 0.025, so the reported probability is p = 0.75 ± 0.025 (1σ).",
  },
  explanation: {
    correctIdea:
      "The standard error of an estimated probability from N shots is sqrt(p(1-p)/N), exactly the formula this lesson derived from the binomial distribution's variance.",
    whyCorrect:
      "k successes out of N independent trials is binomially distributed with variance Np(1-p); dividing by the constant N to form p̂ = k/N scales the variance by 1/N², giving Var(p̂) = p(1-p)/N and hence SE(p̂) = sqrt(p(1-p)/N).",
    whyWrong: [
      "Forgetting to divide by N before taking the square root gives the SINGLE-TRIAL standard deviation, sqrt(p(1-p)) ≈ 0.433, dramatically overstating the uncertainty in the average of 300 trials.",
      "Using sqrt(p(1-p)) × N or sqrt(N) alone confuses the shot count's role in REDUCING uncertainty (it divides variance, inside the square root) with scaling it up.",
    ],
  },
};
