import type { ConceptualProblem } from "@/lib/problems/types";

export const whyTraceOutEverythingIsMeaningless: ConceptualProblem = {
  meta: {
    slug: "why-trace-out-everything-is-meaningless",
    title: "Why You Can't Trace Out Every Qubit",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["partial-trace", "conceptual"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"],
  },
  question: {
    type: "conceptual",
    prompt:
      "partialTrace throws an error if asked to trace out every qubit of a system. Using the defining requirement that the partial trace must satisfy, explain why 'the reduced state of zero qubits' isn't a meaningful object.",
    placeholder: "Think about what local observable the defining requirement would even refer to...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["no qubits", "zero qubits", "nothing left", "no subsystem", "empty"],
      ["no observable", "no local observable", "doesn't apply", "not defined"],
    ],
    incorrectFeedback: "Think about what the defining requirement Tr[(A⊗I)ρ]=Tr(Aρ_A) would even mean if there's no subsystem A left to have an observable on.",
    partialFeedback: "You're close — be explicit about there being no remaining subsystem for any local observable A to act on.",
  },
  hints: [
    { text: "The defining requirement talks about a local observable A acting on 'the kept qubits.'" },
    { text: "If every qubit is traced out, there are no kept qubits left." },
    { text: "What would 'a local observable on zero qubits' even mean?" },
  ],
  solution: {
    steps: [
      { description: "The partial trace is defined by requiring Tr[(A⊗I)ρ]=Tr(Aρ_A) for every local observable A on the kept qubits." },
      { description: "If every qubit is traced out, there is no kept subsystem, so there's no space of local observables A to define the requirement over." },
      { description: "Without that requirement to satisfy, there's no well-defined object left to compute." },
    ],
    finalAnswer: "With no qubits kept, there's no local observable to define 'the reduced state' against, so the operation isn't meaningful.",
  },
  explanation: {
    correctIdea: "The partial trace's meaning comes entirely from matching local observable predictions on a remaining subsystem.",
    whyCorrect: "Tracing out everything removes the very subsystem the defining requirement is about, leaving nothing to define.",
    whyWrong: ["Saying the result would just be 'a number' (the trace itself) misses that the defining requirement, not just some scalar output, is what's undefined."],
  },
};
