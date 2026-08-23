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
      ["phase", "diagonal", "multiplies by", "doesn't change magnitude"],
      ["probability", "\\|amplitude\\|", "unchanged", "same measurement"],
    ],
    incorrectFeedback: "Recall U_C(γ)|z⟩=e^{-iγ·(cut count)}|z⟩ — what kind of number is e^{-iγ·anything}, in terms of magnitude?",
    partialFeedback: "Good — now connect this directly to the Born rule and why probabilities can't change.",
  },
  hints: [
    { text: "U_C(γ)|z⟩ = e^{-iγ·(cut count of z)}|z⟩ — a phase factor times the original amplitude." },
    { text: "Every phase factor e^{iθ} has magnitude exactly 1." },
    { text: "Multiplying an amplitude by a magnitude-1 number doesn't change its squared magnitude — hence not its measurement probability." },
  ],
  solution: {
    steps: [
      { description: "U_C multiplies each basis state's amplitude by a phase factor e^{-iγ·(cut count)}, which has magnitude exactly 1." },
      { description: "Multiplying an amplitude by a magnitude-1 phase leaves |amplitude|² unchanged." },
      { description: "Since measurement probability is |amplitude|², every outcome's probability — and hence the expected cut size — is unchanged." },
    ],
    finalAnswer: "U_C only multiplies amplitudes by phases (magnitude 1), so every measurement probability, and hence the expected cut size, stays exactly the same as before applying it.",
  },
  explanation: {
    correctIdea: "A diagonal unitary built purely from phases can never change measurement statistics on its own — only relative phases between different components, which only matter once something else (the mixer) lets them interfere.",
    whyCorrect: "This is precisely why the mixer is a structurally necessary second ingredient, not an optional add-on.",
    whyWrong: ["Assuming U_C somehow 'boosts' good colorings misunderstands that it only tags them with a phase, doing nothing observable until the mixer converts that phase difference into an amplitude difference."],
  },
};
