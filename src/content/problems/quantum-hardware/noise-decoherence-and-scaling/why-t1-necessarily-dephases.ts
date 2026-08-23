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
    prompt: "Explain why a T1 (energy relaxation) process necessarily also disturbs phase coherence, while a T2 (pure dephasing) process need not involve any energy exchange — the physical asymmetry behind T2≤2T1.",
    placeholder: "If a qubit's population changes (energy relaxes), then...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["population", "populations change", "which state", "information about"],
      ["pure dephasing", "no energy exchange", "populations unchanged"],
    ],
    incorrectFeedback: "Address both directions: why a population change necessarily disturbs coherence, and why a pure dephasing process can leave populations completely untouched.",
    partialFeedback: "Good — now be explicit about the asymmetry: one direction (T1) forces the other (dephasing), but not vice versa.",
  },
  hints: [
    { text: "If the qubit's population (|0⟩ vs |1⟩ probability) changes at all, information about the qubit's state has necessarily leaked to the environment." },
    { text: "This same leaked information necessarily also disturbs the coherence (relative phase) between |0⟩ and |1⟩." },
    { text: "A pure dephasing process (e.g. dephasingChannel) can instead leave the populations completely fixed, only randomizing phase — no energy needs to be exchanged for phase alone to be disturbed." },
  ],
  solution: {
    steps: [
      { description: "A T1 process changes the qubit's population (probability of being found in |0⟩ vs |1⟩), which requires energy exchange with the environment and necessarily also leaks 'which-state' information — this leaked information disturbs phase coherence as a side effect." },
      { description: "A T2 (pure dephasing) process can instead leave populations entirely unchanged, only randomizing the relative phase between |0⟩ and |1⟩ — no energy exchange is required for this." },
      { description: "This asymmetry (T1 necessarily implies some dephasing, but dephasing doesn't require any T1) is exactly why T2≤2T1: dephasing can never be 'better' (longer) than what T1 alone would already limit it to." },
    ],
    finalAnswer: "T1 (population change) necessarily leaks information that also disturbs phase; T2 (pure dephasing) needs no energy exchange at all — this one-directional dependency is why T2≤2T1.",
  },
  explanation: {
    correctIdea: "This connects the abstract T2≤2T1 inequality to its actual physical origin, rather than leaving it as an unexplained rule to memorize.",
    whyCorrect: "Matches the lesson's Engineering Development section's explicit reasoning.",
    whyWrong: ["Treating T1 and T2 as two independent, symmetric processes misses the one-directional physical dependency that produces the specific factor-of-2 bound."],
  },
};
