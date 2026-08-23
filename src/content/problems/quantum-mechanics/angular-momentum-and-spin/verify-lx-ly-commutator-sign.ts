import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const verifyLxLyCommutatorSign: MultipleChoiceProblem = {
  meta: {
    slug: "verify-lx-ly-commutator-sign",
    title: "The Sign of [Ly,Lx]",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["angular-momentum", "commutators"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Given [Lx,Ly]=iħLz, what is [Ly,Lx]?",
    options: [
      { id: "a", text: "−iħLz" },
      { id: "b", text: "+iħLz" },
      { id: "c", text: "iħLx" },
      { id: "d", text: "0" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This ignores the antisymmetry every commutator has: [A,B]=−[B,A] always.",
      c: "Swapping the operators in a commutator doesn't change which operator appears on the right-hand side, only the overall sign.",
      d: "Lx and Ly don't commute — that's the entire content of this lesson.",
    },
    defaultIncorrectFeedback: "Recall the general commutator identity [A,B]=−[B,A].",
  },
  hints: [
    { text: "Every commutator satisfies [A,B]=−[B,A]." },
    { text: "Apply this with A=Lx, B=Ly." },
    { text: "[Ly,Lx]=−[Lx,Ly]=−iħLz." },
  ],
  solution: {
    steps: [{ description: "[Ly,Lx]=−[Lx,Ly]=−iħLz, using the general antisymmetry of any commutator." }],
    finalAnswer: "−iħLz",
  },
  explanation: {
    correctIdea: "Commutator antisymmetry is a completely general algebraic fact, independent of what Lx,Ly specifically are.",
    whyCorrect: "Matches the direct definition [A,B]=AB−BA, which flips sign under swapping A and B.",
    whyWrong: ["Any answer other than −iħLz misapplies or ignores the basic antisymmetry property of commutators."],
  },
};
