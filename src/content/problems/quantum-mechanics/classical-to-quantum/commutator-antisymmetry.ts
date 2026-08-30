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
    incorrectFeedback: "You carried the given value across unchanged, as though the bracket did not care about the order of its entries. Rebuild both brackets from the definition and compare which product each one subtracts.",
    nearMisses: [
      { value: 1, feedback: "You reported the same value the prompt gave for $[\\hat x,\\hat p]$, treating the bracket as symmetric. Expand both from $AB-BA$ and the two orderings do not agree." },
      { value: 0, feedback: "Zero says the two operators commute. The prompt already states they do not; the question is only about the sign." },
    ],
  },
  hints: [
    { text: "Nothing specific to position or momentum is needed here. The question is what happens to any commutator when its two entries trade places." },
    { text: "Write out $[\\hat p,\\hat x]$ and $[\\hat x,\\hat p]$ from the definition $[A,B]=AB-BA$. Both are built from the same two products." },
    { text: "The two expressions differ only in which product carries the minus sign, so one is a fixed numerical multiple of the other. Apply that multiple to the given $i\\hbar$." },
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
