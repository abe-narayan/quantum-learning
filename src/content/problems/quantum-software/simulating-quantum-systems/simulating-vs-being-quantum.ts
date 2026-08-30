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
    placeholder: "The linear algebra computed is..., while what differs from an actual quantum computer is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["exact", "linear algebra", "not an approximation"],
        missingFeedback:
          "Deal with the mathematics first. Say what the simulation actually computes, and how faithful those numbers are.",
      },
      {
        phrases: ["classical hardware", "substrate", "not physically a quantum device", "hardware is classical", "classical machine", "ordinary computer", "real qubits", "physical device", "physically a quantum computer"],
        missingFeedback:
          "You have said the numbers are right. Now say what is genuinely different from a real quantum computer, given that the arithmetic is not.",
      },
    ],
    incorrectFeedback: "Two halves, and they pull in opposite directions. One half concedes something to the claim: say what the simulator computes and how faithful those numbers are to the theory. The other half is where the claim breaks: say what is physically doing the computing, and why that is a different kind of object from a machine built out of qubits.",
    partialFeedback: "Good. Now be explicit that the difference is about what hardware is running the arithmetic, not about whether the numbers are right.",
    modelAnswers: [
      "The linear algebra it computes is exact quantum mechanics: the amplitudes are the numbers a real device would have, not an approximation. What differs is only the physical substrate, classical hardware rather than actual qubits, so it is not physically a quantum device even though the maths is right.",
      "The computed result is exact, not an approximation at all. It is only the hardware that is classical; the mathematics being carried out is genuine quantum mechanics.",
    ],
  },
  hints: [
    { text: "The amplitudes a state-vector simulator produces are the same ones the theory prescribes, to floating-point precision." },
    { text: "What differs is where the arithmetic happens: on ordinary transistors, not on qubits." },
    { text: "So the numbers are right, and yet nothing in the machine was ever in superposition." },
  ],
  solution: {
    steps: [
      { description: "The linear algebra computed by state-vector simulation is exact. It is the identical mathematics, matrix multiplication on complex amplitude vectors, that describes any quantum system." },
      { description: "What differs from an actual quantum computer is the physical substrate: the computation runs on ordinary classical transistors, not on qubits exhibiting genuine physical superposition and entanglement." },
      { description: "So the computed numbers are exactly correct, and it is the physical process producing them that differs from a real quantum device. That is not an approximation, but a different means of computing the same exact answer." },
    ],
    finalAnswer: "The computed math is exact quantum mechanics; only the physical substrate (classical hardware, not real qubits) differs from an actual quantum computer.",
  },
  explanation: {
    correctIdea: "This precisely separates two things often conflated: correctness of the computed result, and the physical means of computing it.",
    whyCorrect: "Nothing here is approximated: the amplitudes obey the same linear algebra a real device obeys, to floating-point precision. What differs is the machinery producing them, which is why the simulator's answers are trustworthy while its cost curve is nothing like a device's.",
    whyWrong: ["Claiming simulation is 'not really' quantum mechanics because it is classical misses that the math is exact. Only the execution substrate differs, not the correctness of the result."],
  },
};
