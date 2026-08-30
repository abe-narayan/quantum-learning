import { Matrix } from "@/lib/quantum/matrix";
import { PAULI_X, PAULI_Y, PAULI_Z, HADAMARD, S_GATE, T_GATE, type Axis3 } from "@/lib/quantum/gates";

export type FixedGateId = "X" | "Y" | "Z" | "H" | "S" | "T";

export type FixedGateDefinition = {
  id: FixedGateId;
  label: string;
  matrix: Matrix;
  /** The axis and angle this gate rotates the Bloch vector by (used to animate it as a genuine rotation). */
  axis: Axis3;
  angle: number;
  latex: string;
  explanation: string;
};

export const FIXED_GATES: FixedGateDefinition[] = [
  {
    id: "X",
    label: "X",
    matrix: PAULI_X,
    axis: { x: 1, y: 0, z: 0 },
    angle: Math.PI,
    latex: "X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}",
    explanation: "Rotates the state by π about the X axis, swapping |0⟩ and |1⟩.",
  },
  {
    id: "Y",
    label: "Y",
    matrix: PAULI_Y,
    axis: { x: 0, y: 1, z: 0 },
    angle: Math.PI,
    latex: "Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}",
    explanation: "Rotates the state by π about the Y axis.",
  },
  {
    id: "Z",
    label: "Z",
    matrix: PAULI_Z,
    axis: { x: 0, y: 0, z: 1 },
    angle: Math.PI,
    latex: "Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}",
    explanation: "Rotates the state by π about the Z axis, flipping the phase of |1⟩ without changing measurement probabilities.",
  },
  {
    id: "H",
    label: "H",
    matrix: HADAMARD,
    axis: { x: Math.SQRT1_2, y: 0, z: Math.SQRT1_2 },
    angle: Math.PI,
    latex: "H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}",
    explanation: "Rotates by π about the diagonal axis between X and Z, turning a pole into an equal superposition.",
  },
  {
    id: "S",
    label: "S",
    matrix: S_GATE,
    axis: { x: 0, y: 0, z: 1 },
    angle: Math.PI / 2,
    latex: "S = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix}",
    explanation: "A quarter-turn about the Z axis, changing the phase φ without touching θ or the measurement probabilities.",
  },
  {
    id: "T",
    label: "T",
    matrix: T_GATE,
    axis: { x: 0, y: 0, z: 1 },
    angle: Math.PI / 4,
    latex: "T = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{pmatrix}",
    explanation: "An eighth-turn about the Z axis, the smallest standard phase gate.",
  },
];

export type RotationAxisId = "Rx" | "Ry" | "Rz";

export const ROTATION_AXES: { id: RotationAxisId; label: string; axis: Axis3 }[] = [
  { id: "Rx", label: "Rx(θ)", axis: { x: 1, y: 0, z: 0 } },
  { id: "Ry", label: "Ry(θ)", axis: { x: 0, y: 1, z: 0 } },
  { id: "Rz", label: "Rz(θ)", axis: { x: 0, y: 0, z: 1 } },
];
