import type { NumericProblem } from "@/lib/problems/types";

export const superdenseLambdaForTargetSuccess: NumericProblem = {
  meta: {
    slug: "superdense-lambda-for-target-success",
    title: "Dephasing Strength for a Target Superdense-Coding Success Rate",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["superdense-coding", "dephasing"],
    prerequisites: ["quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding"],
  },
  question: {
    type: "numeric",
    prompt:
      "Using the verified closed form P_success(lambda) = 1 - lambda/2 for superdense coding with a dephased Bell pair, find the dephasing strength lambda at which the success probability is exactly 0.75.",
    inputHint: "value of lambda between 0 and 1",
  },
  answer: {
    type: "numeric",
    value: 0.5,
    tolerance: 0.001,
    incorrectFeedback: "Set 1 - lambda/2 = 0.75 and solve for lambda.",
  },
  hints: [
    { text: "1 - lambda/2 = 0.75" },
    { text: "lambda/2 = 0.25" },
  ],
  solution: {
    steps: [
      { description: "$1-\\lambda/2=0.75 \\Rightarrow \\lambda/2=0.25 \\Rightarrow \\lambda=0.5$" },
    ],
    finalAnswer: "lambda = 0.5.",
  },
  explanation: {
    correctIdea: "Superdense coding's success probability under this specific noise model degrades linearly in the dephasing strength lambda.",
    whyCorrect: "This matches the lesson's own two checked data points (lambda=0.2 giving 0.9, lambda=0.4 giving 0.8), confirming the linear formula.",
  },
};
