export type JourneyStep = {
  title: string;
  description: string;
};

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: "Qubits",
    description: "The basic unit of quantum information, and how it differs from a classical bit.",
  },
  {
    title: "Quantum Gates",
    description: "The operations that transform qubit states — rotations on the Bloch sphere.",
  },
  {
    title: "Superposition & Measurement",
    description: "Why a qubit can hold many states at once, and what happens when you measure it.",
  },
  {
    title: "Entanglement",
    description: "Correlations between qubits that have no classical explanation.",
  },
  {
    title: "Quantum Algorithms",
    description: "Combining gates and interference to solve problems no classical computer can match.",
  },
];
