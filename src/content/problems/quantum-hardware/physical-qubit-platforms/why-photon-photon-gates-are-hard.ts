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
      {
        phrases: ["shared motional mode", "rydberg", "coupling mechanism"],
        missingFeedback:
          "The question asks for the other platforms first. Name, for each one, the physical thing that lets two of its qubits feel each other.",
      },
      {
        phrases: ["don't interact", "do not interact", "never interact", "pass through", "no natural interaction", "no natural equivalent", "lack a natural equivalent", "no equivalent"],
        missingFeedback:
          "You have the other platforms covered. Now say what happens when two beams of light meet, and what that leaves photonic gates without.",
      },
    ],
    incorrectFeedback: "Name at least one other platform's specific interaction mechanism, and explicitly state why photons lack an analogous one.",
    partialFeedback: "Good. Now be explicit that ordinary light beams pass through each other without interacting, unlike the other platforms' mechanisms.",
    modelAnswers: [
      "Trapped ions use a shared motional mode, neutral atoms use the Rydberg blockade, and superconducting qubits use a direct circuit coupling mechanism. Photons have no natural equivalent because two beams of light simply pass through each other without interacting.",
      "Every other platform has a physical handle: the shared motional mode for ions, a Rydberg interaction for neutral atoms, capacitive coupling on a chip. Photons do not interact with each other in ordinary media, so there is nothing to build a two-qubit gate out of.",
    ],
  },
  hints: [
    { text: "Trapped ions: the shared vibrational (motional) mode. Neutral atoms: Rydberg blockade." },
    { text: "Both rely on a genuine physical interaction between the qubits' carriers." },
    { text: "Two beams crossing in ordinary glass emerge unchanged. Ask what that says about building a gate out of them." },
  ],
  solution: {
    steps: [
      { description: "Trapped ions use their shared vibrational (motional) mode; neutral atoms use Rydberg blockade. Both are genuine physical interactions between the qubit carriers." },
      { description: "Superconducting qubits use direct circuit coupling, capacitive or inductive; spin qubits use exchange interactions between nearby confined electrons." },
      { description: "Photons, by contrast, do not interact with each other in ordinary optical media. Two light beams normally pass straight through one another, so there is no comparably direct, efficient interaction mechanism to build a two-qubit gate from." },
    ],
    finalAnswer: "Other platforms rely on a direct physical interaction (shared motion, Rydberg blockade, circuit coupling); photons lack a natural equivalent, since ordinary light beams do not interact with each other.",
  },
  explanation: {
    correctIdea: "This makes the comparison across every platform in this course explicit, showing photonic qubits' central challenge is specific to them rather than 'harder in general'.",
    whyCorrect: "Every other platform has a carrier that already interacts with its neighbours: shared motion, a Rydberg dipole, a capacitor, an exchange integral. Photons in ordinary media superpose and pass on, so a two-photon gate has to be manufactured out of measurement and postselection rather than found in the physics.",
    whyWrong: ["Describing this only as 'photons are difficult to control' without naming the specific missing interaction mechanism misses the actual physical reason."],
  },
};
