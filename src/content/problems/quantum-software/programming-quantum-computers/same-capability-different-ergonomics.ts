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
    prompt: "Per this lesson, do Qiskit, Cirq, and PennyLane differ in what they can compute, or in how it feels to write?",
    options: [
      { id: "a", text: "In how it feels: each expresses the same circuits and reaches the same backends, and they differ in ergonomics and ecosystem" },
      { id: "b", text: "In what they compute: each is tied to its own vendor's hardware, so a circuit written in one cannot run on another's device" },
      { id: "c", text: "In what they compute: only PennyLane can differentiate a circuit, so gradient-based algorithms are out of reach for the others" },
      { id: "d", text: "In what they compute: Qiskit's transpiler reaches native gate sets the others cannot target, so only Qiskit runs on real hardware" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Each SDK has a home vendor, but all three target multiple providers, and a circuit is portable through OpenQASM in any case. Vendor affinity is an ecosystem fact, not a capability wall.",
      c: "The parameter-shift rule is implemented across the major SDKs. PennyLane makes gradients more ergonomic; it does not hold a monopoly on them.",
      d: "Every major SDK transpiles to hardware-native gate sets and submits to real devices. Transpiler maturity differs; access does not.",
    },
    defaultIncorrectFeedback: "Ask whether anything named is something the other SDKs cannot do, or something they make you work harder to do.",
  },
  hints: [
    { text: "Separate two questions: what a framework can express, and how much work it takes you to express it." },
    { text: "All three compile down to the same gate model and can emit and consume OpenQASM." },
    { text: "A real difference in capability would mean some circuit one SDK can run and another cannot express at all." },
  ],
  solution: {
    steps: [{ description: "All three describe the same gate model, transpile to hardware-native gate sets, and reach multiple providers. What separates them is the shape of the API, the ecosystem each sits in, and which workflows feel natural." }],
    finalAnswer: "In how it feels to write: the three share the same underlying capability, and differ in ergonomics and ecosystem.",
  },
  explanation: {
    correctIdea: "Framework choice here is a question of fit, not of reach. Every one of these SDKs can express what the others can.",
    whyCorrect: "Matches the lesson's Common Mistakes section on overstating SDK differences.",
    whyWrong: [
      { optionId: "b", text: "Turns vendor affinity into a hard restriction. All three target multiple providers." },
      { optionId: "c", text: "Turns an ergonomics advantage into an exclusive feature." },
      { optionId: "d", text: "Turns transpiler maturity into a monopoly on hardware access." },
    ],
  },
};
