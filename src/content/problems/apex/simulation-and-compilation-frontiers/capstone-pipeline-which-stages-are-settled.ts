import type { ConceptualProblem } from "@/lib/problems/types";

export const capstonePipelineWhichStagesAreSettled: ConceptualProblem = {
  meta: {
    slug: "capstone-pipeline-which-stages-are-settled",
    title: "Which Pipeline Stages Are Settled, and Which Are Still Research",
    course: "simulation-and-compilation-frontiers",
    lesson: "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count",
    difficulty: "master",
    estimatedMinutes: 8,
    problemType: "conceptual",
    tags: ["resource-estimation", "compilation-pipeline", "fault-tolerance", "research-calibration"],
    prerequisites: ["apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count"],
  },
  question: {
    type: "conceptual",
    prompt:
      "The capstone's four-stage pipeline (classical-simulability check, T-count synthesis, routing overhead, fault-tolerant resource estimate) was deliberately not presented as equally certain end to end. Explain which stages are well-established, routine engineering practice today, and what specifically is still open to research uncertainty in the remaining stage -- is it the four-step resource-estimation method itself, or something else?",
    placeholder:
      "Distinguish 'we know how to compute this' from 'the specific numbers this produces are still moving targets', and say what exactly is still uncertain.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["classical simulability", "t-count", "synthesis", "routing", "compilation", "swap overhead", "engineering practice", "solved", "routine", "toolchain", "transpiler"],
      ["decoder", "physical error rate", "code choice", "architecture", "qldpc", "still evolving", "moving target", "assumption", "uncertain"],
      {
        phrases: [
          "input",
          "not the method",
          "method itself",
          "methodology",
          "method is solid",
          "method is sound",
          "structure is solid",
          "structure of the method",
          "four-step",
          "four step",
          "numbers it is fed",
          "numbers fed into",
        ],
        missingFeedback:
          "You have located the uncertainty in Stage 4. Say where inside Stage 4 it sits: the four-step method itself is as settled as Stages 1 to 3, and what moves is the numbers fed into it, the achieved physical error rate, decoder throughput and accuracy, and the code or architecture family chosen.",
      },
    ],
    incorrectFeedback:
      "Stages 1-3 (classical-simulability checking, T-count synthesis, routing/SWAP-overhead compilation) are routine, already-automated engineering practice -- real compiler toolchains do this today. Stage 4's four-step resource-estimation *method* is equally solid, but the specific numbers it outputs depend on assumptions still under active research: the physical error rate a real device achieves, real-time decoder throughput and accuracy, and the specific code/architecture family chosen (e.g. surface codes vs. emerging qLDPC codes).",
    partialFeedback:
      "You've captured part of the distinction. Make sure your answer also names which stages are already routine engineering (classical-simulability check, T-count synthesis, routing overhead) and explicitly says that Stage 4's uncertainty is in its numeric inputs, not in the four-step method's structure.",
  },
  hints: [
    { text: "Ask, for each stage: is there an open research question about how to compute this quantity at all, or is the computation itself already solved and just needs to be run?" },
    { text: "Stages 1-3 are things real compiler toolchains (transpilers) already do automatically today for near-term circuits and real device connectivity graphs." },
    { text: "Stage 4's method (union bound -> code distance -> distillation -> qubit sum) is the same solid structure real published estimates use; what's uncertain is the inputs it's fed -- achieved physical error rate, decoder performance, and code/architecture choice." },
  ],
  solution: {
    steps: [
      { description: "Stage 1 (classical-simulability check) and Stage 2 (T-count via Clifford+T synthesis) are solved, deterministic computations: given a circuit, there is no open question about how to check simulability or count T-gates after synthesis." },
      { description: "Stage 3 (routing/SWAP overhead from a device's real connectivity graph) is likewise routine: real compiler toolchains (Qiskit's transpiler, tket, and others) perform exactly this optimization automatically today." },
      { description: "Stage 4's four-step resource-estimation *methodology* (error budget via union bound, code distance from the threshold scaling law, magic-state factory sizing, total qubit sum) is equally solid as a structure -- but the numbers it outputs are only as good as its inputs, and those inputs (the physical error rate a real device actually achieves, real-time decoder throughput and accuracy, and the choice of code/architecture family) are still active research questions whose answers are evolving as hardware and decoding algorithms mature." },
    ],
    finalAnswer:
      "Stages 1-3 (simulability check, T-count synthesis, routing overhead) are routine, already-automated engineering practice. Stage 4's four-step method is equally solid as a structure, but its numeric inputs (achieved physical error rate, decoder performance, code/architecture choice) are still genuine, active research uncertainty -- the uncertainty is in the inputs, not the method.",
  },
  explanation: {
    correctIdea:
      "A pipeline can have a completely solid, well-established structure at every stage while still having some stages whose numeric inputs are settled engineering and others whose numeric inputs are open research questions.",
    whyCorrect:
      "This is exactly the distinction the lesson's Physical Interpretation section draws explicitly, calibrated confidence by stage rather than treating the whole pipeline, or the whole of Stage 4, as uniformly certain or uniformly speculative.",
    whyWrong: [
      "Claiming the four-step resource-estimation method itself is unreliable or unproven conflates the (solid) method with its (still-evolving) numeric inputs.",
      "Claiming every stage of the pipeline is equally settled engineering ignores that Stage 4's outputs are sensitive to assumptions (physical error rate, decoder throughput, code choice) that Stages 1-3 simply don't depend on.",
    ],
  },
  relatedConcepts: ["apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"],
};
