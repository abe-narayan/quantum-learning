/** An immutable complex number, re, im. */
export class Complex {
  static readonly ZERO = new Complex(0, 0);
  static readonly ONE = new Complex(1, 0);
  static readonly I = new Complex(0, 1);

  constructor(
    public readonly re: number,
    public readonly im: number = 0
  ) {}

  static fromPolar(magnitude: number, phase: number): Complex {
    return new Complex(magnitude * Math.cos(phase), magnitude * Math.sin(phase));
  }

  add(other: Complex): Complex {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  sub(other: Complex): Complex {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  mul(other: Complex): Complex {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  scale(k: number): Complex {
    return new Complex(this.re * k, this.im * k);
  }

  div(other: Complex): Complex {
    const denom = other.re * other.re + other.im * other.im;
    return new Complex(
      (this.re * other.re + this.im * other.im) / denom,
      (this.im * other.re - this.re * other.im) / denom
    );
  }

  conjugate(): Complex {
    return new Complex(this.re, -this.im);
  }

  magnitude(): number {
    return Math.hypot(this.re, this.im);
  }

  magnitudeSquared(): number {
    return this.re * this.re + this.im * this.im;
  }

  phase(): number {
    return Math.atan2(this.im, this.re);
  }

  equals(other: Complex, epsilon = 1e-9): boolean {
    return Math.abs(this.re - other.re) < epsilon && Math.abs(this.im - other.im) < epsilon;
  }

  toString(): string {
    if (Math.abs(this.im) < 1e-9) return this.re.toFixed(3);
    if (Math.abs(this.re) < 1e-9) return `${this.im.toFixed(3)}i`;
    const sign = this.im >= 0 ? "+" : "-";
    return `${this.re.toFixed(3)} ${sign} ${Math.abs(this.im).toFixed(3)}i`;
  }
}
