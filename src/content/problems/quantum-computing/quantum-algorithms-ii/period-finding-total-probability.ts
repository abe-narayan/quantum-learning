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
    incorrectFeedback: "This is a probability distribution over a valid quantum state's measurement outcomes — what must any such distribution sum to?",
  },
  hints: [
    { text: "This is a full probability distribution over the counting register's outcomes." },
    { text: "Probabilities of all possible outcomes of any measurement always sum to 1." },
    { text: "No special property of period finding changes this basic normalization fact." },
  ],
  solution: {
    steps: [{ description: "Any valid probability distribution over measurement outcomes sums to exactly 1, by normalization." }],
    finalAnswer: "1.0",
  },
  explanation: {
    correctIdea: "This is a basic normalization sanity check, not specific to period finding's structure.",
    whyCorrect: "Confirmed directly from the engine's actual output.",
    whyWrong: ["Any answer other than 1 would indicate either a genuine engine bug or a misunderstanding of what a probability distribution is."],
  },
};
