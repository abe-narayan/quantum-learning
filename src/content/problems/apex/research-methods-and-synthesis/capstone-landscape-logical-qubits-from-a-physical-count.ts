import type { NumericProblem } from "@/lib/problems/types";

export const capstoneLandscapeLogicalQubitsFromAPhysicalCount: NumericProblem = {
  meta: {
    slug: "capstone-landscape-logical-qubits-from-a-physical-count",
    title: "What 1,121 Physical Qubits Actually Buys",
    course: "research-methods-and-synthesis",
    lesson: "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    difficulty: "master",
    estimatedMinutes: 9,
    problemType: "numeric",
    tags: ["state-of-the-field", "resource-estimation", "fault-tolerance", "claim-evaluation", "synthesis"],
    prerequisites: [
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  question: {
    type: "numeric",
    prompt:
      "A press release leads with a 1,121-physical-qubit superconducting processor and calls it a step into the fault-tolerant era. This capstone's first question about a headline qubit count is whether it is physical or logical, and the resource-estimation pipeline the prerequisite Fault Tolerance Frontiers capstone built is what turns one into the other. Use that capstone's operating point: rotated surface-code patches at distance d = 9, each holding d² data qubits plus d² − 1 syndrome-measurement ancilla qubits. Setting routing space and any magic-state factory aside, how many complete distance-9 logical patches fit inside 1,121 physical qubits?",
    inputHint: "an integer (a number of logical patches)",
  },
  answer: {
    type: "numeric",
    value: 6,
    tolerance: 0,
    incorrectFeedback:
      "Two numbers combine here: what one patch costs at this distance, and how many whole copies of that cost the budget covers. The cost is not the data-qubit count on its own, because the syndrome-measurement ancillas are physical hardware sitting on the same chip and have to be paid for out of the same 1,121. And a fraction of a patch corrects nothing, so the division has to be resolved downward.",
    nearMisses: [
      {
        value: 13,
        feedback:
          "13 is 1,121 divided by the 81 data qubits alone. Those data qubits cannot be error-corrected without the syndrome-measurement qubits that read the stabilizers, and at distance 9 that is 80 more physical qubits per patch, on the same chip and out of the same budget.",
      },
      {
        value: 7,
        feedback:
          "7 is the division rounded the wrong way: 1,121/161 = 6.96. The 155 qubits left after six patches are six short of a seventh, and a patch missing six qubits is not a distance-9 patch. Partial patches do not correct partial errors.",
      },
      {
        value: 1121,
        feedback:
          "1,121 is the headline number read as though the chip's qubits were already logical. Substituting one count for the other is precisely what the press release invites, and the calculation exists to show the two differ by the 161 physical qubits every distance-9 patch costs.",
      },
      {
        value: 0,
        feedback:
          "0 is what you get if a magic-state factory has to fit as well: one round of 15-to-1 distillation is 15 patches, or 2,415 physical qubits, more than twice the whole chip. The prompt sets the factory aside deliberately, and the fact that it does not fit is the finding rather than the answer.",
      },
    ],
  },
  hints: [
    { text: "This lesson's Hardware row and Scaling Challenges before it make the same point about a raw component count: before dividing, work out what one unit of the thing you actually want costs." },
    { text: "Write down the physical-qubit cost of a single distance-9 rotated patch from the two counts the prompt gives, then set that against the chip's budget as a division." },
    { text: "The division does not come out whole. Decide which way a leftover fraction of a patch has to be resolved before reporting an integer." },
  ],
  solution: {
    steps: [
      {
        description:
          "One rotated patch at $d=9$ costs $d^2=81$ data qubits plus $d^2-1=80$ ancilla qubits, so $2d^2-1=161$ physical qubits in total. That is the prerequisite capstone's own per-patch figure, and it is the unit the headline number has to be measured in.",
      },
      {
        description:
          "$1121/161=6.96$, so six complete patches fit, using $6\\times161=966$ physical qubits and leaving 155 spare, six short of a seventh patch. The answer is 6 logical qubits.",
      },
      {
        description:
          "Set that against the pipeline's own toy algorithm, which assumed exactly six logical qubits and came to 3,381 physical qubits: 966 for the compute register and $15\\times161=2415$ for a single 15-to-1 magic-state factory. This chip covers the compute register and none of the factory, and the factory was 71.4% of that estimate.",
      },
      {
        description:
          "So the headline count is physical, and at this operating point it buys six logical qubits, no T gates, and no routing space. Nothing in it bears on the claim being made, which is about a machine that has been assembled and run below threshold through a complete computation.",
      },
    ],
    finalAnswer:
      "6 logical patches. At 161 physical qubits each, 1,121/161 = 6.96 rounds down to 6, with 155 qubits spare and nothing left over for the 2,415-qubit magic-state factory the same pipeline says a universal computation needs.",
  },
  explanation: {
    correctIdea:
      "A logical qubit is not a qubit; it is a patch whose size is set by the code distance the target error rate demands, and converting a headline physical count into logical qubits is a division by that patch's full cost.",
    whyCorrect:
      "Both halves of the patch are real hardware. The $d^2$ data qubits hold the encoded state and the $d^2-1$ ancillas are what make the stabilizers measurable at all, so a chip cannot buy the first without the second. Dividing the budget by the whole 161 and discarding the remainder is the only reading under which every counted patch is actually a distance-9 patch.",
    whyWrong: [
      "Counting data qubits and treating syndrome extraction as free. Nothing about the code works without repeated stabilizer measurement, and the qubits that perform it sit on the same chip as the data.",
      "Rounding a fractional patch up. Code distance is not an average; a patch six qubits short has a shorter minimum-weight logical operator and therefore a different, worse error rate.",
      "Reading the headline number as logical. That substitution is the single most common way a hardware announcement outruns its own evidence, and it is the first thing this capstone tells you to check.",
    ],
  },
};
