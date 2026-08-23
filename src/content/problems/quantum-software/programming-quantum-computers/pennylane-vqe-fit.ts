import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const pennylaneVqeFit: MultipleChoiceProblem = {
  meta: {
    slug: "pennylane-vqe-fit",
    title: "Why PennyLane Fits VQE Well",
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
    prompt: "Why does this lesson highlight PennyLane specifically for VQE-style algorithms?",
    options: [
      { id: "a", text: "PennyLane is built around differentiable programming, making gradient computation for parametrized circuits ergonomic" },
      { id: "b", text: "PennyLane is the only SDK capable of running VQE at all" },
      { id: "c", text: "PennyLane doesn't support real hardware backends, only simulators" },
      { id: "d", text: "PennyLane requires no classical optimizer, unlike other SDKs" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "This overstates the claim — other SDKs CAN run VQE too, just with more manual gradient-computation work; the lesson frames this as an ergonomics difference, not a capability difference.",
      c: "PennyLane does support hardware backends — this isn't the distinguishing feature the lesson names.",
      d: "VQE fundamentally requires a classical optimizer (Quantum Algorithms II) regardless of SDK — PennyLane doesn't eliminate this need.",
    },
    defaultIncorrectFeedback: "The lesson's specific claim is about PennyLane's differentiable-programming design making GRADIENT computation for VQE ergonomic, not about exclusive capability.",
  },
  hints: [
    { text: "VQE needs to compute gradients of a circuit's output with respect to its parameters, for classical optimization." },
    { text: "PennyLane's core design emphasis is differentiable programming." },
    { text: "This is framed as an ERGONOMICS advantage, not a unique capability no other SDK has." },
  ],
  solution: {
    steps: [{ description: "PennyLane's differentiable-programming design makes gradient computation for VQE's parametrized circuits ergonomic — an ergonomics/convenience advantage, not exclusive capability." }],
    finalAnswer: "(a) Differentiable programming makes gradient computation ergonomic",
  },
  explanation: {
    correctIdea: "This tests the lesson's careful framing (ergonomics, not exclusive capability) against an easy overclaim.",
    whyCorrect: "Matches the lesson's explicit Worked Example and Common Mistakes sections.",
    whyWrong: ["Overclaiming exclusivity ('only PennyLane can do this') is exactly the kind of error the lesson's Common Mistakes section warns against."],
  },
};
