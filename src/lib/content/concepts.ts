import { PILLARS } from "./curriculum";
import type { Pillar } from "./types";

/**
 * One of the 12 real simulator anchors on `/simulators` (each `<section>`
 * there is addressable as `/simulators#${simulatorId}`).
 */
export type SimulatorId =
  | "bloch-sphere"
  | "two-qubit-explorer"
  | "complex-amplitude-explorer"
  | "density-matrix-explorer"
  | "circuit-builder"
  | "grover-explorer"
  | "wavefunction-explorer"
  | "rabi-explorer"
  | "noise-explorer"
  | "syndrome-explorer"
  | "period-finding-explorer"
  | "qaoa-explorer"
  | "chsh-bell-test";

export type ConceptNode = {
  id: string;
  title: string;
  /** 1-2 sentence definition, written for this map. */
  definition: string;
  pillar: Pillar;
  /** Real lesson slugs (verified against src/content/lessons/**\/*.mdx), 1-3 entries. */
  lessonSlugs: string[];
  /** A real simulator id from /simulators, if one directly covers this concept. */
  simulatorId?: SimulatorId;
  /** ids of other ConceptNodes this concept depends on. */
  prerequisiteIds: string[];
};

/**
 * ~20-25 hand-picked, load-bearing concepts spanning all four pillars. Every
 * `lessonSlugs` entry was cross-checked against the real file paths under
 * `src/content/lessons/` (and matches the slug format `getAllLessonsMeta()`
 * derives from them: the path relative to that root, minus `.mdx`).
 */
