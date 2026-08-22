import { Complex } from "./complex";

/** An immutable complex-valued matrix, stored row-major. */
export class Matrix {
  readonly rows: number;
  readonly cols: number;
  private readonly data: readonly (readonly Complex[])[];

  constructor(data: Complex[][]) {
    this.rows = data.length;
    this.cols = data[0]?.length ?? 0;
    if (data.some((row) => row.length !== this.cols)) {
      throw new Error("Matrix rows must all have the same length.");
    }
    this.data = data;
  }

  static identity(size: number): Matrix {
    return new Matrix(
      Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => (r === c ? Complex.ONE : Complex.ZERO))
      )
    );
  }

  static zeros(rows: number, cols: number): Matrix {
    return new Matrix(
      Array.from({ length: rows }, () => Array.from({ length: cols }, () => Complex.ZERO))
    );
  }

  get(row: number, col: number): Complex {
    return this.data[row][col];
  }

  add(other: Matrix): Matrix {
    this.assertSameShape(other);
    return new Matrix(
      this.data.map((row, r) => row.map((value, c) => value.add(other.get(r, c))))
    );
  }

  scale(k: Complex | number): Matrix {
    const factor = k instanceof Complex ? k : new Complex(k, 0);
    return new Matrix(this.data.map((row) => row.map((value) => value.mul(factor))));
  }

  /** Standard matrix multiplication: this * other. */
  mul(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw new Error(
        `Cannot multiply a ${this.rows}x${this.cols} matrix by a ${other.rows}x${other.cols} matrix.`
      );
    }
    const result: Complex[][] = [];
    for (let r = 0; r < this.rows; r++) {
      const row: Complex[] = [];
      for (let c = 0; c < other.cols; c++) {
        let sum = Complex.ZERO;
        for (let k = 0; k < this.cols; k++) {
          sum = sum.add(this.get(r, k).mul(other.get(k, c)));
        }
        row.push(sum);
      }
      result.push(row);
    }
    return new Matrix(result);
  }

  /** Applies this matrix to a column vector of complex amplitudes. */
  apply(vector: readonly Complex[]): Complex[] {
    if (this.cols !== vector.length) {
      throw new Error(`Cannot apply a ${this.rows}x${this.cols} matrix to a length-${vector.length} vector.`);
    }
    return Array.from({ length: this.rows }, (_, r) => {
      let sum = Complex.ZERO;
      for (let c = 0; c < this.cols; c++) {
        sum = sum.add(this.get(r, c).mul(vector[c]));
      }
      return sum;
    });
  }

  /** Kronecker (tensor) product: this ⊗ other. */
  tensor(other: Matrix): Matrix {
    const result: Complex[][] = Array.from({ length: this.rows * other.rows }, () =>
      Array.from({ length: this.cols * other.cols }, () => Complex.ZERO)
    );

    for (let r1 = 0; r1 < this.rows; r1++) {
      for (let c1 = 0; c1 < this.cols; c1++) {
        const scalar = this.get(r1, c1);
        for (let r2 = 0; r2 < other.rows; r2++) {
          for (let c2 = 0; c2 < other.cols; c2++) {
            result[r1 * other.rows + r2][c1 * other.cols + c2] = scalar.mul(other.get(r2, c2));
          }
        }
      }
    }

    return new Matrix(result);
  }

  transpose(): Matrix {
    const result: Complex[][] = Array.from({ length: this.cols }, (_, c) =>
      Array.from({ length: this.rows }, (_, r) => this.get(r, c))
    );
    return new Matrix(result);
  }

  /** Conjugate transpose (Hermitian adjoint), written M†. */
  dagger(): Matrix {
    const result: Complex[][] = Array.from({ length: this.cols }, (_, c) =>
      Array.from({ length: this.rows }, (_, r) => this.get(r, c).conjugate())
    );
    return new Matrix(result);
  }

  equals(other: Matrix, epsilon = 1e-9): boolean {
    if (this.rows !== other.rows || this.cols !== other.cols) return false;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.get(r, c).equals(other.get(r, c), epsilon)) return false;
      }
    }
    return true;
  }

  private assertSameShape(other: Matrix) {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error("Matrices must have the same shape.");
    }
  }
}

/** Kronecker product of many matrices, applied left to right. */
export function tensorAll(matrices: Matrix[]): Matrix {
  if (matrices.length === 0) throw new Error("tensorAll requires at least one matrix.");
  return matrices.reduce((acc, m) => acc.tensor(m));
}
