import type { ConceptualProblem } from "@/lib/problems/types";

export const readoutVsGateErrorTiming: ConceptualProblem = {
  meta: {
    slug: "readout-vs-gate-error-timing",
    title: "Readout Error vs. Gate Error: When Each Happens",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/qubit-readout-techniques",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["readout", "conceptual"],
    prerequisites: ["quantum-hardware/control-and-readout/qubit-readout-techniques"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain the difference between readout error and gate error in terms of WHEN each occurs relative to the qubit's actual quantum state.",
    placeholder: "A gate error changes the actual quantum state itself, while a readout error...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["gate error", "changes the state", "during computation"],
      ["readout error", "after", "classification", "reporting"],
    ],
    incorrectFeedback: "Address both error types explicitly: what a gate error does to the actual state, and what a readout error does (or doesn't do) to it.",
    partialFeedback: "Good — now be explicit that readout error occurs AFTER the true state is already fixed, at the classification/reporting stage.",
  },
  hints: [
    { text: "A gate error means the qubit's ACTUAL quantum state ends up different from what was intended, during the computation itself." },
    { text: "A readout error occurs AFTER the computation, at the measurement/classification stage." },
    { text: "The qubit could be in the perfectly correct final state, and readout error could STILL misreport it as the wrong classical bit." },
  ],
  solution: {
    steps: [
      { description: "A gate error occurs DURING computation — it changes the qubit's actual quantum state to something other than what was intended (e.g., a slightly wrong rotation angle from a miscalibrated pulse)." },
      { description: "A readout error occurs AFTER computation is complete — the qubit's actual final state may be perfectly correct, but the classical classification of the analog readout signal into '0' or '1' is wrong." },
      { description: "This means a computation could have a perfect underlying quantum state but still report the wrong answer purely due to readout error — the two error types are independent, occurring at different stages." },
    ],
    finalAnswer: "Gate error changes the actual quantum state during computation; readout error misclassifies an already-fixed final state after computation — independent error sources at different stages.",
  },
  explanation: {
    correctIdea: "This tests whether the reader can distinguish error sources by WHEN they act, a distinction with real consequences for how each is mitigated (e.g., readout error can sometimes be corrected in post-processing, while gate error corrupts the state itself).",
    whyCorrect: "Matches the lesson's own practice-question framing directly.",
    whyWrong: ["Treating both as 'the same kind of error, just in different places' misses that only readout error leaves the underlying quantum state itself untouched."],
  },
};
