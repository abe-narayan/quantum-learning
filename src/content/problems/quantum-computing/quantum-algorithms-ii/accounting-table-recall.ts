import type { ConceptualProblem } from "@/lib/problems/types";

export const accountingTableRecall: ConceptualProblem = {
  meta: {
    slug: "accounting-table-recall",
    title: "What Was Scoped Out of the Shor's Algorithm Implementation",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["capstone", "scope"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"],
  },
  question: {
    type: "conceptual",
    prompt: "According to this course's accounting table, name the two specific pieces of Shor's algorithm that were scoped out of this platform's implementation, and what each of them normally does.",
    placeholder: "Recall the two named gaps from the capstone's table...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["modular exponentiation", "controlled modular", "modular arithmetic", "circuit itself", "state-building circuit"],
        missingFeedback:
          "Name both gaps. One of them is the machinery that would put the register into the right state in the first place.",
      },
      {
        phrases: ["continued fractions", "recover r", "extract the period"],
        missingFeedback:
          "One gap is on the circuit side. The other is classical post-processing that runs after the measurement; name it and say what it computes.",
      },
    ],
    incorrectFeedback: "The capstone's table names two distinct missing pieces for Shor's algorithm. Both are needed here.",
    partialFeedback: "One piece is named. There is a second one in the same table.",
    modelAnswers: [
      "The two scoped-out pieces are the controlled modular exponentiation circuit, which is what would actually build the state, and the continued fractions step, which is what turns the measured value into the period r.",
      "Modular exponentiation as a gate-level circuit is not built, and neither is continued fractions, the classical post-processing that would recover r from the measurement peak.",
    ],
  },
  hints: [
    { text: "One gap concerns how the period-finding state is actually produced, gate by gate." },
    { text: "The other concerns turning a measured peak location into the actual value of r." },
    { text: "Both are named explicitly in the capstone's accounting table." },
  ],
  solution: {
    steps: [
      { description: "Gap 1: the controlled-modular-exponentiation circuit itself, meaning the gate sequence that would build the period-finding state from scratch rather than constructing it directly from its amplitudes." },
      { description: "Gap 2: the continued fractions algorithm, the classical post-processing step that recovers r from a measured peak location." },
    ],
    finalAnswer: "The controlled-modular-exponentiation circuit (state-building gates) and the continued fractions algorithm (period recovery from a measurement). The capstone names both rather than passing over them.",
  },
  explanation: {
    correctIdea: "A complete, honest accounting names every scoped-out piece specifically, rather than leaving gaps implicit.",
    whyCorrect: "This matches the capstone's own explicit table exactly.",
    whyWrong: ["Vague answers like 'some of the hard parts' don't demonstrate having actually located the two specific, named gaps."],
  },
};
