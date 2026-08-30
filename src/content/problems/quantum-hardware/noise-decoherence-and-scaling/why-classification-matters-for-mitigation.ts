import type { ConceptualProblem } from "@/lib/problems/types";

export const whyClassificationMattersForMitigation: ConceptualProblem = {
  meta: {
    slug: "why-classification-matters-for-mitigation",
    title: "Why Misclassifying an Error Wastes Engineering Effort",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "conceptual",
    tags: ["noise-sources", "conceptual"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"],
  },
  question: {
    type: "conceptual",
    prompt:
      "An engineer misdiagnoses a genuinely incoherent (environmental) error as coherent (miscalibration) and responds by recalibrating, repeatedly. Explain what tuning actually repairs, why it cannot touch this particular fault, and what should have been reached for instead.",
    placeholder: "Tuning repairs..., but a genuinely environmental error is instead..., so what is needed here is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["systematic", "deterministic parameter", "drifted setting", "control parameter", "miscalibrated value", "wrong value of a setting"],
        missingFeedback:
          "The second and third parts are covered, but the first is not. Say what kind of quantity a tuning pass is capable of moving, in the vocabulary the lesson uses for it, before saying what it cannot reach.",
      },
      {
        phrases: ["wasted effort", "no improvement", "does not fix", "doesn't fix", "buys nothing", "cannot recover", "already left", "environmental loss"],
        missingFeedback:
          "You have named what tuning repairs and what would actually help, but not the verdict in between. State plainly what the repeated tuning achieves against this fault.",
      },
      {
        phrases: ["shielding", "isolation", "dynamical decoupling", "error correction", "better materials", "colder", "filtering"],
        missingFeedback:
          "The diagnosis is right and the remedy is missing. Something does help against a fault of this kind, and it is not on the control rack. Name it.",
      },
    ],
    incorrectFeedback:
      "Three things are needed. Say what tuning is capable of moving, in terms of the kind of quantity a knob sets. Say why that intervention cannot reach a fault whose information has already escaped into the surroundings. Then name what the engineer should have reached for instead, because something does help here and it is not on the control rack.",
    partialFeedback:
      "Part of it is there. The answer still has to say why no knob setting reaches a fault of that kind, and what the engineer should have reached for instead.",
    modelAnswers: [
      "Tuning only repairs a control parameter that has drifted from its correct setting, a systematic offset in a knob. An environmental error is information that has already left the qubit, so recalibrating does not fix it and the repeated attempts are wasted effort. What was needed instead was better isolation and shielding, dynamical decoupling, or eventually error correction.",
      "Recalibration corrects a miscalibrated value, a deterministic parameter that has been set wrong. It buys nothing against environmental loss, because nothing about the setting was wrong in the first place. The right moves are shielding, filtering, colder operation, or dynamical decoupling.",
    ],
  },
  hints: [
    {
      text: "Sort the two error classes by what it takes to undo them. One of them is a number somebody chose that is now wrong, and that admits a particular kind of intervention.",
    },
    {
      text: "The other class is information that has crossed out of the qubit into its surroundings. Ask whether any setting on the control rack reaches across that boundary.",
    },
    {
      text: "Now separate the two costs of the misdiagnosis: what the repeated tuning achieves against this fault, and what is not being built while it goes on. The second half needs you to name an actual remedy.",
    },
  ],
  solution: {
    steps: [
      { description: "A tuning pass moves a systematic, deterministic parameter back to the value it was supposed to have. That is the entire scope of what it can repair." },
      { description: "An incoherent error is not a wrong number anywhere. It is information that has entangled with an uncontrolled environment, and no setting on any dial reverses that entanglement." },
      { description: "So the repeated recalibration buys nothing, while the interventions that would help, better isolation and shielding, filtering, dynamical decoupling and ultimately error correction, go unstarted." },
    ],
    finalAnswer:
      "Tuning repairs a control parameter that has drifted from its correct setting, and nothing else. An environmental fault is information that has already left the qubit, so the tuning buys nothing against it, and the engineering time is spent while the real remedies, better isolation and shielding or eventually error correction, go unbuilt.",
  },
  explanation: {
    correctIdea:
      "Classifying an error is not bookkeeping: the class determines which entire family of interventions is even applicable. Getting the class wrong does not produce a worse fix, it produces no fix at all, at full engineering cost.",
    whyCorrect:
      "Calibration moves a number the operator controls, and a coherent error is a wrong value of such a number, so calibration reaches it. An incoherent error is information that has already left the qubit, and no dial brings it back. Naming the remedy is the part that makes the diagnosis actionable rather than merely correct.",
    whyWrong: [
      "Saying the tuning 'works less well' treats a category error as a matter of degree. It is not: the intervention and the fault do not intersect at all.",
      "Stopping at the diagnosis, without naming isolation, decoupling or error correction, leaves the engineer knowing what not to do and not what to do.",
    ],
  },
};
