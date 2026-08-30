import type { NumericProblem } from "@/lib/problems/types";

/** Nodes fix the quantum number; the quantum number fixes the energy. */
const nodes = 6;
const n = nodes + 1;
const value = n ** 2;

export const infiniteWellNodeCount: NumericProblem = {
  meta: {
    slug: "infinite-well-node-count",
    title: "From a Node Count to an Energy",
    course: "wave-mechanics",
    lesson: "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["infinite-square-well", "eigenstates", "energy-levels"],
    prerequisites: ["quantum-mechanics/wave-mechanics/the-infinite-square-well"],
  },
  question: {
    type: "numeric",
    prompt:
      "An infinite-well eigenstate is sketched and found to cross zero 6 times strictly inside the well, not counting the two walls. Its energy is what multiple of that well's ground-state energy?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.001,
    incorrectFeedback:
      "Two steps have to happen in order, and skipping either one lands somewhere plausible. The node count identifies which eigenstate this is; only then does the level formula convert that label into an energy, and it does not do so linearly.",
    nearMisses: [
      {
        value: 36,
        feedback:
          "36 squares the node count itself. The walls are forced zeros too, so a state crossing zero 6 times inside is not the 6th eigenstate.",
      },
      {
        value: 7,
        feedback:
          "7 is the quantum number, which is the right halfway point. The energy is not proportional to it, so one step remains.",
      },
      { value: 6, feedback: "6 is the node count handed back. Neither of the two steps has been taken yet." },
      {
        value: 64,
        feedback:
          "64 comes from n=8, which counts the walls as internal nodes as well. Only the crossings strictly between them were counted.",
      },
    ],
  },
  hints: [
    {
      text: "A sine that vanishes at both walls has its zeros evenly spaced across the well, and two of those zeros are the walls themselves. That relationship is what turns a node count into a quantum number.",
    },
    {
      text: "Work out the quantum number first. Then recall what the level formula attaches to it, and note that the ground state is the same formula at n=1.",
    },
    {
      text: "Forming the ratio against the ground state cancels the width and every constant, leaving a pure number built from the two quantum numbers. Check what power the formula puts on them.",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "$\\sin(n\\pi x/L)$ vanishes at $x = 0, L/n, 2L/n, \\ldots, L$: that is $n+1$ zeros, of which two are the walls. So a state with 6 internal nodes has $n-1 = 6$.",
        latex: "n = 7",
      },
      {
        description: "Energies go as the square of the quantum number, and the ground state is the same expression at $n=1$.",
        latex: "\\frac{E_7}{E_1} = \\frac{7^2\\pi^2\\hbar^2/(2mL^2)}{1^2\\pi^2\\hbar^2/(2mL^2)} = 7^2",
      },
      { description: "Every constant, and the width with them, cancels in the ratio." },
    ],
    finalAnswer: "$49$ times the ground-state energy.",
  },
  explanation: {
    correctIdea:
      "A node count is a complete label for an infinite-well eigenstate: it fixes n, and n fixes everything else about the state, including an energy that grows as its square.",
    whyCorrect:
      "Counting nodes is how the shape of a numerically-computed eigenstate is identified in practice, since the solver returns a vector of numbers rather than a quantum number. The n² growth is then what makes highly excited states so much stiffer to resolve on a grid: each successive level adds more oscillation into the same width.",
    whyWrong: [
      "Reading the node count as n directly forgets that the two walls are zeros as well, which puts the state one rung too low.",
      "Reporting 7 stops at the quantum number. The prompt asks for an energy, and energy is not linear in n.",
    ],
  },
};
