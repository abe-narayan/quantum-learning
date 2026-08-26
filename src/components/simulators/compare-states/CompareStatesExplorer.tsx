"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { KatexMath } from "@/components/ui/KatexMath";
import { BarChart, type BarChartEntry } from "@/components/visualizations/BarChart";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { stateToBlochVector, blochStateFromAngles, type BlochAngles } from "@/lib/quantum/bloch";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import { BlochSphereCanvas } from "../bloch-sphere/BlochSphereCanvas";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { ComplexPlaneCanvas } from "../complex-amplitude-explorer/ComplexPlaneCanvas";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { SimulatorSlider } from "../shared/controls";

const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;
const TWO_PI = 2 * Math.PI;

// This simulator's whole displayed view — Bloch sphere, complex-plane points, and
// probability bars — is a pure function of the same θ/φ Bloch angles used throughout
// `bloch-sphere/`, so those two numbers are the minimal shareable state. Query params
// are prefixed (`cs_`) rather than reusing `theta`/`phi` because this simulator is
// rendered on the same `/simulators` page as `BlochSphereExplorer`, which owns those
// unprefixed names — without a prefix the two would stomp on each other's URL state.
function clampTheta(value: number): number {
  return Math.min(Math.PI, Math.max(0, value));
}

// Wraps to [0, 2π) — the range the θ/φ sliders below use — as opposed to the
// file's other `normalizePhi` (below), which wraps to [-π, π] for angle-equality checks.
function wrapPhiToTwoPi(phi: number): number {
  const wrapped = phi % TWO_PI;
  return wrapped < 0 ? wrapped + TWO_PI : wrapped;
}

/** Reads and validates `?cs_theta=&cs_phi=` from the URL. Never throws — returns null on anything malformed or absent. */
function parseAnglesFromParams(params: { get(key: string): string | null }): BlochAngles | null {
  const rawTheta = params.get("cs_theta");
  const rawPhi = params.get("cs_phi");
  if (rawTheta === null || rawPhi === null) return null;
  const theta = Number(rawTheta);
  const phi = Number(rawPhi);
  if (!Number.isFinite(theta) || !Number.isFinite(phi)) return null;
  return { theta: clampTheta(theta), phi: wrapPhiToTwoPi(phi) };
}

/**
 * One real single-qubit state, driven by one set of shared controls (a
 * preset picker plus θ/φ sliders — the same `BlochAngles` used throughout
 * `bloch-sphere/`), rendered simultaneously through three lenses that
 * already exist as their own simulators: `BlochSphereCanvas` (a point on
 * the sphere), `ComplexPlaneCanvas` (each amplitude as a point in the
 * complex plane), and `BarChart` (the two measurement probabilities). No
 * rendering logic is reimplemented here — this component only derives the
 * shared `StateVector` and its Bloch/amplitude/probability views via the
 * real conversions in `lib/quantum/bloch.ts` and `StateVector` itself, then
 * hands each view to the lens that already knows how to draw it.
 */
