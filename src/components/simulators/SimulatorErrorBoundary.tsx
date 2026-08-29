"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface SimulatorErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. Receives the caught error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface SimulatorErrorBoundaryState {
  error: Error | null;
}

/**
 * Scopes a render/lifecycle crash to a single simulator instance.
 *
 * `/simulators` renders many independent explorers behind one page-level
 * error.tsx, so without a boundary here a bug in any one simulator's
 * numerical engine would blank out every sibling simulator on the page too.
 * Error boundaries must be class components — React has no hook equivalent.
 */
export class SimulatorErrorBoundary extends Component<
  SimulatorErrorBoundaryProps,
  SimulatorErrorBoundaryState
> {
  state: SimulatorErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): SimulatorErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No error-reporting service is wired up in this project; console.error
    // is the honest fallback so the failure isn't silent.
    console.error(error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }

      return (
        <div
          role="alert"
          className="not-prose flex flex-col items-center justify-center gap-3 rounded-panel border border-danger/40 bg-danger/5 p-8 text-center"
        >
          <p className="tech-label text-danger">Fault — instrument offline</p>
          <p className="text-sm font-medium text-foreground">This simulator failed to load.</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            An unexpected error interrupted it — likely a bug in its numerical engine, not something you did.
          </p>
          <Button size="sm" onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
