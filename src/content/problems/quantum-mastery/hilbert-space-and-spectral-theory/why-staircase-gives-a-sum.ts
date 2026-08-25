import type { ConceptualProblem } from "@/lib/problems/types";

export const whyStaircaseGivesASum: ConceptualProblem = {
  meta: {
    slug: "why-staircase-gives-a-sum",
    title: "Why a Staircase PVM Reduces the Integral to a Sum",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["spectral-theorem", "pvm", "conceptual"],
    prerequisites: ["quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Explain why ∫λ dE(λ) collapses to the discrete sum Σᵢλᵢ Pᵢ exactly when the spectrum is discrete, and what would need to change about this argument for an operator like position, whose PVM is not a staircase.",
    placeholder: "A Riemann-Stieltjes integral against a staircase function equals... For position, E(λ) is not a staircase because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["staircase", "jump", "constant except", "step function"],
      ["Riemann-Stieltjes", "sum over", "jump size", "value at each jump"],
      ["position", "continuous", "no jumps", "not a staircase"],
    ],
    incorrectFeedback:
      "Address all three ideas: what makes the discrete-spectrum E(λ) a staircase, why a Riemann-Stieltjes integral against a staircase becomes a plain sum over its jumps, and what's different for position's E(λ).",
    partialFeedback:
      "Good — now also explain what's different about position's PVM that keeps its ∫λdE(λ) from ever collapsing into a discrete sum.",
  },
  hints: [
    { text: "For a discrete spectrum, E(λ)=Σ_{λᵢ≤λ}Pᵢ jumps by Pᵢ exactly at each eigenvalue and is constant everywhere else." },
    { text: "A Riemann-Stieltjes integral ∫f dG against a pure staircase G is, by definition, the sum over G's jump points of f(jump point) × (jump size)." },
    { text: "Position's E(Δ) (multiplication by an indicator function) changes continuously as Δ grows — there's no isolated jump to point to, so the integral genuinely stays an integral, not a sum." },
  ],
  solution: {
    steps: [
      {
        description:
          "E(λ)=Σ_{λᵢ≤λ}Pᵢ is constant except for a jump of size Pᵢ exactly at each eigenvalue λᵢ — a genuine staircase function of λ.",
      },
      {
        description:
          "A Riemann-Stieltjes integral against a staircase function is, by the definition of that integral, exactly the sum over the staircase's jump points of (integrand value there) × (jump size) — so ∫λ dE(λ) becomes Σᵢλᵢ Pᵢ with no approximation involved.",
      },
      {
        description:
          "Position's spectral measure E(Δ) = multiplication by the indicator function 1_Δ(x) changes smoothly as Δ is enlarged continuously — there is no isolated jump anywhere, so ⟨ψ|E(λ)ψ⟩ is a continuous (not staircase) function of λ, and ∫x dE(x) genuinely stays an integral over the whole real line.",
      },
    ],
    finalAnswer:
      "The reduction works because the discrete-spectrum PVM is literally a staircase, and integrating against a staircase is a sum by definition; position's PVM has no jumps at all, so its spectral integral never collapses into a sum.",
  },
  explanation: {
    correctIdea:
      "This is the lesson's central derived fact: the finite-dimensional spectral decomposition isn't a separate theorem, it's what the general PVM integral does automatically whenever the measure happens to be a staircase.",
    whyCorrect: "Matches the lesson's explicit Riemann-Stieltjes derivation and its contrast with position's continuous PVM.",
    whyWrong: [
      "Claiming the discrete case is 'simpler physics' rather than a mathematical special case of the same measure-theoretic object misses the actual mechanism (staircase vs. continuous measure).",
    ],
  },
};
