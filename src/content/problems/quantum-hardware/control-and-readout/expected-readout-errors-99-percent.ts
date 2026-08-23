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
    incorrectFeedback: "1000 × (1 - 0.99) = ?",
  },
  hints: [
    { text: "Error rate = 1 - fidelity = 1 - 0.99 = 0.01." },
    { text: "Expected errors = 1000 × 0.01." },
    { text: "= 10." },
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
