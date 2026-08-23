import type { NumericProblem } from "@/lib/problems/types";

const value = 0.5 * 0.5 * 0.5;

export const sequentialSgJointProbability: NumericProblem = {
  meta: {
    slug: "sequential-sg-joint-probability",
    title: "Joint Probability for a Different SG Sequence",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["stern-gerlach"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"],
  },
  question: {
    type: "numeric",
    prompt: "For the sequence 'up' (z), '−' (x), 'down' (z), what is the joint probability, using the same reasoning as the lesson's worked example?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Each of the three stages is independently 50/50, just like the lesson's worked example — multiply all three.",
  },
  hints: [
    { text: "P(up first) = 1/2." },
    { text: "P(− second | up first) = 1/2." },
    { text: "P(down third | − second) = 1/2, since the x-measurement already erased the z-history." },
  ],
  solution: {
    steps: [{ description: "(1/2)×(1/2)×(1/2) = 1/8, by the same independence argument as the lesson's worked example." }],
    finalAnswer: "0.125",
  },
  explanation: {
    correctIdea: "Every specific 3-outcome sequence in this experiment has the same 1/8 probability, regardless of which specific outcomes are chosen.",
    whyCorrect: "This follows directly from each stage being an independent 50/50 measurement, exactly as derived in the lesson.",
    whyWrong: ["Any answer other than 1/8 would imply some sequences are more likely than others, which isn't the case here — every one of the 8 possible sequences is equally likely."],
  },
};