export function CompareStatesExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [angles, setAngles] = useState<BlochAngles>(
    () => parseAnglesFromParams(searchParams) ?? STATE_PRESETS[0].angles
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

  // Keep the URL in sync with the settled angles so the page is always shareable.
  // Debounced so a slider drag (which calls `setAngles` on every input event) doesn't
  // spam `history.replaceState` — only the value it settles on after a short pause
  // gets written. Skips the very first run so mounting doesn't immediately rewrite
  // the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("cs_theta", angles.theta.toFixed(3));
      params.set("cs_phi", angles.phi.toFixed(3));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);
    return () => {
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
    // Deliberately depends only on the angles: `router`/`pathname` are stable, and
    // reading the rest of the query string fresh from `window.location` (rather than
    // depending on the `searchParams` hook) avoids re-running this effect off of our
    // own `replace` calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angles.theta, angles.phi]);

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

  const state = blochStateFromAngles(angles);
  const blochVector = stateToBlochVector(state);
  const [alpha, beta] = state.amplitudes;
  const probabilities = state.probabilities() as [number, number];

  const activePresetId =
    STATE_PRESETS.find((preset) => anglesEqual(preset.angles, angles))?.id ?? null;

  const bars: BarChartEntry[] = [
    { label: "P(0) = |α|²", value: probabilities[0] },
    { label: "P(1) = |β|²", value: probabilities[1], highlight: true },
  ];

  return (
    <SimulatorInstrument
      label="Cross-simulator comparison"
      footnote="The same qubit state, shown three honest ways — changing it moves all three together, because they're the same number."
      // `@container`: the three-panel comparison below queries this stage's
      // own rendered width (see the `@[44rem]:` grid a few lines down), not
      // the viewport — this stage has no controls rail (this simulator has
      // no `controls` prop at all), so it always gets the instrument's full
      // width, but that width still varies a lot: full lesson reading column
      // on desktop, ~280px at a 320px viewport. A `lg:` viewport breakpoint
      // can't see that difference.
      stageClassName="@container"
      stage={
        <>
      <div className="flex justify-end">
        <Button size="sm" variant="secondary" onClick={handleCopyLink} aria-live="polite">
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
        <span className="text-sm font-semibold text-foreground sm:mr-1">State presets:</span>
        <PresetToggle
          ariaLabel="State presets"
          options={STATE_PRESETS.map((preset) => ({ label: preset.ket }))}
          index={STATE_PRESETS.findIndex((preset) => preset.id === activePresetId)}
          onChange={(i) => setAngles(STATE_PRESETS[i].angles)}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6">
        <SimulatorSlider
          label="θ (polar angle)"
          value={angles.theta}
          min={0}
          max={Math.PI}
          step={0.005}
          formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
          valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={(theta) => setAngles({ theta, phi: angles.phi })}
        />
        <SimulatorSlider
          label="φ (azimuthal angle)"
          value={angles.phi}
          min={0}
          max={2 * Math.PI}
          step={0.005}
          formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
          valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={(phi) => setAngles({ theta: angles.theta, phi })}
        />
      </div>

      {/* Container query, not viewport: three ~200px-minimum panels need
          about 700px of actual stage width to read well, which a wide
          desktop *viewport* does not guarantee when this simulator is
          embedded in a lesson's reading column (that column can be
          narrower than this threshold even past the 1024px viewport
          breakpoint `lg:` used to key off, and can just as easily be wide
          enough well below it). This was very likely why this simulator —
          alone among the 14 — had zero lesson embeds: authors who tried it
          in-lesson would have hit three panels crammed into a ~350px
          column, at desktop viewport widths where nothing looked wrong on
          `/simulators` itself. */}
      <div className="mt-8 grid gap-8 @[44rem]:grid-cols-3">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold text-foreground">Bloch sphere</h3>
          <div className="mt-3 w-full max-w-[220px]">
            <BlochSphereCanvas blochPoint={blochVector} className="w-full" />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            The state as a single point on the unit sphere. Drag to rotate the view.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold text-foreground">Complex amplitude plane</h3>
          <div className="mt-3 flex w-full justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <ComplexPlaneCanvas re={alpha.re} im={alpha.im} />
              <KatexMath tex={`\\alpha = ${formatAmplitudeLatex(alpha, 2)}`} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <ComplexPlaneCanvas re={beta.re} im={beta.im} />
              <KatexMath tex={`\\beta = ${formatAmplitudeLatex(beta, 2)}`} />
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            α and β, the same two numbers, each plotted as a point in the complex plane.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold text-foreground">Measurement probabilities</h3>
          <div className="mt-3 w-full max-w-xs">
            <BarChart bars={bars} ariaLabel="Measurement probabilities P(0) and P(1)" maxValue={1} />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            |α|² and |β|² — what you&rsquo;d actually see across many measurements.
          </p>
        </div>
      </div>

      <SimulatorFraming
        shows="One state, θ and φ, driving three different pictures of the same number at once — a point on a sphere, two points in the complex plane, and a pair of bar heights."
        watchFor="Nothing here is three separate simulators kept in sync by hand — moving either slider recomputes all three views from the same StateVector, so they can never disagree with each other."
        tryThis="Set the state to |+⟩ and notice: on the Bloch sphere it sits on the equator; in the complex plane both amplitudes point along the real axis; the bar chart shows 50/50."
      />
        </>
      }
    />
  );
}

function anglesEqual(a: BlochAngles, b: BlochAngles, epsilon = 1e-6): boolean {
  return Math.abs(a.theta - b.theta) < epsilon && Math.abs(normalizePhi(a.phi - b.phi)) < epsilon;
}

function normalizePhi(phi: number): number {
  let normalized = phi % (2 * Math.PI);
  if (normalized > Math.PI) normalized -= 2 * Math.PI;
  if (normalized < -Math.PI) normalized += 2 * Math.PI;
  return normalized;
}
