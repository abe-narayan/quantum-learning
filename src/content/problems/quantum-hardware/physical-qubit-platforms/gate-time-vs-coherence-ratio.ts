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
      { id: "a", text: "The ratio of coherence time to gate time, which counts how many fit" },
      { id: "b", text: "The coherence time on its own, since a longer-lived qubit does more" },
      { id: "c", text: "The gate time on its own, since faster gates get more done per second" },
      { id: "d", text: "The difference, coherence time minus gate time, in the same units" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "A 2-second coherence time sounds decisive until you learn the gates take 20 microseconds each. How many operations fit depends on both numbers.",
      c: "A 50-nanosecond gate sounds decisive until you learn the qubit only stays coherent for 100 microseconds. Speed alone does not set the budget.",
      d: "Subtracting leaves a time, not a count. Coherence minus gate time answers 'how much time is left after one gate', not 'how many gates fit'.",
    },
    defaultIncorrectFeedback: "The operation budget is a count, so it comes from dividing the available time by the time each operation costs, not from either number on its own.",
  },
  hints: [
    { text: "The budget you want is a count of operations, not a duration. Check the units of each candidate." },
    { text: "Picture two platforms: one fast with short coherence, one slow with long coherence. Neither number alone separates them." },
    { text: "Fitting items of a fixed length into a fixed span is a division." },
  ],
  solution: {
    steps: [{ description: "The operation budget counts how many gate-length intervals fit inside the coherence window, which is coherence time divided by gate time." }],
    finalAnswer: "The ratio of coherence time to gate time, which is what turns two durations into a count of operations.",
  },
  explanation: {
    correctIdea: "The number of operations before decoherence dominates is a count, and a count of fixed-length intervals inside a fixed window is a quotient of the two times.",
    whyCorrect: "Two durations only become a count of operations when one is divided by the other. A long-lived qubit with slow gates and a short-lived one with fast gates can reach the same total, which is why neither duration on its own answers the question.",
    whyWrong: [
      { optionId: "b", text: "Reads coherence time as the budget. It is only the numerator." },
      { optionId: "c", text: "Reads gate speed as the budget. It is only the denominator." },
      { optionId: "d", text: "Subtracts where the question calls for division. The result still carries units of time, so it cannot be a count of gates." },
    ],
  },
};
