import type { ConceptualProblem } from "@/lib/problems/types";

export const whyDispersiveNotDirect: ConceptualProblem = {
  meta: {
    slug: "why-dispersive-not-direct",
    title: "Why Measure a Resonator Instead of the Qubit Directly",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/qubit-readout-techniques",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["readout", "conceptual"],
    prerequisites: ["quantum-hardware/control-and-readout/qubit-readout-techniques"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain what risk dispersive readout (measuring a coupled resonator) avoids, compared to probing the qubit's energy levels directly.",
    placeholder: "Directly probing the qubit's energy levels risks...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["disturb", "uncontrolled", "collapse"],
        missingFeedback:
          "Name the risk. Say what going straight at the qubit's energy levels does to the qubit you are trying to read.",
      },
      {
        phrases: ["resonator", "indirect", "dispersive", "coupled"],
        missingFeedback:
          "You have named the risk. Now say what the technique measures instead of the qubit, and how that keeps the probe off the qubit itself.",
      },
    ],
    incorrectFeedback: "Two things need saying. First, what goes wrong if you interrogate the qubit's own transition head-on, in terms of what a strong interaction does to the state you were trying to read. Second, the specific trick that avoids it: what object is actually probed instead, and why probing that object still tells you the qubit's state.",
    partialFeedback: "Good. Now be explicit that the quantity actually measured belongs to the cavity, not to the qubit: the cavity's resonance sits at a different frequency depending on which state the qubit is in.",
    modelAnswers: [
      "Probing the qubit's levels directly risks disturbing the qubit in an uncontrolled way. Dispersive readout avoids that by measuring a coupled resonator instead, reading its state-dependent frequency shift rather than the qubit itself.",
      "Direct probing means poking the qubit itself, which can collapse or disturb it unpredictably. The dispersive scheme is indirect: you interrogate the resonator the qubit is coupled to, so the probe never touches the qubit.",
    ],
  },
  hints: [
    { text: "Interrogating the qubit's own transition head-on means driving it strongly." },
    { text: "Ask what a strong drive does to a state you were trying to leave alone." },
    { text: "Now consider putting a cavity beside the qubit, weakly and off-resonantly, and reading the cavity instead. What about the cavity would depend on the qubit's state?" },
  ],
  solution: {
    steps: [
      { description: "Directly probing a qubit's energy levels means interacting strongly and directly with the qubit itself, risking an uncontrolled disturbance or collapse of its state." },
      { description: "Dispersive readout instead couples the qubit off-resonantly (weakly) to a separate microwave resonator, engineered so the resonator's own frequency shifts depending on the qubit state." },
      { description: "Measuring the resonator's frequency (via a probe tone and reflected/transmitted signal) reveals the qubit's state indirectly, without directly bombarding the qubit itself." },
    ],
    finalAnswer: "Direct probing risks uncontrolled disturbance of the qubit; dispersive readout avoids this by measuring a coupled resonator's state-dependent frequency shift instead.",
  },
  explanation: {
    correctIdea: "This is the lesson's central engineering motivation, stated as a precise risk-avoidance mechanism rather than a vague 'it's gentler' claim.",
    whyCorrect: "The cavity's resonance shifts by ±χ depending on the qubit state, so probing the cavity reads the qubit without driving it.",
    whyWrong: ["Saying dispersive readout is 'more accurate' misses the point. It is about avoiding disturbance, not primarily about accuracy."],
  },
};
