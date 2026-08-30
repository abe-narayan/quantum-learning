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
    prompt: "Explain why an ion trap needs an oscillating rather than a static electric field to confine a charged particle in three dimensions.",
    placeholder: "A static field configuration cannot trap a charge in 3D because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["earnshaw", "no stable equilibrium", "no stable minimum", "cannot be a minimum in all three", "laplace", "not have a stable minimum", "not be a stable minimum", "no stable point", "not stable in all three", "unstable in at least one direction", "always a direction of escape", "saddle"],
        missingFeedback:
          "Say what stops a fixed field arrangement from holding a charge. There is a named theorem here, and it is about what shape the potential is allowed to have.",
      },
      {
        phrases: ["oscillat", "time-averaged", "effective confining"],
        missingFeedback:
          "You have said why the static case fails. Now say what changing the field in time buys you, and what the ion actually feels as a result.",
      },
    ],
    incorrectFeedback: "Naming the phenomenon is a different thing from naming the theorem. A specific result in classical electricity and magnetism forbids a stable three-dimensional equilibrium for a charge held by fields that never vary in time. Name that result, state what it forbids, then say what changes when the field is made to vary rapidly instead.",
    partialFeedback: "Good. Now say how a rapidly varying field gets around the restriction, in terms of what the ion feels averaged over one cycle.",
    modelAnswers: [
      "Earnshaw's theorem says a static electric field can have no stable equilibrium for a charge in free space: Laplace's equation forbids a minimum in all three directions at once. An oscillating field gets round this by producing an effective time-averaged confining potential.",
      "You cannot have a stable minimum in three dimensions with static fields; there is always a direction of escape. Trapping works by oscillating the field fast enough that the time-averaged force pushes the ion back toward the centre.",
    ],
  },
  hints: [
    { text: "This is a classical electrostatics result, and it has a name." },
    { text: "It says no arrangement of unchanging electric fields can hold a charge at a stable point in three dimensions." },
    { text: "A rapidly varying field gives the ion a restoring push averaged over each cycle, which an unchanging one never can." },
  ],
  solution: {
    steps: [
      { description: "Earnshaw's theorem (classical electrostatics) proves no static electric field configuration can create a stable equilibrium point for a charge in 3D. Any static trap leaves at least one direction the charge would spontaneously slide away along." },
      { description: "A rapidly oscillating field, however, can create an effective, time-averaged confining potential, where the ion feels a net restoring force averaged over many oscillation cycles, which a static field cannot provide." },
      { description: "This is why a Paul trap specifically requires radio-frequency oscillating fields, not a static field arrangement." },
    ],
    finalAnswer: "Earnshaw's theorem forbids stable 3D confinement by any static field; an oscillating field creates an effective time-averaged confining potential instead.",
  },
  explanation: {
    correctIdea: "This grounds the ion trap's oscillating-field requirement in a specific, named physical/mathematical fact, not just an engineering detail asserted without justification.",
    whyCorrect: "Earnshaw's theorem follows from Laplace's equation: a potential with no sources in the region has no local minimum, so a static arrangement always leaves one direction along which the ion escapes. Oscillating the field turns that unstable direction into a restoring force once averaged over a cycle.",
    whyWrong: ["Simply stating 'oscillating fields work better' without naming the specific reason static fields fail entirely misses the actual physical justification."],
  },
};
