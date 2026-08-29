import type { NumericProblem } from "@/lib/problems/types";

// Reproduces the exact 15-instruction Toffoli-from-Clifford+T circuit from
// this lesson's <StaticCircuitDiagram> (qubits 0,1 = controls, qubit 2 =
// target), so this count can't silently drift from what the lesson draws.
const toffoliCircuitInstructions: { gate: string; targets: number[] }[] = [
  { gate: "H", targets: [2] },
  { gate: "CNOT", targets: [1, 2] },
  { gate: "P", targets: [2] }, // T-dagger
  { gate: "CNOT", targets: [0, 2] },
  { gate: "T", targets: [2] },
  { gate: "CNOT", targets: [1, 2] },
  { gate: "P", targets: [2] }, // T-dagger
  { gate: "CNOT", targets: [0, 2] },
  { gate: "T", targets: [1] },
  { gate: "T", targets: [2] },
  { gate: "CNOT", targets: [0, 1] },
  { gate: "H", targets: [2] },
  { gate: "T", targets: [0] },
  { gate: "P", targets: [1] }, // T-dagger
  { gate: "CNOT", targets: [0, 1] },
];

const isTTypeGate = (instruction: { gate: string }) => instruction.gate === "T" || instruction.gate === "P";
const tTypeGates = toffoliCircuitInstructions.filter(isTTypeGate);
const totalTCount = tTypeGates.length;
const tCountOnQubit2 = tTypeGates.filter((instruction) => instruction.targets.includes(2)).length;

if (totalTCount !== 7) {
  throw new Error(`toffoli-t-count-on-target-qubit: expected total T-count 7, got ${totalTCount}.`);
}

export const toffoliTCountOnTargetQubit: NumericProblem = {
  meta: {
    slug: "toffoli-t-count-on-target-qubit",
    title: "T-Count on the Target Qubit of the Toffoli Circuit",
    course: "quantum-gates-and-circuits",
    lesson: "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "numeric",
    tags: ["universal-quantum-computation", "toffoli", "t-count"],
    prerequisites: ["quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"],
  },
  question: {
    type: "numeric",
    prompt:
      "The worked-example Toffoli-from-Clifford+T circuit uses 7 T-type gates total ($T$ or $T^\\dagger$, drawn as $P(-\\pi/4)$), split across qubit 0 (the first control), qubit 1 (the second control), and qubit 2 (the target). How many of those 7 T-type gates act on qubit 2 specifically?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value: tCountOnQubit2,
    tolerance: 0.5,
    incorrectFeedback:
      "Go instruction by instruction through the circuit and mark every T-type gate (T or T-dagger) whose target line is the target qubit, then count the marks. A miscount usually comes from missing the T-dagger gates, which count too.",
    nearMisses: [
      { value: totalTCount, feedback: "7 is the circuit's total T-count across all three qubits. The question asks only for the share landing on the target line." },
      { value: 3, feedback: "3 is what an even split across three qubits would give. This construction is not even: the target carries more than the two controls combined." },
      { value: 2, feedback: "2 is qubit 1's share. Count the T-type gates whose line is qubit 2, remembering that the T-dagger gates (drawn as P(-π/4)) count as well." },
    ],
  },
  hints: [
    { text: "List the 7 T-type gates in circuit order and note which qubit each one targets: qubit 2 gets hit three times in a row early on (interleaved with CNOTs to qubits 0 and 1), then once more right before the circuit's second Hadamard." },
    { text: "Qubit 0 and qubit 1 each get noticeably fewer T-type gates than qubit 2 in this construction." },
    { text: "Counting: qubit 0 gets 1, qubit 1 gets 2, and the remainder (out of 7 total) land on qubit 2." },
  ],
  solution: {
    steps: [
      { description: "The 7 T-type gates, in circuit order, target qubits: 2, 2, 2, 1, 2, 0, 1 (reading off the P(-π/4) and T instructions in the diagram)." },
      { description: "Grouping by qubit: qubit 0 gets 1 T-type gate, qubit 1 gets 2, and qubit 2 gets the remaining 4." },
      { description: `Directly counting the lesson's own instruction list confirms qubit 2 receives ${tCountOnQubit2} of the 7 T-type gates.` },
    ],
    finalAnswer: String(tCountOnQubit2),
  },
  explanation: {
    correctIdea:
      "The target qubit of a Toffoli carries the majority of the circuit's T-gate cost in this standard construction, since it's the qubit whose phase gets conditionally kicked by both controls.",
    whyCorrect: `Directly recounting the lesson's 15-instruction circuit gives 1 T-type gate on qubit 0, 2 on qubit 1, and ${tCountOnQubit2} on qubit 2, summing to the lesson's stated total of 7.`,
    whyWrong: [
      "Assuming the 7 T-type gates split evenly across the 3 qubits (e.g. answering ~2 or ~3 for every qubit) ignores that this specific construction concentrates T-gates on the target qubit, not the controls.",
    ],
  },
};
