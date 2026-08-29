import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const threeKindsOfAdvantageClaims: MultipleChoiceProblem = {
  meta: {
    slug: "three-kinds-of-advantage-claims",
    title: "Matching Algorithms to Their Kind of Advantage Claim",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "multiple-choice",
    tags: ["capstone", "quantum-advantage"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Which pairing correctly matches each algorithm to its kind of speedup guarantee?",
    options: [
      { id: "a", text: "Grover's = provably optimal; Deutsch-Jozsa = promise-dependent exponential; QAOA = heuristic, no guarantee" },
      { id: "b", text: "All three algorithms carry the same kind of guarantee: provably optimal" },
      { id: "c", text: "Grover's = heuristic; Deutsch-Jozsa = provably optimal; QAOA = promise-dependent" },
      { id: "d", text: "None of the three algorithms in this platform's courses carry any formal guarantee" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "These are three genuinely different kinds of claims — treating them as identical erases exactly the distinction this course built across two lessons.",
      c: "This reverses Grover's and Deutsch-Jozsa's actual guarantees, and mischaracterizes QAOA as promise-dependent when it's a heuristic with no proven guarantee at all.",
      d: "Grover's and Deutsch-Jozsa both carry real, proven mathematical guarantees — only QAOA lacks one.",
    },
    defaultIncorrectFeedback: "Recall Quantum Algorithms I's capstone (Grover's, Deutsch-Jozsa) and this course's capstone (QAOA) separately.",
  },
  hints: [
    { text: "Grover's speedup was proven optimal for unstructured search generally." },
    { text: "Deutsch-Jozsa's exponential speedup depends entirely on its specific promise." },
    { text: "QAOA has no proven performance guarantee — it's evaluated empirically, worked example by worked example." },
  ],
  solution: {
    steps: [{ description: "Grover's = provably optimal; Deutsch-Jozsa = promise-dependent exponential; QAOA = heuristic, no guarantee." }],
    finalAnswer: "Grover's = provably optimal; Deutsch-Jozsa = promise-dependent exponential; QAOA = heuristic, no guarantee.",
  },
  explanation: {
    correctIdea: "Recognizing these as three genuinely distinct categories, not interchangeable synonyms for 'quantum is faster,' is the central synthesis point across both algorithms courses.",
    whyCorrect: "This matches exactly the distinctions drawn in Quantum Algorithms I's capstone and reinforced in this course's own capstone.",
    whyWrong: [
      { optionId: "b", text: "Collapses three different kinds of claim into one, erasing the distinction this course built across two lessons." },
      { optionId: "c", text: "Reverses Grover's and Deutsch-Jozsa's guarantees, and calls QAOA promise-dependent when it is a heuristic with no proven guarantee." },
      { optionId: "d", text: "Grover's and Deutsch-Jozsa both carry proven mathematical guarantees. Only QAOA lacks one." },
    ],
  },
};
