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
    { text: "State the theorem's hypothesis carefully: which trial states does ⟨H⟩ ≥ E₀ apply to?" },
    { text: "Nothing in that hypothesis mentions optimization. Optimizing searches a family for the smallest ⟨H⟩; it is not a condition for the inequality." },
    { text: "Compare both numbers against E₀ = 0.5 and ask whether either one violates the inequality." },
  ],
  solution: {
    steps: [{ description: "The variational theorem says ⟨H⟩ ≥ E₀ for every normalized trial state. Both numbers sit above E₀ = 0.5, so both are valid upper bounds. Optimizing over σ finds the tightest bound this family can give; it does not decide which bounds are legitimate." }],
    finalAnswer: "Both are valid upper bounds on E₀; the poorly chosen width gives a looser one.",
  },
  explanation: {
    correctIdea: "Validity and tightness are separate. The theorem promises validity for any normalized trial state, and tightness is what a good trial family and a good parameter choice buy you.",
    whyCorrect: "Matches the lesson's Common Mistakes point about what a lower ⟨H⟩ does and does not indicate.",
    whyWrong: [
      { optionId: "b", text: "Treats disagreement with the exact answer as an error. An upper bound is expected to sit above E₀." },
      { optionId: "c", text: "Adds a hypothesis the theorem does not have. It quantifies over every normalized trial state." },
      { optionId: "d", text: "Calls a loose bound a failure. A loose but valid bound is the whole of what the theorem promises for a single trial choice." },
    ],
  },
};
