import type { ConceptualProblem } from "@/lib/problems/types";

export const whyJosephsonJunctionNeeded: ConceptualProblem = {
  meta: {
    slug: "why-josephson-junction-needed",
    title: "Why a Plain LC Circuit Can't Be a Qubit",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["superconducting-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/superconducting-qubits"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why a plain LC circuit (a quantum harmonic oscillator) makes a poor qubit, and what the Josephson junction changes.",
    placeholder: "A plain LC circuit's energy levels are... which means a drive pulse tuned to 0→1 would also...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["evenly spaced", "harmonic", "equal gaps"],
      ["anharmonic", "unevenly spaced", "nonlinear", "isolate"],
    ],
    incorrectFeedback: "Address both the problem (evenly-spaced harmonic levels) and the Josephson junction's fix (anharmonicity).",
    partialFeedback: "Good — now be explicit about what the Josephson junction's nonlinearity actually changes about the level spacing.",
  },
  hints: [
    { text: "A plain LC circuit is a harmonic oscillator, with evenly spaced energy levels (0-1 gap equals 1-2 gap equals 2-3 gap...)." },
    { text: "A drive pulse resonant with 0→1 would be equally resonant with every other adjacent transition." },
    { text: "The Josephson junction's nonlinearity makes the levels UNevenly spaced, so only 0→1 is addressed by a pulse tuned to that specific gap." },
  ],
  solution: {
    steps: [
      { description: "A plain LC circuit's energy levels are evenly spaced (harmonic oscillator), so a pulse resonant with the 0→1 transition is equally resonant with 1→2, 2→3, and so on." },
      { description: "This makes it impossible to cleanly address just the 0 and 1 levels — any drive leaks population into higher levels too." },
      { description: "The Josephson junction adds nonlinearity, making the level spacing uneven (anharmonic) — a pulse tuned to the 0→1 gap specifically no longer resonates with 1→2, isolating a usable two-level qubit." },
    ],
    finalAnswer: "A plain LC circuit's evenly-spaced levels make any 0→1 drive equally resonant with higher transitions; the Josephson junction's anharmonicity breaks this even spacing, isolating a clean two-level qubit.",
  },
  explanation: {
    correctIdea: "This is the lesson's central engineering point, stated as a precise physical mechanism rather than a vague 'it makes qubits work' claim.",
    whyCorrect: "Matches the lesson's Mathematical/Engineering Development section directly.",
    whyWrong: ["Saying the Josephson junction 'adds superconductivity' misses the point — superconductivity is already present elsewhere in the circuit; the junction's specific contribution is nonlinearity/anharmonicity."],
  },
};
