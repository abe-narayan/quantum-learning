import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const connectingBackToShorsAlgorithm: MultipleChoiceProblem = {
  meta: {
    slug: "connecting-back-to-shors-algorithm",
    title: "Why Shor's Algorithm Specifically Needs Fault Tolerance",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["fault-tolerance", "capstone"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead"],
  },
  question: {
    type: "multiple-choice",
    prompt: "Why does factoring a cryptographically relevant number via Shor's algorithm specifically require operating below the fault-tolerance threshold, in a way VQE does not?",
    options: [
      { id: "a", text: "Shor's needs one long uninterrupted run, with no feedback loop to average errors away" },
      { id: "b", text: "Shor's algorithm runs on classical hardware, so quantum error correction does not apply" },
      { id: "c", text: "VQE's variational structure makes it immune to physical errors by design" },
      { id: "d", text: "There is no real difference; the two need identical error-correction resources" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Shor's algorithm is a quantum circuit built from qubits and gates, so error correction bears on it directly.",
      c: "No quantum algorithm is immune to physical errors. VQE is more structurally tolerant of them, not exempt from them.",
      d: "This directly contradicts both this course's and Quantum Algorithms II's explicit circuit-depth and error-tolerance comparison.",
    },
    defaultIncorrectFeedback: "Recall the specific structural difference (single long circuit vs. many short repeated ones) between the two algorithm families.",
  },
  hints: [
    { text: "Shor's period-finding circuit is one long sequence that must work correctly all at once." },
    { text: "VQE reruns a short circuit many times, with a classical loop adjusting parameters between runs." },
    { text: "Only the first structure needs the logical error rate driven arbitrarily low across one whole execution." },
  ],
  solution: {
    steps: [{ description: "Shor's algorithm's single long circuit has no built-in mechanism to tolerate or average out mid-circuit errors, unlike VQE's repeated, classically-corrected loop." }],
    finalAnswer: "Shor's period-finding circuit must succeed in one long uninterrupted run, with no classical feedback loop to average errors out.",
  },
  explanation: {
    correctIdea: "This is the same circuit-depth/error-tolerance distinction Quantum Algorithms II's capstone drew, now explained by the actual threshold mechanism.",
    whyCorrect: "Ties this course's final lesson directly back to the previous course's own capstone conclusion.",
    whyWrong: [
      { optionId: "b", text: "Shor's algorithm is a quantum circuit built from qubits and gates, so error correction bears on it directly." },
      { optionId: "c", text: "No quantum algorithm is immune to physical errors. VQE is more structurally tolerant of them, not exempt." },
      { optionId: "d", text: "Contradicts this course's and Quantum Algorithms II's circuit-depth and error-tolerance comparison, which puts the two families far apart." },
    ],
  },
};
