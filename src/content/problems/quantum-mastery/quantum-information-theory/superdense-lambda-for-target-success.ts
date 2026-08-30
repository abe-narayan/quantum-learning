import type { NumericProblem } from "@/lib/problems/types";

export const superdenseLambdaForTargetSuccess: NumericProblem = {
  meta: {
    slug: "superdense-lambda-for-target-success",
    title: "Dephasing Strength for a Target Superdense-Coding Success Rate",
    course: "quantum-information-theory",
    lesson: "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
    difficulty: "master",
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
    nearMisses: [
      { value: 0.25, feedback: "0.25 is lambda/2, the amount the success probability dropped. Undo the halving to recover lambda." },
      { value: 0.75, feedback: "0.75 is the target success probability, not the dephasing strength that produces it." },
    ],
  },
  hints: [
    { text: "Set the closed form equal to the target success rate and solve for lambda; no new physics is needed beyond rearranging one linear equation." },
    { text: "Isolate the lambda/2 term first, then undo the halving. Sanity check against the lesson's data points: lambda=0.4 gave 0.8, so a target of 0.75 needs more dephasing than that." },
  ],
  solution: {
    steps: [
      { description: "$1-\\lambda/2=0.75 \\Rightarrow \\lambda/2=0.25 \\Rightarrow \\lambda=0.5$" },
    ],
    finalAnswer: "lambda = 0.5.",
  },
  explanation: {
    correctIdea: "Superdense coding's success probability under this specific noise model degrades linearly in the dephasing strength lambda.",
    whyCorrect: "Two data points checked in the lesson (lambda=0.2 giving 0.9, lambda=0.4 giving 0.8) lie on the same straight line as this one, which is what shows the relation is genuinely linear rather than merely fitted at a single value.",
  },
};
