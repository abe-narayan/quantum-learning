"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, rotationAboutAxis } from "@/lib/quantum/gates";
import { measure } from "@/lib/quantum/measurement";
import { stateToBlochVector, type BlochVector } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "./BlochSphereCanvas";
import { FIXED_GATES, type FixedGateDefinition, type FixedGateId } from "./gateDefinitions";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const ANIMATION_MS = 550;
const HERO_GATE_IDS: readonly FixedGateId[] = ["H", "X", "Z"];
const HERO_GATES = FIXED_GATES.filter((gate) => HERO_GATE_IDS.includes(gate.id));

/**
 * The state this hero opens on: |+⟩ = H|0⟩, the equal superposition.
 *
 * It used to open on |0⟩, and |0⟩ is the one point on this sphere that
 * teaches nothing — the vector stands straight up at the north pole, which is
 * indistinguishable at a glance from a classical bit reading 0, and the whole
 * reason the Bloch sphere exists is to show the states a bit cannot reach.
 * A homepage visitor who never presses a button therefore saw a picture that
 * argued the opposite of the point. Opening on the equator means the very
 * first frame is already a state with no classical counterpart, and the
 * Measure button then has something to collapse. Reset still returns to |0⟩,
 * which stays the reference state every lesson starts a circuit from.
 *
 * Built by running the real H gate on |0⟩ rather than hand-writing 1/√2
 * amplitudes, so this is the same state the H button produces, from the same
 * engine call, and cannot drift away from it.
 */
