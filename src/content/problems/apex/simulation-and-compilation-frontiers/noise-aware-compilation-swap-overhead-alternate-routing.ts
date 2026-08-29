import type { NumericProblem } from "@/lib/problems/types";

const swapOverheadForDistance = (d: number) => 2 * (d - 1);

const distances = [1, 1, 1, 3, 2];
const totalSwaps = distances.reduce((sum, d) => sum + swapOverheadForDistance(d), 0);
const totalCnotEquivalent = 5 + totalSwaps * 3;

export const noiseAwareCompilationSwapOverheadAlternateRouting: NumericProblem = {
  meta: {
    slug: "noise-aware-compilation-swap-overhead-alternate-routing",
    title: "SWAP Overhead for a Different Set of Interactions",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["compilation", "routing", "swap-overhead", "transpilation"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"],
  },
  question: {
    type: "numeric",
    prompt:
      "Same 4-qubit linear-chain device (P0-P1-P2-P3, adjacent-only couplers) and the same identity mapping q_i -> P_i as the lesson, but a circuit needing a different set of five interactions: (q0,q1), (q1,q2), (q2,q3), (q0,q3), (q1,q3). Using swapOverheadForDistance(d) = 2(d-1) for each non-adjacent pair, how many total SWAP gates must be inserted?",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value: totalSwaps,
    tolerance: 0,
    incorrectFeedback:
      "First find each pair's chain distance under the identity mapping (|i-j| in physical index), then apply 2(d-1) only to the pairs that aren't already adjacent (d=1 needs zero SWAPs), and sum.",
    nearMisses: [
      {
        value: distances.reduce((sum, d) => sum + (d - 1), 0),
        feedback:
          "You counted d-1 SWAPs per pair rather than 2(d-1). The factor of two is the return trip: after the gate, the qubits have to be swapped back so the rest of the circuit still sees the original mapping.",
      },
      {
        value: distances.reduce((sum, d) => sum + 2 * d, 0),
        feedback: "Using 2d instead of 2(d-1) charges a SWAP for the final adjacency too, and it wrongly bills the three already-adjacent pairs.",
      },
      {
        value: distances.filter((d) => d > 1).reduce((sum, d) => sum + 2 * d, 0),
        feedback: "You skipped the adjacent pairs correctly but used 2d rather than 2(d-1). Bridging a distance-d gap takes d-1 hops, not d.",
      },
    ],
  },
  hints: [
    { text: "Three of the five pairs are already adjacent under the identity mapping: (q0,q1), (q1,q2), (q2,q3) all have distance 1, so they contribute 0 SWAPs each." },
    { text: "(q0,q3) spans the entire chain: distance 3. (q1,q3) spans distance 2." },
    { text: "Apply 2(d-1) to each of those two: 2(3-1)=4 for (q0,q3), and 2(2-1)=2 for (q1,q3), then add." },
  ],
  solution: {
    steps: [
      { description: "Distances under the identity mapping: d(0,1)=1, d(1,2)=1, d(2,3)=1, d(0,3)=3, d(1,3)=2." },
      { description: "The three distance-1 pairs are already adjacent and need 2(1-1)=0 SWAPs each." },
      { description: "(q0,q3) at d=3 needs 2(3-1)=4 SWAPs; (q1,q3) at d=2 needs 2(2-1)=2 SWAPs." },
      { description: `Total: $0+0+0+4+2 = ${totalSwaps}$ SWAP gates (equivalent to $5 + ${totalSwaps}\\times3 = ${totalCnotEquivalent}$ CNOT-equivalent two-qubit operations once the 5 logical gates are included).` },
    ],
    finalAnswer: `${totalSwaps} SWAP gates`,
  },
  explanation: {
    correctIdea:
      "Only the pairs that are NOT already physically adjacent under the chosen mapping contribute SWAP overhead, and the amount each contributes depends purely on how far apart they sit on the chain, exactly the same 2(d-1) formula the lesson's own five-interaction example used.",
    whyCorrect:
      "This is the identical method the lesson applied, run on a different set of required interactions: (q0,q3) is the chain's worst-case pair (the two endpoints), so it dominates the total even though it's only one of five interactions.",
    whyWrong: [
      "Counting d-1 SWAPs per pair instead of 2(d-1) halves the total to 3: the formula is doubled because each qubit walked toward its partner has to be walked back afterwards, or the mapping the rest of the circuit assumes is destroyed.",
      "Using d instead of d-1 in the formula (i.e. 2d) overstates the cost: bridging a gap of distance d only requires walking d-1 intermediate steps each way, not d.",
    ],
  },
};
