import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const gateTimeVsCoherenceRatio: MultipleChoiceProblem = {
  meta: {
    slug: "gate-time-vs-coherence-ratio",
    title: "What Actually Determines the Operation Budget?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["superconducting-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/superconducting-qubits"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson, what actually determines how many gate operations can be performed before decoherence dominates?",
    options: [
      { id: "a", text: "The RATIO of coherence time to gate time" },
      { id: "b", text: "Coherence time alone" },
      { id: "c", text: "Gate time alone" },
      { id: "d", text: "The number of qubits in the device" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Coherence time alone doesn't say how many operations fit inside it — that also depends on how long each operation takes.",
      c: "Gate time alone doesn't say how many operations fit before decoherence — that also depends on how much coherent time is available.",
      d: "Qubit count is a separate scaling question, unrelated to the per-qubit operation budget this lesson discusses.",
    },
    defaultIncorrectFeedback: "The operation budget is a ratio: (coherence time) / (gate time), not either quantity considered alone.",
  },
  hints: [
    { text: "Consider two platforms: one fast-but-short-coherence, one slow-but-long-coherence." },
    { text: "Comparing them fairly requires dividing coherence time by gate time." },
    { text: "This is exactly the calculation this lesson's worked example performs." },
  ],
  solution: {
    steps: [{ description: "The operation budget is coherence time divided by gate time — a ratio, not either number alone." }],
    finalAnswer: "(a) The ratio of coherence time to gate time",
  },
  explanation: {
    correctIdea: "This is the lesson's central 'no single metric wins' point, tested directly.",
    whyCorrect: "Matches the worked example's explicit ratio calculation.",
    whyWrong: ["Judging platforms by gate speed or coherence time alone, in isolation, is exactly the comparison error this lesson warns against."],
  },
};
