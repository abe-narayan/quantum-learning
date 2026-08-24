"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

// Root-level error boundary. Catches any uncaught render-time exception
// below the root layout — including a numeric simulator throwing mid-render
// (e.g. a NaN slipping into a Bloch-sphere rotation, a malformed circuit
// state) — anywhere that doesn't have a more specific error.tsx of its own.
// Must be a Client Component: error boundaries can't be Server Components.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // No error-reporting service is wired up in this project; console.error
    // is the honest fallback so the failure isn't silent.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16 sm:py-24">
      <PageHeader
        eyebrow="Something went wrong"
        title="This calculation collapsed"
        description="An unexpected error interrupted this page — likely a bug in one of the interactive simulators, not something you did. You can try again, or head back to a known-good state."
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>

      {error.digest ? (
        <p className="mt-8 text-xs text-muted-foreground">
          Error reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
    </Container>
  );
}
