"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Complex } from "@/lib/quantum/complex";
import {
  encodeBitFlipCode,
  encodePhaseFlipCode,
  applyBitFlipErrors,
  applyPhaseFlipErrors,
  runBitFlipCorrectionCycle,
  runPhaseFlipCorrectionCycle,
} from "@/lib/quantum/errorCorrection";
import { StateInspector } from "@/components/simulators/circuit-builder/StateInspector";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { Predict } from "../shared/Predict";
import { ControlSection, SymbolGloss } from "../shared/controls";

const INJECTABLE_QUBITS = [0, 1, 2] as const;

const ALPHA = new Complex(0.6);
const BETA = new Complex(0.8);
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

// Minimal shareable state is the SET of qubits (possibly empty) that have
// an injected error. This component renders twice on the same /simulators
// page (once per `mode`), so the two instances need distinct param names,
// not just a shared prefix, or they'd stomp on each other's URL state.
function paramNameForMode(mode: "bit-flip" | "phase-flip"): string {
  return mode === "bit-flip" ? "syn_bf" : "syn_pf";
}

/**
 * First-contact default when no URL param is present: one real error already
 * injected (on qubit 1), so the instrument opens mid-phenomenon: a nonzero
 * syndrome on screen, correction visibly at work, instead of the blank
 * "nothing is wrong" state. "Clear all errors" still reaches the undisturbed
 * reference state, and a shared link with `syn_bf`/`syn_pf` set (including
 * an explicit "none") always wins over this default.
 */
const DEFAULT_INJECTED: number[] = [1];

/**
 * Reads and validates the injected-qubits param for this instance's mode:
 * a comma-separated list of qubit indices (e.g. "0,1"), or "none". Falls
 * back to the first-contact default (an error on qubit 1) when the param is
 * absent; an explicit "none" still means no error, so shared no-error links
 * keep working. A bare single index (e.g. "1"), the format this param used
 * before multi-qubit injection was supported, still parses correctly as a
 * one-element set, so old shared links keep working.
 */
function parseInjectedQubits(params: { get(key: string): string | null }, mode: "bit-flip" | "phase-flip"): number[] {
  const raw = params.get(paramNameForMode(mode));
  if (raw === null) return [...DEFAULT_INJECTED];
  if (raw === "none") return [];
  const qubits = raw
    .split(",")
    .map((token) => Number(token))
    .filter((n): n is 0 | 1 | 2 => n === 0 || n === 1 || n === 2);
  return Array.from(new Set(qubits)).sort((a, b) => a - b);
}

/** Formats a sorted, nonempty list of qubit indices as prose, e.g. [0], [0,1], [0,1,2]. */
function formatQubitList(qubits: readonly number[]): string {
  if (qubits.length === 1) return `qubit ${qubits[0]}`;
  const last = qubits[qubits.length - 1];
  const rest = qubits.slice(0, -1).join(", ");
  return `qubits ${rest} and ${last}`;
}

/**
 * Inject a real bit-flip (X) or phase-flip (Z) error on one of three
 * encoded qubits and watch the platform's actual `runBitFlipCorrectionCycle`
 * / `runPhaseFlipCorrectionCycle` extract the syndrome via genuine
 * ancilla CNOTs and partial measurement, decode it, and apply the
 * correction: the real 3-qubit repetition code, not a scripted
 * animation. Shares one component between both lessons via the `mode`
 * prop, since the phase-flip code is the bit-flip code conjugated by H
 * on every qubit (documented in `errorCorrection.ts`).
 */
