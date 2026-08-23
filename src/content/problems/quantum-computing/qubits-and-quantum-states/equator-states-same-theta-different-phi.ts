import type { ConceptualProblem } from "@/lib/problems/types";

export const equatorStatesSameThetaDifferentPhi: ConceptualProblem = {
  meta: {
    slug: "equator-states-same-theta-different-phi",
    title: "What Distinguishes Two Equator States?",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["bloch-sphere", "phase", "measurement"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/the-bloch-sphere"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Every point on the Bloch sphere's equator (θ=π/2) corresponds to an equal-probability superposition. What physically differs between two different equator points, and what stays the same?",
    placeholder: "All equator states share...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["equal probability", "50/50", "same probability", "p(0)=p(1)"],
      ["phase", "relative phase", "φ", "varphi"],
    ],
    incorrectFeedback:
      "Be specific: what quantity is identical for every equator point (hint: it's tied to θ), and what quantity varies as you move around the equator (hint: it's tied to φ)?",
    partialFeedback: "Good — now make sure you've covered both halves: what stays the same across the equator, and what changes.",
  },
  hints: [
    { text: "θ is the same (π/2) for every equator point — what does θ control?" },
    { text: "φ is different at different equator points — what does φ control?" },
  ],
  solution: {
    steps: [
      {
        description:
          "Every equator point shares the same θ=π/2, so every equator state gives the exact same computational-basis measurement probabilities: P(0)=P(1)=1/2.",
      },
      {
        description:
          "Equator points differ in φ, the relative phase between the |0⟩ and |1⟩ components — invisible to a direct computational-basis measurement, but physically real (it shows up once gates or a different measurement basis get involved).",
      },
    ],
    finalAnswer: "Same: measurement probabilities (P(0)=P(1)=1/2, fixed by θ). Different: relative phase φ.",
  },
  explanation: {
    correctIdea: "θ (latitude) controls measurement statistics; φ (longitude) is the relative phase, a real physical difference invisible only to a plain computational-basis measurement.",
    whyCorrect: "This is exactly why |+⟩ and |-⟩ (both equator, φ differing by π) give identical 50/50 outcomes when measured directly, yet behave completely differently once a Hadamard gate is applied to them.",
    whyWrong: [
      "Claiming two equator states are 'the same state' because they give the same measurement probabilities ignores that φ is still a real, physically distinguishable difference, just not one a computational-basis measurement alone reveals.",
    ],
  },
};
