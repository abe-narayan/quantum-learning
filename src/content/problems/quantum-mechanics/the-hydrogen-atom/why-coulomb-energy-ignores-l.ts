import type { ConceptualProblem } from "@/lib/problems/types";

export const whyCoulombEnergyIgnoresL: ConceptualProblem = {
  meta: {
    slug: "why-coulomb-energy-ignores-l",
    title: "Why Hydrogen's Energy Doesn't Depend on l",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["energy-levels", "degeneracy", "conceptual"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"],
  },
  question: {
    type: "conceptual",
    prompt: "The Radial Equation lesson showed l enters the effective potential explicitly, as a centrifugal term. Yet Eₙ doesn't depend on l at all. Is this a contradiction? Explain what's actually going on.",
    placeholder: "It is not a contradiction because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["not a contradiction", "no contradiction", "consistent"],
        missingFeedback:
          "Answer the question that was asked before you explain anything: is the situation actually inconsistent, or not?",
      },
      {
        phrases: ["specific to", "1/r", "Coulomb", "exact form", "special"],
        missingFeedback:
          "You have the verdict. Now say what it is about this one potential that makes the energy come out independent of l, and whether the same would happen for a different central potential.",
      },
    ],
    incorrectFeedback: "You answered that l 'cancels out', which is not what happens: l genuinely changes the radial equation and its solutions. Decide first whether the two facts actually conflict, then explain what is unusual about this particular potential that lets both hold at once.",
    partialFeedback: "You have answered the yes-or-no part. The other half is a restriction: say for which potentials the degeneracy survives, and give one where it does not.",
    modelAnswers: [
      "Not a contradiction. l really does change the effective potential and therefore the shape of the radial wavefunction; it just happens that for the exact 1/r Coulomb potential the resulting eigenvalue comes out the same for every l. That is special to that potential, not a general fact about central potentials.",
      "There is no contradiction here. The centrifugal term changes the wavefunction, but the Coulomb potential's exact form gives an extra degeneracy so the energy is l-independent. Any other central potential would show l dependence.",
    ],
  },
  hints: [
    { text: "l does change the radial equation, and the solutions R_nl really do differ from one l to the next. So the first fact is genuine." },
    { text: "Now ask a separate question about the same equation: does the eigenvalue it returns depend on l, or only the eigenfunction? Those are different things." },
    { text: "The eigenvalue's l-independence is an accident of one potential shape. Try the same question for a spherical well of finite depth and see whether it survives." },
  ],
  solution: {
    steps: [
      { description: "No contradiction: l does change V_eff(r), and correspondingly changes the shape of the radial wavefunction R_nl(r). That is why 2s and 2p look different." },
      { description: "What's special is that solving the full radial ODE for the exact 1/r Coulomb potential happens to produce the same energy eigenvalue E_n regardless of which l was used to define V_eff." },
      { description: "This is a specific, 'accidental' degeneracy of the 1/r potential. For a different central potential, such as a finite spherical well, the energy would depend on l." },
    ],
    finalAnswer: "Not a contradiction. l changes the wavefunction's shape via V_eff, but only the exact Coulomb potential's eigenvalue comes out l-independent, and that does not hold for central potentials in general.",
  },
  explanation: {
    correctIdea: "This distinguishes a general structural fact (energy eigenstates can be labeled by l, from Central Potentials) from a specific numerical coincidence of the Coulomb potential (the eigenvalue not depending on that label).",
    whyCorrect: "l genuinely changes the radial equation and so genuinely changes the wavefunction. What is special about the 1/r potential is that the resulting eigenvalue happens to come out the same for every allowed l, and that coincidence disappears the moment the potential departs from exact 1/r.",
    whyWrong: ["Claiming l has no physical effect at all ignores that it fully determines the radial wavefunction's shape, degeneracy count, and centrifugal barrier. Only the energy eigenvalue is unaffected."],
  },
};
