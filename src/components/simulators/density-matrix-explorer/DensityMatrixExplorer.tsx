"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Typography";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { blochStateFromAngles, densityMatrixToBlochVector, type BlochAngles } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, convexCombination, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { BlochSphereCanvas } from "../bloch-sphere/BlochSphereCanvas";
import { useAnimatedBlochTarget } from "../bloch-sphere/useAnimatedBlochPoint";
import { DensityMatrixControls } from "./DensityMatrixControls";
import { DensityMatrixStatePanel } from "./DensityMatrixStatePanel";
import { MIXTURE_PRESETS } from "./presets";

const DEFAULT_COMPONENT_1: BlochAngles = { theta: 0, phi: 0 };
const DEFAULT_COMPONENT_2: BlochAngles = { theta: Math.PI, phi: 0 };
/**
 * A 90/10 mixture, not weight 1. Weight 1 is a *pure* state sitting exactly on
 * the sphere's surface — in an instrument built to show mixedness, that's the
 * one setting with no mixedness in it. At 0.9 the point already sits visibly
 * inside the surface and purity/entropy read something other than their pure
 * values on mount, per the bench's "open mid-phenomenon" rule. The pure
 * reference is one click away on the presets, and Reset returns there
 * explicitly (see `reset` below).
 */
const DEFAULT_WEIGHT = 0.9;
const DEFAULT_PRESET_ID = "mostly-0";
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

// Minimal shareable state is the mixing weight plus the two components' Bloch
// angles — together they fully determine ρ via the same convex-combination
// formula used below. Params are prefixed (`dm_`) because this simulator
// shares /simulators with other URL-stateful simulators.
function clampTheta(value: number): number {
  return Math.min(Math.PI, Math.max(0, value));
}

function normalizePhi(phi: number): number {
  const TWO_PI = 2 * Math.PI;
  const wrapped = phi % TWO_PI;
  return wrapped < 0 ? wrapped + TWO_PI : wrapped;
}

