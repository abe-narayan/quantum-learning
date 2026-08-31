import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const gottesmanKnillWhichCircuitIsSimulableMc: MultipleChoiceProblem = {
  meta: {
    slug: "gottesman-knill-which-circuit-is-simulable-mc",
    title: "Which Circuit Gottesman-Knill Covers",
    course: "fault-tolerance-frontiers",
    lesson: "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    difficulty: "master",
    estimatedMinutes: 7,
    problemType: "multiple-choice",
    tags: ["gottesman-knill", "clifford-group", "stabilizer-circuits", "t-gate", "magic-states"],
    prerequisites: ["apex/fault-tolerance-frontiers/magic-states-and-distillation"],
  },
  question: {
    type: "multiple-choice",
    prompt:
      "Four 400-qubit circuits are proposed. For which one does the Gottesman-Knill theorem itself guarantee classical simulation in time polynomial in the number of qubits and gates?",
    options: [
      {
        id: "a",
        text: "Computational-basis preparation, then $H$, $S$ and CNOT gates entangling all 400 qubits, then Pauli measurements, with that whole round repeated 20 times.",
      },
      {
        id: "b",
        text: "Computational-basis preparation, $H$, $S$ and CNOT gates and Pauli measurements, with a single $T$ gate applied to one data qubit before the first round.",
      },
      {
        id: "c",
        text: "Computational-basis preparation and $H$ and CNOT gates, with the closing Pauli measurements each replaced by a Toffoli gate acting on three data qubits.",
      },
      {
        id: "d",
        text: "Computational-basis preparation, $H$ and CNOT gates and Pauli measurements, with every $S$ replaced by an $R_z(\\theta)$ at an angle drawn at random from $[0,2\\pi)$.",
      },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "One $T$ gate is one gate too many for this theorem. Gottesman-Knill's guarantee covers stabilizer circuits, and $T$ is outside the Clifford group, so the tableau bookkeeping the proof relies on no longer closes. Extended stabilizer-rank methods do still handle a circuit with a handful of $T$ gates, at a cost that climbs with the T-count, but that is a different result with a different guarantee, and it is why T-count became the resource a fault-tolerant estimate is built around.",
      c: "A Toffoli permutes computational-basis states, which makes it feel classical, and it is not a Clifford gate: conjugating a Pauli by it does not return a Pauli. Toffoli together with $H$ is universal, so a circuit containing them is outside the theorem's reach even though every individual step could be written down as a truth table.",
      d: "A $Z$-axis rotation stays in the Clifford group only at angles that are multiples of $\\pi/2$, which is what makes $S=R_z(\\pi/2)$ admissible. An angle drawn at random almost surely is not one of those, and $T=R_z(\\pi/4)$ up to a global phase is the standard example of one that is not: the circuit becomes universal rather than stabilizer.",
    },
    defaultIncorrectFeedback:
      "The theorem's hypothesis is a closed list: preparation in a computational basis state, gates drawn from $\\{H,S,\\text{CNOT}\\}$, and measurements of Pauli operators. Check each circuit against that list gate by gate, and treat one ingredient outside it as enough to put the circuit outside the guarantee.",
  },
  hints: [
    { text: "The theorem's hypothesis names three gates and one kind of measurement. Read each circuit as a list of ingredients and check it against that list rather than against how complicated the circuit looks." },
    { text: "For each suspect gate, ask the defining Clifford question: does conjugating a Pauli operator by it give back a Pauli operator? That, not the gate's cost or its classical-looking action, is the membership test." },
    { text: "One circuit adds an ingredient, one swaps its measurements for a different gate, and one swaps a gate for a parameterized version that belongs to the group at special angles only. Work out those angles before choosing." },
  ],
  solution: {
    steps: [
      {
        description:
          "Gottesman-Knill covers stabilizer circuits: preparation in computational-basis states, gates from the Clifford group $\\{H,S,\\text{CNOT}\\}$, and Pauli measurements. Simulation tracks $n$ stabilizer generators under conjugation rather than $2^n$ amplitudes, which is why the cost is polynomial in qubits and gates. The 20-round syndrome-extraction circuit is built from exactly those ingredients, so the guarantee applies to it.",
      },
      {
        description:
          "The $T$ gate is outside the Clifford group. Two matrix products, checked entrywise against this platform's own gate definitions, say why: $T^2=S$ and $S^2=Z$, so $T$ is half of $S$, which is half of $Z$. It is a strictly finer phase rotation than the group contains, and inserting one removes the circuit from the theorem's hypothesis.",
      },
      {
        description:
          "Toffoli is not Clifford either: conjugating a Pauli by it produces an operator outside the Pauli group, and Toffoli with $H$ is universal. A random $R_z(\\theta)$ lies in the Clifford group only when $\\theta$ is a multiple of $\\pi/2$; $S$ is the $\\pi/2$ case and $T$ is the $\\pi/4$ case that is not.",
      },
      {
        description:
          "What the excluded gate costs is the rest of the lesson. Eastin-Knill rules out a universal transversal gate set on any code that still corrects arbitrary single-qubit errors, and the surface code spends its transversal budget on Cliffords, so a logical $T$ is injected from a distilled magic state instead. One round of 15-to-1 distillation consumes 15 noisy $|T\\rangle$ copies to yield one at $\\epsilon_{\\text{out}}\\approx35\\epsilon_{\\text{in}}^3$, and those 15 inputs are 15 code patches: at the resource-estimation capstone's distance 9 that is $15\\times161=2415$ physical qubits for a single output state.",
      },
    ],
    finalAnswer:
      "The 20-round syndrome-extraction circuit: preparation, H, S, CNOT and Pauli measurements, and nothing else. The other three each smuggle in a non-Clifford ingredient (a T gate, a Toffoli, a generic Rz), and a single one of those is enough to leave the theorem behind.",
  },
  explanation: {
    correctIdea:
      "Gottesman-Knill is a statement about a closed gate set, not about circuit size or apparent difficulty: a stabilizer circuit on any number of qubits is efficiently simulable, and one gate outside the Clifford group ends the guarantee.",
    whyCorrect:
      "The proof tracks $n$ Pauli stabilizer generators under conjugation, which works only because a Clifford gate maps Paulis to Paulis and so keeps the description at $n$ generators. A non-Clifford gate breaks the closure that makes the representation finite, and with it the polynomial cost. This is why every syndrome-extraction circuit in the error-correction track is classically simulable, and why reliability alone was never the missing ingredient for quantum advantage.",
    whyWrong: [
      "Judging a circuit by its size or by how many rounds it runs. Four hundred qubits and twenty rounds are irrelevant to the hypothesis; the gate set is the whole test.",
      "Assuming a single non-Clifford gate is too small to matter. The theorem's hypothesis is not graded, and the methods that do handle a few T gates pay a cost that grows with the count, which is the reason T-count is the number a resource estimate is built around.",
      "Reading a basis-permuting gate as classical. Toffoli has a classical truth table and is still non-Clifford, and with H it is universal, so no argument from 'it looks classical' survives contact with the Clifford membership test.",
    ],
  },
};
