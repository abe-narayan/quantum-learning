"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

// Scoped to /simulators, every route here renders a heavy numeric explorer
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
    <Section>
      <Eyebrow>Something went wrong</Eyebrow>
      <SectionTitle level={1} size="xl" className="mt-3 max-w-3xl">
        This simulator crashed
      </SectionTitle>
      <Lede className="mt-4">
        An unexpected error interrupted this simulator, likely a bug in its numerical engine, not
        something you did. You can try again, or head back to the simulator index.
      </Lede>

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
    </Section>
  );
}
