import type { ConceptualProblem } from "@/lib/problems/types";

export const yErrorDoubleDetection: ConceptualProblem = {
  meta: {
    slug: "y-error-double-detection",
    title: "Why a Y Error Is Caught by Both Shor Code Mechanisms",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["shor-code", "conceptual"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why a Y error on one physical qubit is caught by both the inner (bit-flip) and outer (phase-flip) mechanisms of the Shor code independently, using Y's decomposition from the first lesson of this course.",
    placeholder: "Recall Y=iXZ from the very first lesson of this course...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["y = ixz", "y=ixz", "ixz", "both x and z", "x and z", "x and a z", "combination", "product of x and z", "simultaneously an x", "x part and", "x component"],
      ["inner code", "outer code", "each mechanism", "each code", "both mechanisms", "own component", "own piece", "separately", "independently"],
    ],
    incorrectFeedback: "Start from the decomposition of Y given in the first lesson. What two simpler errors does it bundle together, and which mechanism notices each one?",
    partialFeedback: "Good. Now explain why neither mechanism needs to know what the other one saw.",
  },
  hints: [
    { text: "Y=iXZ means a Y error acts like both an X error and a Z error at once." },
    { text: "The inner bit-flip code within that qubit's group responds to the X component." },
    { text: "The outer phase-flip code (across the three groups) responds to the Z component." },
  ],
  solution: {
    steps: [
      { description: "Y=iXZ: a Y error is algebraically an X error and a Z error occurring together on the same qubit." },
      { description: "The inner bit-flip code (within that qubit's group of 3) detects and corrects the X component exactly as in Lesson 2." },
      { description: "The outer phase-flip code (across the 3 groups) detects and corrects the Z component exactly as in Lesson 3, unaffected by whether an X error also occurred." },
    ],
    finalAnswer: "Y=iXZ means the two mechanisms each see and correct their own component of the combined error, independently and simultaneously.",
  },
  explanation: {
    correctIdea: "This is exactly why concatenating the two 3-qubit codes, rather than picking just one, is necessary and sufficient for arbitrary single-qubit errors.",
    whyCorrect: "This directly connects the very first lesson's Pauli decomposition argument to the concrete 9-qubit construction.",
    whyWrong: ["Claiming a Y error needs a third, separate mechanism misses that it's already fully covered by the two existing mechanisms acting together."],
  },
};
