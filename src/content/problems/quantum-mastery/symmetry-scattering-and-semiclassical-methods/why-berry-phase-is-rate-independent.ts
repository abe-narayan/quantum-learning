import type { ConceptualProblem } from "@/lib/problems/types";

export const whyBerryPhaseIsRateIndependent: ConceptualProblem = {
  meta: {
    slug: "why-berry-phase-is-rate-independent",
    title: "Why the Berry Phase Doesn't Depend on How Fast the Loop Is Traversed",
    course: "symmetry-scattering-and-semiclassical-methods",
    lesson: "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase",
    difficulty: "master",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["berry-phase", "adiabatic-theorem", "conceptual"],
    prerequisites: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase"],
  },
  question: {
    type: "conceptual",
    prompt:
      "Using the lesson's derivation γ_n(t) = i∫⟨n(t')|ṅ(t')⟩dt', explain why the Berry phase after one full loop depends only on the loop's shape in parameter space, not on how quickly (or slowly) that loop is traversed — provided the adiabatic condition holds throughout.",
    placeholder: "Rewrite the time integral as a path integral using the chain rule...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["chain rule", "dR", "d/dt", "parameter"],
      ["path integral", "loop", "line integral", "∮"],
      ["not on time", "not on speed", "independent of how fast", "regardless of rate", "doesn't depend on t"],
    ],
    incorrectFeedback:
      "Use the chain rule to rewrite dt in terms of dR (the Hamiltonian's slow parameters), turning the time integral into a path integral over the loop itself, with no leftover explicit time dependence.",
    partialFeedback: "Good start — make sure you explicitly connect the chain-rule rewriting to the path integral having no leftover time dependence.",
  },
  hints: [
    { text: "⟨n|ṅ⟩ = ⟨n|∇_R n⟩·(dR/dt), by the chain rule, where R are the Hamiltonian's slowly-varying parameters." },
    { text: "So γ_n = i∫⟨n|∇_R n⟩·(dR/dt)dt = i∮⟨n|∇_R n⟩·dR, an integral entirely over the path R(t) traces, with the explicit dt's cancelled." },
    { text: "A path integral like ∮A·dR depends only on the curve traced in R-space, not on the parametrization (how fast each piece of the curve is traversed) — the same fact that makes ordinary work integrals path integrals, not time integrals." },
  ],
  solution: {
    steps: [
      { description: "Write γ_n = i∫₀ᵀ⟨n(t')|ṅ(t')⟩dt', and use the chain rule ṅ = (∂n/∂R)·(dR/dt) for the Hamiltonian's slow parameters R(t)." },
      { description: "Then γ_n = i∫₀ᵀ⟨n|∂n/∂R⟩·(dR/dt)dt = i∮_C⟨n|∂n/∂R⟩·dR, a genuine path integral over the curve C that R(t) traces in parameter space." },
      { description: "The explicit dt cancelled entirely: the integral is now a sum over infinitesimal displacements dR along the path, with no reference left to how much time each displacement took." },
      { description: "So retracing the exact same path C twice as slowly (twice the total T, but the same geometric curve) gives the identical γ_n — only the loop's shape matters, provided adiabaticity holds throughout so the instantaneous-eigenstate expansion stays valid." },
    ],
    finalAnswer:
      "The chain rule converts the time integral i∫⟨n|ṅ⟩dt into a path integral i∮⟨n|∂n/∂R⟩·dR with no leftover dt, so γ_n depends only on the loop's shape in parameter space, not on the traversal speed.",
  },
  explanation: {
    correctIdea: "This is exactly why Berry's phase is called geometric: it's a property of the curve in parameter space, not a rate, in the same sense a line integral of a vector field along a fixed path is independent of how fast you walk it.",
    whyWrong: ["Confusing 'adiabatic (slow)' with 'the phase depends on the speed' — adiabaticity is a validity CONDITION for the derivation, not a variable the final geometric phase formula depends on."],
  },
};
