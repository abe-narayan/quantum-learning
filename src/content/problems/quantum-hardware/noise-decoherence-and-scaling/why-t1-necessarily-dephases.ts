import type { ConceptualProblem } from "@/lib/problems/types";

export const whyT1NecessarilyDephases: ConceptualProblem = {
  meta: {
    slug: "why-t1-necessarily-dephases",
    title: "Why Energy Relaxation Necessarily Disturbs Phase",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["t1-t2", "conceptual"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why a T1 (energy relaxation) process necessarily also disturbs phase coherence, while pure dephasing (its own time constant T_phi) need not involve any energy exchange. That asymmetry is what sits behind T2≤2T1. Note that T2 is neither mechanism: it is the total coherence decay rate the two of them add up to, 1/T2 = 1/(2T1) + 1/T_phi.",
    placeholder: "If a qubit's population changes (energy relaxes), then...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["populations change", "moves probability", "probability moves", "which state the qubit is in", "information about which state", "leaks information"],
        missingFeedback:
          "Take T1 first. Say what physically changes about the qubit when it relaxes, and what the environment learns as a result.",
      },
      {
        phrases: ["pure dephasing", "no energy exchange", "populations unchanged"],
        missingFeedback:
          "You have T1's side. Now do the other direction: say what a purely phase-randomizing process does, and does not do, to the qubit's energy.",
      },
    ],
    incorrectFeedback: "The relationship runs one way, and the answer has to establish both ends of it. Start from a process that shifts a qubit's occupancy between |0⟩ and |1⟩ and argue why the environment must have registered something, and what that registering does to the relative phase. Then go the other way: describe a process that scrambles phase while leaving both occupancies exactly where they were, and say what it does not have to exchange.",
    partialFeedback: "Good. Now be explicit about the asymmetry: T1 forces some dephasing, but dephasing does not force any T1.",
    modelAnswers: [
      "If the qubit relaxes, the populations change, and the environment ends up holding information about which state the qubit was in. That leaked information destroys the phase relationship too, so T1 necessarily dephases. Pure dephasing is different: it randomizes the phase with no energy exchange at all, populations unchanged. T2 is the total of the two rates, 1/T2 = 1/(2T1) + 1/T_phi, so it can never exceed 2T1.",
      "A T1 event moves probability from one level to the other, and anything that leaks that information also kills coherence. Pure dephasing need not move any probability; there is no energy exchange, which is why phase can decay without relaxation but not the other way round.",
    ],
  },
  hints: [
    { text: "If the probability of finding |0⟩ versus |1⟩ shifts at all, something outside the qubit must have registered the difference." },
    { text: "Whatever registered it is now correlated with the qubit, and that correlation is exactly what destroys the relative phase between |0⟩ and |1⟩." },
    { text: "Now run it backwards: can a process randomise the phase while the two probabilities stay put? If so, does it need to move any energy?" },
  ],
  solution: {
    steps: [
      { description: "A T1 process changes the qubit's population (probability of being found in |0⟩ versus |1⟩), which requires energy exchange with the environment and necessarily leaks which-state information. That leaked information disturbs phase coherence as a side effect." },
      { description: "A pure-dephasing process, with time constant T_phi, can instead leave populations entirely unchanged, only randomizing the relative phase between |0⟩ and |1⟩, with no energy exchange required." },
      { description: "T2 is neither of those two mechanisms; it is the total rate at which coherence decays once both act, 1/T2 = 1/(2T1) + 1/T_phi. Because 1/T_phi cannot be negative, 1/T2 ≥ 1/(2T1), which is T2 ≤ 2T1. The asymmetry (T1 implies some dephasing, pure dephasing implies no T1) is what puts the factor of 2 on the T1 term." },
    ],
    finalAnswer: "T1 (population change) necessarily leaks information that also disturbs phase; pure dephasing (T_phi) needs no energy exchange at all. Coherence therefore decays at the summed rate 1/T2 = 1/(2T1) + 1/T_phi, and dropping the non-negative 1/T_phi term gives T2 ≤ 2T1.",
  },
  explanation: {
    correctIdea: "This connects the abstract T2≤2T1 inequality to its actual physical origin, rather than leaving it as an unexplained rule to memorize.",
    whyCorrect: "A population change means the environment now holds a record of which level the qubit occupied, and any such record destroys the superposition's phase. Phase can be scrambled without moving energy, though, so the implication runs one way only, and that asymmetry is what T2 ≤ 2T1 encodes.",
    whyWrong: ["Treating relaxation and pure dephasing as two independent, symmetric processes misses the one-directional physical dependency that produces the specific factor-of-2 bound. A related slip is calling pure dephasing 'the T2 process': T_phi is the mechanism, T2 is the total the two mechanisms produce together."],
  },
};
