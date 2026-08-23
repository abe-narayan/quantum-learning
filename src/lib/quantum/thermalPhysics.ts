/**
 * Thermal occupation of a quantized field mode — the specific physics
 * that explains why qubits need millikelvin cooling. Deliberately just
 * this one formula (Bose-Einstein occupation of a harmonic mode), not a
 * general statistical-mechanics module — it's the one calculation
 * Control & Readout's Cryogenic Systems lesson actually needs.
 */

export const H_BAR = 1.054571817e-34; // J·s (reduced Planck constant)
export const K_BOLTZMANN = 1.380649e-23; // J/K (Boltzmann constant)

/**
 * The mean thermal photon occupation number of a harmonic mode at
 * frequency `frequencyHz`, in thermal equilibrium at `temperatureK`:
 * n̄ = 1/(exp(ħω/k_BT) - 1) — the Bose-Einstein distribution. For a
 * superconducting qubit (modeled as a harmonic-ish mode near its 0-1
 * transition), n̄ close to 0 means the qubit reliably starts in its
 * ground state; n̄ >> 1 means thermal noise dominates and the qubit's
 * state is effectively randomized before any computation begins.
 */
export function thermalPhotonOccupation(frequencyHz: number, temperatureK: number): number {
  if (!(frequencyHz > 0)) throw new Error("thermalPhotonOccupation requires frequencyHz > 0.");
  if (!(temperatureK > 0)) throw new Error("thermalPhotonOccupation requires temperatureK > 0.");
  const omega = 2 * Math.PI * frequencyHz;
  const x = (H_BAR * omega) / (K_BOLTZMANN * temperatureK);
  return 1 / (Math.exp(x) - 1);
}
