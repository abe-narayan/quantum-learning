import type { ConceptualProblem } from "@/lib/problems/types";

export const fourSGatesSandwiched: ConceptualProblem = {
  meta: {
    slug: "four-s-gates-sandwiched",
    title: "Four S Gates Sandwiched by H",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    difficulty: "advanced",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["circuits", "composition", "s-gate"],
    prerequisites: [
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
      "quantum-computing/qubits-and-quantum-states/quantum-gates",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "A friend built the circuit H, S, S, S, S, H (four S gates in a row, sandwiched by an H on each side) and claims it does absolutely nothing to any input state. Is this correct? Justify your answer using a fact from an earlier lesson in this course.",
    placeholder: "What do four S gates in a row equal? What about H applied twice?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["correct", "true", "right", "does nothing", "yes"],
      ["s⁴", "s to the fourth", "s^4", "four s gates", "s4=i", "s⁴=i"],
      ["h²=i", "h squared", "h is its own inverse", "hh=i", "h twice"],
    ],
    incorrectFeedback: "Recall the fact from Quantum Gates about how many times S must be applied to return to the identity, and whether H is its own inverse.",
    partialFeedback: "You have some of the pieces — state clearly what S⁴ equals and what H² equals, then combine them.",
  },
  hints: [
    { text: "From the Quantum Gates lesson: S⁴ = I exactly, not just up to phase." },
    { text: "So the four S gates in the middle collapse to the identity, leaving just H, I, H." },
    { text: "H is its own inverse (H² = I), so H · I · H simplifies further." },
  ],
  solution: {
    steps: [
      { description: "$S^4=I$ exactly (from Quantum Gates: two quarter-turns give a half-turn, $S^2=Z$; two more give a full turn, $S^4=I$)." },
      { description: "So the middle four S gates act as the identity: $H\\,S^4\\,H = H\\,I\\,H = H^2$." },
      { description: "$H$ is its own inverse, $H^2=I$, so the entire six-gate circuit is exactly the identity." },
    ],
    finalAnswer: "Correct — the friend is right. S⁴ = I exactly, so the circuit reduces to H·I·H = H² = I, the identity.",
  },
  explanation: {
    correctIdea: "S⁴ = I is an exact matrix identity (not merely 'up to global phase'), so four S gates in a row genuinely vanish, and H² = I finishes the cancellation.",
    whyCorrect: "Both facts (S⁴=I, H²=I) were already established directly in earlier lessons; this problem is just composing them, the same skill the HZH=X derivation practiced.",
    whyWrong: [
      "Assuming the claim must be false because six gates 'look like' they should do something — a circuit's net effect depends on the actual operator product, which can genuinely be the identity even with several gates in it.",
      "Confusing S⁴=I (exact) with a case that only holds up to global phase — here there's no phase subtlety needed at all, since S⁴ IS I exactly.",
    ],
  },
};
