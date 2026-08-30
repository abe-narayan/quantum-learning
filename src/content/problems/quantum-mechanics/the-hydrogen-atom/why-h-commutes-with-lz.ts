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
      {
        phrases: ["kinetic", "p squared", "momentum", "rotationally symmetric", "rotationally invariant"],
        missingFeedback:
          "The Hamiltonian has two pieces and the argument has to cover both separately. Start with the first one and say why turning the coordinate frame leaves it alone.",
      },
      {
        phrases: ["potential", "V(r)", "depends only on r", "distance"],
        missingFeedback:
          "You have one piece. Now do the other: say what it depends on, and why that dependence is blind to a rotation.",
      },
      {
        phrases: ["generates rotation", "rotation about z", "preserves"],
        missingFeedback:
          "You have said both pieces are unmoved by turning the frame. Now connect that to the operator in question: say what Lz has to do with turning things, which is what converts invariance into a vanishing commutator.",
      },
    ],
    incorrectFeedback: "You argued that H as a whole is unchanged by rotations and stopped, which is the sum-level claim the question asks you to unpack. Use [A, B+C] = [A,B] + [A,C], then handle the two summands one at a time, giving each its own reason.",
    partialFeedback: "Address both pieces explicitly, since commutation with a sum requires commutation with each term.",
    modelAnswers: [
      "The kinetic term is built from p squared, which is rotationally invariant: turning the frame does not change it. The potential V(r) depends only on r, the distance from the origin, so a rotation about z leaves it alone too. Lz generates rotation about z, so each piece separately commutes with it, and hence so does the sum.",
      "Both pieces are rotationally symmetric on their own. The momentum-squared operator is unchanged under any rotation, and the potential depends only on distance, so neither notices a rotation about z, which is exactly what Lz generates.",
    ],
  },
  hints: [
    { text: "A commutator with a sum splits into a sum of commutators. Write that identity down and apply it to H." },
    { text: "Take the second piece first. It is a function of one scalar quantity; ask whether turning the system around the z axis changes that quantity." },
    { text: "Now the first piece. It is built from the three components of p in the same symmetric way that r² is built from the three coordinates, so ask what a turn does to it." },
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
    correctIdea: "The full argument requires two separate rotational-invariance claims, not one. That is the content of the Central Potentials lesson's derivation, not a shortcut.",
    whyCorrect: "L_z generates rotations about the z axis, and both terms of H are unchanged by such a rotation: the radial kinetic and potential pieces do not refer to the azimuthal angle at all, and the angular piece is built from L², which commutes with each of its own components.",
    whyWrong: ["Asserting '[H,Lz]=0 because H is the energy and energy is conserved' skips the mechanism and does not generalize to explaining why L² also commutes."],
  },
};
