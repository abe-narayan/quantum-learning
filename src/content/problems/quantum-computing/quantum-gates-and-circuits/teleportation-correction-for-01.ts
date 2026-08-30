import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const teleportationCorrectionFor01: MultipleChoiceProblem = {
  meta: {
    slug: "teleportation-correction-for-01",
    title: "Bob's Correction When Alice's Outcomes Are (0, 1)",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["teleportation", "correction-table"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/quantum-teleportation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "The lesson works through the branch where Alice's two measurement outcomes are $(1,1)$, requiring Bob to apply $X$ then $Z$. Suppose instead Alice's outcomes come out $(m_0,m_1)=(0,1)$. According to the correction table, what should Bob apply?",
    options: [
      { id: "a", text: "Nothing; his qubit is already $|\\psi\\rangle$." },
      { id: "b", text: "Apply $X$ only." },
      { id: "c", text: "Apply $Z$ only." },
      { id: "d", text: "Apply $X$, then $Z$." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "That is the $(0,0)$ branch. Here $m_1=1$, and $m_1$ is the outcome that calls for an $X$.",
      c: "That is the $(1,0)$ branch. A $Z$ is called for by $m_0=1$, and here $m_0=0$.",
      d: "That is the $(1,1)$ branch, where both outcomes are 1 and both corrections are needed. Here only one of them is.",
    },
    defaultIncorrectFeedback:
      "Each outcome bit controls one correction. Work out which bit calls for $X$ and which calls for $Z$, then read off $(m_0,m_1)=(0,1)$.",
  },
  hints: [
    { text: "Bob's correction is built from two independent pieces, one controlled by each of Alice's outcome bits." },
    { text: "Compare the $(1,1)$ branch the lesson works through against the $(0,0)$ branch, which needs nothing, to see which bit switches on which gate." },
    { text: "For $(0,1)$ only one of the two bits is set, so only one of the two corrections applies." },
  ],
  solution: {
    steps: [
      { description: "The four-branch formula gives the correction table: $(0,0)\\to$ none, $(0,1)\\to X$, $(1,0)\\to Z$, $(1,1)\\to X$ then $Z$. Each bit switches on one gate: $m_1$ controls the $X$, $m_0$ controls the $Z$." },
      { description: "For outcomes $(0,1)$, Bob's qubit sits in the state $\\beta|0\\rangle+\\alpha|1\\rangle = X|\\psi\\rangle$, so applying $X$ recovers $|\\psi\\rangle$." },
    ],
    finalAnswer: "Apply $X$ only, since $m_1=1$ switches on the $X$ and $m_0=0$ leaves the $Z$ off.",
  },
  explanation: {
    correctIdea: "The correction table is not four unrelated rows: each outcome bit independently switches one gate on, so reading a row means asking which bits are set.",
    whyCorrect: "The four-branch formula shows Bob's qubit for outcome $(0,1)$ is $\\beta|0\\rangle+\\alpha|1\\rangle$, which is $X$ applied to the message state.",
    whyWrong: [
      { optionId: "a", text: "Applies nothing, which is the $(0,0)$ branch where neither bit is set." },
      { optionId: "c", text: "Applies the correction $m_0$ controls, but $m_0$ is 0 here." },
      { optionId: "d", text: "Applies both corrections, which the $(1,1)$ branch needs and this one does not." },
    ],
  },
};
