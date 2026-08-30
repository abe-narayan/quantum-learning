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
      {
        phrases: ["l-independence", "independent of l", "same energy regardless of l", "doesn't depend on l"],
        missingFeedback:
          "Name the specific earlier result that gets modified. It is a statement about what E_n does and does not vary with.",
      },
      {
        phrases: ["spin-orbit", "spin orbit", "l dot s", "spin couples", "couples the spin", "coupling of spin", "total angular momentum"],
        missingFeedback:
          "You have the result that breaks. Now say what including spin introduces, and what quantity the energy comes to depend on instead.",
      },
    ],
    incorrectFeedback: "You named 'fine structure' as the answer, which is the question's own word. Two specific things are wanted: the earlier formula whose degeneracy is lifted, quoted precisely enough that someone could point to it, and the term in the Hamiltonian that lifts it.",
    partialFeedback: "One of the two is there. Supply the other: either quote the earlier formula precisely, or name the interaction term that has to be added once the electron carries an intrinsic angular momentum of its own.",
    modelAnswers: [
      "It breaks the l-independence of E_n: in the plain Coulomb result the energy is the same regardless of l. Once you include spin, spin-orbit coupling adds a term proportional to L dot S, so the energy depends on total angular momentum rather than just n.",
      "Fine structure modifies the result that the energy is independent of l. Including electron spin brings in spin orbit coupling, which couples the spin to the orbital motion and splits the levels.",
    ],
  },
  hints: [
    { text: "Go back to the Hydrogen Energy Levels formula and read off which quantum numbers appear in it and which do not." },
    { text: "Adding spin to the electron gives the atom a second angular momentum. Ask what new term in the Hamiltonian a pair of angular momenta in the same system makes possible." },
    { text: "That term's value depends on how the two are oriented relative to each other. Say which quantum number now labels the states, and what happens to two states that share n and l but differ in it." },
  ],
  solution: {
    steps: [
      { description: "Fine structure breaks the exact l-independence of Eₙ established in Hydrogen Energy Levels." },
      { description: "Including electron spin introduces a spin-orbit coupling term proportional to L·S." },
      { description: "This forces the good quantum number to become total angular momentum j (from L and S combined, via Addition of Angular Momentum), and states of the same n but different j pick up slightly different energies, which breaks the pure l-independence." },
    ],
    finalAnswer: "Fine structure breaks the exact l-independence of Eₙ, because spin-orbit coupling (∝L·S) makes the energy depend on total angular momentum j, not just n.",
  },
  explanation: {
    correctIdea: "This connects the lesson's abstract 'fine structure breaks something' claim to the one specific, previously-derived numerical result it actually modifies.",
    whyCorrect: "Spin-orbit coupling introduces L·S, which is not diagonal in l and s separately but is diagonal in j. So the energy stops being a function of n alone and becomes a function of n and j, which is precisely the loss of l-independence.",
    whyWrong: ["Vaguely stating 'fine structure changes the energy levels' without naming the specific l-independence result or the L·S mechanism misses the lesson's actual point."],
  },
};
