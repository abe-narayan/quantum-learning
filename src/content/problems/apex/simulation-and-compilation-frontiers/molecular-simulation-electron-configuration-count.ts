import type { NumericProblem } from "@/lib/problems/types";

function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

const numSpinOrbitals = 10;
const numElectrons = 5;
const value = binomial(numSpinOrbitals, numElectrons);

export const molecularSimulationElectronConfigurationCount: NumericProblem = {
  meta: {
    slug: "molecular-simulation-electron-configuration-count",
    title: "Counting Electron Configurations in a Small Active Space",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "numeric",
    tags: ["electronic-structure", "second-quantization", "combinatorics", "hilbert-space-scaling"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"],
  },
  question: {
    type: "numeric",
    prompt: `A tiny "active space" molecular model keeps ${numSpinOrbitals} spin-orbitals active and places exactly ${numElectrons} electrons among them (the rest are frozen core or kept empty). In second quantization, the many-electron Hilbert space sector with fixed particle number ${numElectrons} is spanned by every way of choosing which ${numElectrons} of the ${numSpinOrbitals} spin-orbitals are occupied. How many basis states (Slater determinants) does this sector contain?`,
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0,
    incorrectFeedback: `Two ways this usually goes wrong. Counting ordered assignments (a permutation count) overcounts, because reordering the same occupied orbitals gives the same physical state. And counting every occupation pattern of all ${numSpinOrbitals} spin-orbitals ignores the fixed electron number. What you want is the number of ${numElectrons}-element subsets of the ${numSpinOrbitals} spin-orbitals.`,
    nearMisses: [
      {
        value: 30240,
        feedback:
          "30240 = 10!/5! counts ordered selections. Two orderings of the same five occupied orbitals describe one state, so divide out the 5! orderings.",
      },
      {
        value: 1024,
        feedback:
          "1024 = 2^10 counts every occupation pattern, including those with the wrong number of electrons. The question fixes the particle number at 5.",
      },
      {
        value: 210,
        feedback: "210 is C(10,4). One more orbital has to be occupied to reach 5 electrons.",
      },
    ],
  },
  hints: [
    { text: "Each basis state of the fixed-particle-number sector is specified by which orbitals are occupied, and the order of choosing them does not matter. That makes this a combination count, not a permutation count." },
    { text: `The count is the binomial coefficient C(${numSpinOrbitals}, ${numElectrons}) = ${numSpinOrbitals}! / (${numElectrons}! · ${numSpinOrbitals - numElectrons}!).` },
    { text: `Building it up multiplicatively: C(${numSpinOrbitals},1)=10, C(${numSpinOrbitals},2)=45, C(${numSpinOrbitals},3)=120, C(${numSpinOrbitals},4)=210. One more multiplicative step, a factor of (${numSpinOrbitals}-4)/${numElectrons}, gives the count you want.` },
  ],
  solution: {
    steps: [
      { description: `Each of the ${numSpinOrbitals} spin-orbitals is either occupied or empty, and exactly ${numElectrons} of them must be occupied, so a basis state of this sector is exactly a choice of which ${numElectrons} orbitals are occupied.` },
      { description: `The number of such choices is $\\binom{${numSpinOrbitals}}{${numElectrons}} = ${value}$.` },
      { description: "This is the growth that makes the classical problem hard: doubling the active space multiplies the count combinatorially rather than linearly, which is why exact diagonalization (full configuration interaction) stops being possible once the active space grows." },
    ],
    finalAnswer: `${value}`,
  },
  explanation: {
    correctIdea: `The fixed-particle-number sector of a ${numSpinOrbitals}-spin-orbital, ${numElectrons}-electron system has dimension $\\binom{${numSpinOrbitals}}{${numElectrons}}=${value}$, growing combinatorially in the active space size.`,
    whyCorrect: "The antisymmetric many-electron space is spanned by the ways of placing the electrons among the orbitals, so its dimension is a binomial coefficient rather than a linear function of the orbital count. That is the whole classical-hardness argument, and it is why a modest enlargement of the active space is not a modest increase in cost.",
    whyWrong: [`A count that treats the orbitals as ordered (a permutation count, ${numSpinOrbitals}!/${numSpinOrbitals - numElectrons}!) overcounts, since two orbital assignments that occupy the same set of orbitals in a different order are the same physical state.`],
  },
};
