export type JourneyStep = {
  title: string;
  description: string;
};

export type JourneyTrack = {
  label: string;
  steps: JourneyStep[];
};

/**
 * Two short, parallel tracks — Quantum Mechanics and Quantum Computing —
 * rather than one combined list. Both start from the same math foundations
 * course, so the fork is real: a learner genuinely picks a direction from
 * here, not just a re-labeled continuation of one path.
 */
export const JOURNEY_TRACKS: JourneyTrack[] = [
  {
    label: "Quantum mechanics",
    steps: [
      {
        title: "Mathematical Foundations",
        description: "The complex numbers and linear algebra every course here — physics or computing — builds on.",
      },
      {
        title: "States & the Postulates",
        description: "Observables, measurement, and time evolution — the rules that define quantum mechanics.",
      },
      {
        title: "Wave Mechanics",
        description: "The wavefunction, the Schrödinger equation in position space, and tunneling — explored with a real FFT-based simulator.",
      },
      {
        title: "Angular Momentum & Spin",
        description: "Ladder operators, spherical harmonics, and spin — building toward a real three-dimensional atom.",
      },
      {
        title: "The Hydrogen Atom",
        description: "Solving a real atom exactly, and where quantum numbers actually come from.",
      },
    ],
  },
  {
    label: "Quantum computing",
    steps: [
      {
        title: "Mathematical Foundations",
        description: "The complex numbers and linear algebra every course here — physics or computing — builds on.",
      },
      {
        title: "Qubits",
        description: "The basic unit of quantum information, and how it differs from a classical bit.",
      },
      {
        title: "Quantum Gates",
        description: "The operations that transform qubit states — rotations on the Bloch sphere.",
      },
      {
        title: "Entanglement & Mixed States",
        description: "Correlations between qubits that have no classical explanation, made precise with density matrices.",
      },
      {
        title: "Quantum Algorithms",
        description: "Combining gates and interference to solve problems no classical computer can match.",
      },
    ],
  },
];
