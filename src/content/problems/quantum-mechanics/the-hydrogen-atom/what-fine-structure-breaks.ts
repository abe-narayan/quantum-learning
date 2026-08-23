import type { ConceptualProblem } from "@/lib/problems/types";

export const whatFineStructureBreaks: ConceptualProblem = {
  meta: {
    slug: "what-fine-structure-breaks",
    title: "What Specifically Does Fine Structure Break?",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["fine-structure", "conceptual"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/fine-structure-introduction"],
  },
  question: {
    type: "conceptual",
    prompt: "Name the specific result from Hydrogen Energy Levels that fine structure modifies, and explain in one sentence why including electron spin makes this modification necessary.",
    placeholder: "Fine structure breaks the result that...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["l-independence", "independent of l", "same energy regardless of l", "doesn't depend on l"],
      ["spin-orbit", "L·S", "spin couples", "total angular momentum", "j"],
    ],
    incorrectFeedback: "Name the specific l-independence result from Hydrogen Energy Levels, then connect it to why L·S coupling breaks it.",
    partialFeedback: "Good — make sure both the specific broken result and the mechanism (spin-orbit coupling) are named explicitly.",
  },
  hints: [
    { text: "Hydrogen Energy Levels showed Eₙ depends only on n, not l — this is the result in question." },
    { text: "Spin-orbit coupling adds an energy term proportional to L·S." },
    { text: "Once L and S are coupled, states are better labeled by total angular momentum j=l±1/2, and different j (for the same n,l) get slightly different energies." },
  ],
  solution: {
    steps: [
      { description: "Fine structure breaks the exact l-independence of Eₙ established in Hydrogen Energy Levels." },
      { description: "Including electron spin introduces a spin-orbit coupling term proportional to L·S." },
      { description: "This forces the good quantum number to become total angular momentum j (from L and S combined, via Addition of Angular Momentum), and states of the same n but different j pick up slightly different energies — breaking the pure l-independence." },
    ],
    finalAnswer: "Fine structure breaks the exact l-independence of Eₙ, because spin-orbit coupling (∝L·S) makes the energy depend on total angular momentum j, not just n.",
  },
  explanation: {
    correctIdea: "This connects the lesson's abstract 'fine structure breaks something' claim to the one specific, previously-derived numerical result it actually modifies.",
    whyCorrect: "Matches the lesson's explicit statement that l-independence is the result fine structure breaks.",
    whyWrong: ["Vaguely stating 'fine structure changes the energy levels' without naming the specific l-independence result or the L·S mechanism misses the lesson's actual point."],
  },
};
