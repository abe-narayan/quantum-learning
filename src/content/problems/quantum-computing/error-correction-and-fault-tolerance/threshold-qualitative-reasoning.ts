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
      {
        phrases: ["extra gates", "more gates", "additional gates", "extra qubits", "more qubits", "additional qubits", "syndrome extraction", "ancilla", "circuitry itself", "circuit itself", "own gates", "gates can fail", "gates themselves", "correction circuit"],
        missingFeedback:
          "You have asserted the net effect. Say what error correction physically is on the device, because that is where the extra failures come from.",
      },
      {
        phrases: ["outpace", "outpaces", "faster than", "net increase", "more errors than it", "more errors than the", "introduces more", "adds more", "creates more", "makes it worse", "makes things worse", "worse than"],
        missingFeedback:
          "You have said what the machinery is made of. Now do the accounting: weigh what it removes against what it introduces, and say which side wins above the threshold.",
      },
    ],
    incorrectFeedback: "You said the code 'cannot keep up', which is the conclusion. Say what it is trying to keep up with, and where the second source of errors comes from: the machinery that reads a syndrome is built from the same imperfect hardware as everything else.",
    partialFeedback: "You have the source of the extra errors. Now compare two rates: the one at which the machinery introduces errors and the one at which the code removes them. Say which wins above threshold, and what that does to the logical rate.",
    modelAnswers: [
      "Error correction is itself a circuit: extra gates, extra qubits, syndrome extraction, and every one of those can fail. Above threshold the errors those gates introduce outpace the ones they remove, so you end up with more errors than you started with.",
      "The correction machinery is not free. It adds more gates and ancilla qubits that are just as noisy as everything else, and above the threshold that adds more errors than it fixes, which makes the logical error rate worse.",
    ],
  },
  hints: [
    { text: "A code does not correct errors for free. Ask what physical hardware has to be added to read out a syndrome at all." },
    { text: "That hardware obeys the same physical error rate as the data. So there are now two processes running at once, and they push in opposite directions." },
    { text: "Write both as rates and ask what happens as the physical error rate rises. One of the two grows with the amount of added hardware; the other does not." },
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
    correctIdea: "This is a quantitative tradeoff, not just 'error correction sometimes fails': the mechanism is that the correction machinery is itself imperfect and adds overhead.",
    whyCorrect: "This directly explains, mechanistically, the threshold theorem's qualitative logic without needing a specific cited number.",
    whyWrong: ["Saying 'the code isn't good enough' does not identify the mechanism: the extra circuitry, not the code's design, is the source of the added errors."],
  },
};
