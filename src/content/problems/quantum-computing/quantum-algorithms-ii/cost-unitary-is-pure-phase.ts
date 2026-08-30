import type { ConceptualProblem } from "@/lib/problems/types";

export const costUnitaryIsPurePhase: ConceptualProblem = {
  meta: {
    slug: "cost-unitary-is-pure-phase",
    title: "Why the Cost Unitary Alone Can't Improve the Measured Cut",
    course: "quantum-algorithms-ii",
    lesson: "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["qaoa"],
    prerequisites: ["quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why applying only the cost unitary U_C(γ) (no mixer) leaves the expected cut size completely unchanged from the uniform superposition's baseline.",
    placeholder: "Think about what U_C does to each basis state's amplitude...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["phase factor", "pure phase", "only a phase", "just a phase", "only phases", "just phases", "by a phase", "phases only", "diagonal", "multiplies by", "magnitude 1", "magnitude one", "unit magnitude", "modulus 1", "modulus one", "doesn't change magnitude", "same magnitude"],
        missingFeedback:
          "Say what U_C actually does to each basis state's amplitude. Be precise about what it alters and what it leaves alone.",
      },
      // Bare "probabilit" accepted "so the probabilities change", the exact
      // misconception this question exists to catch, and the bare "doesn't
      // change" forms were already satisfied by the first group's "doesn't
      // change magnitude", collapsing two required ideas into one.
      {
        phrases: ["|amplitude|", "amplitude squared", "squared magnitude", "magnitude squared", "born rule", "probabilities unchanged", "probability unchanged", "probabilities are unchanged", "probabilities don't change", "probabilities do not change", "probabilities stay", "same probabilit", "same measurement", "measurement statistics", "statistics unchanged", "expected cut is unchanged", "stays exactly the same", "stay exactly the same"],
        missingFeedback:
          "You have said what happens to the amplitudes. Now connect that to what a measurement is able to see, and therefore to the average you were asked about.",
      },
    ],
    incorrectFeedback: "You reasoned that the cost operator 'encodes the problem, so it must do something', which is true only once a mixer follows it. Work out what U_C(γ) does to one basis state |z⟩, and then ask which feature of the resulting coefficient a measurement is sensitive to.",
    partialFeedback: "Now finish the argument: connect the size of the factor U_C applies to what a measurement can see.",
    modelAnswers: [
      "U_C is diagonal and multiplies each basis state by a phase of magnitude one. Probabilities come from the amplitude squared, so all the measurement statistics are unchanged and the expected cut is unchanged too.",
      "All the cost unitary does is attach a phase to each amplitude; it does not change any magnitude. Since the Born rule only sees the squared magnitude, the same probabilities come out and the average cut stays exactly the same.",
    ],
  },
  hints: [
    { text: "Apply U_C(γ) to one computational basis state |z⟩. What kind of number multiplies it, and does the state's direction in the basis change?" },
    { text: "What is the absolute value of e^{iθ} for any real θ?" },
    { text: "Recall how measurement outcomes get their likelihoods from the coefficients. Which feature of each coefficient enters that rule, and did the factor from the first rung alter it?" },
  ],
  solution: {
    steps: [
      { description: "U_C multiplies each basis state's amplitude by a phase factor e^{-iγ·(cut count)}, which has magnitude exactly 1." },
      { description: "Multiplying an amplitude by a magnitude-1 phase leaves |amplitude|² unchanged." },
      { description: "Since measurement probability is |amplitude|², every outcome's probability, and hence the expected cut size, is unchanged." },
    ],
    finalAnswer: "U_C only multiplies amplitudes by phases (magnitude 1), so every measurement probability, and hence the expected cut size, stays exactly the same as before applying it.",
  },
  explanation: {
    correctIdea: "A diagonal unitary built purely from phases can never change measurement statistics on its own. It changes only relative phases between components, which start to matter once something else (the mixer) lets them interfere.",
    whyCorrect: "This is precisely why the mixer is a structurally necessary second ingredient, not an optional add-on.",
    whyWrong: ["Assuming U_C somehow 'boosts' good colorings misunderstands that it only tags them with a phase, doing nothing observable until the mixer converts that phase difference into an amplitude difference."],
  },
};
