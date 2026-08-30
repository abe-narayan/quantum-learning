import type { NumericProblem } from "@/lib/problems/types";

const swapsPerIteration = 4;
const cnotsPerSwap = 3;
const cnotFidelity = 0.995;
const cnotsPerIteration = swapsPerIteration * cnotsPerSwap;
/** Largest iteration count whose routing overhead alone still survives with probability >= 1/2. */
const value = Math.floor(Math.log(0.5) / Math.log(cnotFidelity) / cnotsPerIteration);

export const totalSwaps500Iterations: NumericProblem = {
  meta: {
    slug: "total-swaps-500-iterations",
    title: "How Many VQE Iterations the Routing Overhead Survives",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    difficulty: "advanced",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["hybrid-workflows", "routing", "noise"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"],
  },
  question: {
    type: "numeric",
    prompt:
      "A VQE run is scheduled for 500 iterations. Each iteration pays 4 SWAP gates of routing overhead, each SWAP compiles to 3 CNOTs, and each CNOT succeeds with probability 0.995. Counting the routing overhead alone and nothing else in the circuit, what is the largest number of iterations whose accumulated routing still survives with probability 0.5 or better?",
    inputHint: "a whole number of iterations",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0,
    incorrectFeedback:
      "Three multiplications stack here before any probability is taken: iterations to SWAPs, SWAPs to CNOTs, and then each CNOT contributing a factor of 0.995. Assemble the per-iteration CNOT count first, raise the fidelity to the total, and only then solve for the iteration count.",
    nearMisses: [
      {
        value: value + 1,
        feedback:
          "One iteration too many. The exact solution is not a whole number, and at this count the routing has already dropped under one half, so the largest iteration count that still qualifies is the one below.",
      },
      {
        value: Math.floor(Math.log(0.5) / Math.log(cnotFidelity) / swapsPerIteration),
        feedback:
          "Each SWAP has been counted as a single two-qubit gate. On hardware without a native SWAP it decomposes into three CNOTs, so the routing costs three times the two-qubit operations this assumes.",
      },
      {
        value: Math.round(Math.log(0.5) / Math.log(cnotFidelity)),
        tolerance: 2,
        feedback:
          "That is the total CNOT budget rather than an iteration count. Divide it by the number of CNOTs one iteration spends on routing.",
      },
      {
        value: 500,
        feedback:
          "That is the schedule the optimizer asked for, which is exactly what this calculation is checking. Routing overhead alone exhausts the fidelity budget long before the loop finishes.",
      },
      {
        value: swapsPerIteration * 500,
        feedback:
          "That is the total SWAP count for the full run. It is a real quantity, but the question asks how far the run gets before its routing overhead alone costs half the success probability.",
      },
    ],
  },
  hints: [
    {
      text: "Nothing here is a probability until the last step. Start by counting how many two-qubit operations one iteration spends purely on moving qubits around, remembering what a SWAP costs on hardware that has no native one.",
    },
    {
      text: "Every one of those operations contributes the same independent factor, so N iterations give that factor raised to a power you can now write down. Set it against the target and take logarithms to bring N down from the exponent.",
    },
    {
      text: "Solve for N, then round with the direction of the inequality in mind: the question asks for the last iteration still at or above one half, not the first one below.",
    },
  ],
  solution: {
    steps: [
      {
        description: "Count the routing operations per iteration, at three CNOTs per SWAP.",
        latex: "4\\ \\text{SWAP} \\times 3\\ \\text{CNOT/SWAP} = 12\\ \\text{CNOT per iteration}",
      },
      {
        description: "All of them are independent, so their fidelities multiply across N iterations.",
        latex: "0.995^{\\,12N} \\ge \\tfrac12 \\;\\Longleftrightarrow\\; N \\le \\frac{\\ln 0.5}{12\\,\\ln 0.995} \\approx 11.52",
      },
      {
        description:
          "Rounding down gives 11 iterations. The full 500-iteration schedule spends 6000 CNOTs on routing alone, which at this fidelity survives with probability around 10⁻¹³.",
      },
    ],
    finalAnswer: "11 iterations",
  },
  explanation: {
    correctIdea:
      "A hybrid loop pays its routing overhead once per iteration, so a per-gate error rate that looks tolerable inside one circuit is multiplied by the loop count before it reaches the answer. The overhead is what makes variational workloads expensive, not the ansatz.",
    whyCorrect:
      "Twelve CNOTs of routing per iteration at 0.995 each gives 0.995¹²ᴺ, and setting that to one half gives N ≈ 11.5, so 11 whole iterations. A run scheduled for 500 is off by a factor of more than forty on routing alone, before a single ansatz gate is counted.",
    whyWrong: [
      "Treating a SWAP as one two-qubit gate understates the routing cost threefold, since hardware without a native SWAP compiles it into three CNOTs.",
      "Reporting the total CNOT budget answers a different question: it is the depth in gates, not the number of loop iterations that depth pays for.",
    ],
  },
};
