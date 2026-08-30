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
      "Start by separating 'a device has N physical qubits' from 'fault-tolerant quantum computing has arrived'. Are these the same claim? What does the threshold theorem require to be demonstrated, not just assumed, before that second sentence is earned?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["physical qubit", "logical qubit", "physical vs logical", "distinguish physical and logical"],
        missingFeedback:
          "Your answer treats the device's qubits as one thing. The headline's two sentences are about two different kinds of qubit; name both and keep them apart.",
      },
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
          "The two kinds of count are separated. What is still missing is the condition attached to the guarantee. The theorem does not promise suppression unconditionally; it promises it only once the measured error rate is under a particular bar and a large enough encoding is actually being run. Name that condition, and note that an inventory reports neither number.",
      },
      {
        phrases: ["qubit count alone", "not sufficient", "not yet demonstrated", "no full fault-tolerant", "aspirational", "not yet achieved", "sustained computation"],
        missingFeedback:
          "You have named the conditions the guarantee needs. Now say plainly what a raw device number does and does not settle, and what would have to be shown for the headline to be earned.",
      },
    ],
    incorrectFeedback:
      "The announcement swaps one quantity for a different one and counts on the reader not noticing. A count of components is an inventory. The headline is a claim about a machine that has been assembled and run: that its measured error rate came in under the bar the theory requires, that a large enough encoding was actually operated, and that a real computation stayed correct for its whole length. None of those three facts appear anywhere in an inventory. Say which theorem is genuinely proved, what preconditions it attaches to its guarantee, and which of them the announcement leaves unstated.",
    partialFeedback:
      "Part of it is there. Three things have to appear: the two different kinds of thing a count could be counting, the precondition the proved theorem attaches to its guarantee, and the specific fact an inventory number cannot establish about a machine that has actually been run.",
    modelAnswers: [
      "Two claims are being run together. 'We built 1,121 physical qubits' is a hardware fact; 'fault tolerance has arrived' is a claim about logical qubits. The threshold theorem only promises suppression once the physical error rate is below threshold at a large enough code distance, and a qubit count alone tells you none of that. It would be fair once someone has demonstrated a logical qubit outliving its parts through a sustained computation.",
      "A raw qubit count alone is not sufficient. What matters is whether any logical qubit was run below the threshold at a real code distance, which is what the threshold theorem requires. That has not yet been demonstrated, so the headline is aspirational rather than a description of a physical qubit tally.",
    ],
  },
  hints: [
    { text: "The theorem being invoked is genuinely proved. Ask what it promises, and what has to be true before the promise takes effect." },
    { text: "Recall Quantum Hardware's Scaling Challenges lesson: is a raw component inventory ever a complete description of what a device can do?" },
    { text: "There is a difference between 'a chip contains 1,121 of something' and 'one encoded unit built from some of them was operated, under the required error rate, for the length of a whole computation.' Say what closes that gap." },
  ],
  solution: {
    steps: [
      { description: "Separate the claim into two distinct pieces: (1) a specific, physical-qubit count, and (2) the much stronger inference 'therefore fault-tolerant quantum computing has arrived.' These are not logically the same statement." },
      { description: "The threshold theorem itself is a genuinely proven Tier 1 result: if the physical per-gate error rate is below a threshold value, encoding into a code of sufficient distance can suppress the logical error rate arbitrarily far below the physical rate, at a qubit-overhead cost that grows only polylogarithmically in the target error rate." },
      { description: "But that theorem is conditional on things a bare qubit count does not report: the actual achieved physical error rate (is it below threshold at all, and by how much?), the code distance actually implemented, and whether logical qubits built this way have been wired together (via lattice surgery, magic-state distillation) into a sustained, universal computation rather than an isolated demonstration." },
      { description: "'Fault-tolerant quantum computing has arrived' would require evidence at that fuller level: a demonstrated, below-physical-error logical qubit (or several), operated through a real, sustained, universal computation at the code distance and qubit counts the target algorithm's own resource estimate requires, not merely a large raw qubit count on a single chip." },
    ],
    finalAnswer:
      "The threshold theorem (Tier 1, proven) guarantees that suppression is possible below threshold at sufficient code distance. A physical qubit count alone establishes none of the conditions that guarantee requires: the achieved physical error rate, the code distance run, or whether any logical qubit has been operated below its physical error rate through a sustained, universal computation. 'Fault-tolerant quantum computing has arrived' is a claim about that full assembled system, which a qubit count by itself does not establish.",
  },
  explanation: {
    correctIdea:
      "A proven theorem's guarantee and the empirical conditions required to invoke that guarantee are two different things; a headline qubit count speaks to neither the conditions nor the guarantee directly.",
    whyCorrect:
      "This is the same precision the Quantum Complexity Theory capstone insists on for random circuit sampling, applied to a hardware claim instead of a complexity-theoretic one: state what is proven, state what evidence exists, and be explicit about the gap between the two.",
    whyWrong: [
      "Accepting the headline at face value conflates a proven theorem's existence with its conditions having been met and verified in this specific device.",
      "Dismissing the qubit count as meaningless overcorrects. A large, well-connected, low-error device is real progress toward the conditions the threshold theorem requires, even though qubit count alone does not establish that those conditions were met.",
    ],
  },
};
