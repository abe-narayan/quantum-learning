import type { ConceptualProblem } from "@/lib/problems/types";

export const whenDoesStateChange: ConceptualProblem = {
  meta: {
    slug: "when-does-state-change",
    title: "When Does the Quantum State Actually Change?",
    course: "programming-quantum-computers",
    lesson: "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["circuit-representation"],
    prerequisites: ["quantum-software/programming-quantum-computers/circuit-representation-in-code"],
  },
  question: {
    type: "conceptual",
    prompt: "After calling circuit.h(0).cnot(0,1) but before calling runCircuit(circuit), has any quantum state been created or changed? Explain what has actually happened.",
    placeholder: "Calling .h(0).cnot(0,1) only...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["instructions", "list", "data", "appended"],
      ["no quantum state", "nothing", "not yet", "no state exists"],
    ],
    incorrectFeedback: "Address both: what DOES happen (instructions appended to a list) and what does NOT happen yet (no quantum state exists).",
    partialFeedback: "Good — now be explicit that this is a general software structure fact, true regardless of which specific gates were chained.",
  },
  hints: [
    { text: "circuit.h(0) and .cnot(0,1) each just append a GateInstruction object to circuit.instructions." },
    { text: "No StateVector has been created or touched at this point." },
    { text: "The actual quantum state doesn't exist until runCircuit(circuit) is called, which starts from |0...0> and applies each instruction in order." },
  ],
  solution: {
    steps: [
      { description: "Calling circuit.h(0) and .cnot(0,1) only appends two GateInstruction objects (plain data) to circuit.instructions." },
      { description: "No quantum state has been created or changed at this point — there is no StateVector involved yet." },
      { description: "The actual quantum computation only happens when runCircuit(circuit) is called, which starts from |0...0⟩ and applies each recorded instruction in sequence." },
    ],
    finalAnswer: "Nothing quantum has happened yet — only two instructions were appended to a list. The state is created and evolved only when runCircuit is called.",
  },
  explanation: {
    correctIdea: "This directly tests the lesson's central 'build first, run later' distinction with a concrete, specific scenario.",
    whyCorrect: "Matches the lesson's explicit Common Mistakes section.",
    whyWrong: ["Assuming .h(0) immediately applies a Hadamard to some state confuses this platform's data-then-execute pattern with Quantum Gates & Circuits' immediate-execution approach."],
  },
};
