import type { NumericProblem } from "@/lib/problems/types";

const alpha = 2;
/** <N> = |a|^2 and <N^2> = |a|^4 + |a|^2, the second term coming from [a,a†]=1. */
const meanN = alpha * alpha;
const value = meanN * meanN + meanN;

export const coherentStateMeanPhotonNumber: NumericProblem = {
  meta: {
    slug: "coherent-state-mean-photon-number",
    title: "Second Moment of the Photon Number in a Coherent State",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "numeric",
    tags: ["coherent-states", "harmonic-oscillator", "ladder-operators"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  question: {
    type: "numeric",
    prompt:
      "A coherent state is defined by the eigenvalue equation â|α⟩ = α|α⟩, with ⟨α|α⟩ = 1. Working from that equation and the commutator [â, â†] = 1 alone, without expanding in the Fock basis, evaluate ⟨N²⟩ = ⟨α|(â†â)²|α⟩ for α = 2 (real).",
    inputHint: "an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0,
    incorrectFeedback:
      "The operators in (â†â)² sit in the order â†ââ†â, and the middle pair is the wrong way round for the eigenvalue equation to be used. Reorder that pair with the commutator first, then let each â act to the right and each â† to the left.",
    nearMisses: [
      {
        value: meanN * meanN,
        feedback:
          "That is |α|⁴, which is what you get by moving â past â† as though they commuted. They do not: exchanging them leaves an extra term behind, and that leftover term is the entire physical content of this calculation.",
      },
      {
        value: meanN,
        feedback:
          "That is ⟨N⟩, the first moment. The question asks for the expectation of N², which is a strictly larger number for any state whose photon number is not sharp.",
      },
      {
        value: alpha,
        feedback: "That is α itself. Every expectation here comes out in powers of |α|², since â† acting leftwards contributes α* alongside each α.",
      },
    ],
  },
  hints: [
    {
      text: "The eigenvalue equation only helps when an â stands immediately to the left of |α⟩, or an â† immediately to the right of ⟨α|. Write (â†â)² out in full and check where the operators actually sit.",
    },
    {
      text: "One adjacent pair is in the wrong order. Use the commutator to swap it, which turns the product into a sum of two terms: one fully normal-ordered, and one shorter.",
    },
    {
      text: "Evaluate the two terms separately. Each surviving â contributes α and each â† contributes α*, so both terms come out as powers of |α|²; add them and substitute α = 2.",
    },
  ],
  solution: {
    steps: [
      {
        description: "Write the square out and reorder the middle pair with the commutator.",
        latex: "(\\hat a^\\dagger \\hat a)^2 = \\hat a^\\dagger (\\hat a \\hat a^\\dagger) \\hat a = \\hat a^\\dagger(\\hat a^\\dagger \\hat a + 1)\\hat a = \\hat a^{\\dagger 2}\\hat a^2 + \\hat a^\\dagger \\hat a",
      },
      {
        description: "Both terms are now normal-ordered, so every â acts on |α⟩ and every â† on ⟨α|.",
        latex: "\\langle N^2\\rangle = |\\alpha|^4 + |\\alpha|^2",
      },
      {
        description: "With α = 2: |α|² = 4, so ⟨N²⟩ = 16 + 4 = 20. The variance follows as ⟨N²⟩ − ⟨N⟩² = |α|², equal to the mean, which is the Poisson signature of a coherent state.",
      },
    ],
    finalAnswer: "20",
  },
  explanation: {
    correctIdea:
      "The whole calculation turns on one reordering. â and â† do not commute, and the leftover 1 they generate is what makes ⟨N²⟩ exceed ⟨N⟩², that is, what gives a coherent state any photon-number spread at all.",
    whyCorrect:
      "Normal-ordering (â†â)² splits it into â†²â² plus â†â. The eigenvalue equation evaluates the first at |α|⁴ and the second at |α|², so ⟨N²⟩ = |α|⁴ + |α|² = 20 at α = 2. Subtracting ⟨N⟩² = 16 leaves a variance of 4, equal to the mean: the Poisson statistics the Fock-basis expansion also gives, reached here without ever writing down a single cₙ.",
    whyWrong: [
      "Treating â and â† as commuting yields |α|⁴ and a variance of zero, which would make a coherent state a photon-number eigenstate. It is not: only Fock states are.",
    ],
  },
};
