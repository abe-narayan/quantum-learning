"use client";

import type { ReactNode } from "react";
import { ComponentErrorBoundary } from "@/components/ui/ComponentErrorBoundary";

interface SimulatorErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. Receives the caught error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

/**
 * Scopes a render or lifecycle crash to a single simulator instance.
 *
 * `/simulators` renders many independent explorers behind one page-level
 * `error.tsx`, so without a boundary here a bug in any one simulator's
 * numerical engine would blank out every sibling on the page too.
 *
 * The class itself now lives in `@/components/ui/ComponentErrorBoundary`,
 * because the same hazard applies to every `Lazy*` wrapper and two of them
 * (the concept map and the course checkpoint) had no boundary at all. This
 * stays as the simulator-facing name so all 14 call sites are unchanged, and
 * so the fallback keeps the instrument voice the bench is written in.
 */
export function SimulatorErrorBoundary({ children, fallback }: SimulatorErrorBoundaryProps) {
  return (
    <ComponentErrorBoundary
      status="Fault: instrument offline"
      what="This simulator failed to load."
      fallback={fallback}
    >
      {children}
    </ComponentErrorBoundary>
  );
}
