import type { NumericProblem } from "@/lib/problems/types";

export const decodingMwpmFourDefectMatchingWeight: NumericProblem = {
  meta: {
    slug: "decoding-mwpm-four-defect-matching-weight",
    title: "Minimum Matching Weight for a Four-Defect Syndrome",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/decoding-surface-codes",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["surface-codes", "decoding", "minimum-weight-perfect-matching", "graph-matching"],
    prerequisites: ["apex/fault-tolerance-frontiers/decoding-surface-codes"],
  },
  question: {
    type: "numeric",
    prompt:
      "Use the lesson's 3×3-vertex patch, with vertices N(row)(column) for row and column in {0,1,2}, one data qubit on each lattice edge, and half-edges hanging off the left column (column 0) and the right column (column 2) so those vertices can also match to the virtual boundary. Case 1 there had two defects, N01 and N11, one edge apart, matched at weight 1. Now a round of stabilizer measurement flags four defects: N01, N11, N12 and N22. Edge weight between two defects is the number of qubits on the shortest chain joining them; a defect's boundary edge is weighted by its shortest chain off the patch. What total weight does minimum-weight perfect matching return?",
    inputHint: "an integer (total matching weight)",
  },
  answer: {
    type: "numeric",
    value: 2,
    tolerance: 0,
    incorrectFeedback:
      "Enumerate the ways to pair four defects: three ways to split them into two defect-defect pairs, plus the options that send some of them to the boundary. Weight each pairing by the lattice distance between its members, add, and take the smallest total. The point of the exercise is that MWPM does not pick a pairing that looks natural on the page; it picks the one with the smallest sum.",
    nearMisses: [
      {
        value: 4,
        feedback:
          "4 is what the two alternative defect-defect pairings cost. N01 with N12 is two qubits and N11 with N22 is two more; N01 with N22 is three and N11 with N12 is one. Both add to 4, which is why the decoder rejects them in favour of the pairing that costs 2.",
      },
      {
        value: 3,
        feedback:
          "3 comes from pairing N01 with N11 for weight 1 and then sending N12 and N22 to the boundary for 1 each. That is a legal perfect matching, but N12 and N22 sit one edge apart, so pairing them costs 1 rather than 2.",
      },
      {
        value: 6,
        feedback:
          "6 is the cost of matching all four defects to the virtual boundary. Boundary edges are always available, but they are only chosen when they are cheaper than pairing, and here they are not.",
      },
      {
        value: 1,
        feedback:
          "1 is the weight of a single edge. A perfect matching has to give every one of the four defects a partner, so the total is a sum over two pairs, not one.",
      },
    ],
  },
  hints: [
    { text: "Draw the four defects on the 3×3 vertex grid and write the lattice distance between every pair. Three of the six distances come out to 1, so the cheap pairings are not unique and you will have to compare totals." },
    { text: "There are exactly three ways to split four defects into two defect-defect pairs. Compute the total weight of each, then check whether any boundary matching beats all three." },
    { text: "MWPM returns a matching, not an explanation. Two matchings of different weight are not two readings of the same syndrome: the cheaper one is the more probable error, and that is the whole basis of the decoder." },
  ],
  solution: {
    steps: [
      {
        description:
          "Lattice distances between the four defects: N01 to N11 is 1, N12 to N22 is 1, N11 to N12 is 1, N01 to N12 is 2, N11 to N22 is 2, and N01 to N22 is 3.",
      },
      {
        description:
          "The three defect-defect matchings are therefore {N01-N11, N12-N22} at $1+1=2$; {N01-N12, N11-N22} at $2+2=4$; and {N01-N22, N11-N12} at $3+1=4$.",
      },
      {
        description:
          "Boundary options do not improve on this. N12 and N22 sit in the right-hand column, so each is one half-edge from the boundary, while N01 and N11 sit in the middle column and are two qubits away. Pairing N01 with N11 and sending the other two to the boundary costs $1+1+1=3$; sending all four to the boundary costs $2+2+1+1=6$.",
      },
      {
        description:
          "The smallest total is 2, achieved by {N01-N11, N12-N22}: the decoder concludes that two single-qubit errors occurred, one on the edge joining N01 to N11 and one on the edge joining N12 to N22, and applies X on both.",
      },
    ],
    finalAnswer: "Total weight 2, from the matching {N01-N11, N12-N22}. Every alternative costs at least 3.",
  },
  explanation: {
    correctIdea:
      "Decoding is a minimisation, not a pattern match: each candidate pairing is scored by the total length of the error chains it postulates, and the decoder returns the cheapest score.",
    whyCorrect:
      "Two errors of length 1 are more probable than two of length 2, because chain probability falls off with chain length, and taking negative logarithms turns that probability ordering into the weight ordering the matching minimises. The pairing at weight 2 wins by a factor of two in chain length, which is why the decoder never has to guess here.",
    whyWrong: [
      "Reading the four defects as two vertical pairs because they line up on the page. Geometry on the drawing is not the weight; the weight is the number of qubits a chain has to touch.",
      "Reaching for the boundary because two defects sit near it. A boundary edge is only chosen when it is cheaper than a partner, and here the partner is closer.",
    ],
  },
};
