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
      {
        phrases: ["instructions", "list", "data", "appended"],
        missingFeedback:
          "Say what the two chained calls actually did, in ordinary programming terms. They produced something; say what.",
      },
      {
        phrases: ["no quantum state", "nothing", "not yet", "no state exists"],
        missingFeedback:
          "You have said what was built. Now answer the question directly: say whether anything quantum exists at this point, and when it comes into being.",
      },
    ],
    incorrectFeedback: "Say what those two calls actually did, and then say what they did not do. One of them is a bookkeeping fact about the object in your variable; the other is about whether any amplitudes have been created at all. Being precise about the second is the whole point of the question.",
    partialFeedback: "Good. Now be explicit that this is a general software-structure fact, true regardless of which gates were chained.",
    modelAnswers: [
      "No quantum state exists yet. The two calls only appended instructions to a list, ordinary data describing what should happen. The state is created and evolved only when runCircuit is called.",
      "Nothing quantum has happened. You have built up a list of gate instructions and not yet any state, no amplitudes and nothing to measure, until the circuit is actually run.",
    ],
  },
  hints: [
    { text: "circuit.h(0) and .cnot(0,1) each append a GateInstruction object onto the circuit." },
    { text: "No StateVector has been created or touched at this point." },
    { text: "The amplitudes come into being only when runCircuit(circuit) is called, starting from |0...0> and applying each recorded step in order." },
  ],
  solution: {
    steps: [
      { description: "Calling circuit.h(0) and .cnot(0,1) only appends two GateInstruction objects (plain data) to circuit.instructions." },
      { description: "No quantum state has been created or changed at this point. There is no StateVector involved yet." },
      { description: "The actual quantum computation only happens when runCircuit(circuit) is called, which starts from |0...0⟩ and applies each recorded instruction in sequence." },
    ],
    finalAnswer: "Nothing quantum has happened yet. Only two instructions were appended to a list, and the state is created and evolved only when runCircuit is called.",
  },
  explanation: {
    correctIdea: "This directly tests the lesson's central 'build first, run later' distinction with a concrete, specific scenario.",
    whyCorrect: "Builder calls only record what to do later; nothing allocates amplitudes. The state comes into existence at run time, which is why those two lines cost nothing and why the same recorded circuit can then be handed to several different backends.",
    whyWrong: ["Assuming .h(0) immediately applies a Hadamard to some state confuses this platform's data-then-execute pattern with Quantum Gates & Circuits' immediate-execution approach."],
  },
};
