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
      "A colleague claims: 'Quantum phase estimation applied to a molecular Hamiltonian gives a provably polynomial-time algorithm for the ground-state energy, full stop. This is a real, unconditional quantum advantage over classical quantum chemistry.' Identify the specific, load-bearing assumption this claim glosses over, explain concretely what happens to phase estimation's success probability when that assumption fails, and say why finding a state that satisfies it is itself a nontrivial, unsolved-in-general problem.",
    placeholder: "Think about what state phase estimation is actually run on, and what its measured-energy distribution depends on...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["initial state", "trial state", "starting state", "input state", "prepared state"],
        missingFeedback:
          "Phase estimation is run on something. Name what, because that is where the assumption is hiding.",
      },
      {
        phrases: ["overlap", "ground state overlap", "squared overlap", "amplitude squared", "probability of projecting"],
        missingFeedback:
          "You have named the state. Now say what quantity about it the success probability actually depends on.",
      },
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
          "You have named the quantity the success rate depends on. What is missing is the consequence. Say what that quantity does to the number of repetitions for a poor guess on a strongly correlated system, and note where the cost the algorithm claimed to remove has reappeared.",
      },
      {
        phrases: ["state preparation", "finding a good", "not automatic", "unsolved", "open problem", "no general recipe"],
        missingFeedback:
          "You have shown what goes wrong when the assumption fails. Close the argument: say how hard it is to guarantee the assumption holds in the first place.",
      },
    ],
    incorrectFeedback:
      "Phase estimation does not go looking for the lowest energy; it reports the energy of whichever eigenstate the register you handed it happens to collapse onto. The advertised cost is therefore conditional on something the advertisement leaves out, and that something is a property of what you fed in, not of the circuit. Name the quantity that decides how often the readout lands on the level you wanted, and say what happens to the run count when that quantity is tiny.",
    partialFeedback:
      "Good start. Three things still need to be explicit: the quantity that sets how often the readout returns the level you want, what happens to the number of repetitions when that quantity is tiny, and the fact that constructing a good guess to feed in is itself an unsettled, problem-by-problem difficulty rather than something the algorithm hands you.",
    modelAnswers: [
      "It quietly assumes you already have a good initial state. Phase estimation's success probability is the squared overlap of your trial state with the true ground state, and if that overlap is exponentially small you need exponentially many repetitions to see the right energy, so the exponential cost just moves. Finding such a state is state preparation, and in general that is an open problem.",
      "The load-bearing assumption is the input state. What you measure is distributed by the overlap with the eigenstates, so a bad guess gives an exponentially small chance of landing on the ground state and you would need exponentially many shots. There is no general recipe for preparing a good guess.",
    ],
  },
  hints: [
    { text: "Phase estimation does not measure the lowest energy directly. It measures the energy of whichever eigenstate component the register you supplied collapses onto." },
    { text: "Write the supplied register as c₀|E₀⟩ plus other eigenstates. Which number in that expression governs how often the readout returns E₀?" },
    { text: "For a poor guess on a strongly correlated molecule (a single Hartree-Fock determinant, say), that number can be minuscule, and the run count needed to see E₀ even once blows up accordingly. Ask where the saved cost went." },
  ],
  solution: {
    steps: [
      { description: "Quantum phase estimation run on a prepared initial state |ψ⟩ returns an energy estimate distributed according to |ψ⟩'s expansion in the Hamiltonian's true eigenbasis; it returns (an estimate of) the ground energy E₀ with probability equal, to leading order, to |⟨E₀|ψ⟩|², the squared overlap between the prepared state and the true, unknown ground state." },
      { description: "The polynomial-time claim is therefore conditional on |⟨E₀|ψ⟩|² being at least inverse-polynomially large in system size. If it is instead exponentially small, a real risk for strongly correlated molecules where a single classically cheap reference state such as Hartree-Fock is a poor approximation to the true ground state, then the number of repetitions needed to see E₀ at all also grows exponentially. The exponential cost returns through the state-preparation step even though the phase-estimation circuit itself runs in polynomial time per shot." },
      { description: "Constructing a state with provably non-negligible ground-state overlap is, for a general strongly correlated Hamiltonian, itself an unsolved, instance-dependent problem. It is sometimes addressable with adiabatic state preparation or a good classical guess (a coupled-cluster or DMRG-informed reference, say), but there is no general, efficient recipe guaranteed to work for every classically hard molecule." },
    ],
    finalAnswer:
      "The claim glosses over the initial-state-overlap assumption. Phase estimation's success probability scales with |⟨ground state|initial state⟩|², which can be exponentially small for a badly chosen guess, so the exponential cost returns through the number of repetitions needed. Provably guaranteeing a good initial state is itself an open, problem-dependent difficulty, not a free byproduct of the algorithm.",
  },
  explanation: {
    correctIdea:
      "Phase estimation's polynomial-time ground-state-energy estimate is conditional on starting from a state with non-negligible overlap with the true ground state. That is a real, often-underappreciated caveat, not an automatic guarantee.",
    whyCorrect:
      "Phase estimation returns the energy of whichever eigenstate the prepared register collapses onto, and it does so with probability equal to the squared overlap. An exponentially small overlap therefore means an exponentially large number of runs, and no improvement to the simulation circuit touches that.",
    whyWrong: [
      "Treating phase estimation's polynomial query complexity in the simulated unitary as the whole story ignores that the number of repetitions needed to succeed even once depends on a completely separate quantity: the initial state's overlap with the unknown ground state.",
    ],
  },
};
