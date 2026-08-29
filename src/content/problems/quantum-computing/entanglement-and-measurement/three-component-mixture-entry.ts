import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix, computationalBasisDensityMatrix, convexCombination } from "@/lib/quantum/densityMatrix";
import type { NumericProblem } from "@/lib/problems/types";

const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
const rho = convexCombination([
  { probability: 0.5, density: computationalBasisDensityMatrix(1, 0) },
  { probability: 0.25, density: computationalBasisDensityMatrix(1, 1) },
  { probability: 0.25, density: pureStateDensityMatrix(plus) },
]);
const entry = rho.get(0, 1).re;

export const threeComponentMixtureEntry: NumericProblem = {
  meta: {
    slug: "three-component-mixture-entry",
    title: "An Entry of a Three-Component Mixture",
    course: "entanglement-and-measurement",
    lesson: "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["mixed-states", "convex-combination"],
    prerequisites: ["quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures"],
  },
  question: {
    type: "numeric",
    prompt:
      "A qubit is prepared as |0⟩ with probability 0.5, |1⟩ with probability 0.25, and |+⟩ with probability 0.25. Find ρ's (0,1) entry (the coefficient of |0⟩⟨1|).",
    inputHint: "as a decimal",
  },
  answer: {
    type: "numeric",
    value: entry,
    tolerance: 0.005,
    incorrectFeedback: "Only |+⟩⟨+| contributes a nonzero (0,1) entry among the three components — |0⟩⟨0| and |1⟩⟨1| are both diagonal.",
    nearMisses: [
      { value: 0.5, feedback: "0.5 is |+⟩⟨+|'s own (0,1) entry. In the mixture it enters weighted by its 0.25 probability." },
      { value: 0.25, feedback: "0.25 is the probability of the |+⟩ component. It multiplies that component's (0,1) entry, which is 0.5, rather than being the answer itself." },
      { value: 0, feedback: "A zero (0,1) entry would mean no coherence at all. The |+⟩ component carries off-diagonal weight, and mixing dilutes it without removing it." },
    ],
  },
  hints: [
    { text: "|0⟩⟨0| and |1⟩⟨1| are diagonal — they contribute 0 to the (0,1) entry." },
    { text: "Only the |+⟩⟨+| term, weighted by its probability, contributes to (0,1)." },
    { text: "|+⟩⟨+|'s (0,1) entry is 0.5; scale it by the |+⟩ component's probability, 0.25." },
  ],
  solution: {
    steps: [
      { description: "Only the $0.25\\,|+\\rangle\\langle+|$ term has a nonzero (0,1) entry among the three components." },
      { description: "$|+\\rangle\\langle+|$'s (0,1) entry is 0.5, so this term contributes $0.25\\times0.5$.", latex: "0.25\\times0.5 = 0.125" },
    ],
    finalAnswer: "ρ's (0,1) entry is 0.125.",
  },
  explanation: {
    correctIdea: "Only non-diagonal pure-state components contribute off-diagonal terms to a mixture, weighted by their probability.",
    whyCorrect: "|0⟩⟨0| and |1⟩⟨1| are exactly diagonal, so only the |+⟩⟨+| term, scaled by 0.25, survives in the (0,1) position.",
    whyWrong: ["Using 0.5 directly forgets to weight |+⟩⟨+|'s own (0,1) entry by its 0.25 probability in the mixture."],
  },
};
