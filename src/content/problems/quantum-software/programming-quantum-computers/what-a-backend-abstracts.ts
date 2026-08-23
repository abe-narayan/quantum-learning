import type { ConceptualProblem } from "@/lib/problems/types";

export const whatABackendAbstracts: ConceptualProblem = {
  meta: {
    slug: "what-a-backend-abstracts",
    title: "What Does a 'Backend' Actually Abstract Over?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["sdks", "conceptual"],
    prerequisites: ["quantum-software/programming-quantum-computers/quantum-sdks-overview"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain what a 'backend' abstraction lets a quantum SDK user avoid worrying about when writing circuit code.",
    placeholder: "A backend abstracts over WHICH execution engine runs the circuit, meaning the circuit code doesn't need to...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["which engine", "simulator or hardware", "execution target"],
      ["same circuit code", "doesn't need to change", "identical"],
    ],
    incorrectFeedback: "Address both: what specifically varies across backends, and why the circuit code itself doesn't need to change to accommodate that variation.",
    partialFeedback: "Good — now be explicit that the SAME circuit code works across different backend choices without modification.",
  },
  hints: [
    { text: "A backend can be an ideal noiseless simulator, a noisy simulator, or real hardware." },
    { text: "These differ enormously in how they actually execute a circuit (exact math vs. real physical operations)." },
    { text: "A backend abstraction means the circuit-building code itself doesn't need to know or change based on which of these will run it." },
  ],
  solution: {
    steps: [
      { description: "A backend abstracts over WHICH execution engine actually runs a circuit — an ideal noiseless simulator, a noisy simulator, or real hardware." },
      { description: "These execution engines are internally completely different (exact linear algebra vs. simulated noise vs. real physical qubit operations)." },
      { description: "The backend abstraction means the SAME circuit-building code works unchanged regardless of which backend is targeted — the circuit doesn't need to know or care how it will actually be executed." },
    ],
    finalAnswer: "A backend abstracts over the execution engine (simulator or hardware); the same circuit code runs unchanged across any of them.",
  },
  explanation: {
    correctIdea: "This tests understanding of a genuine, valuable software-engineering separation of concerns, not just recall of the word 'backend.'",
    whyCorrect: "Matches the lesson's explicit 'What a backend abstracts over' section.",
    whyWrong: ["Describing a backend as just 'a type of hardware' misses that simulators are also valid backends, and misses the KEY point that circuit code stays unchanged across all of them."],
  },
};
