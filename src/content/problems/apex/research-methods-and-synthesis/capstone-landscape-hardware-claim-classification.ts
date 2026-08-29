import type { ConceptualProblem } from "@/lib/problems/types";

export const capstoneLandscapeHardwareClaimClassification: ConceptualProblem = {
  meta: {
    slug: "capstone-landscape-hardware-claim-classification",
    title: "Classifying a 'Fault-Tolerant Quantum Computing Has Arrived' Claim",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    difficulty: "master",
    estimatedMinutes: 10,
    problemType: "conceptual",
    tags: ["state-of-the-field", "hardware", "fault-tolerance", "claim-evaluation", "synthesis"],
    prerequisites: [
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
    ],
  },
  question: {
    type: "conceptual",
    prompt:
      "A headline claims: 'Company X's new 1,121-physical-qubit superconducting processor means fault-tolerant quantum computing has arrived.' Using this capstone's state-of-the-field framework (the proven / strongly-evidenced-conjecture / genuinely-open tiers, reused from Quantum Complexity Theory's own capstone), break this claim into its separate pieces, classify what is actually established versus merely implied, and state precisely what would have to be demonstrated for 'fault-tolerant quantum computing has arrived' to be a fair description rather than marketing shorthand for a raw qubit count.",
    placeholder:
      "Start by separating 'a device has N physical qubits' from 'fault-tolerant quantum computing has arrived' -- are these the same claim? What does the threshold theorem actually require to be demonstrated, not just assumed, before that second sentence is earned?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["physical qubit", "logical qubit", "physical vs logical", "distinguish physical and logical"],
      {
        phrases: [
          "threshold theorem",
          "below threshold",
          "below the threshold",
          "error rate below threshold",
          "code distance",
          "physical error rate",
        ],
        missingFeedback:
          "You have separated physical from logical qubits. Name the condition that decides whether the headline is earned: the threshold theorem only delivers suppression once the achieved physical error rate is below threshold and a sufficient code distance is actually run, and a raw qubit count reports neither number.",
      },
      [
        "qubit count alone",
        "not sufficient",
        "not yet demonstrated",
        "no full fault-tolerant",
        "aspirational",
        "not yet achieved",
        "sustained computation",
      ],
    ],
    incorrectFeedback:
      "The claim silently substitutes a physical-qubit count for a fault-tolerance claim, and those are not the same thing. The threshold theorem is a genuinely proven (Tier 1) result -- but what it proves is that logical error rate can be suppressed arbitrarily far below physical error rate, PROVIDED the physical error rate is below a threshold AND the resulting logical qubits are actually assembled into a sustained, universal, error-corrected computation. A qubit count by itself says nothing about the achieved physical error rate, the code distance actually run, or whether any logical qubit -- let alone enough of them, wired together through the lattice-surgery and magic-state machinery Fault Tolerance Frontiers built -- has been operated below its physical error rate through a real computation. 'Fault-tolerant quantum computing has arrived' is a claim about that whole assembled, sustained system, not about physical qubit count, which this platform's own Scaling Challenges lesson already showed is an incomplete metric on its own.",
    partialFeedback:
      "You have part of the picture -- make sure you explicitly separate the proven threshold theorem (Tier 1) from the further, not-yet-demonstrated claim that a large-scale sustained fault-tolerant computation has actually been run, and say what evidence (not just qubit count) would be needed to bridge that gap.",
  },
  hints: [
    { text: "The threshold theorem is a real, proven (Tier 1) result. What exactly does it guarantee, and what conditions does it require to be met before that guarantee kicks in?" },
    { text: "Recall Quantum Hardware's own Scaling Challenges lesson: is raw qubit count, by itself, ever a complete description of a device's capability?" },
    { text: "What is the difference between 'a chip has 1,121 physical qubits' and 'a logical qubit built from some of those physical qubits has been operated below the physical error rate, through a sustained, universal computation'?" },
  ],
  solution: {
    steps: [
      { description: "Separate the claim into two distinct pieces: (1) a specific, physical-qubit count, and (2) the much stronger inference 'therefore fault-tolerant quantum computing has arrived.' These are not logically the same statement." },
      { description: "The threshold theorem itself is a genuinely proven Tier 1 result: if the physical per-gate error rate is below a threshold value, encoding into a code of sufficient distance can suppress the logical error rate arbitrarily far below the physical rate, at a qubit-overhead cost that grows only polylogarithmically in the target error rate." },
      { description: "But that theorem is conditional on things a bare qubit count does not report: the actual achieved physical error rate (is it below threshold at all, and by how much?), the code distance actually implemented, and whether logical qubits built this way have been wired together (via lattice surgery, magic-state distillation) into a sustained, universal computation rather than an isolated demonstration." },
      { description: "'Fault-tolerant quantum computing has arrived' would require evidence at that fuller level: a demonstrated, below-physical-error logical qubit (or several), operated through a real, sustained, universal computation at the code distance and qubit counts the target algorithm's own resource estimate requires -- not merely a large raw qubit count on a single chip." },
    ],
    finalAnswer:
      "The threshold theorem (Tier 1, proven) guarantees that suppression IS possible below threshold, at sufficient code distance -- but a physical qubit count alone establishes none of the conditions that guarantee actually requires: the achieved physical error rate, the code distance run, or whether any logical qubit has been operated below its physical error rate through a sustained, universal computation. 'Fault-tolerant quantum computing has arrived' is a claim about that full assembled system, which a qubit count by itself does not establish.",
  },
  explanation: {
    correctIdea:
      "A proven theorem's guarantee and the empirical conditions required to invoke that guarantee are two different things; a headline qubit count speaks to neither the conditions nor the guarantee directly.",
    whyCorrect:
      "This is exactly the same precision this platform's Quantum Complexity Theory capstone insists on for random circuit sampling: state what is proven, state what evidence exists, and be explicit about the gap between the two -- applied here to a hardware claim instead of a complexity-theoretic one.",
    whyWrong: [
      "Accepting the headline at face value conflates a proven theorem's existence with its conditions having been met and verified in this specific device.",
      "Dismissing the qubit count as meaningless overcorrects -- a large, well-connected, low-error device is real progress toward the conditions the threshold theorem requires, even though qubit count alone doesn't establish that those conditions were met.",
    ],
  },
};
