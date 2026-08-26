import type { NumericProblem } from "@/lib/problems/types";

const distillationInputStatesPerRound = 15;
const logicalQubitCount = 9;
const value = distillationInputStatesPerRound / (distillationInputStatesPerRound + logicalQubitCount);

export const resourceEstimationFactoryShareWithNineLogicalQubits: NumericProblem = {
  meta: {
    slug: "resource-estimation-factory-share-with-nine-logical-qubits",
    title: "Factory Share of the Total With Nine Logical Qubits",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "numeric",
    tags: ["resource-estimation", "magic-states", "distillation", "qubit-counting"],
    prerequisites: ["apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"],
  },
  question: {
    type: "numeric",
    prompt:
      "The capstone showed that when the magic-state factory and the compute register share the same code distance, the factory's share of the total physical qubit count is exactly 15/(15+L), where L is the number of logical qubits and 15 is the 15-to-1 distillation protocol's input-state count — independent of the code distance. If the toy algorithm needed L=9 logical qubits instead of the lesson's 6, what fraction of the total physical qubits would the factory occupy?",
    inputHint: "as a decimal between 0 and 1",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback: "Compute 15/(15+9), not 15/9 or 9/(15+9).",
  },
  hints: [
    { text: "The capstone's Step 4 derivation shows the factory share is 15/(15+L), because both the factory's and the compute register's qubit counts scale with the same per-patch factor 2d²−1." },
    { text: "Substitute L=9: 15/(15+9) = 15/24." },
    { text: "15/24 simplifies to 5/8 = 0.625." },
  ],
  solution: {
    steps: [
      { description: "The capstone derived that, when factory and compute patches share a code distance, the total physical qubit count factors as (15+L)×(2d²−1), so the factory's share is 15/(15+L), independent of d." },
      { description: "With L=9 logical qubits: factory share = 15/(15+9) = 15/24." },
      { description: "15/24 = 5/8 = 0.625, i.e. 62.5% — lower than the lesson's own L=6 case (5/7 ≈ 71.4%), since a larger compute register claims a larger slice of the same-sized factory." },
    ],
    finalAnswer: "15/24 = 0.625",
  },
  explanation: {
    correctIdea:
      "The factory's share of total qubits depends only on the ratio of the distillation protocol's input-state count to the number of logical qubits, not on the code distance itself, exactly as the capstone's algebra shows.",
    whyCorrect:
      "This directly reuses the capstone's own derived invariant 15/(15+L) rather than re-deriving the qubit counts from scratch, and correctly predicts that a larger logical-qubit count shrinks the factory's relative share even though the factory's absolute qubit cost hasn't changed.",
    whyWrong: [
      "15/9 ≈ 1.667 is not a valid share (shares must be between 0 and 1) — it comes from forgetting to add 15 to the denominator.",
      "9/(15+9) = 0.375 is the compute register's share, not the factory's.",
    ],
  },
};
