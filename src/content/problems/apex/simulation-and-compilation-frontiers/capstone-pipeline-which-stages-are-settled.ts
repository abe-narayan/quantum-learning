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
      "The capstone's four-stage pipeline (classical-simulability check, T-count synthesis, routing overhead, fault-tolerant resource estimate) was deliberately not presented as equally certain end to end. Explain which stages are well-established, routine engineering practice today, and what is still open to research uncertainty in the remaining stage. Is it the four-step resource-estimation method itself, or something else?",
    placeholder:
      "Distinguish 'we know how to compute this' from 'the specific numbers this produces are still moving targets', and say what exactly is still uncertain.",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["classical simulability", "t-count", "synthesis", "routing", "compilation", "swap overhead", "engineering practice", "solved", "routine", "toolchain", "transpiler"],
        missingFeedback:
          "Name the stages that already have automated tool support today. The answer has to separate them from the one that does not.",
      },
      {
        phrases: ["decoder", "physical error rate", "code choice", "architecture", "qldpc", "still evolving", "moving target", "assumption", "not settled yet"],
        missingFeedback:
          "You have named what is settled. Now say what remains uncertain in the last stage, in terms of the specific quantities that are still moving.",
      },
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
          "You have put the soft spot in Stage 4. Say where inside Stage 4 it sits. The recipe there is as settled as the three stages before it; what moves is the values it is handed, and there are three of those worth naming.",
      },
    ],
    incorrectFeedback:
      "The question asks you to locate the soft spot, and there are two ways to get it wrong. One is to call the whole pipeline settled because every stage has a published recipe. The other is to call the last stage soft as a whole, when what actually moves there is not its recipe but the values that recipe is handed. Walk the four stages and say, for each, whether anyone is still arguing about how to compute the quantity, or only about what value to feed in.",
    partialFeedback:
      "Part of the distinction is there. Two things still need saying: which of the four stages are already done automatically by tools people run today, and, for the last one, that what moves is the values it is handed rather than the recipe it follows.",
    modelAnswers: [
      "The first three stages are routine. Classical simulability checks, T-count synthesis and routing overhead are all in the standard toolchain now. What is still moving is stage four's numbers: the physical error rate you actually achieve, decoder performance, and which code or architecture you assume. The four-step method itself is sound; it is the inputs that are open.",
      "Simulability, synthesis and compilation are solved engineering with transpiler support. The resource estimate's structure is solid too, but its inputs are still an assumption: decoder quality, achieved physical error rate, code choice. So the uncertainty is in the numbers fed into the method, not the method itself.",
    ],
  },
  hints: [
    { text: "For each stage ask: is there an open research question about how to compute this quantity at all, or is the computation already worked out and simply needs running?" },
    { text: "Stages 1 to 3 are things real compiler tools already do automatically today, for near-term circuits on real device connectivity graphs." },
    { text: "Stage 4's recipe (union bound, then distance, then distillation, then a qubit sum) is the same structure published estimates use. Ask what part of it a reader could argue with today." },
  ],
  solution: {
    steps: [
      { description: "Stage 1 (classical-simulability check) and Stage 2 (T-count via Clifford+T synthesis) are solved, deterministic computations: given a circuit, there is no open question about how to check simulability or count T-gates after synthesis." },
      { description: "Stage 3 (routing/SWAP overhead from a device's real connectivity graph) is likewise routine: real compiler toolchains (Qiskit's transpiler, tket, and others) perform exactly this optimization automatically today." },
      { description: "Stage 4's four-step resource-estimation methodology (error budget via union bound, code distance from the threshold scaling law, magic-state factory sizing, total qubit sum) is equally solid as a structure. But the numbers it outputs are only as good as its inputs, and those inputs (the physical error rate a real device achieves, real-time decoder throughput and accuracy, and the choice of code/architecture family) are still active research questions whose answers are evolving as hardware and decoding algorithms mature." },
    ],
    finalAnswer:
      "Stages 1-3 (simulability check, T-count synthesis, routing overhead) are routine, already-automated engineering practice. Stage 4's four-step method is equally solid as a structure, but its numeric inputs (achieved physical error rate, decoder performance, code/architecture choice) are still active research uncertainty. The uncertainty is in the inputs, not the method.",
  },
  explanation: {
    correctIdea:
      "A pipeline can have a completely solid, well-established structure at every stage while still having some stages whose numeric inputs are settled engineering and others whose numeric inputs are open research questions.",
    whyCorrect:
      "Confidence has to be assigned stage by stage. Three of the four stages are computations that shipping tools already perform; the fourth has an equally settled procedure whose numeric inputs are still moving. Grading the pipeline as uniformly solid, or uniformly speculative, loses exactly that distinction.",
    whyWrong: [
      "Claiming the four-step resource-estimation method itself is unreliable or unproven conflates the (solid) method with its (still-evolving) numeric inputs.",
      "Claiming every stage of the pipeline is equally settled engineering ignores that Stage 4's outputs are sensitive to assumptions (physical error rate, decoder throughput, code choice) that Stages 1-3 simply don't depend on.",
    ],
  },
  relatedConcepts: ["apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"],
};
