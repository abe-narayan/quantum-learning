import type { ConceptualProblem } from "@/lib/problems/types";

export const whyGlobalPhaseToleranceCorrect: ConceptualProblem = {
  meta: {
    slug: "why-global-phase-tolerance-correct",
    title: "Why Checking 'Up to Global Phase' Is Correct, Not a Shortcut",
    course: "compilation-and-hybrid-algorithms",
    lesson: "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    difficulty: "advanced",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["gate-decomposition", "conceptual"],
    prerequisites: ["quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain why matricesEqualUpToGlobalPhase is the physically correct way to verify a gate decomposition, rather than a looser approximation of 'true' equality.",
    placeholder: "Global phase is unobservable because...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["unobservable", "no measurement can detect", "cancels in probabilities"],
        missingFeedback:
          "Say why an overall phase makes no difference to anything measurable. That is the physics the tool is built on.",
      },
      {
        phrases: ["same physical gate", "identical physical gate", "physically identical", "identical gate", "same gate", "correct decomposition"],
        missingFeedback:
          "You have the physics. Now say what follows about two matrices that differ only by that factor, and therefore why the looser-looking check is actually the right one.",
      },
    ],
    incorrectFeedback: "Two claims, and the second is the one usually skipped. First, say why an overall factor of e^{iφ} on a state can never show up in any experiment, and point at the step in the probability rule where it disappears. Second, draw the consequence for the checker: if two matrices differ only by that factor, they are the same object as far as the machine is concerned, so tolerating it is not a relaxation of the test but the right test.",
    partialFeedback: "Good. Now draw the consequence: a decomposition that agrees up to that factor is fully right, not an approximation, so a checker insisting on literal matrix agreement would be rejecting good answers.",
    modelAnswers: [
      "Global phase is unobservable: it cancels in probabilities, so no measurement can detect it. Two matrices differing only by an overall phase therefore implement the identical physical gate, so checking equality up to phase is the physically correct test rather than a loosened one.",
      "Since no measurement can detect an overall phase, a decomposition differing from the target by one is the same gate physically. Demanding exact matrix equality would reject a correct decomposition.",
    ],
  },
  hints: [
    { text: "Mathematical Foundations established that multiplying an entire state vector by e^{iφ} changes nothing observable, since probabilities involve |amplitude|², where the phase cancels." },
    { text: "Two gate matrices differing only by a global phase factor produce identical measurement statistics on every possible input state." },
    { text: "So requiring exact matrix equality, with no phase tolerance, would incorrectly reject decompositions that are physically correct." },
  ],
  solution: {
    steps: [
      { description: "A global phase e^{iφ} multiplying an entire state vector is unobservable. Any measurement probability involves |amplitude|², and the phase factor cancels out completely (Mathematical Foundations)." },
      { description: "Two gate matrices differing only by such a phase produce identical measurement outcomes for every possible input, so they implement the same physical gate." },
      { description: "Checking equality up to global phase is therefore the physically correct equivalence for verifying a decomposition, not a loosened or approximate check. Requiring exact matrix equality would incorrectly reject genuinely correct decompositions." },
    ],
    finalAnswer: "Global phase is unobservable in any measurement, so two matrices differing only by phase implement the identical physical gate. Checking equality up to phase is the physically correct verification, not an approximation.",
  },
  explanation: {
    correctIdea: "This connects a practical compilation-verification tool back to a foundational physics fact, global phase invariance, showing why the engineering choice is correct rather than merely convenient.",
    whyCorrect: "Probabilities come from |amplitude|², where an overall e^{iφ} cancels against its own conjugate. Two matrices differing only by that factor therefore agree on every outcome of every experiment, so tolerating it is the exact equivalence and demanding literal equality would reject correct work.",
    whyWrong: ["Treating phase tolerance as a looser or less strict check misunderstands that it is the more precise physical equivalence, excluding only unobservable differences."],
  },
};
