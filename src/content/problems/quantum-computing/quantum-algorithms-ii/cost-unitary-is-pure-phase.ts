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
      ["phase factor", "pure phase", "only a phase", "just a phase", "only phases", "just phases", "by a phase", "phases only", "diagonal", "multiplies by", "magnitude 1", "magnitude one", "unit magnitude", "modulus 1", "modulus one", "doesn't change magnitude", "same magnitude"],
      ["probabilit", "|amplitude|", "amplitude squared", "squared magnitude", "magnitude squared", "born rule", "unchanged", "same measurement", "measurement statistics", "stay the same", "stays the same", "don't change", "do not change", "doesn't change", "does not change"],
    ],
    incorrectFeedback: "Work out what U_C(γ) does to a single basis state |z⟩ first, then ask which feature of an amplitude a measurement can actually see.",
    partialFeedback: "Good. Now finish the argument: connect the size of the factor U_C applies to what a measurement can actually see.",
  },
  hints: [
    { text: "Apply U_C(γ) to one computational basis state |z⟩. What kind of number multiplies it, and does the state's direction in the basis change?" },
    { text: "What is the absolute value of e^{iθ} for any real θ?" },
    { text: "Recall how measurement outcomes get their likelihoods from amplitudes. Which feature of each amplitude enters that rule, and did the factor from step 1 alter it?" },
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
