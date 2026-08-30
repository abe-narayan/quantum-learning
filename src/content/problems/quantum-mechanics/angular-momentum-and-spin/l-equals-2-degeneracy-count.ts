import type { NumericProblem } from "@/lib/problems/types";

/** The shell runs l = 0, 1, ..., n-1, and each l carries 2l+1 values of m. */
const n = 3;
const value = Array.from({ length: n }, (_, l) => 2 * l + 1).reduce((a, b) => a + b, 0);

export const lEquals2DegeneracyCount: NumericProblem = {
  meta: {
    slug: "l-equals-2-degeneracy-count",
    title: "From the Commutation Relations to Hydrogen's Shell Degeneracy",
    course: "angular-momentum-and-spin",
    lesson: "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["capstone", "degeneracy", "synthesis"],
    prerequisites: ["quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"],
  },
  question: {
    type: "numeric",
    prompt:
      "Trace this course's chain to its end. The commutation relations $[J_i,J_j]=i\\hbar\\varepsilon_{ijk}J_k$ alone force each $l$ to carry a fixed number of $m$ values. Hydrogen adds one further fact from outside the algebra: its Coulomb energy does not depend on $l$, so a shell of principal quantum number $n$ collects every $l$ from 0 up to $n-1$ at the same energy. For $n=3$, whose top rung is $l=2$, how many degenerate orbital states does the shell hold? Ignore spin.",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback:
      "One of the two steps went missing. The algebra fixes how many states sit at a single l; the Coulomb potential's l-independence is what licenses adding those counts across every l the shell contains. Do both, in that order.",
    nearMisses: [
      {
        value: 5,
        feedback:
          "5 is the l=2 rung on its own, the largest single contribution. It is the answer to 'how many states at this l', not 'how many in the shell', and the shell collects the smaller l values too.",
      },
      {
        value: 3,
        feedback:
          "3 counts the allowed values of l rather than the states. Each l carries a whole multiplet of its own, and only l=0 carries just one.",
      },
      {
        value: 18,
        feedback:
          "18 doubles the count for the two spin orientations. That is the right move for the full shell capacity, but the prompt asks for orbital states alone.",
      },
      {
        value: 27,
        feedback:
          "27 is n³. Summing the first n odd numbers gives n², and it is worth checking that on the small cases: 1, then 1+3, then 1+3+5.",
      },
    ],
  },
  hints: [
    {
      text: "Two separate facts are doing work here, and only one of them comes from the commutation relations. Say which part of the count the algebra fixes on its own, and which part needs something the Coulomb potential contributes.",
    },
    {
      text: "The algebra fixes how many states sit at one fixed value of $l$. The l-independence of the energy is what lets you add those counts together across the shell instead of treating each $l$ as its own level.",
    },
    {
      text: "Write out the allowed values of $l$ for $n=3$, put each one's multiplet size beside it, and add the column. The numbers in that column come out as the odd integers in order, which is worth noticing.",
    },
  ],
  solution: {
    steps: [
      {
        description:
          "The commutation relations, via the ladder-operator argument, force the spectrum of $J_z$ at fixed $l$ to run from $-l$ to $+l$ in integer steps, giving $2l+1$ states. This part is pure algebra and holds for any system at all.",
      },
      {
        description:
          "Hydrogen's Coulomb energy $E_n=-13.6\\,\\mathrm{eV}/n^2$ carries no $l$, so all of $l=0,1,2$ sit at the same energy for $n=3$. That degeneracy is a property of the $1/r$ potential, not of the algebra.",
      },
      {
        description: "Summing the multiplet sizes over the shell gives the total.",
        latex: "\\sum_{l=0}^{n-1}(2l+1) = 1+3+5 = 9 = n^2",
      },
    ],
    finalAnswer: "9 orbital states, which is $n^2$ for $n=3$.",
  },
  explanation: {
    correctIdea:
      "The n² degeneracy of a hydrogen shell is two results stacked: an algebraic one that fixes 2l+1 at each l, and a potential-specific one that puts every l at the same energy so those counts can be added.",
    whyCorrect:
      "Summing the first n odd numbers gives n² exactly, which is why hydrogen's shells hold 1, 4 and 9 orbital states. Pull out the l-independence and the sum stops being meaningful: each l would be its own energy level with its own 2l+1 degeneracy, and no shell total would exist to ask about.",
    whyWrong: [
      "Reporting 5 stops at the top rung and treats the largest multiplet as the whole shell, which is what happens when the l-independence step is skipped.",
      "Doubling to 18 counts spin. Spin multiplies the orbital count by 2 and is what makes the periodic table's shells hold 2n² electrons, but the prompt asks for the orbital count itself.",
    ],
  },
};
