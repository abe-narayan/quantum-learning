import { periodFindingMeasurementDistribution } from "@/lib/quantum/shor";
import type { NumericProblem } from "@/lib/problems/types";

const dist = periodFindingMeasurementDistribution(7, 15, 6);
const value = dist.reduce((sum, p) => sum + p, 0);

export const periodFindingTotalProbability: NumericProblem = {
  meta: {
    slug: "period-finding-total-probability",
    title: "Total Probability Across the Period-Finding Distribution",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["shors-algorithm"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"],
  },
  question: {
    type: "numeric",
    prompt: "Summing periodFindingMeasurementDistribution's output over every possible outcome for a=7, N=15, t=6, what should the total equal?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    nearMisses: [
      { value: 0, tolerance: 0.0005, feedback: "0 would say no outcome can occur at all. Any measurement on a valid state has to land somewhere." },
      { value: 64, tolerance: 0.5, feedback: "64 counts the possible outcomes for t = 6 rather than summing their probabilities. The question asks for the total weight, not the number of entries." },
      { value: 0.015625, tolerance: 0.0005, feedback: "That is 1/64, the weight one outcome would carry if the distribution were flat. The sum runs over all of them, and the distribution is not flat here anyway." },
    ],
    incorrectFeedback: "This is a probability distribution over a valid quantum state's measurement outcomes. What must any such distribution sum to?",
  },
  hints: [
    { text: "This is a full probability distribution over the counting register's outcomes." },
    { text: "Recall the normalization constraint every measurement-outcome distribution obeys, whatever circuit produced it." },
    { text: "No special property of period finding changes this basic normalization fact." },
  ],
  solution: {
    steps: [{ description: "Any valid probability distribution over measurement outcomes sums to exactly 1, by normalization." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This is a basic normalization sanity check, not specific to period finding's structure.",
    whyCorrect: "Confirmed directly from the engine's actual output.",
    whyWrong: ["Any answer other than 1 would mean either an engine bug or a misreading of what a probability distribution is."],
  },
};
