import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const whichPrecisionQubitControlsLargestPower: MultipleChoiceProblem = {
  meta: {
    slug: "which-precision-qubit-controls-largest-power",
    title: "Which Precision Qubit Controls the Largest Power of U",
    course: "quantum-algorithms-i",
    lesson: "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["phase-estimation"],
    prerequisites: ["quantum-computing/quantum-algorithms-i/quantum-phase-estimation"],
  },
  question: {
    type: "multiple-choice",
    prompt: "With t=4 precision qubits (indices 0-3, qubit 0 is this platform's MSB), which qubit controls U^(2^3)=U^8, the largest power?",
    options: [
      { id: "a", text: "Qubit 0" },
      { id: "b", text: "Qubit 1" },
      { id: "c", text: "Qubit 2" },
      { id: "d", text: "Qubit 3" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Qubit 1 controls U^(2^(4-1-1))=U^4, one power lower.",
      c: "Qubit 2 controls U^(2^(4-1-2))=U^2.",
      d: "Qubit 3 (the last precision qubit) controls U^(2^0)=U^1, the smallest power.",
    },
    defaultIncorrectFeedback: "Use the formula power = 2^(t−1−q) with t=4, and find which q gives power=8.",
  },
  hints: [
    { text: "The formula is power = 2^(t−1−q), with t=4." },
    { text: "You want 2^(t−1−q) = 8 = 2³, so t−1−q = 3." },
    { text: "Solve: 4−1−q=3 → q=0." },
  ],
  solution: {
    steps: [{ description: "2^(4−1−q)=8=2³ requires 4−1−q=3, giving q=0." }],
    finalAnswer: "Qubit 0 controls the largest power, U^8.",
  },
  explanation: {
    correctIdea: "Precision qubit 0 (first Hadamard'd, this platform's MSB) always controls the largest power of U.",
    whyCorrect: "This is why qubit 0 ends up as the most significant bit of the recovered phase after the inverse QFT.",
    whyWrong: [
      { optionId: "b", text: "Controls U^4: one step down the ladder from the largest power." },
      { optionId: "c", text: "Controls U^2: two steps down." },
      { optionId: "d", text: "Controls U^1, the smallest power. Picking it reverses the qubit-0-is-most-significant convention." },
    ],
  },
};
