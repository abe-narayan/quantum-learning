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
      { id: "a", text: "Nothing — his qubit is already $|\\psi\\rangle$." },
      { id: "b", text: "Apply $X$ only." },
      { id: "c", text: "Apply $Z$ only." },
      { id: "d", text: "Apply $Z$, then $X$." },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "b",
    optionFeedback: {
      a: "Outcome $(0,0)$ is the branch requiring no correction, not $(0,1)$.",
      c: "Outcome $(1,0)$ is the branch requiring only $Z$, not $(0,1)$.",
      d: "Outcome $(1,1)$ is the branch requiring $Z$ then $X$, not $(0,1)$.",
    },
    defaultIncorrectFeedback:
      "Check the correction table against $(m_0,m_1)=(0,1)$ specifically — each of the four outcome pairs maps to a different, single correction.",
  },
  hints: [
    { text: "The lesson's correction table lists all four possible outcome pairs and their corrections." },
    { text: "Read off the row for $(m_0,m_1)=(0,1)$ specifically." },
  ],
  solution: {
    steps: [
      { description: "The correction table (derived from the four-branch formula) reads: $(0,0)\\to$ none, $(0,1)\\to X$, $(1,0)\\to Z$, $(1,1)\\to Z$ then $X$." },
      { description: "For outcomes $(0,1)$, Bob's qubit sits in the state $\\beta|0\\rangle+\\alpha|1\\rangle = X|\\psi\\rangle$, so applying $X$ recovers $|\\psi\\rangle$." },
    ],
    finalAnswer: "Apply $X$ only.",
  },
  explanation: {
    correctIdea: "Each of Alice's four possible outcome pairs corresponds to a different, fixed, single-row correction from the table derived in the lesson.",
    whyCorrect: "The four-branch formula shows Bob's qubit for outcome $(0,1)$ is exactly $\\beta|0\\rangle+\\alpha|1\\rangle$, which is $X$ applied to the message state.",
    whyWrong: ["Confusing which correction goes with which outcome pair is the most common mistake here — always re-derive from the four-branch formula rather than guessing by pattern."],
  },
};
