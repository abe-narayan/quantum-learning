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
      {
        phrases: ["y = ixz", "y=ixz", "ixz", "both x and z", "x and z", "x and a z", "combination", "product of x and z", "simultaneously an x", "x part and", "x component"],
        missingFeedback:
          "Start with the algebra. Write Y in terms of the other two Paulis, because that decomposition is the whole argument.",
      },
      {
        phrases: ["inner code", "outer code", "each mechanism", "each code", "both mechanisms", "own component", "own piece", "separately", "independently"],
        missingFeedback:
          "You have the decomposition. Now say who catches what: name the two layers of the code and pair each with the piece of the error it is responsible for.",
      },
    ],
    incorrectFeedback: "You said the Shor code 'handles arbitrary single-qubit errors', which is the theorem rather than the mechanism. Write Y in terms of the other two Paulis, then walk each factor to the layer that was designed for it.",
    partialFeedback: "Now explain why neither mechanism needs to know what the other one saw.",
    modelAnswers: [
      "Y is iXZ, so a Y error is simultaneously an X error and a Z error on that qubit. The inner bit-flip code sees the X part and the outer phase-flip code sees the Z part, and each fixes its own component independently.",
      "Because Y decomposes as a product of X and Z, each mechanism sees only the piece it is built to catch. The inner code corrects the X and the outer code corrects the Z, separately.",
    ],
  },
  hints: [
    { text: "Look up the identity from the first lesson that writes Y in terms of the other two Paulis. Write it down." },
    { text: "The Shor code has two layers. Say which kind of error each layer was built to catch, before thinking about Y at all." },
    { text: "Now apply your identity. A Y error carries one of each kind at once. Ask whether either layer needs to know what the other one saw." },
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
