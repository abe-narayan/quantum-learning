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
    incorrectFeedback: `Count the number of ways to choose which ${numElectrons} of the ${numSpinOrbitals} spin-orbitals are occupied: this is the binomial coefficient C(${numSpinOrbitals}, ${numElectrons}).`,
  },
  hints: [
    { text: "Each basis state of the fixed-particle-number sector is specified by exactly which orbitals are occupied, with the order of choosing not mattering — that makes this a combination count, not a permutation count." },
    { text: `The count is the binomial coefficient C(${numSpinOrbitals}, ${numElectrons}) = ${numSpinOrbitals}! / (${numElectrons}! · ${numSpinOrbitals - numElectrons}!).` },
    { text: `Building it up multiplicatively: C(${numSpinOrbitals},1)=10, C(${numSpinOrbitals},2)=45, C(${numSpinOrbitals},3)=120, C(${numSpinOrbitals},4)=210, C(${numSpinOrbitals},5)=${value}.` },
  ],
  solution: {
    steps: [
      { description: `Each of the ${numSpinOrbitals} spin-orbitals is either occupied or empty, and exactly ${numElectrons} of them must be occupied, so a basis state of this sector is exactly a choice of which ${numElectrons} orbitals are occupied.` },
      { description: `The number of such choices is $\\binom{${numSpinOrbitals}}{${numElectrons}} = ${value}$.` },
      { description: "This is the same combinatorial growth the lesson's Mathematical Development section describes: doubling the active space size grows this count combinatorially, not linearly, which is exactly why classical exact diagonalization (full configuration interaction) becomes intractable for larger active spaces." },
    ],
    finalAnswer: `${value}`,
  },
  explanation: {
    correctIdea: `The fixed-particle-number sector of a ${numSpinOrbitals}-spin-orbital, ${numElectrons}-electron system has dimension $\\binom{${numSpinOrbitals}}{${numElectrons}}=${value}$, growing combinatorially in the active space size.`,
    whyCorrect: "This combinatorial scaling is exactly the classical-hardness argument the lesson's Mathematical Development section makes precise: the antisymmetric many-electron Hilbert space grows as a binomial coefficient, not linearly, in the number of orbitals.",
    whyWrong: [`A count that treats the orbitals as ordered (a permutation count, ${numSpinOrbitals}!/${numSpinOrbitals - numElectrons}!) overcounts, since two orbital assignments that occupy the same set of orbitals in a different order are the same physical state.`],
  },
};
