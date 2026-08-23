import type { NumericProblem } from "@/lib/problems/types";

export const xzCommutatorEntry: NumericProblem = {
  meta: {
    slug: "xz-commutator-entry",
    title: "An Entry of [X, Z]",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["commutators", "pauli-operators"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"],
  },
  question: {
    type: "numeric",
    prompt: "Compute [X, Z] = XZ - ZX directly. What is the magnitude of its (row 0, column 1) entry?",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0.001,
    incorrectFeedback: "Compute XZ and ZX as 2x2 matrix products first, then subtract entry-by-entry before taking the magnitude.",
  },
  hints: [
    { text: "XZ = [[0,-1],[1,0]], ZX = [[0,1],[-1,0]] — compute these first." },
    { text: "Subtract to get [X,Z], then take the magnitude of the top-right entry." },
  ],
  solution: {
    steps: [
      { description: "$XZ = \\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$, $ZX = \\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$." },
      { description: "$[X,Z] = XZ-ZX = \\begin{pmatrix}0&-2\\\\2&0\\end{pmatrix}$." },
      { description: "The $(0,1)$ entry is $-2$; its magnitude is $2$." },
    ],
    finalAnswer: "$2$",
  },
  explanation: {
    correctIdea: "[X,Z] is nonzero, confirming X and Z don't commute and therefore share no common eigenbasis.",
    whyCorrect: "Direct matrix subtraction, matching the platform's own gates.ts matrices exactly.",
    whyWrong: ["Computing only XZ or only ZX (forgetting to subtract) misses that it's the *difference* that matters — either product alone is nonzero even when the operators do commute."],
  },
};
