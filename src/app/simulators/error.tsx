"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

// Scoped to /simulators — every route here renders a heavy numeric explorer
// (Bloch sphere, wavefunction, circuit builder, ...), so this is the most
// likely place for a computation bug to surface as a render-time throw.
// Catching it here keeps the Navbar/Footer chrome and points back to the
// simulator index instead of all the way home.
export default function SimulatorsError({
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
        title="This simulator crashed"
        description="An unexpected error interrupted this simulator — likely a bug in its numerical engine, not something you did. You can try again, or head back to the simulator index."
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/simulators" variant="secondary">
          Back to all simulators
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
