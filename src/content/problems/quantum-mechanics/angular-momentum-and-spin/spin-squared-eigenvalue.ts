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
    inputHint: "as a decimal, not a fraction",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.01,
    incorrectFeedback: "Compute (1/2)(1/2+1) directly.",
    nearMisses: [
      { value: 0.25, feedback: "0.25 is j², not j(j+1). The eigenvalue of S² always exceeds the square of the largest S_z value, which is why a spin can never point exactly along an axis." },
      { value: 0.5, feedback: "0.5 is j itself, the spin label. The S² eigenvalue is j(j+1) in units of ħ²." },
      { value: 1.5, feedback: "1.5 is j+1. Both factors are needed: multiply j by j+1." },
    ],
  },
  hints: [
    { text: "The general eigenvalue of J² is j(j+1), in units of ħ²." },
    { text: "Substitute j = 1/2 into both factors: the second one is j+1, not j." },
    { text: "Multiply the two. As a check, the answer should exceed j² = 1/4, which is why the spin vector never lies flat along z." },
  ],
  solution: {
    steps: [{ description: "(1/2)(3/2) = 3/4 = 0.75." }],
    finalAnswer: "0.75",
  },
  explanation: {
    correctIdea: "This matches the direct Pauli-matrix computation X²+Y²+Z²=3I exactly, divided by 4.",
    whyCorrect: "Confirmed both by the general j(j+1) formula and by direct Pauli matrix algebra.",
    whyWrong: ["Answering 0.25 uses j² instead of j(j+1). The two quantities coincide only at j=0."],
  },
};
