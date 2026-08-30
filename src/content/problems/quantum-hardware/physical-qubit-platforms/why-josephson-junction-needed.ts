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
      {
        phrases: ["evenly spaced", "harmonic", "equal gaps"],
        missingFeedback:
          "Say what an LC circuit's ladder of energy levels looks like, and why that shape is a problem for a pulse aimed at the bottom transition.",
      },
      {
        phrases: ["anharmonic", "unevenly spaced", "nonlinear", "isolate"],
        missingFeedback:
          "You have the problem. Now say what the junction changes about the ladder, and what that buys you when you drive the circuit.",
      },
    ],
    incorrectFeedback: "Two halves. First, say what is wrong with a plain LC circuit as a qubit: describe its ladder of energy levels and what that does to a pulse tuned to the lowest transition. Second, say what the junction changes about that ladder, and why the change is what lets you address one transition and leave the rest alone.",
    partialFeedback: "Good. Now say precisely what the junction does to the spacing of the ladder, and why that is what makes a single transition addressable.",
    modelAnswers: [
      "A plain LC circuit is a harmonic oscillator, so its levels are evenly spaced. A pulse tuned to the 0 to 1 transition is equally resonant with 1 to 2 and everything above, so population leaks out of the qubit subspace. The Josephson junction is nonlinear and makes the spacing uneven, which isolates a clean two-level system.",
      "With equal gaps between levels you cannot address just the bottom two. The junction adds anharmonicity, so the 1 to 2 transition sits at a different frequency and the drive only touches the qubit levels.",
    ],
  },
  hints: [
    { text: "A plain LC circuit's energy levels form a ladder with identical rungs: the 0-1 gap matches the 1-2 gap, and so on." },
    { text: "A pulse tuned to 0→1 is then tuned to every other neighbouring transition too. Ask what that does to a computation." },
    { text: "The junction's current-phase relation is not proportional. Ask what an unequal ladder does for addressing one transition." },
  ],
  solution: {
    steps: [
      { description: "A plain LC circuit's energy levels are evenly spaced (harmonic oscillator), so a pulse resonant with the 0→1 transition is equally resonant with 1→2, 2→3, and so on." },
      { description: "That makes it impossible to cleanly address just the 0 and 1 levels, since any drive leaks population into higher levels too." },
      { description: "The Josephson junction adds nonlinearity, making the level spacing uneven (anharmonic), so a pulse tuned to the 0→1 gap no longer resonates with 1→2 and a usable two-level qubit is isolated." },
    ],
    finalAnswer: "A plain LC circuit's evenly-spaced levels make any 0→1 drive equally resonant with higher transitions; the Josephson junction's anharmonicity breaks this even spacing, isolating a clean two-level qubit.",
  },
  explanation: {
    correctIdea: "This is the lesson's central engineering point, stated as a precise physical mechanism rather than a vague 'it makes qubits work' claim.",
    whyCorrect: "A harmonic ladder has identical rungs, so a pulse tuned to the lowest transition drives every transition above it too and population escapes the computational pair. The junction's nonlinear current-phase relation makes the rungs unequal, which is what lets one transition be addressed alone.",
    whyWrong: ["Saying the Josephson junction 'adds superconductivity' misses the point. Superconductivity is already present elsewhere in the circuit; the junction's contribution is nonlinearity, and so anharmonicity."],
  },
};
