"use client";

import { cn } from "@/lib/utils";
import { CHSH_CLASSICAL_BOUND, CHSH_QUANTUM_BOUND } from "@/lib/quantum/chsh";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";

/**
 * Side-by-side "classical vs quantum" comparison for the CHSH statistic —
 * three honest reference points, each labeled for what it actually is:
 *
 *  1. The classical (local hidden-variable) bound |S| ≤ 2. This is a
 *     *proven mathematical ceiling* (Bell's theorem: no local
 *     hidden-variable strategy, however tuned, can ever push S above 2) —
 *     it is presented here as the labeled constant `CHSH_CLASSICAL_BOUND`
 *     from lib/quantum/chsh.ts, not as a simulated classical experiment.
 *  2. The actual quantum S at the student's chosen measurement angles,
 *     computed live by `chshValue()` — the same number the default view
 *     already narrates.
 *  3. Tsirelson's bound 2√2 (`CHSH_QUANTUM_BOUND`) — quantum mechanics'
 *     own absolute ceiling, unreachable by any state or observable choice.
 *
 * Every value is rendered as plain text/numbers first; the bars beneath
 * each row are `aria-hidden` decoration, never the only way to read the
 * comparison.
 */
export function CHSHComparisonPanel({ sValue }: { sValue: number }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const quantumBound = CHSH_QUANTUM_BOUND;
  const magnitude = Math.abs(sValue);
  const exceedsClassical = magnitude > CHSH_CLASSICAL_BOUND;

  const rows: {
    key: string;
    label: string;
    sublabel: string;
    display: string;
    barValue: number;
    tone: "classical" | "quantum" | "tsirelson";
  }[] = [
    {
      key: "classical",
      label: "Classical bound — any local hidden-variable strategy",
      sublabel: "Proven ceiling (Bell's theorem), not a simulated result",
      display: `≤ ${CHSH_CLASSICAL_BOUND.toFixed(3)}`,
      barValue: CHSH_CLASSICAL_BOUND,
      tone: "classical",
    },
    {
      key: "quantum-actual",
      label: "Quantum S at your chosen angles",
      sublabel: "Computed live from chshValue()",
      display: sValue.toFixed(3),
      barValue: magnitude,
      tone: "quantum",
    },
    {
      key: "tsirelson",
      label: "Tsirelson's bound — quantum mechanics' own ceiling",
      sublabel: "The maximum |S| any state or observables can reach",
      display: `${CHSH_QUANTUM_BOUND.toFixed(3)} (2√2)`,
      barValue: CHSH_QUANTUM_BOUND,
      tone: "tsirelson",
    },
  ];

  return (
    <div
      className="space-y-4 rounded-panel border border-border bg-surface-muted/40 p-4"
      aria-label="Classical versus quantum CHSH comparison"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Classical ceiling vs. your quantum result vs. quantum&rsquo;s own ceiling
      </p>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-sm text-foreground">{row.label}</dt>
              <dd className="whitespace-nowrap font-mono text-sm font-semibold text-foreground">
                {row.display}
              </dd>
            </div>
            <p className="text-[11px] text-muted-foreground">{row.sublabel}</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div
                className={cn(
                  "h-full rounded-full",
                  !prefersReducedMotion && "transition-[width] duration-200 ease-out",
                  row.tone === "classical" && "bg-border",
                  row.tone === "tsirelson" && "bg-pillar/60",
                  row.tone === "quantum" && (exceedsClassical ? "bg-accent" : "bg-pillar")
                )}
                style={{ width: `${Math.min(100, (row.barValue / quantumBound) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">
        {exceedsClassical ? (
          <>
            At these angles, quantum mechanics beats the classical ceiling by{" "}
            <span className="font-mono font-semibold text-foreground">
              {(magnitude - CHSH_CLASSICAL_BOUND).toFixed(3)}
            </span>{" "}
            — a gap no local hidden-variable strategy, however tuned, could ever close.
          </>
        ) : (
          <>
            At these angles, |S| ={" "}
            <span className="font-mono font-semibold text-foreground">{magnitude.toFixed(3)}</span>{" "}
            still sits inside the classical ceiling. Try the quantum-optimal preset to see it cross into
            territory no local hidden-variable strategy can reach.
          </>
        )}
      </p>
    </div>
  );
}
