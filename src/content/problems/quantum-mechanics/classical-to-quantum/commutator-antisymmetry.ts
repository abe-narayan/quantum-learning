import type { NumericProblem } from "@/lib/problems/types";

export const commutatorAntisymmetry: NumericProblem = {
  meta: {
    slug: "commutator-antisymmetry",
    title: "[p,x] From [x,p]",
    course: "classical-to-quantum",
    lesson: "quantum-mechanics/classical-to-quantum/position-and-momentum",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["commutators", "position-momentum"],
    prerequisites: ["quantum-mechanics/classical-to-quantum/position-and-momentum"],
  },
  question: {
    type: "numeric",
    prompt: "Given $[\\hat x,\\hat p]=i\\hbar$, express $[\\hat p,\\hat x]$ as a multiple of $i\\hbar$ (e.g. enter 1 for $i\\hbar$, or -1 for $-i\\hbar$).",
    inputHint: "a number",
  },
  answer: {
    type: "numeric",
    value: -1,
    tolerance: 0.001,
    incorrectFeedback: "The commutator is antisymmetric: [B,A] = -[A,B] for any A, B.",
  },
  hints: [
    { text: "[p,x] = px - xp = -(xp - px) = -[x,p]." },
  ],
  solution: {
    steps: [
      { description: "By definition, $[p,x]=px-xp=-(xp-px)=-[x,p]$.", latex: "[p,x] = -i\\hbar" },
    ],
    finalAnswer: "$-1$ (i.e. $[p,x]=-i\\hbar$)",
  },
  explanation: {
    correctIdea: "Every commutator is antisymmetric under swapping its two operators, by definition.",
    whyCorrect: "This is a general algebraic fact, true for any pair of operators, not specific to x and p.",
    whyWrong: ["Assuming [p,x]=[x,p] (the same value) ignores that a commutator, by its very definition, flips sign when the two operators are swapped."],
  },
};
