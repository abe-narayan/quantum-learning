import type { NumericProblem } from "@/lib/problems/types";

export const areaLawMinimumBondDimension: NumericProblem = {
  meta: {
    slug: "area-law-minimum-bond-dimension",
    title: "Minimum Bond Dimension From an Area-Law Entropy Bound",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["area-law", "bond-dimension", "matrix-product-states", "gapped-hamiltonians"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "A family of gapped, local 1D Hamiltonians has ground states whose entanglement entropy across every spatial cut is bounded by exactly 2 bits, independent of system size n (an area law). A bond dimension chi can carry at most log2(chi) bits across a cut, so any MPS representing such a state needs log2(chi) at least as large as the entropy present there. Taking a cut that saturates the 2-bit bound, what is the minimum integer bond dimension chi it can be represented with?",
    inputHint: "a single integer",
  },
  answer: {
    type: "numeric",
    value: 4,
    tolerance: 0.01,
    incorrectFeedback:
      "The key identity: a bond dimension chi carries at most log2(chi) bits of entropy, saturated by chi equal Schmidt coefficients (the lesson's GHZ example saturates it at one bit). Set log2(chi) against the entropy bound, solve for chi, and take the smallest integer that satisfies it.",
    nearMisses: [
      {
        value: 2,
        feedback:
          "2 is the entropy bound in bits, and it is also the chi the lesson's GHZ example needed for one bit. Here chi has to satisfy log2(chi) >= 2, so chi = 2^2.",
      },
      {
        value: 3,
        feedback: "chi must satisfy log2(chi) >= 2, and log2(3) is about 1.58, short of the 2-bit bound. The smallest integer that clears it is 2^2.",
      },
    ],
  },
  hints: [
    { text: "A cut with bond dimension chi can carry at most log2(chi) bits of entropy, saturated when all chi Schmidt coefficients are equal, as in this lesson's GHZ worked example." },
    { text: "Two bits of entropy needs log2(chi) >= 2, i.e. chi >= 2^2." },
    { text: "Solve the inequality for the smallest integer chi. Note the bound is n-independent: the same for n=10 and for n=10,000, by the area law's own defining property." },
  ],
  solution: {
    steps: [
      { description: "An exact bond dimension chi lets a cut carry at most log2(chi) bits of entropy, saturated when the chi Schmidt coefficients are all equal to 1/chi (the same logic as GHZ's chi=2 giving exactly 1 bit in this lesson's worked example)." },
      { description: "Requiring $\\log_2(\\chi) \\geq 2$ gives $\\chi \\geq 2^2 = 4$, so the minimum integer bond dimension is $\\chi_{\\min}=4$." },
      { description: "This floor is n-independent by construction (the area law's defining property, not an extra assumption), so chi_min = 4 for n=10 and for n=10,000 alike. Note what it is: a lower bound on chi that does not grow with n, not a proof that chi stays bounded. Bounded entropy places no upper bound on Schmidt rank at all; what makes area-law ground states efficiently representable is the fast decay of their singular values, which lets a truncated MPS with chi = poly(n, 1/eps) reach accuracy eps." },
    ],
    finalAnswer: "chi_min = 4, unchanged as n grows from 10 to 10,000.",
  },
  explanation: {
    correctIdea: "S <= log2(chi) makes the entropy across a cut a floor under the bond dimension there, so an entropy bound that does not grow with n gives a minimum bond dimension that does not grow with n either: 2 bits forces chi >= 2^2 = 4.",
    whyCorrect: "A cut carrying S bits of entropy needs at least 2^S Schmidt coefficients, so 2 bits forces chi >= 4. The inequality runs in that direction only: entropy floors chi, it never caps it, and a bounded entropy leaves the exact Schmidt rank unbounded (a spectrum with one dominant weight and exponentially many tiny ones has O(1) entropy at full rank). The reason area-law ground states admit efficient MPS is not a cap on rank but the rapid decay of the singular values that get truncated away.",
    whyWrong: [
      "Assuming chi must grow with n by analogy to a generic volume-law state, whose entropy (and hence required chi) does grow with the smaller subsystem's size. That growth is what an area law rules out.",
      "Reading S <= log2(chi) backwards, as though a bounded entropy bounded chi from above. It does the opposite: it is entropy that sets the floor, and the exact bond dimension of an area-law state can still be full rank.",
    ],
  },
};
