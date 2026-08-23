"use client";

import { useMemo, useState } from "react";
import { uniformSuperposition, groverIteration, optimalGroverIterations } from "@/lib/quantum/grover";
import { AmplitudeBars } from "./AmplitudeBars";
import { GroverControls } from "./GroverControls";
import { KatexMath } from "@/components/ui/KatexMath";

export function GroverExplorer() {
  const [numQubits, setNumQubits] = useState(3);
  const [markedIndex, setMarkedIndex] = useState(5);
  const [iteration, setIteration] = useState(0);

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
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="space-y-6">
        <div className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
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
      </div>

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
  );
}
