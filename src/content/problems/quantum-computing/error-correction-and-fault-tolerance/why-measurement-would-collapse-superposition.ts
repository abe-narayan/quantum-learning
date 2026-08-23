import type { ConceptualProblem } from "@/lib/problems/types";

export const whyMeasurementWouldCollapseSuperposition: ConceptualProblem = {
  meta: {
    slug: "why-measurement-would-collapse-superposition",
    title: "Why Direct Measurement Fails as an Error-Check Strategy",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["quantum-error-correction", "conceptual"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, in one or two sentences, why directly measuring a qubit in superposition to 'check for errors' destroys the very information error correction is trying to protect.",
    placeholder: "Think about what the Born rule does to a superposition upon measurement...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["collapse", "collapses", "forces a definite"],
      ["superposition", "amplitudes", "alpha", "beta"],
    ],
    incorrectFeedback: "Recall what measurement does to a state like α|0⟩+β|1⟩ — does it leave α,β intact afterward?",
    partialFeedback: "Good — be explicit that this destroys exactly the α,β information the code is meant to preserve.",
  },
  hints: [
    { text: "Measuring α|0⟩+β|1⟩ collapses it to |0⟩ or |1⟩, with probabilities |α|² and |β|²." },
    { text: "After measurement, the specific values of α and β are gone — only the classical outcome remains." },
    { text: "This is exactly the information error correction needs to preserve." },
  ],
  solution: {
    steps: [
      { description: "Measuring a superposition collapses it to one definite basis outcome, chosen randomly by the Born rule." },
      { description: "The original amplitudes α, β are irretrievably lost in this process — not merely hidden, but gone." },
    ],
    finalAnswer: "Measurement forces the qubit into one definite outcome, destroying the exact α,β values that were the actual information being protected.",
  },
  explanation: {
    correctIdea: "Any error-checking strategy for quantum information must avoid direct measurement of the protected amplitudes — exactly why syndrome measurement is designed around this constraint.",
    whyCorrect: "This is precisely the obstacle syndrome extraction (measuring only parity, not individual qubit values) is built to avoid.",
    whyWrong: ["Saying 'it just gives the wrong answer' misses the deeper point — the issue isn't inaccuracy, it's that the protected information is destroyed outright."],
  },
};