export function SyndromeExplorer({ mode }: { mode: "bit-flip" | "phase-flip" }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const paramName = paramNameForMode(mode);

  const [injected, setInjected] = useState<number[]>(() => parseInjectedQubits(searchParams, mode));
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

  // Keep the URL in sync with the injected qubit so the page is always
  // shareable. Debounced and skips the very first run so mounting doesn't
  // immediately rewrite the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set(paramName, injected.length === 0 ? "none" : injected.join(","));
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
  }, [injected, paramName]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), COPY_CONFIRMATION_MS);
    } catch {
      // Clipboard access can be denied in some browser security contexts, so no crash and no link copied.
    }
  }, []);

  const toggleQubit = useCallback((qubit: number) => {
    setInjected((prev) => (prev.includes(qubit) ? prev.filter((q) => q !== qubit) : [...prev, qubit].sort((a, b) => a - b)));
  }, []);

  const encoded = mode === "bit-flip" ? encodeBitFlipCode(ALPHA, BETA) : encodePhaseFlipCode(ALPHA, BETA);
  const applyErrors = mode === "bit-flip" ? applyBitFlipErrors : applyPhaseFlipErrors;
  const runCycle = mode === "bit-flip" ? runBitFlipCorrectionCycle : runPhaseFlipCorrectionCycle;
  const errored = injected.length === 0 ? encoded : applyErrors(encoded, injected);
  const result = runCycle(errored, [0.5, 0.5]);

  const errorLabel = mode === "bit-flip" ? "X" : "Z";
  const logicalErrorLabel = mode === "bit-flip" ? "bit" : "phase";

  // For a weight-2+ error (more than one qubit checked), the syndrome
  // extraction can still fire, but the standard single-qubit recovery step
  // is only guaranteed correct for weight-1 errors: past that it either
  // mis-applies a correction to an uninjected qubit (converting the error
  // into a full logical flip) or, for the weight-3 case, sees no syndrome
  // at all while the state is already fully flipped. Surfacing this in the
  // live summary is what makes the weight-2 worked example checkable here.
  let outcomeNote = "";
  if (injected.length >= 2) {
    if (result.correctedQubit !== null && !injected.includes(result.correctedQubit)) {
      outcomeNote = `: recovery mis-applies a correction to qubit ${result.correctedQubit}, converting this weight-${injected.length} error into a full logical ${logicalErrorLabel} flip`;
    } else if (result.correctedQubit === null) {
      outcomeNote = `: this weight-${injected.length} error is undetectable at the syndrome stage (syndrome stays (0,0)), yet the state is already a full logical ${logicalErrorLabel} flip`;
    }
  }

  return (
    <SimulatorInstrument
      label={`Syndrome extraction: ${mode === "bit-flip" ? "bit-flip" : "phase-flip"} code`}
      readout={
        <Readout
          label="Syndrome"
          hint="the two agreement checks"
          value={`(${result.syndrome[0]}, ${result.syndrome[1]})`}
        />
      }
      footnote="Next: real codes correct both error types at once; see why the repetition code alone can't in the Error Correction lesson."
      // StateInspector's amplitude table reads 8 basis-state rows across
      // three columns; full-width stage instead of splitting against a
      // 320px rail keeps it legible rather than merely non-overflowing.
      layout="stacked"
      stageClassName="space-y-6"
      stage={
        <>
          {/* Lightly trimmed: the "without ever measuring the logical qubit"
              claim below in `SimulatorFraming` restates the opening clause
              here, so it drops; the actual mechanism (spread across three,
              check agreement) is unique to this paragraph and stays, since
              it is what the readout below (labelled "the two agreement
              checks") assumes the reader already has. */}
          <p className="text-sm text-muted-foreground">
            You cannot check a qubit for errors by looking at it, looking destroys it. The trick: spread one
            qubit&rsquo;s information across three, then ask only whether they still{" "}
            <em>agree with each other</em>. That answer names the broken qubit without ever revealing what
            was stored.
          </p>

          {/* `role="status"` + `aria-atomic="true"`: a role-less live region's
              implicit `aria-atomic` is `false`, so an update announces only
              the text nodes that actually changed. This one swaps a whole
              sentence, so it was safe in practice but not by construction. */}
          <div role="status" aria-live="polite" aria-atomic="true" className="rounded-panel border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {injected.length === 0
              ? "No error injected. The encoded state is exactly the logical state, undisturbed."
              : `${errorLabel} error${injected.length > 1 ? "s" : ""} injected on ${formatQubitList(injected)}. Syndrome (${result.syndrome[0]}, ${result.syndrome[1]}) decodes to ${
                  result.correctedQubit === null ? "no error" : `qubit ${result.correctedQubit}`
                }${outcomeNote}.`}
          </div>
        </>
      }
      stageAfter={
        <>
          <StateInspector state={result.corrected} />

          <SimulatorFraming
            shows="Error correction detects and fixes a bit/phase flip without ever measuring (let alone disturbing) the encoded logical qubit."
            tryThis={
              <ul>
                <li>
                  Check one qubit at a time (0, then 1, then 2) and confirm the decoded correction target
                  always matches the qubit you picked. The logical state (top panel) never changes regardless.
                </li>
                <li>
                  Now check two qubits at once (e.g. 0 and 1): the syndrome is still nonzero, but the decode
                  table points at the third, uninjected qubit, so the standard recovery step actively converts
                  the two-qubit error into a full logical {logicalErrorLabel} flip, checkable directly in the
                  amplitude table above.
                </li>
                <li>
                  Compare the two panels side by side: the bit-flip code&apos;s syndrome pattern is exactly the
                  phase-flip code&apos;s, because one is the other conjugated by H.
                </li>
              </ul>
            }
          />
        </>
      }
      controls={
        <div className="space-y-6">
          <ControlSection
            id="syndrome-inject"
            title={`Inject ${errorLabel} error(s)`}
            description="Check any combination of qubits; checking two or more drives a weight-2+ error."
          >
            <div role="group" aria-label="Qubits to error" className="flex flex-wrap gap-2">
              {INJECTABLE_QUBITS.map((qubit) => {
                const checked = injected.includes(qubit);
                return (
                  <label
                    key={qubit}
                    className={cn(
                      // `min-h-11` (44px): the real checkbox is `sr-only`, so
                      // this label *is* the whole hit area, and at `py-1.5`
                      // around 12px text it stood about 28px tall, the
                      // smallest tap target in any of these instruments, on
                      // the control the reader is meant to toggle repeatedly.
                      // `border` unconditional, matching
                      // `visualizations/PresetToggle.tsx` and
                      // `simulators/shared/controls.tsx`'s `PillGroup`. Only
                      // the unchecked pill used to have one, so checking a
                      // qubit shrank that pill by 2px in each axis and shoved
                      // every pill after it along this `flex-wrap` row, and
                      // this is a *multi-select*, so the reader is expected to
                      // check several in a row and watch the row twitch under
                      // the pointer each time. Worse than the single-select
                      // case: the target for the reader's *next* click moves
                      // as a result of the click they just made.
                      "flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-pillar focus-within:ring-offset-2 focus-within:ring-offset-background",
                      checked
                        ? "border-pillar bg-pillar text-brand-foreground"
                        : "border-border bg-surface text-muted-foreground hover:bg-surface-muted"
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleQubit(qubit)} />
                    Qubit {qubit}
                  </label>
                );
              })}
            </div>
            {injected.length > 0 ? (
              <Button size="sm" variant="ghost" className="mt-3" onClick={() => setInjected([])}>
                Clear all errors
              </Button>
            ) : null}
          </ControlSection>

          {injected.length === 1 ? (
            <Predict
              key={`${mode}-${injected.join(",")}`}
              question={`Before checking below: which qubit will the decoder point the ${errorLabel} correction at?`}
              options={[
                { id: "0", label: "Qubit 0" },
                { id: "1", label: "Qubit 1" },
                { id: "2", label: "Qubit 2" },
              ]}
              outcomeId={result.correctedQubit !== null ? String(result.correctedQubit) : "none"}
            />
          ) : null}

          <ControlSection
            id="syndrome-readout"
            title="Syndrome"
            description="The two agreement checks, read out. This is the only thing measured; the encoded data itself is never touched."
          >
            <p className="font-mono text-sm text-foreground">
              ({result.syndrome[0]}, {result.syndrome[1]})
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Decoded correction:{" "}
              {result.correctedQubit !== null
                ? `apply ${errorLabel} to qubit ${result.correctedQubit}`
                : injected.length > 0
                  ? "none applied, syndrome reads (0,0)"
                  : "none needed"}
            </p>
            <SymbolGloss
              items={[
                {
                  symbol: "(0,0)",
                  name: "syndrome",
                  means:
                    "the pair of answers to “does qubit 0 agree with qubit 1?” and “does qubit 1 agree with qubit 2?”. 0 means yes. Any other pattern points at exactly one culprit.",
                  glossaryId: "stabilizer-formalism",
                },
                {
                  symbol: errorLabel,
                  name: mode === "bit-flip" ? "bit flip" : "phase flip",
                  means:
                    mode === "bit-flip"
                      ? "the error being injected: a qubit's 0 and 1 get swapped. Applying the same flip again undoes it, which is why the correction is just a second X."
                      : "the error being injected: the qubit's phase gets reversed. Invisible to a plain 0-or-1 measurement, and lethal to interference, which is why it needs its own code.",
                  glossaryId: "pauli-matrices",
                },
              ]}
            />
          </ControlSection>

          {/* Last, not first: see the note in GroverExplorer's controls. */}
          <div className="flex justify-end">
            <Button size="sm" variant="secondary" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>
        </div>
      }
    />
  );
}
