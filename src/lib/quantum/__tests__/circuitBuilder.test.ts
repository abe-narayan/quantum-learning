import { describe, expect, it } from "vitest";
import { QuantumCircuit, runCircuit, runInstructions, sampleMeasurements } from "../circuitBuilder";

describe("QuantumCircuit: Bell state", () => {
  it("H(0), CNOT(0,1) produces the Bell state (|00>+|11>)/sqrt(2)", () => {
    const circuit = new QuantumCircuit(2);
    circuit.h(0).cnot(0, 1);
    const state = runCircuit(circuit);
    const probs = state.probabilities();
    expect(probs[0]).toBeCloseTo(0.5, 9);
    expect(probs[1]).toBeCloseTo(0, 9);
    expect(probs[2]).toBeCloseTo(0, 9);
    expect(probs[3]).toBeCloseTo(0.5, 9);
  });
});

describe("QuantumCircuit: GHZ state", () => {
  it("H(0), CNOT(0,1), CNOT(1,2) produces (|000>+|111>)/sqrt(2)", () => {
    const circuit = new QuantumCircuit(3);
    circuit.h(0).cnot(0, 1).cnot(1, 2);
    const state = runCircuit(circuit);
    const probs = state.probabilities();
    expect(probs[0]).toBeCloseTo(0.5, 9);
    expect(probs[7]).toBeCloseTo(0.5, 9);
    for (let i = 1; i < 7; i++) expect(probs[i]).toBeCloseTo(0, 9);
  });
});

describe("runInstructions", () => {
  it("matches runCircuit for the same instruction list (Bell state)", () => {
    const circuit = new QuantumCircuit(2);
    circuit.h(0).cnot(0, 1);
    const viaCircuit = runCircuit(circuit);
    const viaInstructions = runInstructions(2, circuit.instructions);
    expect(viaInstructions.probabilities()).toEqual(viaCircuit.probabilities());
  });

  it("replays a PREFIX of instructions correctly (Circuit Builder's step feature)", () => {
    const instructions = [
      { gate: "H" as const, targets: [0] as [number] },
      { gate: "CNOT" as const, targets: [0, 1] as [number, number] },
    ];
    const afterH = runInstructions(2, instructions.slice(0, 1));
    // H on qubit 0 (the MSB on this platform) splits |00> and |10> (indices 0 and 2).
    expect(afterH.probabilities()[0]).toBeCloseTo(0.5, 9);
    expect(afterH.probabilities()[1]).toBeCloseTo(0, 9);
    expect(afterH.probabilities()[2]).toBeCloseTo(0.5, 9);
    expect(afterH.probabilities()[3]).toBeCloseTo(0, 9);

    const afterBoth = runInstructions(2, instructions);
    expect(afterBoth.probabilities()[0]).toBeCloseTo(0.5, 9);
    expect(afterBoth.probabilities()[3]).toBeCloseTo(0.5, 9);
  });

  it("gives |0...0> for an empty instruction list", () => {
    const state = runInstructions(3, []);
    expect(state.probabilities()[0]).toBeCloseTo(1, 9);
  });
});

describe("QuantumCircuit: gate identities", () => {
  it("H Z H equals X, applied to |0> gives |1> exactly", () => {
    const circuit = new QuantumCircuit(1);
    circuit.h(0).z(0).h(0);
    const state = runCircuit(circuit);
    expect(state.probabilities()[0]).toBeCloseTo(0, 9);
    expect(state.probabilities()[1]).toBeCloseTo(1, 9);
  });

  it("rx(pi) matches x up to global phase in probabilities", () => {
    const circuit = new QuantumCircuit(1);
    circuit.rx(0, Math.PI);
    const state = runCircuit(circuit);
    expect(state.probabilities()[1]).toBeCloseTo(1, 6);
  });
});

describe("runInstructions: MEASURE", () => {
  it("is a no-op on the statevector (diagram-only marker, not a collapse)", () => {
    const withoutMeasure = [
      { gate: "H" as const, targets: [0] as [number] },
      { gate: "CNOT" as const, targets: [0, 1] as [number, number] },
    ];
    const withMeasure = [
      { gate: "H" as const, targets: [0] as [number] },
      { gate: "MEASURE" as const, targets: [0] as [number] },
      { gate: "CNOT" as const, targets: [0, 1] as [number, number] },
    ];
    const stateWithout = runInstructions(2, withoutMeasure);
    const stateWith = runInstructions(2, withMeasure);
    expect(stateWith.probabilities()).toEqual(stateWithout.probabilities());
  });

  it("leaves |0...0> unchanged when it's the only instruction", () => {
    const state = runInstructions(2, [{ gate: "MEASURE" as const, targets: [0] as [number] }]);
    expect(state.probabilities()[0]).toBeCloseTo(1, 9);
  });
});

describe("QuantumCircuit: validation", () => {
  it("throws for an out-of-range target", () => {
    const circuit = new QuantumCircuit(2);
    expect(() => circuit.h(5)).toThrow();
  });

  it("throws for CNOT with equal control and target", () => {
    const circuit = new QuantumCircuit(2);
    expect(() => circuit.cnot(0, 0)).toThrow();
  });

  it("throws for a non-positive qubit count", () => {
    expect(() => new QuantumCircuit(0)).toThrow();
  });
});

describe("sampleMeasurements", () => {
  it("converges to the Bell state's 50/50 split over many shots", () => {
    const circuit = new QuantumCircuit(2);
    circuit.h(0).cnot(0, 1);
    const state = runCircuit(circuit);
    const counts = sampleMeasurements(state, 5000);
    const total = (counts["00"] ?? 0) + (counts["11"] ?? 0);
    expect(total).toBe(5000);
    expect(counts["01"] ?? 0).toBe(0);
    expect(counts["10"] ?? 0).toBe(0);
    const fraction00 = (counts["00"] ?? 0) / 5000;
    expect(fraction00).toBeGreaterThan(0.45);
    expect(fraction00).toBeLessThan(0.55);
  });

  it("throws for a non-positive shot count", () => {
    const circuit = new QuantumCircuit(1);
    circuit.h(0);
    const state = runCircuit(circuit);
    expect(() => sampleMeasurements(state, 0)).toThrow();
  });
});
