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
import { easeInOutCubic, GATE_ROTATION_MS, slerpBlochVector } from "./useAnimatedBlochPoint";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Same 550ms as the full `BlochSphereExplorer`, and now literally the same
 * constant: a reader who meets the sphere here and then opens the full
 * explorer should not find the identical H gate sweeping at a different rate.
 */
const ANIMATION_MS = GATE_ROTATION_MS;
const HERO_GATE_IDS: readonly FixedGateId[] = ["H", "X", "Z"];
const HERO_GATES = FIXED_GATES.filter((gate) => HERO_GATE_IDS.includes(gate.id));

/**
 * The state this hero opens on: |+⟩ = H|0⟩, the equal superposition.
 *
 * It used to open on |0⟩, and |0⟩ is the one point on this sphere that
 * teaches nothing: the vector stands straight up at the north pole, which is
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

/**
 * WHY THE SLERP IS IMPORTED RATHER THAN LIVING HERE.
 *
 * This file used to carry its own `slerp`, plus its own `easeInOutCubic`,
 * `arbitraryPerpendicular`, `degenerateSlerpAxis` and
 * `rotateAboutPerpendicularAxis`: a line-for-line copy of what
 * `useAnimatedBlochPoint` exports, forked at some point and then maintained
 * in neither place. The shared one has since been fixed and the copy had not:
 * it read `a·b` as the cosine of the angle between its inputs, which is only
 * true for *unit* vectors, so for a shorter vector it over-reports the angle
 * and the weights sin((1-t)θ)/sinθ and sin(tθ)/sinθ stop summing to 1. The
 * drawn arrow then grows mid-tween, by up to √2 (41%) in the worst case.
 *
 * Nothing was wrong on screen here, and that is exactly the trap: the hero
 * only ever animates *pure* states (every `renderPoint` and `endPoint` below
 * comes from `stateToBlochVector`, whose output is a unit vector), so the
 * bug was unreachable through this file and would have stayed unreachable
 * right up until someone added a decoherence demo to the homepage. The Noise
 * Explorer and the Density Matrix Explorer, which do animate mixed states,
 * had the live version of it.
 *
 * Importing costs nothing: `useAnimatedBlochPoint` is already in the client
 * graph (`BlochSphereExplorer` and four other simulators use it), it pulls in
 * only React and this folder's own `usePrefersReducedMotion`, which this file
 * already imports, and it deletes ~60 lines from here. `slerpBlochVector` is
 * bit-for-bit the old `slerp` on unit input: it normalizes, sweeps the
 * direction along the identical great-circle arc through the identical
 * degenerate-case branches, and rescales to a radius that interpolates from 1
 * to 1. Rendering is unchanged.
 *
 * The full hook is deliberately not adopted wholesale: `runAnimation` below
 * drives `pointAtT` callbacks that are not slerps at all (a gate animates by
 * re-deriving the state from a real `rotationAboutAxis` at each t, which is
 * the thing that makes this hero honest), and it needs the completion
 * callback to settle `state` as well as the point.
 *
 * A compact, genuinely interactive Bloch sphere for the homepage hero: real
 * quantum state (src/lib/quantum), the same 3D-projected canvas as the full
 * BlochSphereExplorer, and a small set of gate/measure/reset controls. This
 * is a deliberately trimmed-down sibling of BlochSphereExplorer (drops
 * presets, angle sliders, and the state readout panel) so it fits a hero
 * layout, not a decorative substitute for it.
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
      `Measured |${outcomeIndex}⟩ (random, weighted by probability). The superposition has collapsed.`
    );

    runAnimation(
      (t) => slerpBlochVector(renderPoint, endPoint, t),
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
      (t) => slerpBlochVector(startPoint, endPoint, t),
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
  // keyboard without re-tabbing through the whole page between them. The
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

      {/* No frame of its own; see the long note in
          `WavefunctionHeroExplorer`. This used to be a `rounded-panel border
          border-border bg-surface p-6 shadow-sm sm:p-8` root, and inside the
          `<Instrument>` that `home/ComputingSection` mounts it in that drew a
          second hairline at the identical radius under `.instrument::after`'s
          corner ticks. `bodyClassName="p-0"` never cancelled it: `cn()` does
          not merge, so the class landed beside `p-4 sm:p-5` and the cascade
          picked the later rule.
          `relative` (and only `relative`) stays, because the glow above is
          `-z-10`: a negative-z sibling paints behind in-flow content, and the
          `bg-surface` that used to do that job has gone with the frame.
          It also un-shrinks the canvas. At a 320px viewport the `<Instrument>`
          hands this 254px; the border and `p-6` took 50 of them, leaving the
          sphere 204px, at which the 15-unit axis labels on the 400-unit
          viewBox rendered at 15 × 204 ÷ 400 = 7.65px — under the ~9px floor
          the type in `BlochSphereCanvas` was raised to clear. At the full
          254px they are 9.53px, which is the figure that file's own note
          derives. */}
      <div className="relative">
        <BlochSphereCanvas blochPoint={renderPoint} className="mx-auto h-auto w-full max-w-xs" />

        {/* `aria-atomic="true"` is load-bearing here rather than tidy-up: the
            region is two children, a narration sentence and a measurement
            chip, and only the chip changes when a measurement lands. Without
            atomic, a role-less element's implicit `aria-atomic="false"` means
            that update announces the bare "→ |1⟩" with no sentence around it.
            `role="status"` carries the polite live region itself. */}
        <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 min-h-[2.5rem] text-center text-xs text-muted-foreground">
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
              // "H, button", with no indication it is a gate, or that pressing it
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
            Drag to rotate the view Full explorer", an instruction about the
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
