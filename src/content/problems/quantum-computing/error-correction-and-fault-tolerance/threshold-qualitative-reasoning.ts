import type { ConceptualProblem } from "@/lib/problems/types";

export const thresholdQualitativeReasoning: ConceptualProblem = {
  meta: {
    slug: "threshold-qualitative-reasoning",
    title: "Explaining Why Above-Threshold Error Correction Backfires",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["fault-tolerance", "capstone"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, without citing a specific numeric threshold, why running error correction above the threshold error rate makes the logical error rate worse rather than better.",
    placeholder: "Think about what error correction circuitry itself consists of...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["extra gates", "syndrome extraction.*itself", "more qubits.*more errors"],
      ["outpace", "faster than.*corrects", "net increase"],
    ],
    incorrectFeedback: "Consider: syndrome-extraction circuitry (CNOTs, ancilla qubits) is itself built from physical gates that can also fail — what does that imply above a high enough error rate?",
    partialFeedback: "Good — now be explicit that the new errors introduced can outpace the errors actually corrected.",
  },
  hints: [
    { text: "Error correction adds extra qubits and extra gates (the syndrome-extraction circuitry itself)." },
    { text: "Every added gate is itself a new opportunity for a physical error." },
    { text: "Above threshold, these new errors are introduced faster than the code corrects existing ones." },
  ],
  solution: {
    steps: [
      { description: "Error correction's own circuitry (ancilla qubits, syndrome-extraction CNOTs) is built from physical gates that can themselves fail." },
      { description: "At a high physical error rate, these added gates introduce new errors faster than the code's correction removes existing ones." },
      { description: "The net effect is a higher logical error rate with correction running than without it." },
    ],
    finalAnswer: "Above threshold, the error-correction circuitry's own gates introduce new errors faster than they remove existing ones, so the net logical error rate increases rather than decreases.",
  },
  explanation: {
    correctIdea: "This is a genuinely quantitative combinatorial tradeoff, not simply 'error correction sometimes fails' — the specific mechanism is that the correction machinery is itself imperfect and adds real overhead.",
    whyCorrect: "This directly explains, mechanistically, the threshold theorem's qualitative logic without needing a specific cited number.",
    whyWrong: ["Saying 'the code just isn't good enough' doesn't identify the actual mechanism — the extra circuitry itself, not the code's design, is the source of the added errors."],
  },
};
