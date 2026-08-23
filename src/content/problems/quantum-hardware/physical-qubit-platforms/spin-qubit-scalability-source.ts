import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const spinQubitScalabilitySource: MultipleChoiceProblem = {
  meta: {
    slug: "spin-qubit-scalability-source",
    title: "Where Does Spin Qubits' Scalability Argument Come From?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/spin-qubits",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "multiple-choice",
    tags: ["spin-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/spin-qubits"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Per this lesson, what is spin qubits' specific, distinct scalability argument, compared to the other platforms in this course?",
    options: [
      { id: "a", text: "Small device size compatible with existing semiconductor fabrication tooling" },
      { id: "b", text: "The longest coherence time of any platform in this course" },
      { id: "c", text: "The fastest gate speed of any platform in this course" },
      { id: "d", text: "All-to-all connectivity via a shared motional mode" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Trapped ions and neutral atoms claim the longest coherence times in this course, not spin qubits specifically.",
      c: "Superconducting qubits and spin qubits are both fast, but raw gate speed isn't the scalability argument this lesson makes for spin qubits specifically.",
      d: "All-to-all connectivity via a shared motional mode is trapped ions' specific advantage, not spin qubits'.",
    },
    defaultIncorrectFeedback: "The lesson's specific scalability claim for spin qubits is about manufacturing compatibility with existing semiconductor fabrication infrastructure, driven by small device size.",
  },
  hints: [
    { text: "This lesson emphasizes device SIZE specifically, not coherence time or gate speed." },
    { text: "Small size means compatibility with existing chip-fabrication tooling." },
    { text: "This is a manufacturing-infrastructure argument, distinct from any other platform's pitch in this course." },
  ],
  solution: {
    steps: [{ description: "Spin qubits' distinct scalability pitch is small device size enabling reuse of existing semiconductor fabrication tooling — not a coherence-time or gate-speed claim." }],
    finalAnswer: "(a) Small device size compatible with existing semiconductor fabrication tooling",
  },
  explanation: {
    correctIdea: "This tests whether each platform's DISTINCT pitch (not a generic 'it's good') was actually absorbed — every platform in this course has a different central argument.",
    whyCorrect: "Matches the lesson's explicit 'Why small size matters' section.",
    whyWrong: ["Options (b), (c), (d) each correctly describe a DIFFERENT platform's advantage from earlier lessons in this course, not spin qubits' specific pitch."],
  },
};
