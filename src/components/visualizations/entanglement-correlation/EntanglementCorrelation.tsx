"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KatexMath } from "@/components/ui/KatexMath";
import { StateVector } from "@/lib/quantum/state";
import { HADAMARD, applyCNOT, applySingleQubitGate } from "@/lib/quantum/gates";
import { measure } from "@/lib/quantum/measurement";
import { pureStateDensityMatrix, purity } from "@/lib/quantum/densityMatrix";
import { reducedDensityMatrixQubit0, reducedDensityMatrixQubit1 } from "@/lib/quantum/partialTrace";
import { densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { EntanglementCorrelationCanvas, type GlyphState } from "./EntanglementCorrelationCanvas";
import { FigureReadouts } from "../FigureReadouts";

/** Matches SuperpositionJourney's suspense/collapse timings, for the same reason: long enough to
 * read as a distinct event, short enough not to feel like a loading spinner. */
const MEASURE_SUSPENSE_MS = 550;
const COLLAPSE_FLASH_MS = 400;

type JointOutcome = { label: string; aliceBit: 0 | 1; bobBit: 0 | 1 };

/** Tally indexed exactly like the engine's own basis ordering (00, 01, 10, 11) — kept as all
 * four slots, not just two, so the running counts can themselves stand as the live evidence
 * that this Bell state only ever produces 00 or 11: the 01 and 10 slots are always 0. */
type Tally = { counts: [number, number, number, number]; total: number };

const EMPTY_TALLY: Tally = { counts: [0, 0, 0, 0], total: 0 };

/**
 * Two Bloch-glyphs, deliberately drawn far apart, sharing one entangled Bell
 * state |Φ+⟩ = (|00⟩+|11⟩)/√2 — built with the exact same engine calls as
 * "Bell States & Entanglement" and the CHSH lesson (`HADAMARD` then
 * `applyCNOT`), never a hand-rolled substitute. "Measure both" samples one
 * real joint outcome from `measure()` against the actual shared state — for
 * this specific Bell state that is provably 00 or 11 and nothing else, which
 * is exactly what the running tally is there to make visible over many
 * trials, not just assert once.
 *
 * Before any measurement, each glyph's dot sits at its own qubit's real
 * reduced-state Bloch z-coordinate (via `reducedDensityMatrixQubit0/1` and
 * `densityMatrixToBlochVector`) — that lands at the center, purity 0.5,
 * which is the exact fact this lesson's boxed identity proves for a
 * maximally entangled pair, not a separately-asserted illustration.
 */
export function EntanglementCorrelation() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [outcome, setOutcome] = useState<JointOutcome | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [collapseFlash, setCollapseFlash] = useState(false);
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);

  const suspenseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (suspenseTimeoutRef.current !== null) clearTimeout(suspenseTimeoutRef.current);
      if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  // The shared entangled state itself never changes — pressing "Measure both" again always
  // re-prepares this same |Φ+⟩ and samples it fresh, exactly like SuperpositionJourney's `state`.
  const bellPlus = useMemo(
    () => applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1),
    []
  );

  const { reducedBlochA, reducedBlochB, purityA, purityB } = useMemo(() => {
    const rho = pureStateDensityMatrix(bellPlus);
    const rhoA = reducedDensityMatrixQubit0(rho);
    const rhoB = reducedDensityMatrixQubit1(rho);
    return {
      reducedBlochA: densityMatrixToBlochVector(rhoA),
      reducedBlochB: densityMatrixToBlochVector(rhoB),
      purityA: purity(rhoA),
      purityB: purity(rhoB),
    };
  }, [bellPlus]);

  const alice: GlyphState = {
    z: outcome ? (outcome.aliceBit === 0 ? 1 : -1) : reducedBlochA.z,
    bit: outcome ? outcome.aliceBit : null,
  };
  const bob: GlyphState = {
    z: outcome ? (outcome.bobBit === 0 ? 1 : -1) : reducedBlochB.z,
    bit: outcome ? outcome.bobBit : null,
  };

  const handleMeasure = useCallback(() => {
    if (isMeasuring) return;
    if (suspenseTimeoutRef.current !== null) clearTimeout(suspenseTimeoutRef.current);
    if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);

    // The one real sample: `measure` runs the actual Born-rule sampling against the actual
    // shared 2-qubit state, so both qubits collapse together in a single draw — never two
    // independent 50/50 coin flips that merely happen to agree.
    const { outcome: sampled } = measure(bellPlus);
    const aliceBit = (sampled.label[0] === "1" ? 1 : 0) as 0 | 1;
    const bobBit = (sampled.label[1] === "1" ? 1 : 0) as 0 | 1;

    const finalize = () => {
      setOutcome({ label: sampled.label, aliceBit, bobBit });
      setIsMeasuring(false);
      setTally((prev) => {
        const counts: [number, number, number, number] = [...prev.counts];
        counts[sampled.index] += 1;
        return { counts, total: prev.total + 1 };
      });
      setCollapseFlash(true);
      flashTimeoutRef.current = setTimeout(() => setCollapseFlash(false), COLLAPSE_FLASH_MS);
    };

    if (prefersReducedMotion) {
      finalize();
    } else {
      setIsMeasuring(true);
      suspenseTimeoutRef.current = setTimeout(finalize, MEASURE_SUSPENSE_MS);
    }
  }, [isMeasuring, bellPlus, prefersReducedMotion]);

  const handleReset = useCallback(() => {
    if (suspenseTimeoutRef.current !== null) clearTimeout(suspenseTimeoutRef.current);
    if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
    setOutcome(null);
    setIsMeasuring(false);
    setCollapseFlash(false);
    setTally(EMPTY_TALLY);
  }, []);

  const count00 = tally.counts[0];
  const count01 = tally.counts[1];
  const count10 = tally.counts[2];
  const count11 = tally.counts[3];
  const pct00 = tally.total > 0 ? Math.round((count00 / tally.total) * 100) : 0;
  const pct11 = tally.total > 0 ? Math.round((count11 / tally.total) * 100) : 0;

  const narration = isMeasuring
    ? "Measuring both qubits at once…"
    : outcome === null
      ? "Press “Measure both” to sample one real joint measurement of the shared entangled state."
      : `Both qubits collapsed together to |${outcome.label}⟩. Tally so far: ${count00} of ${tally.total} gave 00 (${pct00}%), ${count11} of ${tally.total} gave 11 (${pct11}%)${
          count01 + count10 > 0 ? `, ${count01 + count10} gave a mismatched outcome (should never happen for this state)` : ", 0 gave 01 or 10"
        }.`;

  const stateLatex = "|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}\\big(|00\\rangle + |11\\rangle\\big)";

  return (
    <div className="not-prose rounded-3xl border border-border bg-surface p-6">
      <div className="mb-5">
        <Badge tone="brand" className="mb-1.5">
          What we&rsquo;re studying
        </Badge>
        <p className="text-sm text-muted-foreground">
          Alice and Bob each hold one qubit from the same entangled pair, prepared once and shared between
          them. Neither qubit has a definite state on its own. Press &ldquo;Measure both&rdquo; to sample
          one real joint outcome from the shared state and watch both glyphs snap to a matching result at
          the same instant.
        </p>
      </div>

      <EntanglementCorrelationCanvas
        alice={alice}
        bob={bob}
        isMeasuring={isMeasuring}
        collapseFlash={collapseFlash}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* No `overflow-x-auto` here: the only child is a block-level
          `.katex-display`, which fills this content box and carries its own
          horizontal scroll (globals.css §6), so this box never had anything to
          scroll — and `overflow-x: auto` with `overflow-y: visible` computes the
          y axis to `auto` too, which would silently clip a tall equation. The tab
          stop the slab needs now lives on `.katex-display` itself; see
          `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
      <div className="mt-4 panel-inset px-4 py-3">
        <KatexMath tex={stateLatex} display />
      </div>

      <FigureReadouts
        className="mt-4"
        items={[
          { label: "Purity of ρ_A (Alice, alone)", value: purityA.toFixed(3) },
          { label: "Purity of ρ_B (Bob, alone)", value: purityB.toFixed(3) },
          { label: "P(00)", value: "0.500" },
          { label: "P(11)", value: "0.500" },
        ]}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Each reduced state&rsquo;s purity of 0.5 is exactly the maximally-mixed value this lesson&rsquo;s
        boxed identity predicts for a Bell state (|ad&minus;bc|=0.5), computed here from the same
        <code className="mx-1 rounded bg-surface-muted px-1 py-0.5 font-mono text-meta">reducedDensityMatrixQubit0/1</code>
        and <code className="mx-1 rounded bg-surface-muted px-1 py-0.5 font-mono text-meta">purity</code> functions,
        not a separately-asserted number.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={handleMeasure} disabled={isMeasuring}>
          Measure both
        </Button>
        <Button variant="secondary" onClick={handleReset} disabled={isMeasuring}>
          Reset
        </Button>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground"
      >
        {narration}
      </div>

      <div className="mt-4 panel-inset p-4">
        <p className="tech-label">
          Running tally ({tally.total} joint measurement{tally.total === 1 ? "" : "s"})
        </p>
        <FigureReadouts
          className="mt-2"
          items={[
            { label: "00", value: `${count00} / ${tally.total} ${tally.total > 0 ? `(${pct00}%)` : ""}`, plainLabel: true },
            { label: "11", value: `${count11} / ${tally.total} ${tally.total > 0 ? `(${pct11}%)` : ""}`, plainLabel: true },
            { label: "01 (should stay 0)", value: count01, plainLabel: true },
            { label: "10 (should stay 0)", value: count10, plainLabel: true },
          ]}
        />
      </div>

      <div className="mt-6 rounded-panel border border-warning/30 bg-warning/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-warning">Not a signal</p>
        <p className="mt-2 text-sm text-foreground">
          This correlation is genuinely stronger than any classical shared randomness can produce, but it
          does not let Alice and Bob send information to each other faster than light. Whoever holds one
          qubit, on their own, sees only a random 50/50 sequence of |0&#10217;/|1&#10217; results no matter what
          the other person does to their qubit. The perfect match is only visible after the two of them
          later compare notes over an ordinary, light-speed-limited classical channel.
        </p>
      </div>
    </div>
  );
}
