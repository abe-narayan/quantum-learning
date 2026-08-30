import type { ConceptualProblem } from "@/lib/problems/types";

/**
 * Rewritten because the original was false, and graded a correct student wrong.
 *
 * It asked what happens when you measure an observable A twice on a state with
 * ΔE = 0, and its answer was "the same outcome, always, because the state is
 * stationary." The hypothesis ΔE = 0 describes the state *before* the first
 * measurement. That measurement collapses it to an eigenstate of A, which is
 * in general not an energy eigenstate, so the collapsed state does evolve and
 * the second measurement can disagree.
 *
 * Counterexample, verified against the engine: H = (ħω/2)Z, |ψ⟩ = |0⟩ (an
 * energy eigenstate, so ΔE = 0), A = X. The first measurement lands on |+⟩ or
 * |−⟩. Either one evolves to pick up a relative phase ωΔt, giving
 * P(second agrees with first) = cos²(ωΔt/2). At ωΔt = π that is exactly 0:
 * the second measurement is *certain to disagree*, which is the opposite of
 * what the problem asserted.
 *
 * The damage was not only that the stated answer was wrong. The old
 * `requiredConceptGroups` demanded the phrases "same outcome" and "the state
 * doesn't evolve", so a student who correctly answered "only if A commutes
 * with H" was told they were incorrect. The question now asks for the
 * hypothesis and the counterexample, which is the thing worth learning here.
 */
