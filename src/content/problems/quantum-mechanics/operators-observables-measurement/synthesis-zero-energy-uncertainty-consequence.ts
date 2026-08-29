import type { ConceptualProblem } from "@/lib/problems/types";

export const synthesisZeroEnergyUncertaintyConsequence: ConceptualProblem = {
  meta: {
    slug: "synthesis-zero-energy-uncertainty-consequence",
    title: "Synthesis: Repeated Measurement on a Zero-Uncertainty State",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["synthesis", "measurement", "energy-time-uncertainty"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Combining the repeated-measurement-certainty result and the energy-time uncertainty relation, explain what happens if you measure any observable A twice, separated by some time interval, on a state with Delta E = 0.",
    placeholder: "Combine the two results to predict the outcome...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["same outcome", "identical result", "unchanged"],
      {
        phrases: ["state doesn't evolve", "does not evolve", "stationary", "delta t_A is infinite", "infinite", "never changes", "doesn't change", "frozen", "no evolution"],
        missingFeedback:
          "You have the outcome. Say why the time gap does not matter: ΔE = 0 sends Δt_A to infinity for every observable, so the state is stationary and nothing has changed between the two measurements however long you wait.",
      },
    ],
    incorrectFeedback: "Name both pieces: that the second measurement gives exactly the same outcome as the first, and why — because Delta E=0 means the state is stationary (Delta t_A = infinity for every observable), so nothing changes between the two measurements regardless of the time interval.",
  },
  hints: [
    { text: "What does Delta E = 0 imply about Delta t_A for the observable A, from the energy-time relation?" },
    { text: "If the state literally doesn't change between the two measurements, what should the second measurement give?" },
  ],
  solution: {
    steps: [
      { description: "$\\Delta E=0$ forces $\\Delta t_A=\\infty$ for every observable $A$ — the state's expectation values (and, in fact, the full state itself up to an overall phase) don't change with time at all." },
      { description: "Since the state genuinely doesn't evolve, and repeated immediate measurement of the same observable is already certain (idempotence), the second measurement — however long after the first — gives exactly the same outcome as the first." },
    ],
    finalAnswer: "The second measurement gives exactly the same outcome as the first, regardless of how much time separates them, because Delta E=0 makes the state stationary and repeated measurement of the same observable is always certain.",
  },
  explanation: {
    correctIdea: "Combining results from different lessons is exactly the kind of synthesis this capstone is for — the energy-time relation and the collapse/idempotence result reinforce each other here.",
    whyCorrect: "Both facts point to the same conclusion via independent reasoning, a genuine consistency check.",
    whyWrong: ["Assuming the time interval between the two measurements matters is incorrect for a truly stationary state — that's precisely what Delta t_A=infinity means."],
  },
};
