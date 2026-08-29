import type { NumericProblem } from "@/lib/problems/types";

const l = 2;
const value = 2 * l + 1;

export const lEquals2DegeneracyCount: NumericProblem = {
  meta: {
    slug: "l-equals-2-degeneracy-count",
    title: "How Many m-States Share an l=2 Energy Level?",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["capstone", "degeneracy"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"],
  },
  question: {
    type: "numeric",
    prompt: "For a central potential's l=2 angular momentum states, how many different m values (and hence how many degenerate states, from angular momentum alone) are there?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Use the 2l+1 count from this course's ladder-operator derivation.",
    nearMisses: [
      { value: 4, feedback: "4 is 2l, which forgets the m=0 rung sitting between the negative and positive values." },
      { value: 2, feedback: "2 is l itself, the angular momentum label. The question asks how many m values it permits." },
      { value: 3, feedback: "3 would be the count for l=1. At l=2 the ladder runs from m=−2 to m=+2." },
    ],
  },
  hints: [
    { text: "The general count of allowed m values for a given l is 2l+1." },
    { text: "With l=2: 2(2)+1." },
    { text: "Evaluate 2(2)+1, or simply list the allowed m values from -l up to +l and count them." },
  ],
  solution: {
    steps: [{ description: "2l+1 = 2(2)+1 = 5 states: m=−2,−1,0,1,2." }],
    finalAnswer: "5",
  },
  explanation: {
    correctIdea: "This 2l+1 degeneracy is a direct, general consequence of the ladder-operator spectrum derivation, not specific to hydrogen.",
    whyCorrect: "Matches the general m-counting rule from this course's ladder-operator lesson exactly.",
    whyWrong: ["Answering just 'l=2' or '2' confuses the angular momentum quantum number itself with the count of distinct m-states it allows."],
  },
};
