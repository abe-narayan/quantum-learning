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
      "Using the lesson's derivation γ_n(t) = i∫⟨n(t')|ṅ(t')⟩dt', explain why the Berry phase after one full loop depends only on the loop's shape in parameter space, not on how quickly or slowly that loop is traversed, provided the adiabatic condition holds throughout.",
    placeholder: "Rewrite the time integral as a path integral using the chain rule...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["chain rule", "dR/dt", "parameter", "parameters R"],
        missingFeedback:
          "The integral is over time, and you want an answer with no time in it. Say what substitution turns the time derivative into something written in the loop's own variables.",
      },
      {
        phrases: ["path integral", "line integral", "integral over the curve", "integral around the closed path"],
        missingFeedback:
          "You have done the substitution. Now say what kind of integral you are left with, and over what.",
      },
      {
        phrases: ["not on time", "not on speed", "independent of how fast", "regardless of rate", "doesn't depend on t", "not on the rate", "not the rate", "independent of the speed", "nothing about the speed", "not how quickly", "not how fast", "no matter how fast", "whatever the speed", "shape and not"],
        missingFeedback:
          "You have converted the integral. Now draw the conclusion explicitly: say what the result does and does not depend on.",
      },
    ],
    incorrectFeedback:
      "The formula γ_n = i∫⟨n|ṅ⟩dt still has a dt in it, so the claim cannot be read off; it has to be derived. Rewrite ⟨n|ṅ⟩ using the fact that |n⟩ depends on t only through the Hamiltonian's slow variables, then see what happens to the dt. What is left has no dt in it at all: it runs along the curve drawn in variable space, and the answer should say why an object of that shape cares about the curve and nothing else.",
    partialFeedback: "Good start. Now join the two halves: say what the rewriting leaves behind once dt has cancelled, and why an object of that form carries no leftover dependence on how long the traversal took.",
    modelAnswers: [
      "Use the chain rule to write the time derivative of |n> as dn/dR times dR/dt. The dt cancels against the dR/dt, so the time integral becomes a line integral around the closed path in parameter space. There is no t left anywhere, so the answer is independent of how fast you traverse the loop.",
      "Rewriting in terms of the parameters R turns it into a path integral over the curve, and nothing about the speed survives the rewrite. So the phase depends on the loop's shape and not on the rate.",
    ],
  },
  hints: [
    { text: "⟨n|ṅ⟩ = ⟨n|∇_R n⟩·(dR/dt), by the chain rule, where R are the Hamiltonian's slowly-varying parameters." },
    { text: "Substitute that into γ_n and cancel the dt's. What kind of object are you left integrating over?" },
    { text: "An object of that kind depends on the curve drawn in R-space and not on how the curve is parametrised. It is the same fact that makes ordinary work integrals what they are." },
  ],
  solution: {
    steps: [
      { description: "Write γ_n = i∫₀ᵀ⟨n(t')|ṅ(t')⟩dt', and use the chain rule ṅ = (∂n/∂R)·(dR/dt) for the Hamiltonian's slow parameters R(t)." },
      { description: "Then γ_n = i∫₀ᵀ⟨n|∂n/∂R⟩·(dR/dt)dt = i∮_C⟨n|∂n/∂R⟩·dR, a genuine path integral over the curve C that R(t) traces in parameter space." },
      { description: "The explicit dt cancelled entirely: the integral is now a sum over infinitesimal displacements dR along the path, with no reference left to how much time each displacement took." },
      { description: "So retracing the exact same path C twice as slowly (twice the total T, but the same geometric curve) gives the identical γ_n. Only the loop's shape matters, provided adiabaticity holds throughout so the instantaneous-eigenstate expansion stays valid." },
    ],
    finalAnswer:
      "The chain rule converts the time integral i∫⟨n|ṅ⟩dt into a path integral i∮⟨n|∂n/∂R⟩·dR with no leftover dt, so γ_n depends only on the loop's shape in parameter space, not on the traversal speed.",
  },
  explanation: {
    correctIdea: "This is why Berry's phase is called geometric: it is a property of the curve in parameter space, not a rate, in the same sense that a line integral of a vector field along a fixed path is independent of how fast you walk it.",
    whyWrong: ["Confusing 'adiabatic (slow)' with 'the phase depends on the speed'. Adiabaticity is a validity condition for the derivation, not a variable the final geometric-phase formula depends on."],
  },
};
