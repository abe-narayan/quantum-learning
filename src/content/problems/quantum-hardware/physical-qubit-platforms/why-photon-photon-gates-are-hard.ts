import type { ConceptualProblem } from "@/lib/problems/types";

export const whyPhotonPhotonGatesAreHard: ConceptualProblem = {
  meta: {
    slug: "why-photon-photon-gates-are-hard",
    title: "Why Two-Photon Gates Lack a Direct Interaction Mechanism",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["photonic-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/photonic-qubits"],
  },
  question: {
    type: "conceptual",
    prompt: "Every other platform's two-qubit gate relies on some direct physical interaction. Name each platform's mechanism briefly, then explain why photons lack an equivalent.",
    placeholder: "Trapped ions use... Neutral atoms use... Photons lack an equivalent because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["shared motional mode", "rydberg", "coupling mechanism"],
      ["don't interact", "pass through", "no natural interaction"],
    ],
    incorrectFeedback: "Name at least one other platform's specific interaction mechanism, and explicitly state why photons lack an analogous one.",
    partialFeedback: "Good — now be explicit that ordinary light beams pass through each other without interacting, unlike the other platforms' mechanisms.",
  },
  hints: [
    { text: "Trapped ions: the shared vibrational (motional) mode. Neutral atoms: Rydberg blockade." },
    { text: "Both rely on a genuine physical interaction between the qubits' carriers." },
    { text: "Ordinary photons essentially pass straight through each other in normal optical media — no comparable interaction exists without special (inefficient) techniques." },
  ],
  solution: {
    steps: [
      { description: "Trapped ions use their shared vibrational (motional) mode; neutral atoms use Rydberg blockade — both are genuine physical interactions between the qubit carriers." },
      { description: "Superconducting qubits use direct circuit coupling (capacitive/inductive); spin qubits use exchange interactions between nearby confined electrons." },
      { description: "Photons, by contrast, essentially don't interact with each other in ordinary optical media — two light beams normally pass straight through one another — so there is no comparably direct, efficient interaction mechanism to build a two-qubit gate from." },
    ],
    finalAnswer: "Other platforms rely on a direct physical interaction (shared motion, Rydberg blockade, circuit coupling); photons lack a natural equivalent since ordinary light beams don't interact with each other.",
  },
  explanation: {
    correctIdea: "This makes the comparison across ALL of this course's platforms explicit, showing photonic qubits' central challenge is genuinely unique, not just 'harder in general.'",
    whyCorrect: "Matches the lesson's explicit 'Why two-photon gates are hard' section and draws on every previous lesson in the course.",
    whyWrong: ["Describing this only as 'photons are difficult to control' without naming the specific missing interaction mechanism misses the actual physical reason."],
  },
};
