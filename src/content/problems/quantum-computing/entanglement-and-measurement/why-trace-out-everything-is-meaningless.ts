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
      {
        phrases: ["no qubits", "nothing left", "nothing remains", "no subsystem", "no remaining", "no kept", "is empty", "empty system", "empty set", "left empty", "all qubits gone"],
        missingFeedback:
          "Start with the bookkeeping: after tracing out every qubit, what is actually there?",
      },
      {
        phrases: ["no observable", "no local observable", "nothing to measure", "nothing to act on", "no operator", "doesn't apply", "does not apply", "not defined", "undefined", "not well-defined", "not well defined", "no requirement", "cannot be defined", "can't be defined", "can not be defined", "nothing for the requirement to constrain"],
        missingFeedback:
          "You have said what survives. Now connect that to the defining requirement: what does that requirement range over, and what happens to it when there is nothing left to range over?",
      },
    ],
    incorrectFeedback: "You answered that the function should just return 1, or a scalar, which sidesteps the question. Go to the equation that defines what a partial trace is, and ask where the local observable in it would have to live once the kept register has size zero.",
    partialFeedback: "You have half of it. The other half is the defining equation itself: name the space the observable A has to be an operator on, and check whether that space still exists.",
    modelAnswers: [
      "The partial trace is defined by requiring that it reproduce the predictions of local observables on the qubits you keep. Trace out everything and there are no qubits left, so there is no local observable for the requirement to talk about and nothing to define the reduced state against.",
      "Trace out all of them and nothing remains. With an empty system there is no operator to act on, so the defining requirement has nothing to constrain and the reduced state simply is not defined.",
    ],
  },
  hints: [
    { text: "Write the defining equation of the partial trace down in full. It has an operator A in it; which register does A act on?" },
    { text: "Set the kept register's size to zero. What is A supposed to be an operator on?" },
    { text: "If the equation's left-hand side has nothing to say, the quantity it defines has not been given a meaning. Say which of the two is missing." },
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
