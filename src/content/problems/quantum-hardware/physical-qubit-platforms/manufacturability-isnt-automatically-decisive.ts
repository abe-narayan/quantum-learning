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
      {
        phrases: ["uniformity", "reliable", "consistent fabrication"],
        missingFeedback:
          "One of the named challenges is about the fabrication itself. Say what has to be true of a large array of dots coming off the line.",
      },
      {
        phrases: ["individual addressing", "neighboring", "without disturbing"],
        missingFeedback:
          "You have the fabrication challenge. The lesson names a second one, about control rather than manufacture: say what you have to be able to do to one dot, and what must not happen to the ones next to it.",
      },
    ],
    incorrectFeedback: "Name both specific open challenges the lesson identifies, not just a general statement that 'more work is needed.'",
    partialFeedback: "Good. Both of the lesson's named challenges have to appear, not one of them plus a general remark. One is about making many dots come out the same; the other is about touching one spin without touching the ones beside it.",
    modelAnswers: [
      "Two challenges are named: reliable, consistent fabrication of many dots so they come out uniform, and addressing each one individually without disturbing its neighboring dots. Compatible tooling solves neither.",
      "Even with standard fabrication tooling you still have to get uniformity across a large array, and you need individual addressing that leaves the neighboring dots alone.",
    ],
  },
  hints: [
    { text: "One challenge concerns making many quantum dots consistently, not just one." },
    { text: "Another challenge concerns controlling a single spin without accidentally affecting its neighbors." },
    { text: "Both are problems that only appear once you want many dots working together, rather than one dot working at all." },
  ],
  solution: {
    steps: [
      { description: "Uniform, reliable fabrication of many quantum dots. Small variations in dot properties across a chip cause inconsistent qubit behavior." },
      { description: "Individually addressing single spins without disturbing neighboring qubits, a control challenge distinct from the fabrication question." },
      { description: "Both remain open engineering problems even though the underlying device size favors existing manufacturing infrastructure." },
    ],
    finalAnswer: "Reliable, uniform fabrication of many dots, and precise individual addressing without disturbing neighbors: both open challenges named explicitly in the lesson.",
  },
  explanation: {
    correctIdea: "This tests whether the reader absorbed the lesson's explicit caveat, not just its headline manufacturability claim.",
    whyCorrect: "Both remaining obstacles only appear in the plural. One dot works; a thousand dots behaving identically is a fabrication problem, and touching one spin while its neighbours stay put is a control problem. Borrowing a mature fabrication line solves neither.",
    whyWrong: ["A vague answer like 'more research is needed' does not demonstrate having read the specific challenges the lesson names."],
  },
};
