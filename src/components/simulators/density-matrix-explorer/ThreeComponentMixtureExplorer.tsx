"use client";

import { useEffect, useMemo, useState } from "react";
import { Readout } from "@/components/ui/Typography";
import { blochStateFromAngles } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, convexCombination, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "../bloch-sphere/BlochSphereCanvas";
import { useAnimatedBlochTarget } from "../bloch-sphere/useAnimatedBlochPoint";
import { DensityMatrixStatePanel } from "./DensityMatrixStatePanel";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { ControlSection, SimulatorSlider, PillGroup } from "../shared/controls";

/** How long the derived-weight readout must hold still before it is announced. See `announcedPPlus`. */
const SETTLE_MS = 400;

const ZERO_ANGLES = { theta: 0, phi: 0 };
const ONE_ANGLES = { theta: Math.PI, phi: 0 };
const PLUS_ANGLES = { theta: Math.PI / 2, phi: 0 };

// Fixed once: these three kets are exactly the worked example's ensemble,
// so this widget is deliberately scoped to that one point rather than
// generalized into a full N-component mixer.
const RHO_0 = pureStateDensityMatrix(blochStateFromAngles(ZERO_ANGLES));
const RHO_1 = pureStateDensityMatrix(blochStateFromAngles(ONE_ANGLES));
const RHO_PLUS = pureStateDensityMatrix(blochStateFromAngles(PLUS_ANGLES));

type ThreeWeightPreset = {
  id: string;
  label: string;
  p0: number;
  p1: number;
};

// p_plus is always 1 - p0 - p1, so every preset here already sums to 1,
// there's nothing to normalize or validate at the call site.
const PRESETS: ThreeWeightPreset[] = [
  { id: "worked-example", label: "Worked example: 0.5 / 0.25 / 0.25", p0: 0.5, p1: 0.25 },
  { id: "equal-thirds", label: "Equal thirds", p0: 1 / 3, p1: 1 / 3 },
  { id: "pure-0", label: "Pure |0⟩", p0: 1, p1: 0 },
];

/**
 * A small, lesson-local widget for exactly one thing the shared
 * `DensityMatrixExplorer` can't show: a genuine three-component mixture. It
 * fixes the ensemble to this lesson's worked example (|0⟩, |1⟩, |+⟩) and
 * exposes two independent sliders (p0, p1); the third probability,
 * p_plus = 1 - p0 - p1, is derived rather than independently adjustable, so
 * every reachable configuration is automatically a valid probability
 * distribution (nonnegative, summing to exactly 1) with no separate
 * renormalization step.
 */
