import type { ConceptualProblem } from "@/lib/problems/types";

export const molecularSimulationPhaseEstimationOverlapCaveat: ConceptualProblem = {
  meta: {
    slug: "molecular-simulation-phase-estimation-overlap-caveat",
    title: "Is Quantum Phase Estimation's Efficiency Really Unconditional?",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules",
    difficulty: "master",
    estimatedMinutes: 9,
    problemType: "conceptual",
    tags: ["quantum-phase-estimation", "vqe", "ground-state-overlap", "fault-tolerance", "honest-scope"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A colleague claims: 'Quantum phase estimation applied to a molecular Hamiltonian gives a provably polynomial-time algorithm for the ground-state energy, full stop — this is a real, unconditional quantum advantage over classical quantum chemistry.' Identify the specific, load-bearing assumption this claim glosses over, explain concretely what happens to phase estimation's success probability when that assumption fails, and say why finding a state that satisfies it is itself a nontrivial, unsolved-in-general problem.",
    placeholder: "Think about what state phase estimation is actually run on, and what its measured-energy distribution depends on...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["initial state", "trial state", "starting state", "input state", "prepared state"],
      ["overlap", "ground state overlap", "amplitude squared", "|<", "probability of projecting"],
      {
        phrases: [
          "exponentially small",
          "exponentially small success",
          "vanishes exponentially",
          "shrinks exponentially",
          "exponentially many repetitions",
          "exponentially many shots",
          "exponential number of repetitions",
        ],
        missingFeedback:
          "You have identified the overlap assumption. Now say what breaks when it fails: for a poor reference state the squared overlap can be exponentially small in system size, so the number of repetitions needed to see the ground energy even once grows exponentially, and the exponential cost returns through state preparation rather than through the circuit.",
      },
      ["state preparation", "finding a good", "not automatic", "unsolved", "open problem", "no general recipe"],
    ],
    incorrectFeedback:
      "Focus on the specific quantity phase estimation's success probability actually depends on: how much overlap the initial state you feed in has with the true ground state, and what happens as that overlap shrinks.",
    partialFeedback:
      "Good start — be more explicit that the success probability is, to leading order, the squared overlap of the prepared initial state with the true ground state, that this overlap can be exponentially small for a badly chosen guess, and that constructing a provably good initial state is itself an open, problem-dependent difficulty, not something phase estimation supplies for free.",
  },
  hints: [
    { text: "Phase estimation doesn't measure the ground energy directly — it measures the energy of whatever eigenstate component your prepared initial state actually collapses onto." },
    { text: "If the prepared state is |ψ⟩ = c₀|E₀⟩ + (other eigenstates), the probability of the phase-estimation readout returning E₀ is governed by |c₀|², the squared overlap with the true ground state." },
    { text: "For a badly chosen initial guess (e.g. a single Hartree-Fock determinant for a strongly correlated molecule), |c₀|² can be exponentially small in system size, requiring exponentially many repetitions to succeed even once — silently reintroducing exponential cost through the back door." },
  ],
  solution: {
    steps: [
      { description: "Quantum phase estimation run on a prepared initial state |ψ⟩ returns an energy estimate distributed according to |ψ⟩'s expansion in the Hamiltonian's true eigenbasis; it returns (an estimate of) the ground energy E₀ with probability equal, to leading order, to |⟨E₀|ψ⟩|², the squared overlap between the prepared state and the true, unknown ground state." },
      { description: "The polynomial-time claim is therefore conditional on |⟨E₀|ψ⟩|² being at least inverse-polynomially large in system size. If it is instead exponentially small — a real risk for strongly correlated molecules where a single classically cheap reference state (e.g. Hartree-Fock) is a poor approximation to the true ground state — the number of repetitions needed to see E₀ at all also grows exponentially, reintroducing exponential cost through the state-preparation step even though the phase-estimation circuit itself runs in polynomial time per shot." },
      { description: "Constructing a state with provably non-negligible ground-state overlap is, for a general strongly correlated Hamiltonian, itself an unsolved, instance-dependent problem — sometimes addressable with adiabatic state preparation or a good classical guess (e.g. a coupled-cluster or DMRG-informed reference), but with no general, efficient recipe guaranteed to work for every classically hard molecule." },
    ],
    finalAnswer:
      "The claim glosses over the initial-state-overlap assumption: phase estimation's success probability scales with |⟨ground state|initial state⟩|², which can be exponentially small for a badly chosen guess, silently reintroducing exponential cost via the number of repetitions needed — and provably guaranteeing a good initial state is itself an open, problem-dependent difficulty, not a free byproduct of the algorithm.",
  },
  explanation: {
    correctIdea:
      "Phase estimation's polynomial-time ground-state-energy estimate is conditional on starting from a state with non-negligible overlap with the true ground state — a real, often-underappreciated caveat, not an automatic guarantee.",
    whyCorrect:
      "This is exactly the caveat the lesson's Common Mistakes callout states explicitly: an exponentially small overlap makes phase estimation's success probability exponentially small too, regardless of how efficient the underlying Hamiltonian-simulation circuit is.",
    whyWrong: [
      "Treating phase estimation's polynomial query complexity in the simulated unitary as the whole story ignores that the number of repetitions needed to succeed even once depends on a completely separate quantity: the initial state's overlap with the unknown ground state.",
    ],
  },
};