function initialSuperposition() {
  const hadamard = FIXED_GATES.find((gate) => gate.id === "H");
  if (!hadamard) throw new Error("Hero explorer expects an H gate in FIXED_GATES.");
  return applySingleQubitGate(StateVector.zero(1), hadamard.matrix, 0);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/** An arbitrary unit vector perpendicular to `v` — used only for the antipodal slerp case
 * below, where any one meridian is as good as any other. */
function arbitraryPerpendicular(v: BlochVector): BlochVector {
  const reference = Math.abs(v.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
  const cx = v.y * reference.z - v.z * reference.y;
  const cy = v.z * reference.x - v.x * reference.z;
  const cz = v.x * reference.y - v.y * reference.x;
  const norm = Math.hypot(cx, cy, cz) || 1;
  return { x: cx / norm, y: cy / norm, z: cz / norm };
}

/** The rotation axis for the degenerate (near-π) slerp branch below. Prefers `cross(a, b)`
 * — the true meridian axis, which stays numerically meaningful far below the `sinTheta < 1e-6`
 * cutoff that gates this branch — and only falls back to the direction-agnostic
 * `arbitraryPerpendicular(a)` once that cross product has itself collapsed to noise (`a` and
 * `b` are bit-for-bit antipodal, or close enough that no meridian is distinguishable). Without
 * this, a vector approaching antipodal along a fixed azimuth would track that azimuth right up
 * to the branch cutoff and then visibly snap to the unrelated arbitrary axis. */
function degenerateSlerpAxis(a: BlochVector, b: BlochVector): BlochVector {
  const cx = a.y * b.z - a.z * b.y;
  const cy = a.z * b.x - a.x * b.z;
  const cz = a.x * b.y - a.y * b.x;
  const norm = Math.hypot(cx, cy, cz);
  if (norm > 1e-9) return { x: cx / norm, y: cy / norm, z: cz / norm };
  return arbitraryPerpendicular(a);
}

/** Rotates unit vector `v` by `angle` about a perpendicular `axis` (Rodrigues' formula with
 * the axis·v term dropped, since it's zero when axis ⟂ v). */
function rotateAboutPerpendicularAxis(v: BlochVector, axis: BlochVector, angle: number): BlochVector {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const crossX = axis.y * v.z - axis.z * v.y;
  const crossY = axis.z * v.x - axis.x * v.z;
  const crossZ = axis.x * v.y - axis.y * v.x;
  return { x: v.x * cos + crossX * sin, y: v.y * cos + crossY * sin, z: v.z * cos + crossZ * sin };
}

function slerp(a: BlochVector, b: BlochVector, t: number): BlochVector {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);

  if (sinTheta < 1e-6) {
    if (dot < 0) {
      // Antipodal (e.g. Reset from |1⟩ back to |0⟩): the great-circle direction is undefined,
      // and the naive lerp-then-normalize below divides by a norm that passes through exactly
      // zero at t=0.5 — the vector visibly collapses to the sphere's center instead of
      // sweeping along a meridian. Rotate about the (near-)meridian axis instead.
      return rotateAboutPerpendicularAxis(a, degenerateSlerpAxis(a, b), Math.PI * t);
    }
    const lerped = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
    const norm = Math.hypot(lerped.x, lerped.y, lerped.z) || 1;
    return { x: lerped.x / norm, y: lerped.y / norm, z: lerped.z / norm };
  }

  const wa = Math.sin((1 - t) * theta) / sinTheta;
  const wb = Math.sin(t * theta) / sinTheta;
  return { x: wa * a.x + wb * b.x, y: wa * a.y + wb * b.y, z: wa * a.z + wb * b.z };
}

/**
 * A compact, genuinely interactive Bloch sphere for the homepage hero: real
 * quantum state (src/lib/quantum), the same 3D-projected canvas as the full
 * BlochSphereExplorer, and a small set of gate/measure/reset controls. This
 * is a deliberately trimmed-down sibling of BlochSphereExplorer (drops
 * presets, angle sliders, and the state readout panel) so it fits a hero
 * layout — not a decorative substitute for it.
 */
export function BlochSphereHeroExplorer() {
  const [state, setState] = useState(initialSuperposition);
  const [renderPoint, setRenderPoint] = useState<BlochVector>(() => stateToBlochVector(initialSuperposition()));
  const [isAnimating, setIsAnimating] = useState(false);
  const [narration, setNarration] = useState(
    "A real qubit, already in superposition: the arrow points at the equator, so |0⟩ and |1⟩ are equally likely. Press Measure to collapse it to one pole, or Reset to return to |0⟩."
  );
  const [lastMeasurement, setLastMeasurement] = useState<0 | 1 | null>(null);

  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const runAnimation = useCallback(
    (pointAtT: (t: number) => BlochVector, onComplete: () => void) => {
      if (prefersReducedMotion) {
        onComplete();
        return;
      }

      setIsAnimating(true);
      const start = performance.now();

      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / ANIMATION_MS);
        setRenderPoint(pointAtT(easeInOutCubic(t)));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          setIsAnimating(false);
          onComplete();
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    },
    [prefersReducedMotion]
  );

  const settleAt = useCallback((nextState: StateVector, point: BlochVector) => {
    setState(nextState);
    setRenderPoint(point);
  }, []);

  const applyGate = useCallback(
    (gate: FixedGateDefinition) => {
      if (isAnimating) return;
      const startState = state;
      const nextState = applySingleQubitGate(startState, gate.matrix, 0);
      const endPoint = stateToBlochVector(nextState);

      setLastMeasurement(null);
      setNarration(`Applied the ${gate.label} gate. ${gate.explanation}`);

      runAnimation(
        (t) => stateToBlochVector(startState.applyMatrix(rotationAboutAxis(gate.axis, gate.angle * t))),
        () => settleAt(nextState, endPoint)
      );
    },
    [isAnimating, state, runAnimation, settleAt]
  );

  const applyMeasurement = useCallback(() => {
    if (isAnimating) return;
    const { outcome, collapsed } = measure(state);
    const endPoint = stateToBlochVector(collapsed);
    const outcomeIndex = outcome.index as 0 | 1;

    setLastMeasurement(outcomeIndex);
    setNarration(
      `Measured |${outcomeIndex}⟩ (random, weighted by probability) — the superposition has collapsed.`
    );

    runAnimation(
      (t) => slerp(renderPoint, endPoint, t),
      () => settleAt(collapsed, endPoint)
    );
  }, [isAnimating, state, renderPoint, runAnimation, settleAt]);

  const reset = useCallback(() => {
    if (isAnimating) return;
    const zero = StateVector.zero(1);
    const startPoint = renderPoint;
    const endPoint = stateToBlochVector(zero);

    setLastMeasurement(null);
    setNarration("Reset to |0⟩.");

    runAnimation(
      (t) => slerp(startPoint, endPoint, t),
      () => settleAt(zero, endPoint)
    );
  }, [isAnimating, renderPoint, runAnimation, settleAt]);

  // `min-h-11 min-w-11` (44px), not the previous `h-10 min-w-10` (40px): the
  // single-letter gate buttons are the smallest targets on the homepage and
  // sit in a wrapping row 8px apart, so at 40px they missed the touch-target
  // floor in both axes at once. `min-h`/`min-w` rather than fixed `h`/`w` so
  // "Measure" and "Reset" still size to their own text.
  // `aria-disabled:` rather than `disabled:` here, paired with the switch from
  // the native `disabled` attribute to `aria-disabled` on every button below.
  // Every control in this row disables itself *as the direct result of being
  // pressed*: applyGate / applyMeasurement / reset each set `isAnimating`
  // true, which is exactly the condition that greyed the whole row out. A
  // natively-disabled button stops being focusable while it currently holds
  // focus, so a keyboard reader who pressed H had focus dropped to <body> by
  // their own keystroke, spent the 600ms animation with no focus anywhere, and
  // found their next Tab restarting from the top of the document. On the
  // homepage hero that means you cannot apply two gates in a row from the
  // keyboard without re-tabbing through the whole page between them — the
  // single most-reached instrument on the site, unusable in sequence.
  //
  // `aria-disabled` announces the identical "dimmed, unavailable" state while
  // keeping the element focusable, so focus stays on the button you pressed
  // and is still there when the animation settles and the row goes live again.
  // No handler guard needs adding: applyGate, applyMeasurement and reset all
  // already open with `if (isAnimating) return;`, so a press that slips through
  // is already a no-op. `aria-disabled:pointer-events-none` reproduces the
  // dead-to-the-mouse behaviour `disabled` provided.
  const controlButtonClasses =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-(--radius-tight) border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors hover:border-pillar/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar aria-disabled:pointer-events-none aria-disabled:opacity-50";

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-35 blur-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--pillar-accent) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="rounded-panel border border-border bg-surface p-6 shadow-sm sm:p-8">
        <BlochSphereCanvas blochPoint={renderPoint} className="mx-auto h-auto w-full max-w-xs" />

        <p aria-live="polite" className="mt-4 min-h-[2.5rem] text-center text-xs text-muted-foreground">
          {narration}
          {lastMeasurement !== null ? (
            <span className="ml-1 font-mono text-pillar">→ |{lastMeasurement}⟩</span>
          ) : null}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {HERO_GATES.map((gate) => (
            <button
              key={gate.id}
              type="button"
              aria-disabled={isAnimating}
              onClick={() => applyGate(gate)}
              title={gate.explanation}
              // A button whose entire content is the letter "H" announces as
              // "H, button" — no indication it is a gate, or that pressing it
              // does anything to the sphere. `title` alone does not fix that:
              // it becomes the accessible *description*, which many screen
              // readers skip. The visible letter stays as it is.
              aria-label={`Apply the ${gate.label} gate`}
              className={controlButtonClasses}
            >
              {gate.label}
            </button>
          ))}
          <button type="button" aria-disabled={isAnimating} onClick={applyMeasurement} className={controlButtonClasses}>
            Measure
          </button>
          <button type="button" aria-disabled={isAnimating} onClick={reset} className={controlButtonClasses}>
            Reset
          </button>
        </div>

        {/* The rotate hint sits outside the link on purpose. It used to be the
            link's second line, which made the link announce as "Bloch sphere
            Drag to rotate the view Full explorer" — an instruction about the
            canvas above welded onto the accessible name of a control that goes
            somewhere else entirely. It now describes what it is about, and the
            link's name is just its destination. */}
        <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          Drag the sphere, or focus it and use the arrow keys, to rotate the view.
        </p>

        <Link
          href="/simulators"
          className="mt-3 flex min-h-11 items-center justify-between gap-3 transition-colors hover:border-pillar/40"
        >
          <span className="text-sm font-medium text-foreground">Bloch sphere</span>
          <Badge tone="brand">Full explorer →</Badge>
        </Link>
      </div>
    </div>
  );
}