function clampWeight(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Reads and validates `?dm_t1=&dm_p1=&dm_t2=&dm_p2=&dm_w=`. Never throws — returns null on anything malformed or absent. */
function parseDensityMatrixParams(
  params: { get(key: string): string | null }
): { component1: BlochAngles; component2: BlochAngles; weight: number } | null {
  const rawT1 = params.get("dm_t1");
  const rawP1 = params.get("dm_p1");
  const rawT2 = params.get("dm_t2");
  const rawP2 = params.get("dm_p2");
  const rawW = params.get("dm_w");
  if (rawT1 === null || rawP1 === null || rawT2 === null || rawP2 === null || rawW === null) return null;
  const t1 = Number(rawT1);
  const p1 = Number(rawP1);
  const t2 = Number(rawT2);
  const p2 = Number(rawP2);
  const w = Number(rawW);
  if (![t1, p1, t2, p2, w].every(Number.isFinite)) return null;
  return {
    component1: { theta: clampTheta(t1), phi: normalizePhi(p1) },
    component2: { theta: clampTheta(t2), phi: normalizePhi(p2) },
    weight: clampWeight(w),
  };
}

function matchMixturePresetId(component1: BlochAngles, component2: BlochAngles, weight: number, epsilon = 1e-2): string | null {
  const match = MIXTURE_PRESETS.find(
    (preset) =>
      Math.abs(preset.component1.theta - component1.theta) < epsilon &&
      Math.abs(preset.component1.phi - component1.phi) < epsilon &&
      Math.abs(preset.component2.theta - component2.theta) < epsilon &&
      Math.abs(preset.component2.phi - component2.phi) < epsilon &&
      Math.abs(preset.weight - weight) < epsilon
  );
  return match?.id ?? null;
}

/**
 * A single-qubit density matrix built live from ρ = p·ρ₁ + (1−p)·ρ₂, where
 * ρ₁, ρ₂ come from two independently-adjustable points on the Bloch sphere.
 * Deliberately single-qubit in scope (matching this course's engine, which
 * has no general N-dimensional eigensolver) — the payoff is that mixedness
 * becomes something you can literally see: pure states sit exactly on the
 * sphere's surface, and every real mixture pulls the point strictly inside,
 * by exactly the amount `purity` and `vonNeumannEntropy` predict.
 */
export function DensityMatrixExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialFromUrl = parseDensityMatrixParams(searchParams);

  const [component1, setComponent1] = useState<BlochAngles>(initialFromUrl?.component1 ?? DEFAULT_COMPONENT_1);
  const [component2, setComponent2] = useState<BlochAngles>(initialFromUrl?.component2 ?? DEFAULT_COMPONENT_2);
  const [weight, setWeight] = useState(initialFromUrl?.weight ?? DEFAULT_WEIGHT);
  const [activePresetId, setActivePresetId] = useState<string | null>(() =>
    initialFromUrl
      ? matchMixturePresetId(initialFromUrl.component1, initialFromUrl.component2, initialFromUrl.weight)
      : DEFAULT_PRESET_ID
  );
  const [narration, setNarration] = useState(() =>
    initialFromUrl
      ? "Restored the shared mixture from your link."
      : "A 90/10 mixture of |0⟩ and |1⟩ — mostly |0⟩, but not certainly. The point has already left the sphere's surface: that gap is the missing certainty."
  );
  const [copied, setCopied] = useState(false);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstUrlSync = useRef(true);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
  }, []);

  const rho = useMemo(() => {
    const rho1 = pureStateDensityMatrix(blochStateFromAngles(component1));
    const rho2 = pureStateDensityMatrix(blochStateFromAngles(component2));
    return convexCombination([
      { probability: weight, density: rho1 },
      { probability: 1 - weight, density: rho2 },
    ]);
  }, [component1, component2, weight]);

  const targetBlochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const { point: blochVector } = useAnimatedBlochTarget(targetBlochVector);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);

  // Keep the URL in sync with the settled mixture so the page is always shareable.
  // Debounced so dragging a slider doesn't spam `history.replaceState` — only the
  // value it settles on after a short pause gets written. Skips the very first run
  // so mounting doesn't immediately rewrite the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("dm_t1", component1.theta.toFixed(3));
      params.set("dm_p1", component1.phi.toFixed(3));
      params.set("dm_t2", component2.theta.toFixed(3));
      params.set("dm_p2", component2.phi.toFixed(3));
      params.set("dm_w", weight.toFixed(3));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);
    return () => {
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
    // Deliberately depends only on the shareable state: `router`/`pathname` are
    // stable, and reading the rest of the query string fresh from
    // `window.location` (rather than depending on the `searchParams` hook)
    // avoids re-running this effect off of our own `replace` calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component1.theta, component1.phi, component2.theta, component2.phi, weight]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), COPY_CONFIRMATION_MS);
    } catch {
      // Clipboard access can be denied in some browser security contexts — no crash, no link copied.
    }
  }, []);

  function applyMixturePreset(presetId: string) {
    const preset = MIXTURE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setComponent1(preset.component1);
    setComponent2(preset.component2);
    setWeight(preset.weight);
    setActivePresetId(presetId);
    setNarration(preset.narration);
  }

  function handleComponent1Change(angles: BlochAngles) {
    setComponent1(angles);
    setActivePresetId(null);
    setNarration(
      weight === 0
        ? "Adjusted component 1 — but the mixing weight is entirely on component 2 right now, so ρ hasn't changed. Move the weight slider to see it."
        : "Adjusted component 1 — the density matrix updates live."
    );
  }

  function handleComponent2Change(angles: BlochAngles) {
    setComponent2(angles);
    setActivePresetId(null);
    setNarration(
      weight === 1
        ? "Adjusted component 2 — but the mixing weight is entirely on component 1 right now, so ρ hasn't changed. Move the weight slider to see it."
        : "Adjusted component 2 — the density matrix updates live."
    );
  }

  function handleWeightChange(nextWeight: number) {
    setWeight(nextWeight);
    setActivePresetId(null);
    setNarration(
      nextWeight === 0 || nextWeight === 1
        ? "Weight is entirely on one component — the mixture is pure again."
        : "Adjusted the mixing weight — watch the point move toward or away from the center."
    );
  }

  function reset() {
    applyMixturePreset(DEFAULT_PRESET_ID);
  }

  return (
    <SimulatorInstrument
      label="Density matrix — mixed states"
      readout={<Readout label="Purity" value={purityValue.toFixed(3)} />}
      footnote="Next: see what happens when a real noise channel — not a hand-picked mixture — pulls a pure state toward the center → try the Noise &amp; Decoherence Explorer."
      stage={
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            There are two different ways not to know what a qubit will do. In a superposition, the qubit
            genuinely has no answer yet. In a <em>mixture</em>, it does have one — you just weren&rsquo;t
            told which. This instrument builds the second kind: pick two states, set how often each one is
            the true one, and the density matrix ρ is what an experimenter who only knows those odds can
            say. Distance from the sphere&rsquo;s surface is exactly how much they don&rsquo;t know.
          </p>

          <div className="mx-auto max-w-sm">
            <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Drag to rotate the view. A mixed state&rsquo;s point sits strictly inside the sphere, not on its surface.
          </p>

          <div aria-live="polite" className="mt-4 rounded-xl border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {narration}
          </div>

          <div className="mt-6">
            <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />
          </div>

          <SimulatorFraming
            shows="The Bloch vector of a mixture is the probability-weighted average of its components&rsquo; own vectors — that&rsquo;s why the point moves smoothly toward the center as the mixing weight balances out, rather than jumping discontinuously."
            watchFor={
              <>
                Try the two 50/50 presets — {"{"}|0⟩,|1⟩{"}"} and {"{"}|+⟩,|−⟩{"}"} — and check the density
                matrix panel: both land on the exact same ρ = I/2, even though they mix completely different
                states.
              </>
            }
          />
        </>
      }
      controls={
        <>
          <div className="flex justify-end">
            <Button size="sm" variant="secondary" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>
          <div className="mt-4">
            <DensityMatrixControls
              component1={component1}
              component2={component2}
              weight={weight}
              activePresetId={activePresetId}
              onComponent1Change={handleComponent1Change}
              onComponent2Change={handleComponent2Change}
              onWeightChange={handleWeightChange}
              onApplyMixturePreset={applyMixturePreset}
              onReset={reset}
            />
          </div>
        </>
      }
    />
  );
}