export const CONCEPT_NODES: ConceptNode[] = [
  // ---------------------------------------------------------------------
  // Quantum Mechanics
  // ---------------------------------------------------------------------
  {
    id: "superposition",
    title: "Superposition",
    definition:
      "A quantum system can exist in a combination of basis states at once, with complex amplitudes rather than classical probabilities — the idea every other concept on this map ultimately builds on.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
    prerequisiteIds: [],
  },
  {
    id: "measurement",
    title: "Measurement",
    definition:
      "Measuring a quantum system collapses its superposition to a single outcome, with probabilities given by the squared magnitude of each amplitude (the Born rule).",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"],
    prerequisiteIds: ["superposition"],
  },
  {
    id: "phase-interference",
    title: "Phase & Interference",
    definition:
      "Complex amplitudes carry a phase, and adding amplitudes with different phases lets probabilities constructively or destructively interfere — the mechanism nearly every quantum algorithm exploits for advantage.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    ],
    prerequisiteIds: ["superposition"],
  },
  {
    id: "hamiltonians-time-evolution",
    title: "Hamiltonians & Time Evolution",
    definition:
      "A system's Hamiltonian generates its unitary time evolution via the Schrödinger equation, determining how a quantum state changes moment to moment.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"],
    prerequisiteIds: ["superposition"],
  },
  {
    id: "angular-momentum-spin",
    title: "Angular Momentum & Spin",
    definition:
      "Spin is an intrinsic quantum angular momentum with no classical analogue; spin-1/2 systems are the physical basis for many real qubit implementations.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"],
    prerequisiteIds: ["measurement"],
  },
  {
    id: "wave-mechanics",
    title: "Wave Mechanics",
    definition:
      "Making position continuous turns the quantum state into a wavefunction whose squared magnitude gives a probability density, evolving under the position-space Schrödinger equation.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/wave-mechanics/what-is-a-wavefunction"],
    simulatorId: "wavefunction-explorer",
    prerequisiteIds: ["hamiltonians-time-evolution"],
  },
  {
    id: "hydrogen-atom",
    title: "The Hydrogen Atom",
    definition:
      "Solving the Schrödinger equation for an electron in a Coulomb potential yields quantized energy levels and orbitals, showing exactly where atomic quantum numbers come from.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"],
    prerequisiteIds: ["angular-momentum-spin", "wave-mechanics"],
  },

  // ---------------------------------------------------------------------
  // Quantum Computing
  // ---------------------------------------------------------------------
  {
    id: "qubit",
    title: "Qubit",
    definition:
      "The quantum unit of information: a two-level system that can be in a superposition of |0⟩ and |1⟩, represented as a point on the Bloch sphere.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/what-is-a-qubit"],
    simulatorId: "bloch-sphere",
    prerequisiteIds: ["superposition"],
  },
  {
    id: "quantum-gates",
    title: "Quantum Gates",
    definition:
      "Unitary operations that transform a qubit's state — the quantum analogue of classical logic gates, and the building blocks of every quantum circuit.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/quantum-gates"],
    simulatorId: "bloch-sphere",
    prerequisiteIds: ["qubit"],
  },
  {
    id: "entanglement",
    title: "Entanglement",
    definition:
      "Two or more qubits can share correlations that can't be explained by either qubit having a definite state on its own — a uniquely quantum resource with no classical counterpart.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
    simulatorId: "two-qubit-explorer",
    prerequisiteIds: ["qubit", "measurement"],
  },
  {
    id: "bell-states",
    title: "Bell States",
    definition:
      "The four maximally entangled two-qubit states; testing their correlations against the CHSH inequality is the clearest experimental proof that nature isn't locally classical.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    ],
    simulatorId: "chsh-bell-test",
    prerequisiteIds: ["entanglement"],
  },
  {
    id: "density-matrices",
    title: "Density Matrices",
    definition:
      "A more general description of a quantum state than a state vector, needed for mixed states and for describing part of an entangled system in isolation.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"],
    simulatorId: "density-matrix-explorer",
    prerequisiteIds: ["entanglement"],
  },
  {
    id: "quantum-circuits",
    title: "Quantum Circuits",
    definition:
      "A sequence of gates applied to a register of qubits, drawn and reasoned about the same way across every real quantum programming framework.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"],
    simulatorId: "circuit-builder",
    prerequisiteIds: ["quantum-gates", "entanglement"],
  },
  {
    id: "quantum-fourier-transform",
    title: "Quantum Fourier Transform",
    definition:
      "A quantum circuit that maps computational-basis states to a Fourier-transformed superposition using exponentially fewer gates than the classical FFT needs operations — though its output is a quantum state whose amplitudes can't simply be read out, so it isn't a faster way to obtain an explicit transformed array — and the engine behind phase estimation and Shor's algorithm.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    ],
    prerequisiteIds: ["quantum-circuits", "phase-interference"],
  },
  {
    id: "grovers-algorithm",
    title: "Grover's Algorithm",
    definition:
      "A quantum search algorithm that finds a marked item among N unsorted possibilities in roughly √N steps, using oracle calls and amplitude amplification instead of brute force.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"],
    simulatorId: "grover-explorer",
    prerequisiteIds: ["quantum-circuits", "phase-interference"],
  },
  {
    id: "shors-algorithm",
    title: "Shor's Algorithm",
    definition:
      "Reduces integer factoring to finding the period of a modular exponentiation function, then finds that period exponentially faster than any known classical algorithm using the quantum Fourier transform.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    ],
    simulatorId: "period-finding-explorer",
    prerequisiteIds: ["quantum-fourier-transform"],
  },
  {
    id: "qaoa",
    title: "QAOA",
    definition:
      "The Quantum Approximate Optimization Algorithm alternates cost and mixer unitaries on a parameterized circuit, then classically optimizes those parameters to approximate hard combinatorial problems like Max-Cut.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"],
    simulatorId: "qaoa-explorer",
    prerequisiteIds: ["quantum-circuits"],
  },
  {
    id: "quantum-error-correction",
    title: "Quantum Error Correction",
    definition:
      "Encodes one logical qubit across several physical qubits so that errors can be detected via syndrome measurement and corrected without ever directly measuring (and collapsing) the protected state.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    ],
    simulatorId: "syndrome-explorer",
    prerequisiteIds: ["quantum-circuits", "density-matrices"],
  },

  // ---------------------------------------------------------------------
  // Quantum Hardware
  // ---------------------------------------------------------------------
  {
    id: "superconducting-qubits",
    title: "Superconducting Qubits",
    definition:
      "Qubits encoded in the quantized energy levels of a superconducting circuit built from Josephson junctions — the platform behind most of today's largest quantum processors.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/superconducting-qubits"],
    prerequisiteIds: ["qubit"],
  },
  {
    id: "trapped-ions",
    title: "Trapped Ions",
    definition:
      "Qubits encoded in the internal energy states of individually trapped, laser-cooled ions, offering long coherence times and high-fidelity gates at the cost of slower operation.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
    prerequisiteIds: ["qubit"],
  },
  {
    id: "qubit-control",
    title: "Qubit Control & Readout",
    definition:
      "Turning an abstract gate into a real microwave or laser pulse, and reading a qubit's state back out, both governed by the exact Rabi model of a driven two-level system.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/control-and-readout/control-electronics", "quantum-hardware/control-and-readout/calibration"],
    simulatorId: "rabi-explorer",
    prerequisiteIds: ["superconducting-qubits"],
  },
  {
    id: "noise-decoherence",
    title: "Noise & Decoherence",
    definition:
      "Real qubits leak information to their environment over characteristic timescales T1 and T2, describable as Kraus-operator noise channels that shrink a qubit's Bloch vector toward a fixed point.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    ],
    simulatorId: "noise-explorer",
    prerequisiteIds: ["density-matrices", "superconducting-qubits"],
  },

  // ---------------------------------------------------------------------
  // Quantum Software
  // ---------------------------------------------------------------------
  {
    id: "quantum-circuit-simulation",
    title: "Quantum Circuit Simulation",
    definition:
      "Simulating a quantum circuit classically by tracking the full state vector, which costs 16×2ⁿ bytes and becomes intractable around 30-50 qubits — the technique this platform's own simulators use.",
    pillar: "quantum-software",
    lessonSlugs: ["quantum-software/simulating-quantum-systems/state-vector-simulation"],
    prerequisiteIds: ["quantum-circuits"],
  },
  {
    id: "sdks-programming",
    title: "SDKs & Programming",
    definition:
      "Real quantum software builds a circuit as data before running it — the shared pattern behind SDKs like Qiskit, Cirq, and PennyLane, and behind this platform's own QuantumCircuit class.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview",
      "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    ],
    prerequisiteIds: ["quantum-circuits", "quantum-circuit-simulation"],
  },
];

