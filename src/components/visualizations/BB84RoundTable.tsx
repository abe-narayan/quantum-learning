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
          {/* `min-h-11`: the checkbox itself is 16px square, well under the 44px
              WCAG 2.5.8 asks for. The whole label is the hit area, so giving the label
              a 44px minimum height buys the target without resizing the box — the same
              approach `FrameSlider` takes with `h-11` on its range input. */}
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-foreground">
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
        {/* `aria-live="polite"`. Both controls in this figure — "New round" and
            the Eve checkbox — resimulate the entire round, and the two numbers
            in this line are the whole payoff: ~0% error rate honest, ~25% with
            Eve intercepting, which is the lesson's headline claim and the
            reason to press the button repeatedly. Without a live region a
            screen-reader user pressed "New round", heard nothing at all, and
            had to go hunting back down into the table to discover whether
            anything had happened. Safe to attach directly to the visible node
            here, unlike the auto-playing figures on this bench: nothing on a
            timer ever rewrites it, so it speaks exactly once per press —
            paced by the reader. */}
        <p aria-live="polite" className="text-sm text-foreground">
          Kept (sifted): <span className="font-mono font-medium">{keptCount}</span> / {numQubits} &middot; Error rate on
          kept: <span className="font-mono font-medium">{(errorRate * 100).toFixed(0)}%</span>
        </p>
      </div>

      {/* `tabIndex={0}` + `role="group"` on the scroll container. Fourteen
          columns do not fit a narrow viewport, so this div genuinely scrolls
          horizontally — and a plain `overflow-x-auto` div is not focusable, so
          a keyboard-only user (no mouse, no trackpad gesture) had no way to
          reach the columns past the fold at all. Making the scroll container a
          tab stop is the standard remedy for WCAG 2.1.1 on a scrollable
          region; the label tells the reader what they have just landed on
          rather than announcing a bare "group". */}
      <div
        tabIndex={0}
        role="group"
        aria-label="Round-by-round table, scrollable horizontally"
        className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* `role="img"` used to sit on this `<table>`. That is the single most
            destructive thing that can be done to a data table: the role makes
            every descendant presentational, so all five rows × fourteen columns
            of the actual simulated round — Alice's bits and bases, Bob's bases
            and results, which positions survived sifting — were erased from the
            accessibility tree, along with the `scope="row"` headers already
            written below. A screen-reader user got one summary sentence and no
            way whatsoever to inspect a single position, which is the one thing
            this figure exists to let you do: check, column by column, that the
            kept positions are exactly the ones where the two bases agree.

            The table is now a table. The summary that `role="img"` was carrying
            has not been lost — it moves to a `<caption>`, which is the element
            that actually names a table, and is announced on entry before the
            reader starts navigating cells. */}
        <table className="w-full border-separate border-spacing-0 text-center text-xs sm:text-sm">
          <caption className="sr-only">
            {`${ariaLabel} Currently: ${keptCount} of ${numQubits} qubits kept after sifting, with a ${(errorRate * 100).toFixed(0)} percent error rate on the kept positions, Eve ${eveActive ? "intercepting" : "not intercepting"}.`}
          </caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="sticky left-0 bg-surface-muted/40 px-2 py-1.5 text-left font-medium text-muted-foreground">
                  {row.label}
                </th>
                {columns.map((c, i) => (
                  // `border-border-strong`, not `border-border`. This table is the
                  // figure — a reader scans a column of four cells to check that
                  // Alice's basis and Bob's basis agree — so the row rules are what
                  // keeps the eye on one row across fourteen columns. `--border` is the
                  // panel-edge token (1.41:1 on `--surface-muted`); the design system's
                  // own note on `--border-strong` names "table rules" as exactly the
                  // case for it.
                  <td key={i} className="min-w-8 border-b border-border-strong px-1 py-1.5 font-mono text-foreground">
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
                    // The dash was `text-muted-foreground/50`, which composites to
                    // roughly 3.4:1 — under the 4.5:1 WCAG 2.1 SC 1.4.3 wants for
                    // text this size. The discarded cells are already distinguished
                    // from the kept ones by their neutral `--surface` fill against
                    // green/red, so the dimming bought nothing the fill was not
                    // already saying.
                    !c.kept
                      ? "bg-surface text-muted-foreground"
                      : c.isError
                        ? "bg-danger/20 text-danger"
                        : "bg-success/20 text-success"
                  }`}
                >
                  {!c.kept ? "–" : c.bobResult}
                  {/* Now that the table is readable at all (see the caption
                      note above), this row's three states have to survive
                      being read aloud. On screen they are told apart by cell
                      fill: green for a kept bit that matches Alice, red for a
                      kept bit that does not. Both render the same character —
                      a 0 or a 1 — so hue was the *only* channel separating "we
                      share this key bit" from "Eve was here", which fails WCAG
                      1.4.1 for a sighted reader with a colour vision deficiency
                      just as squarely as it failed a screen reader. The dash
                      already distinguishes discarded positions on its own, but
                      it reads as "dash" with no explanation, so it gets a word
                      too. `sr-only` keeps the visual row exactly as dense as it
                      was — fourteen single characters — while the spoken row
                      becomes "one, error; zero; dash, discarded; …". */}
                  <span className="sr-only">
                    {!c.kept ? ", discarded, bases disagreed" : c.isError ? ", error, does not match Alice" : ", matches Alice"}
                  </span>
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
          {/* This swatch is drawn *only* by its border — its fill is `--surface`, the
              same colour as the ground behind it — so on `border-border` (1.41:1) the
              legend key for "discarded" was an invisible 10px square next to the word
              "discarded". `border-axis` is the chart channel and clears 3:1. */}
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-surface border border-axis" aria-hidden="true" /> discarded (basis mismatch)
        </span>
      </div>
    </div>
  );
}
