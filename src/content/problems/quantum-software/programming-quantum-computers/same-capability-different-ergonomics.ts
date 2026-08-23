import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const sameCapabilityDifferentErgonomics: MultipleChoiceProblem = {
  meta: {
    slug: "same-capability-different-ergonomics",
    title: "Do Different SDKs Have Fundamentally Different Capabilities?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["sdks"],
    prerequisites: ["quantum-software/programming-quantum-computers/quantum-sdks-overview"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson, do Qiskit, Cirq, and PennyLane have fundamentally different computational CAPABILITIES?",
    options: [
      { id: "a", text: "No — all can, in principle, express the same circuits and target the same range of backends; differences are ergonomics and ecosystem fit" },
      { id: "b", text: "Yes — each can only run on its own specific hardware brand" },
      { id: "c", text: "Yes — only PennyLane supports parametrized circuits" },
      { id: "d", text: "Yes — only Qiskit and Cirq support multi-qubit circuits" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "SDKs generally support multiple hardware backends and providers, not just one specific hardware brand each.",
      c: "Parametrized circuits (RX, RY, RZ-style gates) are standard across all major SDKs, not exclusive to PennyLane.",
      d: "Multi-qubit circuits are a basic, universal feature across every major SDK, including PennyLane.",
    },
    defaultIncorrectFeedback: "The lesson explicitly states these SDKs share the same underlying capability — differences are about ergonomics and ecosystem fit, not fundamental features.",
  },
  hints: [
    { text: "The lesson's explicit Common Mistakes point addresses this exact question." },
    { text: "All three can express similar circuits and target similar ranges of backends." },
    { text: "Differences are about convenience/ergonomics and which ecosystem each integrates with best, not raw capability." },
  ],
  solution: {
    steps: [{ description: "All three SDKs share the same fundamental capability; differences are about ergonomics, ecosystem, and convenience, not exclusive features." }],
    finalAnswer: "(a) No — capabilities are shared; differences are ergonomics/ecosystem",
  },
  explanation: {
    correctIdea: "This directly tests the lesson's explicit Common Mistakes warning against overstating SDK differences.",
    whyCorrect: "Matches the lesson's explicit statement.",
    whyWrong: ["Each distractor invents an exclusive feature or restriction not actually true of any major real-world SDK."],
  },
};
