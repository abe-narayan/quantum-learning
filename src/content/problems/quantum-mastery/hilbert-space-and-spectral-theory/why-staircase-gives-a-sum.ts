import type { ConceptualProblem } from "@/lib/problems/types";

export const whyStaircaseGivesASum: ConceptualProblem = {
  meta: {
    slug: "why-staircase-gives-a-sum",
    title: "Why a Staircase PVM Reduces the Integral to a Sum",
    course: "hilbert-space-and-spectral-theory",
    lesson: "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
    difficulty: "master",
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
      {
        phrases: ["staircase", "jump", "constant except", "step function"],
        missingFeedback:
          "Describe the shape of the spectral family E(lambda) when the spectrum is discrete. That shape is doing all the work.",
      },
      {
        phrases: ["Riemann-Stieltjes", "sum over", "is a sum", "becomes a sum", "sum by definition", "reduces to a sum", "collapses into a sum", "turns into a sum"],
        missingFeedback:
          "You have the shape. Now say what kind of integral you are computing against it, and what such an integral comes out to when the integrator only moves at isolated points.",
      },
      {
        phrases: ["position", "continuous", "continuously", "smoothly", "absolutely continuous"],
        missingFeedback:
          "You have the discrete case. The question also asks about an operator whose PVM is not a staircase: say how its spectral family behaves instead, and why that blocks the same step.",
      },
    ],
    incorrectFeedback:
      "Three separate facts are needed and the argument collapses without any one of them. First, describe the shape of E(λ) when the spectrum is discrete: where it changes and where it does not. Second, say what an integral against a function of that shape reduces to, and why that reduction is a definition rather than an approximation. Third, describe the shape of E(λ) for the observable whose spectrum fills the real line, and say why the same reduction is unavailable there.",
    partialFeedback:
      "Good. The remaining piece is the contrast. Describe the shape of E(λ) for the operator whose spectrum fills the real line, and say what feature it lacks that the discrete case relied on.",
    modelAnswers: [
      "For a discrete spectrum, E(lambda) is literally a staircase: constant except at the eigenvalues, where it jumps by the corresponding projector. A Riemann-Stieltjes integral against a staircase picks up only the jumps, so it is a sum by definition. Position's PVM is continuous with no jumps at all, so nothing collapses into a sum there.",
      "The measure only puts weight where E(lambda) jumps, so the integral becomes a sum over those jumps. For position the spectral family increases continuously, so there are no jumps to pick out and the integral stays an integral.",
    ],
  },
  hints: [
    { text: "For a discrete spectrum, E(λ)=Σ_{λᵢ≤λ}Pᵢ. Ask what it does at each eigenvalue, and what it does between them." },
    { text: "The integral ∫f dG is built out of increments of G. If G only ever changes at isolated points, ask which increments survive." },
    { text: "Now do the same for the operator that multiplies by an indicator function on an interval. As the interval grows, does E(Δ) ever change abruptly, or only smoothly?" },
  ],
  solution: {
    steps: [
      {
        description:
          "E(λ)=Σ_{λᵢ≤λ}Pᵢ is constant except for a jump of size Pᵢ exactly at each eigenvalue λᵢ: a staircase function of λ.",
      },
      {
        description:
          "A Riemann-Stieltjes integral against a staircase function is, by the definition of that integral, the sum over the staircase's jump points of (integrand value there) × (jump size), so ∫λ dE(λ) becomes Σᵢλᵢ Pᵢ with no approximation involved.",
      },
      {
        description:
          "Position's spectral measure E(Δ) = multiplication by the indicator function 1_Δ(x) changes smoothly as Δ is enlarged continuously. There is no isolated jump anywhere, so ⟨ψ|E(λ)ψ⟩ is a continuous rather than staircase function of λ, and ∫x dE(x) stays an integral over the whole real line.",
      },
    ],
    finalAnswer:
      "The reduction works because the discrete-spectrum PVM is literally a staircase, and integrating against a staircase is a sum by definition; position's PVM has no jumps at all, so its spectral integral never collapses into a sum.",
  },
  explanation: {
    correctIdea:
      "This is the lesson's central derived fact: the finite-dimensional spectral decomposition is not a separate theorem. It is what the general PVM integral does whenever the measure happens to be a staircase.",
    whyCorrect: "A Stieltjes integral picks up contributions only where its integrator moves. A discrete-spectrum E(λ) moves only at the eigenvalues, so the integral is a sum over those points by definition rather than by approximation. Position's E(Δ) moves everywhere, so nothing isolates a term to collect.",
    whyWrong: [
      "Claiming the discrete case is 'simpler physics' rather than a mathematical special case of the same measure-theoretic object misses the actual mechanism (staircase vs. continuous measure).",
    ],
  },
};
