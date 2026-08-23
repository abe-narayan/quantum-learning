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
      ["modular exponentiation", "controlled.*modular", "circuit itself"],
      ["continued fractions", "recover r", "extract the period"],
    ],
    incorrectFeedback: "Recall the capstone's table specifically — it names two distinct missing pieces for Shor's algorithm.",
    partialFeedback: "Good — name the second missing piece as well, not just the first.",
  },
  hints: [
    { text: "One gap concerns how the period-finding state is actually produced, gate by gate." },
    { text: "The other concerns turning a measured peak location into the actual value of r." },
    { text: "Both are named explicitly in the capstone's accounting table." },
  ],
  solution: {
    steps: [
      { description: "Gap 1: the controlled-modular-exponentiation circuit itself — the gate sequence that would build the period-finding state from scratch, rather than constructing it directly from its amplitudes." },
      { description: "Gap 2: the continued fractions algorithm — the classical post-processing step that reliably recovers r from a measured peak location." },
    ],
    finalAnswer: "The controlled-modular-exponentiation circuit (state-building gates) and the continued fractions algorithm (period recovery from a measurement) — both named explicitly, not silently omitted.",
  },
  explanation: {
    correctIdea: "A complete, honest accounting names every scoped-out piece specifically, rather than leaving gaps implicit.",
    whyCorrect: "This matches the capstone's own explicit table exactly.",
    whyWrong: ["Vague answers like 'some of the hard parts' don't demonstrate having actually located the two specific, named gaps."],
  },
};
