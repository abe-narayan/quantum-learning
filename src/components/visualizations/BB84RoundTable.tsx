"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";

type Basis = "Z" | "X";

type Column = {
  aliceBit: 0 | 1;
  aliceBasis: Basis;
  bobBasis: Basis;
  bobResult: 0 | 1;
  kept: boolean;
  isError: boolean;
};

/**
 * Runs the real intercept-resend mechanics for one qubit, matching the
 * lesson's derivation exactly (Z/X measurement is either certain or a coin
 * flip depending on whether the two relevant bases agree):
 *
 * - No Eve: Bob's basis matches Alice's basis -> he reads Alice's bit back
 *   with certainty (the matching-basis case). Mismatched bases aren't kept
 *   at sifting, so what Bob reads there doesn't matter for the error rate,
 *   but we still generate a fair-coin result for display.
 * - Eve on: Eve measures in a random basis and resends whatever she
 *   collapsed to. If her basis matches Alice's, she resends Alice's exact
 *   state undisturbed (Bob then behaves exactly as the no-Eve case). If her
 *   basis differs, she resends a state prepared in the *wrong* basis
 *   relative to Alice's, so even when Bob's basis matches Alice's, his
 *   result is a fair coin flip — the mismatch case derived in the lesson,
 *   just triggered by Eve's wrong guess rather than Bob's.
 *
 * Nothing here hardcodes a 25% figure; it falls out of composing these two
 * independent 50/50 events exactly as the lesson's math does.
 */
function simulateColumn(eveActive: boolean): Column {
  const aliceBit: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
  const aliceBasis: Basis = Math.random() < 0.5 ? "Z" : "X";
  const bobBasis: Basis = Math.random() < 0.5 ? "Z" : "X";

  // What basis/bit actually arrives at Bob, after Eve's interference (if any).
  let arrivingBasis: Basis = aliceBasis;
  let arrivingBit: 0 | 1 = aliceBit;

  if (eveActive) {
    const eveBasis: Basis = Math.random() < 0.5 ? "Z" : "X";
    if (eveBasis === aliceBasis) {
      // Eve guessed correctly: she measures the state she was given without
      // disturbing it, and resends exactly what Alice sent.
      arrivingBasis = aliceBasis;
      arrivingBit = aliceBit;
    } else {
      // Eve guessed wrong: her own measurement in the wrong basis is a fair
      // coin flip, and she resends *that* result in *her* (wrong) basis.
      arrivingBasis = eveBasis;
      arrivingBit = Math.random() < 0.5 ? 0 : 1;
    }
  }

  // Bob measures the arriving qubit in his own chosen basis.
  const bobResult: 0 | 1 = bobBasis === arrivingBasis ? arrivingBit : Math.random() < 0.5 ? 0 : 1;

  const kept = aliceBasis === bobBasis;
  const isError = kept && bobResult !== aliceBit;

  return { aliceBit, aliceBasis, bobBasis, bobResult, kept, isError };
}

function simulateRound(numQubits: number, eveActive: boolean): Column[] {
  return Array.from({ length: numQubits }, () => simulateColumn(eveActive));
}

/**
 * A horizontal strip of simulated BB84 qubits, one column per qubit, with
 * rows for Alice's bit/basis, Bob's basis/result, and whether the position
 * is kept (sifted) or discarded. Regenerating draws a fresh random round
 * using the real intercept-resend logic above — not a canned percentage —
 * so the lesson's two headline statistical claims (sifting keeps ~half the
 * qubits; the sifted-key error rate is ~0% honest / ~25% under Eve) are
 * something a reader can watch happen across many rounds rather than only
 * read as a derived number.
 */
export function BB84RoundTable({
  numQubits = 14,
  ariaLabel,
}: {
  numQubits?: number;
  ariaLabel: string;
}) {
  const [eveActive, setEveActive] = useState(false);
  const [columns, setColumns] = useState<Column[]>(() => simulateRound(numQubits, false));

  const newRound = useCallback(
    (nextEveActive: boolean) => {
      setColumns(simulateRound(numQubits, nextEveActive));
    },
    [numQubits]
  );

  const kept = columns.filter((c) => c.kept);
  const keptCount = kept.length;
  const errorCount = kept.filter((c) => c.isError).length;
  const errorRate = keptCount > 0 ? errorCount / keptCount : 0;

  const rows: { label: string; render: (c: Column) => string }[] = [
    { label: "Alice's bit", render: (c) => String(c.aliceBit) },
    { label: "Alice's basis", render: (c) => c.aliceBasis },
    { label: "Bob's basis", render: (c) => c.bobBasis },
    { label: "Bob's result", render: (c) => String(c.bobResult) },
  ];

  return (
    <div className="not-prose space-y-4 panel-inset p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => newRound(eveActive)}>
            New round
          </Button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={eveActive}
              onChange={(e) => {
                const next = e.target.checked;
                setEveActive(next);
                newRound(next);
              }}
              className="h-4 w-4 rounded border-border accent-danger"
            />
            Eve intercepting
          </label>
        </div>
        <p className="text-sm text-foreground">
          Kept (sifted): <span className="font-mono font-medium">{keptCount}</span> / {numQubits} &middot; Error rate on
          kept: <span className="font-mono font-medium">{(errorRate * 100).toFixed(0)}%</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table role="img" aria-label={`${ariaLabel} Currently: ${keptCount} of ${numQubits} qubits kept after sifting, with a ${(errorRate * 100).toFixed(0)} percent error rate on the kept positions, Eve ${eveActive ? "intercepting" : "not intercepting"}.`} className="w-full border-separate border-spacing-0 text-center text-xs sm:text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="sticky left-0 bg-surface-muted/40 px-2 py-1.5 text-left font-medium text-muted-foreground">
                  {row.label}
                </th>
                {columns.map((c, i) => (
                  <td key={i} className="min-w-8 border-b border-border px-1 py-1.5 font-mono text-foreground">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="sticky left-0 bg-surface-muted/40 px-2 py-1.5 text-left font-medium text-muted-foreground">
                Sifted key
              </th>
              {columns.map((c, i) => (
                <td
                  key={i}
                  className={`min-w-8 px-1 py-1.5 font-mono font-semibold ${
                    !c.kept
                      ? "bg-surface text-muted-foreground/50"
                      : c.isError
                        ? "bg-danger/20 text-danger"
                        : "bg-success/20 text-success"
                  }`}
                >
                  {!c.kept ? "–" : c.bobResult}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-success/60" aria-hidden="true" /> kept, matches Alice
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-danger/40" aria-hidden="true" /> kept, error
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-surface border border-border" aria-hidden="true" /> discarded (basis mismatch)
        </span>
      </div>
    </div>
  );
}
