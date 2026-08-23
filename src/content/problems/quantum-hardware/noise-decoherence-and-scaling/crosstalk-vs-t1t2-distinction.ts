import type { ConceptualProblem } from "@/lib/problems/types";

export const crosstalkVsT1T2Distinction: ConceptualProblem = {
  meta: {
    slug: "crosstalk-vs-t1t2-distinction",
    title: "Crosstalk vs. T1/T2: A Structural Difference",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["crosstalk", "conceptual"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/crosstalk"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why crosstalk is structurally different from T1/T2 decoherence, specifically in terms of how many qubits each error type fundamentally involves.",
    placeholder: "T1/T2 are properties of... while crosstalk fundamentally requires...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["single qubit", "one qubit", "own environment"],
      ["multi-qubit", "two qubits", "neighboring", "spectator"],
    ],
    incorrectFeedback: "Address both error types explicitly: what T1/T2 are properties of, and what crosstalk fundamentally requires that T1/T2 does not.",
    partialFeedback: "Good — now make the single-qubit vs. multi-qubit contrast explicit.",
  },
  hints: [
    { text: "T1/T2 describe a single qubit's coupling to its own environment — defined and measurable even for a single isolated qubit." },
    { text: "Crosstalk fundamentally requires at least two qubits — a target and a spectator." },
    { text: "A single-qubit device could still have T1/T2 values, but the concept of 'crosstalk' wouldn't even apply." },
  ],
  solution: {
    steps: [
      { description: "T1 and T2 are properties of a single qubit's coupling to its own environment — well-defined and measurable even for one isolated qubit with no other qubits nearby." },
      { description: "Crosstalk fundamentally requires at least two qubits: a target qubit being intentionally driven, and a spectator qubit unintentionally disturbed." },
      { description: "A hypothetical single-qubit device would still have meaningful T1/T2 values, but the very concept of crosstalk wouldn't apply to it at all — this is the structural difference." },
    ],
    finalAnswer: "T1/T2 are single-qubit properties (measurable even in isolation); crosstalk fundamentally requires at least two qubits (a target and a spectator) — a structural, not just quantitative, difference.",
  },
  explanation: {
    correctIdea: "This makes precise the lesson's opening claim ('crosstalk is different in kind') using a concrete, checkable criterion (how many qubits are fundamentally needed to even define the effect).",
    whyCorrect: "Matches the lesson's explicit Motivation and Common Mistakes sections.",
    whyWrong: ["Describing crosstalk as 'just a stronger form of decoherence' misses that it isn't reducible to any single-qubit environmental coupling at all."],
  },
};
