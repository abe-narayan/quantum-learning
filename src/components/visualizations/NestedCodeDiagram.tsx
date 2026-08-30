"use client";

import { useId, useMemo, useState } from "react";
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
    return `An X error on qubit ${qubit} is caught by that qubit's own bit-flip group (group ${group}). The outer phase-flip structure is irrelevant to it.`;
  }
  if (errorType === "Z") {
    return `A Z error on qubit ${qubit} flips the relative phase within its group of three identical qubits, equivalent to a single logical Z on group ${group} as a whole, exactly what the outer phase-flip code is built to catch, applied at the level of the three groups.`;
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
  // `useId()` rather than a literal id string. Two instances of this figure
  // on one page emitted duplicate ids, which is invalid HTML and leaves
  // every reference ambiguous: an `id` lookup resolves to the first match in
  // document order, so the second instance's references silently pointed at
  // the first instance's element. Harmless while both are identical, wrong
  // the moment they are not. Matches `ProjectionShadow`, which already does
  // this.
  const idBase = useId();

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
          {/* THE SCALE FACTOR HERE WAS WRONG, AND EVERY SIZE BELOW WITH IT.
              The previous note computed the effective type size from a
              "~288px lesson column". 288px is the *page column* on a 320px
              phone (320 less Container's `px-4` gutters) — but this SVG does
              not render into the page column, it renders into `panel-inset
              p-4`, and `panel-inset` (globals.css) supplies border, radius
              and fill but no padding: the `p-4` does. So the real box is
              288 − 2 × (16px padding + 1px border) = **254px**, and every
              figure in the old note was ~13% optimistic.

              Corrected: authored type scales by 254/520 = 0.4885. The 14 and
              15 unit sizes the last pass installed painted at **6.84px and
              7.33px** — it moved them off the floor by the wrong measure and
              they stayed under it. 19 and 20 units give 9.28px and 9.77px.

              The two header lines and the outer caption were shortened again
              to match: in the mono face (0.6em advance) 19 units is 11.4
              units per character, so 520 units of viewBox holds ~45
              characters edge to edge and comfortably holds ~38. Text that
              overruns an SVG viewBox is silently clipped, not scrolled, and
              a sentence with its tail cut off teaches nothing — "inside a"
              carries the nesting the words "inner"/"outer" were carrying,
              and the boxes themselves carry the rest. */}
          {/* `fill-muted-foreground`, not `fill-axis`. These two lines are the
              figure's title and subtitle: prose about the picture, with nothing
              measured against them and no value read off them. `--axis` is the
              4.5:1 token and `--muted-foreground` the 6.78:1 one, so a prose
              line on `--axis` is a contrast *cut*, not a promotion. `--axis`
              stays on the marks that earn it in this figure: the box outlines,
              the group names and the per-qubit identifiers. */}
          <text x={WIDTH / 2} y={22} textAnchor="middle" fontSize={19} className="fill-muted-foreground font-mono">
            3 groups of 3 physical qubits
          </text>
          <text x={WIDTH / 2} y={46} textAnchor="middle" fontSize={19} className="fill-muted-foreground font-mono">
            bit-flip boxes inside a phase-flip box
          </text>

          {/* Outer phase-flip boundary, around all three groups. The
              un-fired boundaries are NOT decoration: the nesting itself is
              the lesson, so the reader must be able to see all four boxes at
              once and register which single one is highlighted. Drawing the
              three-quarters of the structure that isn't currently firing in
              `--border` (the panel-edge token, 1.41:1 on `--surface-muted`,
              under the 3:1 WCAG 2.1 SC 1.4.11 floor) meant the "nested"
              claim was invisible on the dark theme until you happened to
              pick the error type that lit a given box. `--axis` clears 3:1
              on every panel depth and still sits well below the accent
              highlight, so the fired/not-fired distinction survives. */}
          <rect
            x={outerRect.x}
            y={outerRect.y}
            width={outerRect.width}
            height={outerRect.height}
            rx={14}
            className={outerFires ? "fill-accent/10 stroke-accent" : "fill-none stroke-axis"}
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
                  className={fired ? "fill-accent/15 stroke-accent" : "fill-none stroke-axis"}
                  strokeWidth={fired ? 2.5 : 1.5}
                  strokeDasharray="5 4"
                />
                <text x={group.cx} y={group.rect.y - 10} textAnchor="middle" fontSize={20} className="fill-axis font-mono">
                  group {group.index + 1}
                </text>
                {/* Shortened from "inner: bit-flip protected". At the type
                    size this figure now needs, three copies of a 25-character
                    string centred 170 units apart overlap each other; the
                    full phrasing survives once, in the caption under the
                    whole row, where it only has to fit once. At 20 units the
                    surviving 8 characters are 96 units wide, centred on
                    clusters at x = 90, 260 and 430 — 74 units of clear space
                    between neighbours, and the leftmost edge at x = 42 stays
                    inside the outer boundary at x = 32. */}
                <text
                  x={group.cx}
                  y={group.rect.y + group.rect.height + 18}
                  textAnchor="middle"
                  fontSize={20}
                  className={fired ? "fill-accent font-semibold" : "fill-axis font-mono"}
                >
                  bit-flip
                </text>

                {group.qubits.map((q) => {
                  const isTarget = q.index === targetQubit;
                  return (
                    <g key={q.index}>
                      {isTarget && <circle cx={q.x} cy={q.y} r={13} className="fill-none stroke-accent" strokeWidth={2.5} />}
                      <circle cx={q.x} cy={q.y} r={8} className="fill-brand" />
                      <text x={q.x + 20} y={q.y + 7} fontSize={19} className="fill-axis font-mono">
                        q{q.index}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Re-shortened from "outer: phase-flip protected (spans all 3
              groups)". That was 47 characters, which the old note sized at
              ~423 units — correct arithmetic for 15 units, but 15 units was
              itself set from the wrong 288px column (see the header note).
              At the 20 units this figure actually needs, 47 characters is
              47 × 0.6 × 20 = 564 units in the mono face: 44 units WIDER than
              the whole 520-unit viewBox, so the string would have been
              clipped at both ends with no scrollbar and no other symptom.
              The 37 characters kept are 444 units, centred at x = 260, so
              they run 38..482 and clear the outer boundary's own 32..488.
              "spans all 3" is what the drawn box already says. */}
          <text
            x={WIDTH / 2}
            y={outerRect.y + outerRect.height + 26}
            textAnchor="middle"
            fontSize={20}
            className={outerFires ? "fill-accent font-semibold" : "fill-axis font-mono"}
          >
            outer: phase-flip protected (3 groups)
          </text>
        </svg>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section aria-labelledby={`${idBase}-error-heading`}>
          <h3 id={`${idBase}-error-heading`} className="text-sm font-semibold text-foreground">
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

        <section aria-labelledby={`${idBase}-qubit-heading`}>
          <h3 id={`${idBase}-qubit-heading`} className="text-sm font-semibold text-foreground">
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

      <div aria-live="polite" aria-atomic="true" className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {outcomeText(errorType, targetQubit)}
      </div>
    </div>
  );
}
