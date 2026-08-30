"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  /**
   * What failed, in the reader's terms, not the component's. Rendered as the
   * body line of the fallback: "This concept map failed to load."
   */
  what: string;
  /** The uppercase status line above it. Keep it short; it is a `tech-label`. */
  status?: string;
  /** Optional custom fallback. Receives the caught error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ComponentErrorBoundaryState {
  error: Error | null;
}

/**
 * Scopes a render or lifecycle crash to one lazily-mounted component.
 *
 * Every `Lazy*` wrapper in this codebase splits a heavy client component out
 * of the eager graph, which means its chunk is fetched separately and can fail
 * separately: a dropped connection mid-scroll, a stale hashed filename after a
 * deploy, or a genuine bug in the component's own render. Without a boundary
 * the nearest `error.tsx` catches it, and that is the *page*, so one failed
 * chunk blanks out an entire lesson or the whole `/map` route around it.
 *
 * Error boundaries must be class components; React still has no hook
 * equivalent. This is the generic one. `SimulatorErrorBoundary` wraps it with
 * the instrument-specific copy and is what the 14 simulator wrappers use, so
 * their call sites are unchanged and there is one implementation rather than
 * two that drift.
 */
export class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  state: ComponentErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No error-reporting service is wired up in this project; console.error is
    // the honest fallback so the failure is not silent.
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
          <p className="tech-label text-danger">{this.props.status ?? "Fault"}</p>
          <p className="text-sm font-medium text-foreground">{this.props.what}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            An unexpected error interrupted it, most likely a bug on our side rather than anything
            you did. The rest of the page is unaffected.
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
