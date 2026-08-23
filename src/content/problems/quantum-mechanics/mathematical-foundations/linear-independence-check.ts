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
      { id: "d", text: "$\\{(1,0), (1,0)\\}$" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "(i,0) = i·(1,0) — a complex scalar multiple of the first vector, so this pair is dependent over ℂ even though the two vectors 'look' different.",
      c: "(2,2) = 2·(1,1) — a real scalar multiple, so this pair is dependent.",
      d: "These are literally the same vector twice — trivially dependent.",
    },
    defaultIncorrectFeedback: "Check whether one vector is a complex scalar multiple of the other.",
  },
  hints: [
    { text: "Two vectors are dependent exactly when one is a scalar multiple of the other." },
    { text: "The scalar is allowed to be any complex number, not just a real one." },
  ],
  solution: {
    steps: [
      { description: "For each pair, check whether one vector equals c times the other for some complex c." },
      { description: "$(i,0)=i\\cdot(1,0)$ and $(2,2)=2\\cdot(1,1)$ are both dependent pairs." },
      { description: "$(1,0)$ and $(0,1)$ have no such relationship — no complex $c$ satisfies $(0,1)=c(1,0)$, since that would require $c=0$ from the first coordinate but $c=1/0$ from the second." },
    ],
    finalAnswer: "$\\{(1,0),(0,1)\\}$ is the linearly independent set.",
  },
  explanation: {
    correctIdea: "Independence over ℂ allows complex scalars, so a pair can look 'different' while still being dependent.",
    whyCorrect: "The standard basis vectors (1,0) and (0,1) genuinely point in unrelated directions — no complex scalar relates them.",
    whyWrong: ["(i,0) and (1,0) are dependent precisely because complex scalars are allowed — this is the subtlety the lesson emphasizes."],
  },
};
