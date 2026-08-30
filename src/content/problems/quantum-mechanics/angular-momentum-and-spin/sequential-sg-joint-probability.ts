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
    prompt: "An unpolarized beam passes through a z-oriented Stern-Gerlach magnet, then an x-oriented one, then a second z-oriented one, with nothing else in between. What is the joint probability of the outcome sequence 'up' (z), '−' (x), 'down' (z)?",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Each of the three stages is independently 50/50, just like the lesson's worked example. Multiply all three.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 multiplies only two stages. All three measurements are 50/50, so three factors of a half are needed." },
      { value: 0.5, feedback: "0.5 is one stage's probability. The joint probability of a specific three-outcome sequence multiplies all three." },
      { value: 0, feedback: "Nothing here is forbidden: the x-measurement erases the earlier z-outcome, so 'down' at the third stage is as likely as 'up'." },
    ],
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
    whyCorrect: "This follows from each stage being an independent 50/50 measurement, as derived in the lesson.",
    whyWrong: ["Any answer other than 1/8 would imply some sequences are more likely than others. All 8 possible sequences are equally likely here."],
  },
};
