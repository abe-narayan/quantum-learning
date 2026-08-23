import type { ConceptualProblem } from "@/lib/problems/types";

export const simulatingVsBeingQuantum: ConceptualProblem = {
  meta: {
    slug: "simulating-vs-being-quantum",
    title: "Is a Classical Simulation 'Really' Doing Quantum Mechanics?",
    course: "simulating-quantum-systems",
    lesson: "quantum-software/simulating-quantum-systems/state-vector-simulation",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["state-vector-simulation", "conceptual"],
    prerequisites: ["quantum-software/simulating-quantum-systems/state-vector-simulation"],
  },
  question: {
    type: "conceptual",
    prompt: "Is running a state-vector simulation on classical hardware 'really' doing quantum mechanics, or is it just an approximation? Explain precisely what is and isn't exact here.",
    placeholder: "The LINEAR ALGEBRA computed is..., while what differs from an actual quantum computer is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["exact", "linear algebra", "not an approximation"],
      ["classical hardware", "substrate", "not physically a quantum device"],
    ],
    incorrectFeedback: "Address both halves precisely: what IS exact (the math), and what differs (the physical substrate executing it).",
    partialFeedback: "Good — now be explicit that the distinction is about substrate, not about the correctness of the computed answer.",
  },
  hints: [
    { text: "The amplitudes computed by state-vector simulation are exact — the same linear algebra any quantum system obeys." },
    { text: "What's different is WHERE that computation happens: on ordinary classical transistors, not actual qubits." },
    { text: "This means the computed numbers are correct, but they weren't produced via genuine physical quantum superposition/entanglement in hardware." },
  ],
  solution: {
    steps: [
      { description: "The linear algebra computed by state-vector simulation is EXACT — it's the identical mathematics (matrix multiplication on complex amplitude vectors) that describes any quantum system." },
      { description: "What differs from an actual quantum computer is the physical substrate: the computation runs on ordinary classical transistors, not on qubits exhibiting genuine physical superposition and entanglement." },
      { description: "So the computed numbers are exactly correct; it's the PHYSICAL PROCESS producing them that differs from a real quantum device — not an approximation, but a different means of computing the same exact answer." },
    ],
    finalAnswer: "The computed math is exact quantum mechanics; only the physical substrate (classical hardware, not real qubits) differs from an actual quantum computer.",
  },
  explanation: {
    correctIdea: "This precisely separates two things often conflated: correctness of the computed result, and the physical means of computing it.",
    whyCorrect: "Matches the lesson's explicit 'Simulating vs. being' section.",
    whyWrong: ["Claiming simulation is 'not really' quantum mechanics because it's classical misses that the MATH is exact — only the execution substrate differs, not the correctness of the result."],
  },
};
