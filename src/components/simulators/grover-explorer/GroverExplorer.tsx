"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { uniformSuperposition, groverIteration, optimalGroverIterations } from "@/lib/quantum/grover";
import { AmplitudeBars } from "./AmplitudeBars";
import { GroverControls } from "./GroverControls";
import { KatexMath } from "@/components/ui/KatexMath";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Typography";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { Predict } from "../shared/Predict";

const DEFAULT_NUM_QUBITS = 3;
const DEFAULT_MARKED_INDEX = 5;
const MIN_QUBITS = 2;
const MAX_QUBITS = 4;
const MAX_ITERATION = 200;
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

// Minimal shareable state is qubit count + marked index + iteration count —
// together they fully determine the amplitude vector shown (it's a pure
// function of these three via `groverIteration`). Params are prefixed
// (`grover_`) because this simulator shares `/simulators` with other
// URL-stateful simulators.
function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Reads and validates `?grover_n=&grover_m=&grover_i=`. Null if any is absent or malformed. */
function parseGroverParams(
  params: { get(key: string): string | null }
): { numQubits: number; markedIndex: number; iteration: number } | null {
  const rawN = params.get("grover_n");
  const rawM = params.get("grover_m");
  const rawI = params.get("grover_i");
  if (rawN === null || rawM === null || rawI === null) return null;
  const n = Number(rawN);
  const m = Number(rawM);
  const i = Number(rawI);
  if (!Number.isFinite(n) || !Number.isFinite(m) || !Number.isFinite(i)) return null;
  const numQubits = clampInt(n, MIN_QUBITS, MAX_QUBITS);
  const markedIndex = clampInt(m, 0, 2 ** numQubits - 1);
  const iteration = clampInt(i, 0, MAX_ITERATION);
  return { numQubits, markedIndex, iteration };
}

export function GroverExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialGrover = parseGroverParams(searchParams);

  const [numQubits, setNumQubits] = useState(initialGrover?.numQubits ?? DEFAULT_NUM_QUBITS);
  const [markedIndex, setMarkedIndex] = useState(initialGrover?.markedIndex ?? DEFAULT_MARKED_INDEX);
  const [iteration, setIteration] = useState(initialGrover?.iteration ?? 0);
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

  // Keep the URL in sync with the settled state so the page is always shareable.
  // Debounced, and skips the very first run so mounting doesn't immediately
  // rewrite the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("grover_n", String(numQubits));
      params.set("grover_m", String(markedIndex));
      params.set("grover_i", String(iteration));
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
  }, [numQubits, markedIndex, iteration]);

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

  // A running history of P(marked) at every iteration count from 0 up to the
  // current one — the same `groverIteration` sequence `state` below already
  // walks, just retained at each step instead of only the last. This is what
  // lets the over-rotation Predict question (below) compare "probability the
  // moment you reached the optimum" against "probability now" without
  // re-deriving physics: it's a read of the same real trajectory, not a
  // parallel computation.
  const probabilityHistory = useMemo(() => {
    let s = uniformSuperposition(numQubits);
    const history = [s.probabilities()[markedIndex]];
    for (let i = 0; i < iteration; i++) {
      s = groverIteration(s, [markedIndex]);
      history.push(s.probabilities()[markedIndex]);
    }
    return history;
  }, [numQubits, markedIndex, iteration]);

  const state = useMemo(() => {
    let s = uniformSuperposition(numQubits);
    for (let i = 0; i < iteration; i++) s = groverIteration(s, [markedIndex]);
    return s;
  }, [numQubits, markedIndex, iteration]);

  const optimal = optimalGroverIterations(numQubits, 1);
  const successProbability = state.probabilities()[markedIndex];

  const handleNumQubitsChange = (n: number) => {
    setNumQubits(n);
    setMarkedIndex(Math.min(markedIndex, 2 ** n - 1));
    setIteration(0);
  };

  const handleMarkedIndexChange = (i: number) => {
    setMarkedIndex(i);
    setIteration(0);
  };

  const handleStep = () => setIteration((i) => i + 1);
  const handleReset = () => setIteration(0);

  return (
    <SimulatorInstrument
      label="Grover&rsquo;s algorithm — amplitude amplification"
      readout={<Readout label="P(marked)" value={(successProbability * 100).toFixed(1)} unit="%" />}
      footnote="Next: see how the same-size search space collapses instantly in the Two-Qubit Explorer&rsquo;s measurement panel — no amplification needed classically."
      stageClassName="space-y-6"
      stage={
        <>
          <div className="rounded-xl border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {iteration === 0 ? (
              <>Starting in the uniform superposition: every basis state has the same amplitude and probability.</>
            ) : (
              <>
                After {iteration} iteration{iteration === 1 ? "" : "s"}: P(marked) = {(successProbability * 100).toFixed(1)}%.{" "}
                {iteration === optimal
                  ? "This is the theoretical optimum. Stepping further will start to overshoot."
                  : iteration > optimal
                    ? "Past the optimum: success probability is now falling back down."
                    : null}
              </>
            )}
          </div>

          <AmplitudeBars state={state} markedIndices={[markedIndex]} />

          <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
            <KatexMath
              tex={`P(\\text{marked}) = ${successProbability.toFixed(4)}`}
              display
            />
          </div>

          {iteration >= optimal && optimal > 0 ? (
            <Predict
              key={`${numQubits}-${markedIndex}`}
              question={`You've just reached the theoretical optimum (${optimal} iteration${optimal === 1 ? "" : "s"}). Step once more — does P(marked) keep climbing, or start falling?`}
              options={[
                { id: "climb", label: "Keeps climbing" },
                { id: "fall", label: "Starts falling" },
              ]}
              outcomeId={
                iteration > optimal
                  ? probabilityHistory[iteration] > probabilityHistory[optimal] + 1e-9
                    ? "climb"
                    : "fall"
                  : null
              }
            />
          ) : null}

          <SimulatorFraming
            shows="Grover's algorithm concentrates probability onto a marked item faster than any classical search — but only up to a point."
            watchFor="Success probability doesn't climb forever — past the optimal iteration count it overshoots and starts falling back down."
            tryThis={
              <ul>
                <li>
                  Set 3 qubits, mark index 5, and step past the optimal iteration count shown in the controls
                  — watch P(marked) fall back down instead of climbing forever.
                </li>
                <li>Try 4 qubits (16 items) and compare how many iterations it takes versus 3 qubits (8 items).</li>
              </ul>
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
            <GroverControls
              numQubits={numQubits}
              onNumQubitsChange={handleNumQubitsChange}
              markedIndex={markedIndex}
              onMarkedIndexChange={handleMarkedIndexChange}
              iteration={iteration}
              optimalIteration={optimal}
              onStep={handleStep}
              onReset={handleReset}
              disabled={false}
            />
          </div>
        </>
      }
    />
  );
}
