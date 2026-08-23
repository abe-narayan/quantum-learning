import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const recommendPlatformForNetworking: MultipleChoiceProblem = {
  meta: {
    slug: "recommend-platform-for-networking",
    title: "Which Platform Fits a Networking-First Application?",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["capstone"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"],
  },
  question: {
    type: "multiple-choice",
    prompt: "An application needs to distribute entanglement between two physically distant quantum computers. Which platform's comparison-table entry is naturally suited to this specific role?",
    options: [
      { id: "a", text: "Photonic — naturally networked, since light itself travels between locations" },
      { id: "b", text: "Trapped ions — because of their long coherence time" },
      { id: "c", text: "Spin qubits — because of their small size" },
      { id: "d", text: "Superconducting qubits — because of their fast gates" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Long coherence time is valuable for LOCAL computation, but doesn't directly address the need to physically transmit information between distant locations.",
      c: "Small size helps with on-chip fabrication density, not with transmitting quantum information across distance.",
      d: "Fast gates help local computation speed, not the specific problem of physically connecting distant devices.",
    },
    defaultIncorrectFeedback: "Photons are the only platform in this course whose qubit carrier (light) naturally travels between physically separate locations.",
  },
  hints: [
    { text: "The task specifically requires transmitting quantum information across distance, not just computing locally." },
    { text: "Which platform's qubit doesn't sit still, but travels?" },
    { text: "Photonic qubits are explicitly noted as well-suited to communication/networking roles." },
  ],
  solution: {
    steps: [{ description: "Photons are the natural fit — light already travels, making photonic qubits the standard choice for connecting physically separate quantum devices." }],
    finalAnswer: "(a) Photonic",
  },
  explanation: {
    correctIdea: "This tests matching a specific application priority (networking) to the one platform whose defining physical property (mobility) directly addresses it, rather than defaulting to whichever platform 'sounds most advanced.'",
    whyCorrect: "Matches the Photonic Qubits lesson's explicit closing point about hybrid architectures using photons for inter-processor communication.",
    whyWrong: ["Each other option describes a real advantage of that platform, but not one that addresses the specific distant-communication requirement in this question."],
  },
};