export type ConceptNodeLayout = ConceptNode & {
  x: number;
  y: number;
  /** Longest-path depth from a root (no-prerequisite) concept, via Kahn's algorithm. */
  depth: number;
};

export type ConceptGraph = {
  nodes: ConceptNodeLayout[];
  edges: { from: string; to: string }[];
  width: number;
  height: number;
};

const PILLAR_ORDER: Pillar[] = PILLARS.map((pillar) => pillar.slug);

const COLUMN_WIDTH = 620;
const ROW_HEIGHT = 160;
const NODE_GAP_X = 160;
// Must match ConceptMapExplorer.tsx's NODE_WIDTH — used here only to pad the
// graph's bounding box so a rendered node's edges never clip outside it.
const NODE_WIDTH = 152;
const MARGIN_X = 140;
const MARGIN_Y = 100;

/**
 * Computes a deterministic, non-force-directed layout for `CONCEPT_NODES`:
 * x is the concept's pillar (one of 4 columns), y is its longest-path depth
 * in the prerequisite DAG (computed via Kahn's algorithm — concepts with no
 * prerequisites sit at the top, deeper concepts sit lower). No layout
 * library or force simulation involved.
 */
export function buildConceptGraph(): ConceptGraph {
  const byId = new Map(CONCEPT_NODES.map((node) => [node.id, node]));

  // Kahn's algorithm over the "prerequisite -> concept" edges, relaxing a
  // longest-path depth as each node's indegree reaches zero.
  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  const depth = new Map<string, number>();

  for (const node of CONCEPT_NODES) {
    const validPrereqs = node.prerequisiteIds.filter((id) => byId.has(id));
    indegree.set(node.id, validPrereqs.length);
    depth.set(node.id, 0);
    for (const prereqId of validPrereqs) {
      if (!dependents.has(prereqId)) dependents.set(prereqId, []);
      dependents.get(prereqId)!.push(node.id);
    }
  }

  const queue: string[] = CONCEPT_NODES.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  const order: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const dependentId of dependents.get(id) ?? []) {
      depth.set(dependentId, Math.max(depth.get(dependentId)!, depth.get(id)! + 1));
      const remaining = indegree.get(dependentId)! - 1;
      indegree.set(dependentId, remaining);
      if (remaining === 0) queue.push(dependentId);
    }
  }
  // Any node not reached (a cycle, which shouldn't happen with hand-authored
  // data) keeps its default depth of 0 rather than being dropped.

  // Group nodes by (pillar, depth) to spread siblings horizontally within
  // their column instead of stacking them on top of each other.
  const groups = new Map<string, string[]>();
  for (const node of CONCEPT_NODES) {
    const key = `${node.pillar}:${depth.get(node.id)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(node.id);
  }

  // Sibling spreading (`offset` below) can push a node's raw x left of 0
  // within its column, so the true bounding box's left edge isn't at x=0 —
  // track the real min/max here rather than assuming it, otherwise the
  // leftmost node(s) render partially outside `width`, and any viewport
  // centered on `[0, width]` clips them (this was a real, visible bug: the
  // "Qubit" node was cropped on initial map load).
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;

  const rawNodes = CONCEPT_NODES.map((node) => {
    const nodeDepth = depth.get(node.id) ?? 0;
    const columnIndex = Math.max(0, PILLAR_ORDER.indexOf(node.pillar));
    const groupKey = `${node.pillar}:${nodeDepth}`;
    const group = groups.get(groupKey)!;
    const indexInGroup = group.indexOf(node.id);
    const offset = (indexInGroup - (group.length - 1) / 2) * NODE_GAP_X;

    const x = MARGIN_X + columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2 + offset;
    const y = MARGIN_Y + nodeDepth * ROW_HEIGHT;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    return { ...node, x, y, depth: nodeDepth };
  });

  // Shift everything so the leftmost node's left edge (accounting for its
  // half-width) lands exactly at MARGIN_X, and re-derive `width` from the
  // shifted, true right edge — both now genuinely bound every node.
  const shiftX = -minX + NODE_WIDTH / 2 + MARGIN_X;
  const nodes: ConceptNodeLayout[] = rawNodes.map((node) => ({ ...node, x: node.x + shiftX }));

  const edges: { from: string; to: string }[] = [];
  for (const node of CONCEPT_NODES) {
    for (const prereqId of node.prerequisiteIds) {
      if (byId.has(prereqId)) edges.push({ from: prereqId, to: node.id });
    }
  }

  return {
    nodes,
    edges,
    width: maxX + shiftX + NODE_WIDTH / 2 + MARGIN_X,
    height: maxY + MARGIN_Y,
  };
}

export function getConcept(id: string): ConceptNode | undefined {
  return CONCEPT_NODES.find((node) => node.id === id);
}
