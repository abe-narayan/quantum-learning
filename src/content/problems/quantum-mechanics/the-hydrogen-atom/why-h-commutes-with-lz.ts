import type { ConceptualProblem } from "@/lib/problems/types";

export const whyHCommutesWithLz: ConceptualProblem = {
  meta: {
    slug: "why-h-commutes-with-lz",
    title: "Why the Full Hamiltonian Commutes With Lz",
    course: "the-hydrogen-atom",
    lesson: "quantum-mechanics/the-hydrogen-atom/central-potentials",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["central-potential", "conceptual"],
    prerequisites: ["quantum-mechanics/the-hydrogen-atom/central-potentials"],
  },
  question: {
    type: "conceptual",
    prompt: "H = p²/2m + V(r) has two pieces. Explain why EACH piece separately commutes with Lz, rather than just asserting the sum does.",
    placeholder: "The kinetic term commutes with Lz because... The potential term commutes with Lz because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["kinetic", "p^2", "p²", "rotationally symmetric", "rotationally invariant"],
      ["potential", "V(r)", "depends only on r", "distance"],
      ["generates rotation", "rotation about z", "preserves"],
    ],
    incorrectFeedback: "Address the kinetic term p²/2m and the potential term V(r) as two separate arguments, not one combined claim.",
    partialFeedback: "Good — make sure both pieces are addressed explicitly, since commutation with a sum requires commutation with each term.",
  },
  hints: [
    { text: "[A, B+C] = [A,B] + [A,C] — commuting with a sum requires commuting with each term separately." },
    { text: "V(r) depends only on distance, which rotation preserves." },
    { text: "p² = px²+py²+pz² is built symmetrically from momentum components, the same way r² is built from position — rotation preserves total momentum magnitude too." },
  ],
  solution: {
    steps: [
      { description: "[Lz, A+B] = [Lz,A] + [Lz,B], so each piece of H must be checked separately." },
      { description: "V(r) depends only on distance r, and rotation about any axis preserves distance from the origin, so [Lz,V(r)]=0." },
      { description: "p²=px²+py²+pz² is built the same rotationally-symmetric way from momentum as r² is from position, so rotation preserves it too: [Lz,p²]=0." },
      { description: "Both pieces commute with Lz individually, so their sum H does too." },
    ],
    finalAnswer: "Both p²/2m and V(r) are individually rotationally invariant, so each commutes with Lz (which generates rotation), and hence so does their sum H.",
  },
  explanation: {
    correctIdea: "The full argument requires two separate rotational-invariance claims, not one — this is the actual content of the Central Potentials lesson's derivation, not a shortcut.",
    whyCorrect: "This matches the lesson's Mathematical Development section exactly, addressing both terms of H individually.",
    whyWrong: ["Asserting '[H,Lz]=0 because H is the energy and energy is conserved' skips the actual mechanism and doesn't generalize to explaining why L² also commutes."],
  },
};
