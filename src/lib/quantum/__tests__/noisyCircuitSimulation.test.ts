import { describe, expect, it } from "vitest";
import { Matrix } from "../matrix";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { HADAMARD } from "../gates";
import { pureStateDensityMatrix, purity } from "../densityMatrix";
import { dephasingChannel } from "../openSystems";
import { runNoisyCircuit } from "../noisyCircuitSimulation";

describe("runNoisyCircuit", () => {
  const zero = new StateVector([Complex.ONE, Complex.ZERO]);
  const rho0 = pureStateDensityMatrix(zero);

  it("with a trivial (identity) noise channel, H then H returns exactly to the pure |0> state", () => {
    const identityChannel = [Matrix.identity(2)];
    const result = runNoisyCircuit(rho0, [HADAMARD, HADAMARD], identityChannel);
    expect(purity(result)).toBeCloseTo(1, 9);
    expect(result.get(0, 0).re).toBeCloseTo(1, 9);
  });

  it("with dephasing noise interleaved, H then H does NOT return exactly to |0>", () => {
    const noise = dephasingChannel(0.2);
    const result = runNoisyCircuit(rho0, [HADAMARD, HADAMARD], noise);
    expect(result.get(0, 0).re).toBeLessThan(1);
    expect(purity(result)).toBeLessThan(1);
  });

  it("purity strictly decreases as more noisy gates are applied", () => {
    const noise = dephasingChannel(0.2);
    const afterOne = runNoisyCircuit(rho0, [HADAMARD], noise);
    const afterThree = runNoisyCircuit(rho0, [HADAMARD, HADAMARD, HADAMARD], noise);
    expect(purity(afterThree)).toBeLessThan(purity(afterOne));
  });

  it("throws for a non-2x2 initial density matrix", () => {
    const bigRho = Matrix.identity(4);
    expect(() => runNoisyCircuit(bigRho, [HADAMARD], [Matrix.identity(2)])).toThrow();
  });
});
