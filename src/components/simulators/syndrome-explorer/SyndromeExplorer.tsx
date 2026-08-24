"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Complex } from "@/lib/quantum/complex";
import {
  encodeBitFlipCode,
  encodePhaseFlipCode,
  applyBitFlipError,
  applyPhaseFlipError,
  runBitFlipCorrectionCycle,
  runPhaseFlipCorrectionCycle,
} from "@/lib/quantum/errorCorrection";
import { StateInspector } from "@/components/simulators/circuit-builder/StateInspector";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { Button } from "@/components/ui/Button";
import { LabNotes } from "./LabNotes";

const INJECT_OPTIONS = ([null, 0, 1, 2] as const).map((q) => ({
  q,
  label: q === null ? "None" : `Qubit ${q}`,
}));

const ALPHA = new Complex(0.6);
const BETA = new Complex(0.8);
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

// Minimal shareable state is which qubit (if any) has the injected error.
// This component renders twice on the same /simulators page — once per
// `mode` — so the two instances need distinct param names, not just a
// shared prefix, or they'd stomp on each other's URL state.
function paramNameForMode(mode: "bit-flip" | "phase-flip"): string {
  return mode === "bit-flip" ? "syn_bf" : "syn_pf";
}

/** Reads and validates the injected-qubit param for this instance's mode. Falls back to the default (no error) on anything malformed or absent. */
function parseInjectedQubit(params: { get(key: string): string | null }, mode: "bit-flip" | "phase-flip"): number | null {
  const raw = params.get(paramNameForMode(mode));
  if (raw === null || raw === "none") return null;
  const value = Number(raw);
  return value === 0 || value === 1 || value === 2 ? value : null;
}

/**
 * Inject a real bit-flip (X) or phase-flip (Z) error on one of three
 * encoded qubits and watch the platform's actual `runBitFlipCorrectionCycle`
 * / `runPhaseFlipCorrectionCycle` extract the syndrome via genuine
 * ancilla CNOTs and partial measurement, decode it, and apply the
 * correction — the real 3-qubit repetition code, not a scripted
 * animation. Shares one component between both lessons via the `mode`
 * prop, since the phase-flip code is the bit-flip code conjugated by H
 * on every qubit (documented in `errorCorrection.ts`).
 */
export function SyndromeExplorer({ mode }: { mode: "bit-flip" | "phase-flip" }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const paramName = paramNameForMode(mode);

  const [injected, setInjected] = useState<number | null>(() => parseInjectedQubit(searchParams, mode));
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
      params.set(paramName, injected === null ? "none" : String(injected));
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
      // Clipboard access can be denied in some browser security contexts — no crash, no link copied.
    }
  }, []);

  const encoded = mode === "bit-flip" ? encodeBitFlipCode(ALPHA, BETA) : encodePhaseFlipCode(ALPHA, BETA);
  const applyError = mode === "bit-flip" ? applyBitFlipError : applyPhaseFlipError;
  const runCycle = mode === "bit-flip" ? runBitFlipCorrectionCycle : runPhaseFlipCorrectionCycle;
  const errored = injected === null ? encoded : applyError(encoded, injected);
  const result = runCycle(errored, [0.5, 0.5]);

  const errorLabel = mode === "bit-flip" ? "X" : "Z";

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="space-y-6">
        <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          {injected === null
            ? "No error injected. The encoded state is exactly the logical state, undisturbed."
            : `${errorLabel} error injected on qubit ${injected}. Syndrome (${result.syndrome[0]}, ${result.syndrome[1]}) decodes to ${
                result.correctedQubit === null ? "no error" : `qubit ${result.correctedQubit}`
              }.`}
        </div>
        <StateInspector state={result.corrected} />

        <LabNotes
          notes={[
            {
              label: "What we're studying",
              content:
                "Error correction detects and fixes a bit/phase flip without ever measuring — let alone disturbing — the encoded logical qubit.",
            },
            {
              label: "Try this",
              content: (
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    Inject an error on qubit 0, then 1, then 2, and confirm the decoded correction target always
                    matches the qubit you picked — the logical state (top panel) never changes regardless.
                  </li>
                  <li>
                    Compare the two panels side by side: the bit-flip code&apos;s syndrome pattern is exactly the
                    phase-flip code&apos;s, because one is the other conjugated by H.
                  </li>
                </ul>
              ),
            },
            {
              label: "What's next",
              content:
                "Next: real codes correct both error types at once — see why the repetition code alone can't in the Error Correction lesson.",
            },
          ]}
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={handleCopyLink}>
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>

        <section aria-labelledby="syndrome-inject-heading">
          <h3 id="syndrome-inject-heading" className="text-sm font-semibold text-foreground">
            Inject a {errorLabel} error
          </h3>
          <div className="mt-3">
            <PresetToggle
              options={INJECT_OPTIONS}
              index={INJECT_OPTIONS.findIndex((o) => o.q === injected)}
              onChange={(i) => setInjected(INJECT_OPTIONS[i].q)}
              ariaLabel="Qubit to error"
            />
          </div>
        </section>

        <section aria-labelledby="syndrome-readout-heading">
          <h3 id="syndrome-readout-heading" className="text-sm font-semibold text-foreground">
            Syndrome
          </h3>
          <p className="mt-1 font-mono text-sm text-foreground">
            ({result.syndrome[0]}, {result.syndrome[1]})
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Decoded correction:{" "}
            {result.correctedQubit === null ? "none needed" : `apply ${errorLabel} to qubit ${result.correctedQubit}`}
          </p>
        </section>
      </div>
    </div>
  );
}
