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
    prompt: "Explain the difference between readout error and gate error in terms of when each occurs relative to the qubit's actual quantum state.",
    placeholder: "A gate error changes the actual quantum state itself, while a readout error...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["gate error", "changes the state", "during computation"],
        missingFeedback:
          "Take the two error types one at a time. Say what the first of them does to the qubit, and when in the circuit it happens.",
      },
      {
        phrases: ["classification", "reporting", "misreport", "misidentif", "discrimination", "records the wrong bit", "wrong label"],
        missingFeedback:
          "You have said what happens while the circuit runs. Now say what goes wrong in the other case, given that the state itself was correct when the shot ended.",
      },
    ],
    incorrectFeedback: "Both failure modes have to be described, and the distinction is about when each one happens relative to the qubit's final state being fixed. One of them makes the qubit end up somewhere other than where the circuit intended. The other leaves the qubit exactly where it should be and still writes down the wrong bit. Say which is which, and where in the sequence each one sits.",
    partialFeedback: "Good. Now pin down the second one's timing: it happens once the qubit's final state is already settled, and it corrupts the record rather than the physics.",
    modelAnswers: [
      "A gate error changes the actual quantum state during computation, so the qubit really is in the wrong place afterwards. A readout error leaves the state exactly as the circuit left it and goes wrong at the classification step, reporting the wrong bit for a state that was fine.",
      "One of them corrupts the state itself while the circuit is running: that is gate error, and it changes the state. Readout error happens at the very end, in the discrimination between the two signal levels, so it records the wrong bit without the state ever having been wrong.",
    ],
  },
  hints: [
    { text: "One of the two makes the qubit's actual quantum state end up different from what the circuit called for, while the circuit is still running." },
    { text: "The other happens once the circuit has finished, when the apparatus has to decide which bit it just saw." },
    { text: "The qubit could be sitting in exactly the right final state and the machine could still write down the wrong answer. Which of the two does that describe?" },
  ],
  solution: {
    steps: [
      { description: "A gate error occurs during computation. It changes the qubit's actual quantum state to something other than what was intended, for instance through a slightly wrong rotation angle from a miscalibrated pulse." },
      { description: "A readout error occurs after computation is complete. The qubit's actual final state may be perfectly correct, but the classical classification of the analog readout signal into '0' or '1' is wrong." },
      { description: "So a computation could have a perfect underlying quantum state and still report the wrong answer purely from readout error. The two error types are independent, occurring at different stages." },
    ],
    finalAnswer: "Gate error changes the actual quantum state during computation. Readout error leaves the state exactly where the circuit put it and fails at the classification step afterwards, reporting the wrong bit for a state that was right. They are independent error sources acting at different stages.",
  },
  explanation: {
    correctIdea: "This tests whether the reader can distinguish error sources by when they act, a distinction with real consequences for how each is mitigated: readout error can sometimes be corrected in post-processing, while gate error corrupts the state itself.",
    whyCorrect: "The two errors are separated by when they act. One happens while the state is still being built, so it changes what the qubit is; the other happens after the state is fixed, so it changes only what gets written down. That is why a device can be flawless in one respect and wrong in the other.",
    whyWrong: ["Treating both as 'the same kind of error, just in different places' misses that only readout error leaves the underlying quantum state itself untouched."],
  },
};
