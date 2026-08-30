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
      { id: "a", text: "Small devices compatible with the existing semiconductor tooling" },
      { id: "b", text: "Coherence times longer than any other platform in this course" },
      { id: "c", text: "The fastest two-qubit gates of the platforms in this course" },
      { id: "d", text: "All-to-all connectivity through a shared vibrational mode" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Trapped ions and neutral atoms claim the longest coherence times in this course, not spin qubits specifically.",
      c: "Superconducting qubits hold the two-qubit speed record in this course, and in any case raw gate speed is a quality claim rather than a scaling one.",
      d: "A shared vibrational mode is what gives trapped ions all-to-all connectivity. Spin qubits couple to their immediate neighbours on the chip.",
    },
    defaultIncorrectFeedback: "The lesson's specific scalability claim for spin qubits is about manufacturing compatibility with existing semiconductor fabrication infrastructure, driven by small device size.",
  },
  hints: [
    { text: "This lesson emphasizes device size specifically, not coherence time or gate speed." },
    { text: "Small size means compatibility with existing chip-fabrication tooling." },
    { text: "This is a manufacturing-infrastructure argument, distinct from any other platform's pitch in this course." },
  ],
  solution: {
    steps: [{ description: "Spin qubits' distinct scalability pitch is small device size enabling reuse of existing semiconductor fabrication tooling, not a coherence-time or gate-speed claim." }],
    finalAnswer: "Small devices compatible with existing semiconductor tooling",
  },
  explanation: {
    correctIdea: "This tests whether each platform's distinct pitch was absorbed, rather than a generic 'it's good'. Every platform in this course has a different central argument.",
    whyCorrect: "The argument is about the manufacturing pipeline rather than about qubit quality. A spin qubit is small enough to be made with tooling that already exists at industrial scale, which is a different kind of claim from a coherence-time or gate-speed record.",
    whyWrong: [
      { optionId: "b", text: "Longest coherence time is trapped ions' and neutral atoms' claim in this course, not spin qubits'." },
      { optionId: "c", text: "Reads a gate-quality record as a scaling argument, and attributes to spin qubits a speed claim that belongs to superconducting circuits." },
      { optionId: "d", text: "Borrows trapped ions' shared-mode connectivity. Spin qubits couple to their nearest neighbours on the chip instead." },
    ],
  },
};