export function ThreeComponentMixtureExplorer() {
  const [p0, setP0] = useState(0.5);
  const [p1, setP1] = useState(0.25);
  const [activePresetId, setActivePresetId] = useState<string | null>("worked-example");

  const clampedP1 = Math.min(p1, 1 - p0);
  const pPlus = 1 - p0 - clampedP1;
  /** p₀ has claimed the entire probability budget, so p₁'s slider range has collapsed to a single point. */
  const noWeightLeftForP1 = 1 - p0 <= 0;

  /**
   * The value the live region actually speaks, held one settle-delay behind
   * `pPlus`.
   *
   * `pPlus` is derived from two sliders, so it changes on every `pointermove`
   * of a drag, dozens of times per second. Announcing each one is not the
   * classic timer-driven live-region spam (nothing here updates unless the
   * reader is doing something), but it is chatty in a way that actively hurts:
   * NVDA and VoiceOver queue polite updates rather than dropping them, so a
   * one-second drag leaves a reader listening to twenty stale numbers before
   * hearing the one they stopped on, and JAWS interrupts its own reading of
   * the slider's `aria-valuetext` to do it.
   *
   * Debouncing to the end of the gesture makes it one announcement per drag,
   * the number the reader actually chose. Keyboard scrubbing behaves the same
   * way: hold an arrow key and you hear the result once, on release, instead
   * of once per repeat. `SETTLE_MS` is long enough to span pointer-event
   * cadence and key auto-repeat, short enough that it still reads as a
   * response to the action rather than a later interruption.
   */
  const [announcedPPlus, setAnnouncedPPlus] = useState(pPlus);
  useEffect(() => {
    const id = window.setTimeout(() => setAnnouncedPPlus(pPlus), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [pPlus]);

  const rho = useMemo(
    () =>
      convexCombination([
        { probability: p0, density: RHO_0 },
        { probability: clampedP1, density: RHO_1 },
        { probability: pPlus, density: RHO_PLUS },
      ]),
    [p0, clampedP1, pPlus]
  );

  const targetBlochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const { point: blochVector } = useAnimatedBlochTarget(targetBlochVector);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setP0(preset.p0);
    setP1(preset.p1);
    setActivePresetId(preset.id);
  }

  return (
    <SimulatorInstrument
      label="Density matrix: three-component mixture"
      readout={<Readout label="Purity" value={purityValue.toFixed(3)} />}
      footnote="ρ = p₀|0⟩⟨0| + p₁|1⟩⟨1| + p₊|+⟩⟨+|. p₊ is always whatever's left, so this can never drift into an invalid mixture."
      stage={
        <>
          <div className="mx-auto max-w-sm">
            <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            The point pulled by three weighted components at once, not the pairwise workaround above.
          </p>
          <div className="mt-6">
            <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />
          </div>

          <SimulatorFraming
            shows="A mixture doesn't need to stay pairwise: three independently-weighted pure states can pull the Bloch point to the same interior location a two-component mixture reaches, as long as the weights land on the same effective average."
            watchFor="p₊ is derived, not a third slider; every point you can reach with p₀ and p₁ is automatically a valid probability distribution, so nothing here can be normalized wrong."
            tryThis="Drag p₀ to 1 (or p₁ to 1 − p₀) so p₊ hits 0. The mixture collapses back to the two-component case above. Then split the weight three ways with Equal thirds and compare the entropy reading to the two-component 50/50 presets."
          />
        </>
      }
      controls={
        <div className="space-y-6">
          <ControlSection id="mixture3-presets" title="Presets">
            <PillGroup
              label="Weight presets"
              value={activePresetId}
              options={PRESETS.map((preset) => ({ id: preset.id, label: preset.label }))}
              onChange={applyPreset}
            />
          </ControlSection>

          <ControlSection
            id="mixture3-weights"
            title="Mixing weights"
            description="ρ = p₀·ρ₀ + p₁·ρ₁ + p₊·ρ₊, where ρ₀, ρ₁, ρ₊ are the density matrices of |0⟩, |1⟩ and |+⟩."
          >
            <div className="space-y-4">
              <SimulatorSlider
                id="mixture3-p0"
                label="p₀ (|0⟩)"
                value={p0}
                min={0}
                max={1}
                step={0.01}
                formatValue={(v) => v.toFixed(2)}
                onChange={(value) => {
                  setP0(value);
                  setActivePresetId(null);
                }}
              />
              <SimulatorSlider
                id="mixture3-p1"
                label="p₁ (|1⟩)"
                value={clampedP1}
                min={0}
                max={1 - p0}
                step={0.01}
                formatValue={(v) => v.toFixed(2)}
                // At p₀ = 1 (the "Pure |0⟩" preset does exactly this) the
                // remaining weight is zero, so this slider's own range
                // collapses to a single point: it looks live, moves nowhere,
                // and says nothing about why. Disabling it and saying so is
                // the honest reading of "there is no weight left to give."
                disabled={noWeightLeftForP1}
                hint={
                  noWeightLeftForP1
                    ? "p₀ has taken all of the weight, so there is none left to put on |1⟩. Lower p₀ to free some up."
                    : undefined
                }
                onChange={(value) => {
                  setP1(value);
                  setActivePresetId(null);
                }}
              />
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-foreground">p₊ (|+⟩), derived</span>
                  {/* The visible readout is no longer the live region itself.
                      It repaints on every pointermove of a drag, which is
                      right for eyes and wrong for a speech queue; the
                      announcement now comes from the settled `sr-only` region
                      beside it, so the two can be paced independently. */}
                  <span className="font-mono text-sm text-foreground">{pPlus.toFixed(2)}</span>
                  {/* The one number on this panel nothing else announces: it
                      has no slider of its own, and the purity readout in the
                      instrument header reports a different quantity. Without
                      a live region a screen-reader user dragging p₀ or p₁
                      never learns what the third weight became.
                      Named in the text rather than relying on the adjacent
                      visible label, because a live announcement arrives with
                      no surrounding context: "0.25" alone says nothing about
                      which of the three weights just moved. */}
                  {/* `role="status"` + `aria-atomic="true"`. This was the one
                      live region on the bench actually exposed to the bare-
                      number failure: a role-less element's implicit
                      `aria-atomic` is `false`, and the only thing that ever
                      changes inside this span is the formatted number, so an
                      update announced "0.25" with the "p₊ (|+⟩) is" prefix
                      dropped, which is exactly the context the surrounding
                      comment says the region exists to supply. Atomic forces
                      the whole sentence to be re-read on every change. */}
                  <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                    p₊ (|+⟩) is {announcedPPlus.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-pillar transition-[width] duration-300 ease-out motion-reduce:transition-none"
                    style={{ width: `${Math.max(0, Math.min(100, pPlus * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </ControlSection>
        </div>
      }
    />
  );
}
