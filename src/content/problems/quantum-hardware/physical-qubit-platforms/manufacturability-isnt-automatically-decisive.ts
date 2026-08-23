import type { ConceptualProblem } from "@/lib/problems/types";

export const manufacturabilityIsntAutomaticallyDecisive: ConceptualProblem = {
  meta: {
    slug: "manufacturability-isnt-automatically-decisive",
    title: "Why Manufacturability Alone Doesn't Settle the Question",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/spin-qubits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["spin-qubits", "conceptual"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/spin-qubits"],
  },
  question: {
    type: "conceptual",
    prompt: "Name the specific open engineering challenges this lesson identifies that keep spin qubits' manufacturability advantage from being automatically decisive.",
    placeholder: "Despite compatible fabrication tooling, spin qubits still face...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["uniformity", "reliable", "consistent fabrication"],
      ["individual addressing", "neighboring", "without disturbing"],
    ],
    incorrectFeedback: "Name both specific open challenges the lesson identifies, not just a general statement that 'more work is needed.'",
    partialFeedback: "Good — make sure both named challenges (uniformity and individual addressing) appear explicitly.",
  },
  hints: [
    { text: "One challenge concerns making many quantum dots consistently, not just one." },
    { text: "Another challenge concerns controlling a single spin without accidentally affecting its neighbors." },
    { text: "Both are named explicitly in the lesson's Physical Interpretation and Common Mistakes sections." },
  ],
  solution: {
    steps: [
      { description: "Uniform, reliable fabrication of many quantum dots — small variations in dot properties across a chip can cause inconsistent qubit behavior." },
      { description: "Individually addressing single spins without disturbing neighboring qubits — a real control challenge distinct from the fabrication question." },
      { description: "Both remain open engineering problems even though the underlying device size favors existing manufacturing infrastructure." },
    ],
    finalAnswer: "Reliable, uniform fabrication of many dots, and precise individual addressing without disturbing neighbors — both open challenges named explicitly in the lesson.",
  },
  explanation: {
    correctIdea: "This tests whether the reader absorbed the lesson's explicit caveat, not just its headline manufacturability claim.",
    whyCorrect: "Matches the lesson's Common Mistakes section directly.",
    whyWrong: ["A vague answer like 'more research is needed' doesn't demonstrate having read the SPECIFIC challenges the lesson names."],
  },
};
