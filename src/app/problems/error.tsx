"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

// Scoped to /problems and every /problems/[slug] page — these routes run
// real grading/validation logic (numeric comparisons, MC checking) on every
// answer submission, making them just as likely a source of a render-time
// throw as the simulators. Catching the error here keeps the Navbar/Footer
// chrome and lets the fallback point back to the problem set instead of home.
export default function ProblemsError({
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
        title="This problem hit a snag"
        description="An unexpected error interrupted this problem — most likely a bug in its grading logic, not something you did. You can try again, or head back to the problem set."
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/problems" variant="secondary">
          Back to all problems
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
