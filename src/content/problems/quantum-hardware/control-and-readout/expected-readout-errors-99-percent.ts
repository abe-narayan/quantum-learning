import type { NumericProblem } from "@/lib/problems/types";

const shots = 1000;
const fidelity = 0.99;
const value = shots * (1 - fidelity);

export const expectedReadoutErrors99Percent: NumericProblem = {
  meta: {
    slug: "expected-readout-errors-99-percent",
    title: "Expected Readout Errors at 99% Fidelity",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/qubit-readout-techniques",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "numeric",
    tags: ["readout"],
    prerequisites: ["quantum-hardware/control-and-readout/qubit-readout-techniques"],
  },
  question: {
    type: "numeric",
    prompt: "For 1000 shots at 99% readout fidelity, roughly how many are expected to be readout errors?",
    inputHint: "as a number",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 1,
    incorrectFeedback: "Error rate is 1 minus the fidelity, not the fidelity itself. If you got 990, you counted the correct shots; the errors are the small remainder.",
    nearMisses: [
      { value: 990, feedback: "990 is the number of shots read out correctly. The errors are the remaining share, 1 − F." },
      { value: 30, feedback: "30 is the lesson's own answer at 97% fidelity. This device is three times better, so it makes three times fewer errors." },
    ],
  },
  hints: [
    { text: "Fidelity is the probability a readout comes out correct, so the error rate is its complement. Find that rate first." },
    { text: "Expected errors = shots × error rate = 1000 × (1 - 0.99)." },
    { text: "Multiply out. Sanity check: at this fidelity, about one shot in a hundred goes wrong." },
  ],
  solution: {
    steps: [{ description: "1000 × (1-0.99) = 1000 × 0.01 = 10." }],
    finalAnswer: "10",
  },
  explanation: {
    correctIdea: "This is roughly 3x fewer errors than the lesson's own 97%-fidelity worked example (30 errors), directly showing how sensitive the error count is to the fidelity percentage.",
    whyCorrect: "Direct application of the lesson's worked-example methodology to a different fidelity value.",
    whyWrong: ["Confusing fidelity with error rate directly (answering 990, using 0.99 instead of 0.01) inverts the calculation."],
  },
};
