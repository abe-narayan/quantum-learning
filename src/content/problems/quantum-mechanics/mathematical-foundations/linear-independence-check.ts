import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const linearIndependenceCheck: MultipleChoiceProblem = {
  meta: {
    slug: "linear-independence-check",
    title: "Checking Linear Independence Over ℂ",
    course: "mathematical-foundations",
    lesson: "quantum-mechanics/mathematical-foundations/vector-spaces",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["vector-spaces", "linear-independence"],
    prerequisites: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which of the following sets of vectors in $\\mathbb{C}^2$ is linearly independent over $\\mathbb{C}$?",
    options: [
      { id: "a", text: "$\\{(1,0), (i,0)\\}$" },
      { id: "b", text: "$\\{(1,0), (0,1)\\}$" },
      { id: "c", text: "$\\{(1,1), (2,2)\\}$" },
      { id: "d", text: "$\\{(0,0), (1,1)\\}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "(i,0) = i·(1,0), a complex scalar multiple of the first vector, so this pair is dependent over ℂ even though the two vectors 'look' different.",
      c: "(2,2) = 2·(1,1), a real scalar multiple, so this pair is dependent.",
      d: "Any set containing the zero vector is dependent, whatever else is in it: 1·(0,0) + 0·(1,1) = 0 is already a combination with a nonzero coefficient. Nothing about (1,1) needs checking.",
    },
    defaultIncorrectFeedback: "Check whether one vector is a complex scalar multiple of the other.",
  },
  hints: [
    { text: "For a pair of vectors, dependence means one is a scalar multiple of the other, so scan each pair for a common factor rather than solving anything." },
    { text: "The scalar may be any complex number, not only a real one, so a factor of $i$ counts as dependence just as much as a factor of 2 does." },
    { text: "One pair contains the zero vector. Ask whether the zero vector can be written as a multiple of the other one, and what that says about the pair." },
  ],
  solution: {
    steps: [
      { description: "For each pair, check whether one vector equals c times the other for some complex c." },
      { description: "$(i,0)=i\\cdot(1,0)$ and $(2,2)=2\\cdot(1,1)$ are dependent pairs; $\\{(0,0),(1,1)\\}$ is dependent because the zero vector is in it." },
      { description: "$(1,0)$ and $(0,1)$ have no such relationship: no complex $c$ satisfies $(0,1)=c(1,0)$, since that would require $c=0$ from the first coordinate but $c=1/0$ from the second." },
    ],
    finalAnswer: "$\\{(1,0),(0,1)\\}$ is the linearly independent set.",
  },
  explanation: {
    correctIdea: "Independence over ℂ allows complex scalars, so a pair can look 'different' while still being dependent.",
    whyCorrect: "The standard basis vectors (1,0) and (0,1) point in unrelated directions; no complex scalar relates them.",
    whyWrong: [
      { optionId: "a", text: "The trap of the set: the two entries look unrelated, but (i,0) = i·(1,0), and over ℂ that scalar is allowed." },
      { optionId: "c", text: "(2,2) = 2·(1,1), a real multiple, so the pair spans only a line." },
      { optionId: "d", text: "Overlooks the zero vector, which drags any set it belongs to into dependence: give it coefficient 1 and everything else coefficient 0." },
    ],
  },
};
