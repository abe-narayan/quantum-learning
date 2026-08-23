import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const classifyCoherentErrors: MultipleChoiceProblem = {
  meta: {
    slug: "classify-coherent-errors",
    title: "Classifying a Drifting Calibration Error",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["noise-sources"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"],
  },
  question: {
    type: "multiple-choice",
    prompt: "A device's gate fidelity degrades slowly over several hours, then returns to its original value immediately after recalibration, with no hardware changes. Is this a coherent or incoherent error?",
    options: [
      { id: "a", text: "Coherent — recalibration alone (no hardware change) fully restoring fidelity is the signature of a systematic, deterministic parameter drift" },
      { id: "b", text: "Incoherent — any fidelity loss over time indicates genuine environmental decoherence" },
      { id: "c", text: "Neither — this describes a readout error, not a coherent/incoherent distinction" },
      { id: "d", text: "Impossible to classify without knowing the specific qubit platform" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Genuine incoherent decoherence (information lost to environment) is NOT fixed by recalibrating a classical control parameter — the fact that recalibration works is exactly what rules this out.",
      c: "This scenario describes a gate-fidelity drift, unrelated to the specific readout-classification error discussed elsewhere in this course.",
      d: "The coherent/incoherent distinction is defined by the ERROR'S BEHAVIOR (fixable by recalibration or not), not by platform-specific details.",
    },
    defaultIncorrectFeedback: "The key diagnostic is whether recalibration alone (no hardware change) restores full fidelity — that's the signature of a coherent, systematic error.",
  },
  hints: [
    { text: "Coherent errors are systematic and deterministic — fully fixable by recalibration." },
    { text: "Incoherent errors are genuine information loss to an environment — recalibration cannot recover this." },
    { text: "The fact that recalibration alone restores fidelity is the deciding clue here." },
  ],
  solution: {
    steps: [{ description: "Since recalibration alone (no hardware change) restores full fidelity, this is the signature of a coherent, systematic parameter drift, not incoherent environmental decoherence." }],
    finalAnswer: "(a) Coherent",
  },
  explanation: {
    correctIdea: "This is exactly the lesson's own Worked Example, restated as a multiple-choice diagnostic question.",
    whyCorrect: "Matches the lesson's explicit reasoning.",
    whyWrong: ["Assuming any fidelity loss over time must be decoherence ignores that systematic drift (a coherent error) produces the identical symptom but responds completely differently to recalibration."],
  },
};
