"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Lede, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";

// Root-level error boundary. Catches any uncaught render-time exception
// below the root layout — including a numeric simulator throwing mid-render
// (e.g. a NaN slipping into a Bloch-sphere rotation, a malformed circuit
// state) — anywhere that doesn't have a more specific error.tsx of its own.
// Must be a Client Component: error boundaries can't be Server Components.
//
// `retry` (not `reset`) is this modified Next.js's stable recovery prop —
// see node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md.
export default function Error({
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
    // `tight`, not `className="pt-4 sm:pt-8"` — same dead override as
    // not-found.tsx and /learn's hero: `Section` writes its vertical padding
    // as an inline `style`, which no class on the same element can beat, so
    // the requested 16px was silently the full `--rhythm-section` instead.
    <Section width="reading" tight>
      <Eyebrow>System fault</Eyebrow>
      <SectionTitle level={1} size="xl" className="mt-4">
        This calculation collapsed
      </SectionTitle>
      <Lede className="mt-5 max-w-[42rem]">
        An unexpected error interrupted this page — likely a bug in one of the interactive
        simulators, not something you did. You can try again, or head back to a known-good state.
      </Lede>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>

      {error.digest ? (
        <Instrument className="mt-8" label="Error readout">
          <p className="text-xs text-muted-foreground">
            Reference: <code className="font-tech text-foreground">{error.digest}</code>
          </p>
        </Instrument>
      ) : null}
    </Section>
  );
}
