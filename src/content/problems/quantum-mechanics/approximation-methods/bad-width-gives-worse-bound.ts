import { createGrid } from "@/lib/quantum/wavefunction";
import { harmonicOscillatorPotential } from "@/lib/quantum/potentials";
import { gaussianTrialEnergy, minimizeGaussianTrialEnergy } from "@/lib/quantum/approximationMethods";
import type { MultipleChoiceProblem } from "@/lib/problems/types";

const grid = createGrid(1024, 0.05);
const V = harmonicOscillatorPotential(grid, 1, 1);
const badEnergy = gaussianTrialEnergy(grid, V, 3);
const { bestEnergy } = minimizeGaussianTrialEnergy(grid, V, { widthMin: 0.2, widthMax: 3, steps: 300 });

export const badWidthGivesWorseBound: MultipleChoiceProblem = {
  meta: {
    slug: "bad-width-gives-worse-bound",
    title: "A Poorly-Chosen Trial Width Gives a Worse Bound",
    course: "approximation-methods",
    lesson: "quantum-mechanics/approximation-methods/the-variational-method",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "multiple-choice",
    tags: ["variational-method"],
    prerequisites: ["quantum-mechanics/approximation-methods/the-variational-method"],
  },
  question: {
    type: "multiple-choice",
    prompt: `A Gaussian trial with width σ=3 (far from the optimum σ≈0.7) gives ⟨H⟩≈${badEnergy.toFixed(3)}, compared to the optimized ⟨H⟩≈${bestEnergy.toFixed(3)}. What does the variational theorem say about this?`,
    options: [
      { id: "a", text: "Both are valid upper bounds on E₀=0.5; the badly-chosen width just gives a looser (higher) bound" },
      { id: "b", text: "The σ=3 result must be wrong, since it doesn't match the exact answer" },
      { id: "c", text: "Only the optimized result is a valid upper bound — non-optimal widths don't obey the theorem" },
      { id: "d", text: "This shows the variational method fails for badly-chosen trial parameters" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Both values are legitimate — ⟨H⟩ for ANY normalized trial state is ≥E₀; a bad choice just means a less tight bound, not an invalid one.",
      c: "The theorem applies to every normalized trial state, optimized or not — optimization only finds the tightest bound within a family, it isn't a precondition for the inequality to hold.",
      d: "The method isn't failing — it's working exactly as guaranteed: giving a valid (if loose) upper bound, which is all the theorem promises for any single trial choice.",
    },
    defaultIncorrectFeedback: "Every normalized trial state gives a valid upper bound on E₀, regardless of how good or bad the parameter choice is — only the tightness of the bound changes.",
  },
  hints: [
    { text: "The variational theorem applies to ANY normalized trial state, not just optimized ones." },
    { text: "σ=3 gives a higher (worse, looser) bound; σ≈0.7 gives a much tighter one." },
    { text: "Both are still valid upper bounds — neither violates ⟨H⟩≥E₀." },
  ],
  solution: {
    steps: [{ description: "Both σ=3 and the optimized σ give ⟨H⟩≥E₀=0.5, exactly as the theorem requires; only the tightness of the bound differs." }],
    finalAnswer: "(a) Both are valid upper bounds; the poor choice just gives a looser one",
  },
  explanation: {
    correctIdea: "This distinguishes 'valid' (the theorem always holds) from 'tight' (a property of how well the trial family, and the specific parameter choice, matches the true ground state).",
    whyCorrect: "Matches the lesson's explicit Common Mistakes point about what a lower ⟨H⟩ does and doesn't indicate.",
    whyWrong: ["Concluding the method 'fails' for bad parameters misunderstands that the theorem never promised a good bound — only a valid (upper-bound) one."],
  },
};
