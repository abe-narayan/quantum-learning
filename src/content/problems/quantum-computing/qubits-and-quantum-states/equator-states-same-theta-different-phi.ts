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
      {
        phrases: ["equal probability", "50/50", "same probability", "p(0)=p(1)"],
        missingFeedback:
          "The question asks for two things. Say what every equator state has in common, in terms of what a computational-basis measurement would give.",
      },
      {
        phrases: ["relative phase", "phase difference", "phase angle", "differ in phase", "differs in phase", "differing phase", "the phase between", "azimuthal angle", "φ", "varphi"],
        missingFeedback:
          "You have said what they share. Now say what actually distinguishes two equator points, given that latitude is the same for both.",
        anchors: {
          "φ": "The bare angle symbol is what a student writes who names the coordinate rather than the concept. It strips to nothing, so the raw glyph is the test.",
        },
      },
    ],
    incorrectFeedback:
      "You said the equator points are 'the same state up to a global factor', which is exactly what they are not. Split the two angles: say which measurable quantity θ pins down, and what changes as you travel round the equator that a computational-basis measurement cannot see.",
    partialFeedback: "Cover both halves: what stays the same across the equator, and what changes.",
    modelAnswers: [
      "What stays the same is the measurement probabilities: every equator state gives 50/50 in the computational basis, because theta fixes those. What differs is the relative phase between the two amplitudes, the azimuthal angle phi.",
      "All equator points have the same probability of 0 and 1, P(0)=P(1)=1/2. They differ in phase: the angle phi is the phase difference between the |0> and |1> components, and that is a real physical difference.",
    ],
  },
  hints: [
    { text: "Write a general Bloch-sphere state in terms of its two angles, then set the polar angle to π/2 and see what survives." },
    { text: "Compute the computational-basis probabilities for that state. Which of the two angles do they involve?" },
    { text: "The other angle has not disappeared from the state. Say what it does to the two amplitudes, and name a measurement that would notice." },
  ],
  solution: {
    steps: [
      {
        description:
          "Every equator point shares the same θ=π/2, so every equator state gives the exact same computational-basis measurement probabilities: P(0)=P(1)=1/2.",
      },
      {
        description:
          "Equator points differ in φ, the relative phase between the |0⟩ and |1⟩ components. It is invisible to a direct computational-basis measurement but physically real, showing up once gates or a different measurement basis are involved.",
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
