import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const twoImplementationsCrossCheck: MultipleChoiceProblem = {
  meta: {
    slug: "two-implementations-cross-check",
    title: "Why Two Different Code Paths Agreeing Is Meaningful",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["variational-algorithms"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why does the QuantumCircuit-based VQE matching Quantum Algorithms II's matrix-based exactGroundStateEnergy serve as a genuine correctness check?",
    options: [
      { id: "a", text: "Because the two implementations compute the same physics through independent code paths — agreement rules out a class of bugs that would affect only one path" },
      { id: "b", text: "It doesn't serve as a real check — the two implementations are actually the same code" },
      { id: "c", text: "Because QuantumCircuit is inherently more trustworthy than matrix computation" },
      { id: "d", text: "Because VQE always converges to the same answer regardless of implementation" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "They're genuinely different code paths — one builds a circuit-as-data structure and dispatches through gate-application functions; the other computes ansatz matrices directly.",
      c: "Neither implementation is inherently 'more trustworthy' — the value comes specifically from their INDEPENDENCE, not from one being superior.",
      d: "This begs the question — 'VQE always converges to the same answer' is exactly what's being verified, not something that can be assumed in advance.",
    },
    defaultIncorrectFeedback: "The value of cross-checking comes from the two implementations being genuinely independent — a bug specific to one code path would likely cause a mismatch, not agreement.",
  },
  hints: [
    { text: "This platform's QuantumCircuit and Quantum Algorithms II's ansatzState are genuinely different code paths, not the same code." },
    { text: "A bug specific to one implementation would likely cause the two results to DISAGREE." },
    { text: "Their agreement is real evidence both are correct, not just a formality." },
  ],
  solution: {
    steps: [{ description: "The two implementations are independent code paths computing the same physics; their agreement rules out bugs specific to either one, making it a genuine correctness check." }],
    finalAnswer: "(a) Independent code paths agreeing rules out path-specific bugs",
  },
  explanation: {
    correctIdea: "This is a basic but important software-verification principle (independent implementation cross-checking), applied concretely to this platform's own VQE code.",
    whyCorrect: "Matches the lesson's explicit Physical Interpretation section.",
    whyWrong: ["Dismissing the check as trivial or automatic misunderstands that genuine independence between the two code paths is exactly what makes their agreement meaningful evidence."],
  },
};
