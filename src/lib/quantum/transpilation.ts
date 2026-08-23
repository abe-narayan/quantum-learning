import { StateVector } from "./state";
import { applySwap, applyCNOT } from "./gates";

/**
 * A minimal SWAP-network transpilation: implements a CNOT between two
 * qubits that aren't adjacent on a LINEAR-CHAIN connectivity graph (qubit
 * i can only directly interact with qubit i±1 — the simplest realistic
 * hardware connectivity constraint), by swapping the control qubit's data
 * stepwise into the position next to the target, applying the real CNOT,
 * then swapping back to restore the original qubit ordering. Scoped to
 * linear-chain connectivity specifically (not a general graph router) —
 * the smallest case that actually demonstrates why transpilation is
 * needed at all, without building a full general-graph pathfinding
 * compiler no lesson here requires.
 */
export function cnotOnLinearChain(state: StateVector, control: number, target: number): StateVector {
  if (control === target) throw new Error("cnotOnLinearChain requires control !== target.");
  if (control < target) {
    return forwardCnot(state, control, target);
  }
  // control > target: same idea, walking control down toward target.
  let s = state;
  let pos = control;
  const path: number[] = [];
  while (pos > target + 1) {
    s = applySwap(s, pos, pos - 1);
    path.push(pos);
    pos--;
  }
  s = applyCNOT(s, pos, target);
  for (let i = path.length - 1; i >= 0; i--) {
    s = applySwap(s, path[i], path[i] - 1);
  }
  return s;
}

function forwardCnot(state: StateVector, control: number, target: number): StateVector {
  let s = state;
  let pos = control;
  const path: number[] = [];
  while (pos < target - 1) {
    s = applySwap(s, pos, pos + 1);
    path.push(pos);
    pos++;
  }
  s = applyCNOT(s, pos, target);
  for (let i = path.length - 1; i >= 0; i--) {
    s = applySwap(s, path[i], path[i] + 1);
  }
  return s;
}

/** The number of SWAP gates cnotOnLinearChain needs to bridge a given control/target distance — the real, computable "compilation overhead" this technique introduces. */
export function swapOverheadForLinearChain(control: number, target: number): number {
  if (control === target) throw new Error("swapOverheadForLinearChain requires control !== target.");
  const distance = Math.abs(control - target);
  return 2 * (distance - 1);
}
