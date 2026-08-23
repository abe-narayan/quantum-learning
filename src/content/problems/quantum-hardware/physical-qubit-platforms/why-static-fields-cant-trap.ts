import type { ConceptualProblem } from "@/lib/problems/types";

export const whyStaticFieldsCantTrap: ConceptualProblem = {
  meta: {
    slug: "why-static-fields-cant-trap",
    title: "Why a Static Electric Field Can't Trap an Ion in 3D",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/trapped-ions",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["trapped-ions"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why an ion trap needs an OSCILLATING (not static) electric field to confine a charged particle in three dimensions.",
    placeholder: "A static field configuration cannot trap a charge in 3D because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["earnshaw", "static", "cannot", "no stable"],
      ["oscillat", "time-averaged", "effective confining"],
    ],
    incorrectFeedback: "Name the specific classical electrostatics result (Earnshaw's theorem) that rules out static 3D trapping, and explain what an oscillating field provides instead.",
    partialFeedback: "Good — now be explicit about how oscillation gets around the static-field limitation.",
  },
  hints: [
    { text: "This is a classical electrostatics result called Earnshaw's theorem." },
    { text: "It states no static arrangement of electric fields can create a stable 3D equilibrium point for a charge." },
    { text: "An oscillating (radio-frequency) field creates an effective, time-averaged confining potential that a static field cannot." },
  ],
  solution: {
    steps: [
      { description: "Earnshaw's theorem (classical electrostatics) proves no static electric field configuration can create a stable equilibrium point for a charge in 3D — any static trap has at least one direction the charge would spontaneously slide away along." },
      { description: "A rapidly OSCILLATING field, however, can create an effective, time-averaged confining potential (the ion effectively feels a net restoring force averaged over many oscillation cycles) that a static field fundamentally cannot provide." },
      { description: "This is why a Paul trap specifically requires radio-frequency oscillating fields, not a static field arrangement." },
    ],
    finalAnswer: "Earnshaw's theorem forbids stable 3D confinement by any static field; an oscillating field creates an effective time-averaged confining potential instead.",
  },
  explanation: {
    correctIdea: "This grounds the ion trap's oscillating-field requirement in a specific, named physical/mathematical fact, not just an engineering detail asserted without justification.",
    whyCorrect: "Matches the lesson's explicit mention of Earnshaw's theorem.",
    whyWrong: ["Simply stating 'oscillating fields work better' without naming the specific reason static fields fail entirely misses the actual physical justification."],
  },
};
