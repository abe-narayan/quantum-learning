import type { NumericProblem } from "@/lib/problems/types";

const j = 0.5;
const value = j * (j + 1);

export const spinSquaredEigenvalue: NumericProblem = {
  meta: {
    slug: "spin-squared-eigenvalue",
    title: "S² Eigenvalue for Spin-1/2 (in units of ħ²)",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["spin"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"],
  },
  question: {
    type: "numeric",
    prompt: "Using j(j+1) with j=1/2, what is S²'s eigenvalue in units of ħ²?",
    inputHint: "as a decimal (e.g. a fraction like 0.75)",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute (1/2)(1/2+1) directly.",
  },
  hints: [
    { text: "j(j+1) with j=1/2." },
    { text: "(1/2)(3/2)." },
    { text: "= 3/4." },
  ],
  solution: {
    steps: [{ description: "(1/2)(3/2) = 3/4 = 0.75." }],
    finalAnswer: "0.75",
  },
  explanation: {
    correctIdea: "This matches the direct Pauli-matrix computation X²+Y²+Z²=3I exactly, divided by 4.",
    whyCorrect: "Confirmed both by the general j(j+1) formula and by direct Pauli matrix algebra.",
    whyWrong: ["Answering 0.25 (just j² instead of j(j+1)) confuses the two different quantities — they're only equal for j=0."],
  },
};
