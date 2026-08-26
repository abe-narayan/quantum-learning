"use client";

import { useMemo, useState } from "react";
import { PresetToggle } from "@/components/visualizations/PresetToggle";

const WIDTH = 520;
const HEIGHT = 360;

const GROUPS = 3;
const QUBITS_PER_GROUP = 3;

const START_X = 90;
const CLUSTER_GAP = 170;
const START_Y = 110;
const GAP_Y = 46;

const INNER_PAD = 24;
const OUTER_PAD = 34;

type ErrorType = "X" | "Z" | "Y";

const ERROR_OPTIONS: { label: string }[] = [{ label: "X" }, { label: "Z" }, { label: "Y" }];
const ERROR_TYPES: ErrorType[] = ["X", "Z", "Y"];

const QUBIT_OPTIONS: { label: string }[] = Array.from({ length: GROUPS * QUBITS_PER_GROUP }, (_, i) => ({ label: String(i) }));

/**
 * Explains exactly, per error type, which boundary "fires" — worded to
 * mirror the lesson's own "Why this catches every single-qubit error"
 * section rather than paraphrase it loosely.
 */
function outcomeText(errorType: ErrorType, qubit: number): string {
  const group = Math.floor(qubit / QUBITS_PER_GROUP) + 1;
  if (errorType === "X") {
    return `An X error on qubit ${qubit} is caught by that qubit's own bit-flip group (group ${group}) — the outer phase-flip structure is irrelevant to it.`;
  }
  if (errorType === "Z") {
    return `A Z error on qubit ${qubit} flips the relative phase within its group of three identical qubits — equivalent to a single logical Z on group ${group} as a whole, exactly what the outer phase-flip code is built to catch, applied at the level of the three groups.`;
  }
  return `A Y error on qubit ${qubit} (both X and Z at once) is caught by both mechanisms simultaneously and independently: the inner code (group ${group}) doesn't care that an outer-level phase problem also exists, and vice versa.`;
}

/**
 * Visualizes the Shor code's nesting: 9 physical qubits in 3 clusters of 3,
 * each cluster boxed with an inner "bit-flip protected" boundary, and one
 * larger boundary around all three clusters for the outer "phase-flip
 * protected" structure. A toggle for error type (X/Z/Y) and a target-qubit
 * selector highlight which boundary actually fires for that choice —
 * inner only (X), outer only (Z), or both (Y) — making concrete why the
 * lesson's 3-groups-of-3 split, not just its arithmetic, catches every
 * single-qubit error. Complements `PipelineDiagram` (the plain group
 * split) rather than replacing it.
 */
export function NestedCodeDiagram({ ariaLabel }: { ariaLabel: string }) {
  const [errorType, setErrorType] = useState<ErrorType>("X");
  const [targetQubit, setTargetQubit] = useState(0);

  const errorIndex = ERROR_TYPES.indexOf(errorType);
  const targetGroup = Math.floor(targetQubit / QUBITS_PER_GROUP);
  const innerFires = errorType === "X" || errorType === "Y";
  const outerFires = errorType === "Z" || errorType === "Y";

  const groups = useMemo(
    () =>
      Array.from({ length: GROUPS }, (_, g) => {
        const cx = START_X + g * CLUSTER_GAP;
        const qubits = Array.from({ length: QUBITS_PER_GROUP }, (_, q) => ({
          index: g * QUBITS_PER_GROUP + q,
          x: cx,
          y: START_Y + q * GAP_Y,
        }));
        const rect = {
          x: cx - INNER_PAD,
          y: START_Y - INNER_PAD,
          width: INNER_PAD * 2,
          height: (QUBITS_PER_GROUP - 1) * GAP_Y + INNER_PAD * 2,
        };
        return { index: g, cx, qubits, rect };
      }),
    []
  );

  const outerRect = useMemo(() => {
    const first = groups[0].rect;
    const last = groups[groups.length - 1].rect;
    return {
      x: first.x - OUTER_PAD,
      y: first.y - OUTER_PAD,
      width: last.x + last.width - first.x + OUTER_PAD * 2,
      height: first.height + OUTER_PAD * 2,
    };
  }, [groups]);

  return (
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <text x={WIDTH / 2} y={16} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
            3 groups of 3: inner bit-flip boundaries nested inside one outer phase-flip boundary
          </text>

          {/* outer phase-flip boundary, around all three groups */}
          <rect
            x={outerRect.x}
            y={outerRect.y}
            width={outerRect.width}
            height={outerRect.height}
            rx={14}
            className={outerFires ? "fill-accent/10 stroke-accent" : "fill-none stroke-border"}
            strokeWidth={outerFires ? 2.5 : 1.5}
            strokeDasharray="8 5"
          />

          {groups.map((group) => {
            const fired = innerFires && group.index === targetGroup;
            return (
              <g key={group.index}>
                <rect
                  x={group.rect.x}
                  y={group.rect.y}
                  width={group.rect.width}
                  height={group.rect.height}
                  rx={10}
                  className={fired ? "fill-accent/15 stroke-accent" : "fill-none stroke-border"}
                  strokeWidth={fired ? 2.5 : 1.5}
                  strokeDasharray="5 4"
                />
                <text x={group.cx} y={group.rect.y - 8} textAnchor="middle" className="fill-muted-foreground text-[9.5px] font-mono">
                  group {group.index + 1}
                </text>
                <text
                  x={group.cx}
                  y={group.rect.y + group.rect.height + 14}
                  textAnchor="middle"
                  className={fired ? "fill-accent text-[9.5px] font-semibold" : "fill-muted-foreground text-[9.5px] font-mono"}
                >
                  inner: bit-flip protected
                </text>

                {group.qubits.map((q) => {
                  const isTarget = q.index === targetQubit;
                  return (
                    <g key={q.index}>
                      {isTarget && <circle cx={q.x} cy={q.y} r={13} className="fill-none stroke-accent" strokeWidth={2.5} />}
                      <circle cx={q.x} cy={q.y} r={8} className="fill-brand" />
                      <text x={q.x + 20} y={q.y + 4} className="fill-muted-foreground text-[9.5px] font-mono">
                        q{q.index}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          <text
            x={WIDTH / 2}
            y={outerRect.y + outerRect.height + 20}
            textAnchor="middle"
            className={outerFires ? "fill-accent text-[11px] font-semibold" : "fill-muted-foreground text-[11px] font-mono"}
          >
            outer: phase-flip protected (spans all 3 groups)
          </text>
        </svg>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section aria-labelledby="nested-error-heading">
          <h3 id="nested-error-heading" className="text-sm font-semibold text-foreground">
            Error type
          </h3>
          <div className="mt-2">
            <PresetToggle
              options={ERROR_OPTIONS}
              index={errorIndex}
              onChange={(i) => setErrorType(ERROR_TYPES[i])}
              ariaLabel="Error type: X, Z, or Y"
            />
          </div>
        </section>

        <section aria-labelledby="nested-qubit-heading">
          <h3 id="nested-qubit-heading" className="text-sm font-semibold text-foreground">
            Target qubit
          </h3>
          <div className="mt-2">
            <PresetToggle
              options={QUBIT_OPTIONS}
              index={targetQubit}
              onChange={setTargetQubit}
              ariaLabel="Target qubit, 0 through 8"
            />
          </div>
        </section>
      </div>

      <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {outcomeText(errorType, targetQubit)}
      </div>
    </div>
  );
}
