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
    { text: "Write out the definition: [A,B] = AB − BA." },
    { text: "Now write [B,A] = BA − AB and compare the two expressions term by term." },
    { text: "Swapping the two operators negates the whole commutator, so apply that to the value you were given." },
  ],
  solution: {
    steps: [{ description: "[Ly,Lx] = LyLx − LxLy = −(LxLy − LyLx) = −[Lx,Ly] = −iħLz. The antisymmetry is immediate from the definition, so nothing about Lx and Ly in particular is needed." }],
    finalAnswer: "−iħLz, since swapping the two arguments of a commutator negates it.",
  },
  explanation: {
    correctIdea: "Commutator antisymmetry is an algebraic fact about the definition AB − BA, independent of what the two operators are.",
    whyCorrect: "Matches the definition [A,B] = AB − BA, which changes sign under swapping A and B.",
    whyWrong: [
      { optionId: "b", text: "Leaves the sign alone, treating the commutator as symmetric in its arguments. It never is." },
      { optionId: "c", text: "Changes which operator appears on the right-hand side. Swapping the arguments changes the sign, not the result operator." },
      { optionId: "d", text: "Says the two commute, which is the claim this whole lesson exists to deny." },
    ],
  },
};