export const synthesisZeroEnergyUncertaintyConsequence: ConceptualProblem = {
  meta: {
    slug: "synthesis-zero-energy-uncertainty-consequence",
    title: "Synthesis: Repeated Measurement on a Zero-Uncertainty State",
    course: "operators-observables-measurement",
    lesson: "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    difficulty: "advanced",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["synthesis", "measurement", "energy-time-uncertainty"],
    prerequisites: ["quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A state has Delta E = 0. You measure an observable A, wait a time interval, then measure A again. A tempting argument says the two results must agree, because zero energy spread makes the state stationary. That argument has a gap. Say where it breaks, name the condition on A under which the conclusion is nonetheless true, and describe what can happen when that condition fails.",
    placeholder: "Say what the first measurement does to the hypothesis...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: [
          "collapses to an eigenstate of a",
          "eigenstate of a",
          "no longer an energy eigenstate",
          "not an energy eigenstate",
          "destroys the energy eigenstate",
          "after the first measurement the state",
          "the collapsed state",
        ],
        missingFeedback:
          "Locate the gap precisely. Delta E = 0 describes the state you started with. Something happens between the two measurements that the argument never accounts for, and it is not the waiting. Say what the first measurement leaves behind and why that object no longer satisfies the hypothesis.",
      },
      {
        phrases: [
          "commutes with h",
          "commutes with the hamiltonian",
          "compatible with the hamiltonian",
          "shares eigenstates with h",
          "a is conserved",
          "conserved quantity",
          "simultaneous eigenstate",
        ],
        missingFeedback:
          "You have the gap. Now close it: state the condition on A that would make the collapsed state stationary after all, so that the tempting conclusion becomes true rather than merely plausible.",
      },
      {
        phrases: [
          "can disagree",
          "can differ",
          "need not agree",
          "not guaranteed",
          "certain to disagree",
          "depends on the interval",
          "depends on how long",
          "different outcome",
        ],
        missingFeedback:
          "Say what actually happens when the condition fails. The interesting claim is not that agreement becomes uncertain; it is stronger than that, and it depends on the interval you waited.",
      },
    ],
    incorrectFeedback:
      "The most common answer here is that the results always agree, because Delta E = 0 makes the state stationary. That is the argument the question is asking you to break. Delta E = 0 is true of the state you prepared, not of the state the first measurement leaves behind: collapse puts you in an eigenstate of A, and unless A commutes with H that is not an energy eigenstate and it does evolve.",
    modelAnswers: [
      "The argument breaks at the first measurement. Delta E = 0 is a fact about the state you prepared, and the measurement collapses it to an eigenstate of A, which in general is no longer an energy eigenstate, so it evolves during the wait. The conclusion holds exactly when A commutes with the Hamiltonian, since then the collapsed state is still stationary. When A does not commute with H the two results can disagree, and how likely that is depends on the interval: take H proportional to Z and A equal to X, and the second measurement is certain to disagree at the right waiting time.",
      "Zero energy spread applies before you measure anything. The first measurement leaves the collapsed state in an eigenstate of A, and that is not an energy eigenstate unless A is a conserved quantity, so the state does evolve while you wait. If A commutes with the Hamiltonian the two outcomes must agree. Otherwise they can differ, and for the right interval the second outcome is guaranteed to be the opposite of the first.",
    ],
  },
  hints: [
    { text: "The hypothesis Delta E = 0 is a statement about one particular state. Ask yourself which state it describes, and whether you are still holding that state when the second measurement happens." },
    { text: "Write down what the state is immediately after the first measurement. Is that an energy eigenstate? Under what condition on A would it be one?" },
    { text: "For a concrete case, take H proportional to Z and A equal to X, and start in the energy eigenstate |0>. Follow one branch of the first measurement through the wait and compute the probability that the second measurement agrees." },
  ],
  solution: {
    steps: [
      {
        description:
          "$\\Delta E=0$ says the *prepared* state is an energy eigenstate, so on its own it would not evolve except by an overall phase. The first measurement of $A$ intervenes: it projects onto an eigenstate of $A$. That is a different state, and the hypothesis says nothing about it.",
      },
      {
        description:
          "The collapsed state is an energy eigenstate exactly when $A$ commutes with the Hamiltonian, $[A,H]=0$, since that is the condition for the two to share eigenstates. In that case the state is stationary through the wait and the second measurement must reproduce the first, which is the conclusion the tempting argument reached for the wrong reason.",
      },
      {
        description:
          "When $[A,H]\\neq0$ the collapsed state evolves. Take $H=\\tfrac{\\hbar\\omega}{2}Z$, $|\\psi\\rangle=|0\\rangle$ (so $\\Delta E=0$) and $A=X$. The first measurement leaves $|+\\rangle$ or $|-\\rangle$; either picks up a relative phase $\\omega\\Delta t$, giving $P(\\text{agree})=\\cos^{2}(\\omega\\Delta t/2)$.",
      },
      {
        description:
          "At $\\omega\\Delta t=\\pi$ that probability is exactly $0$: the second measurement is certain to give the *opposite* result. So the interval matters, and in the sharpest case it reverses the naive conclusion rather than merely weakening it.",
      },
    ],
    finalAnswer:
      "The argument breaks because Delta E = 0 describes the prepared state, while the first measurement collapses it to an eigenstate of A. That is an energy eigenstate only when A commutes with the Hamiltonian, and only then must the two results agree. Otherwise the collapsed state evolves and the outcomes can differ: for H proportional to Z, A = X and omega times the interval equal to pi, the second measurement is certain to disagree.",
  },
  explanation: {
    correctIdea:
      "Synthesis questions are where a half-remembered result gets applied past its hypothesis. Both ingredients here are real, and the join between them is where the reasoning fails: stationarity belongs to the state you prepared, and measurement replaces that state.",
    whyCorrect:
      "Checking a hypothesis still holds at the moment you invoke it is the habit this question is for, and the counterexample is sharp rather than marginal: the conclusion is not merely uncertain, it is exactly reversed at the right waiting time.",
    whyWrong: [
      "Answering that the results always agree applies Delta E = 0 to a state that no longer has it, because the first measurement has already replaced the prepared state.",
      "Saying the second result is simply random again overshoots. It is a definite probability, cos-squared of omega times the interval over two, which reaches both 1 and 0.",
      "Treating the energy-time relation as the mechanism gets the right shape for the wrong reason. What settles the question is whether A commutes with H, not a bound on any timescale.",
    ],
  },
};
