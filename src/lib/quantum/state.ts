import { Complex } from "./complex";
import { Matrix } from "./matrix";

/**
 * A pure state of `numQubits` qubits, stored as 2^numQubits complex
 * amplitudes over the computational basis |00...0⟩ .. |11...1⟩.
 */
export class StateVector {
  readonly numQubits: number;
  readonly amplitudes: readonly Complex[];

  constructor(amplitudes: Complex[]) {
    const dimension = amplitudes.length;
    const numQubits = Math.log2(dimension);
    if (!Number.isInteger(numQubits) || numQubits < 1) {
      throw new Error(`StateVector length must be a power of two (got ${dimension}).`);
    }
    this.numQubits = numQubits;
    this.amplitudes = amplitudes;
  }

  /** The |00...0⟩ state for `numQubits` qubits. */
  static zero(numQubits: number): StateVector {
    return StateVector.basis(numQubits, 0);
  }

  /** A computational basis state |index⟩, e.g. basis(2, 2) = |10⟩. */
  static basis(numQubits: number, index: number): StateVector {
    const dimension = 2 ** numQubits;
    const amplitudes = Array.from({ length: dimension }, (_, i) =>
      i === index ? Complex.ONE : Complex.ZERO
    );
    return new StateVector(amplitudes);
  }

  get dimension(): number {
    return this.amplitudes.length;
  }

  /** Probability of measuring each computational basis state, |amplitude|^2. */
  probabilities(): number[] {
    return this.amplitudes.map((amplitude) => amplitude.magnitudeSquared());
  }

  /** Sum of all basis-state probabilities; should be 1 for a physical state. */
  norm(): number {
    return Math.sqrt(this.probabilities().reduce((sum, p) => sum + p, 0));
  }

  normalize(): StateVector {
    const n = this.norm();
    if (n === 0) throw new Error("Cannot normalize the zero vector.");
    return new StateVector(this.amplitudes.map((amplitude) => amplitude.scale(1 / n)));
  }

  /** ⟨this|other⟩ */
  innerProduct(other: StateVector): Complex {
    if (this.dimension !== other.dimension) {
      throw new Error("States must have the same dimension for an inner product.");
    }
    return this.amplitudes.reduce(
      (sum, amplitude, i) => sum.add(amplitude.conjugate().mul(other.amplitudes[i])),
      Complex.ZERO
    );
  }

  /** Combines this state with another via the tensor product: |this⟩ ⊗ |other⟩. */
  tensor(other: StateVector): StateVector {
    const combined: Complex[] = [];
    for (const a of this.amplitudes) {
      for (const b of other.amplitudes) {
        combined.push(a.mul(b));
      }
    }
    return new StateVector(combined);
  }

  /** Applies a 2^numQubits x 2^numQubits matrix to this state's full amplitude vector. */
  applyMatrix(matrix: Matrix): StateVector {
    return new StateVector(matrix.apply(this.amplitudes));
  }

  /** Binary basis label for a given index, e.g. index 2 with 3 qubits -> "010". */
  basisLabel(index: number): string {
    return index.toString(2).padStart(this.numQubits, "0");
  }

  toString(): string {
    return this.amplitudes
      .map((amplitude, i) => `(${amplitude.toString()})|${this.basisLabel(i)}⟩`)
      .join(" + ");
  }
}
