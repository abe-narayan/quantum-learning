"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionTitle, Lede } from "@/components/ui/Typography";
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
    <Section width="reading">
      <Eyebrow>Something went wrong</Eyebrow>
      <SectionTitle level={1} size="lg" className="mt-3">
        This problem hit a snag
      </SectionTitle>
      <Lede className="mt-4">
        An unexpected error interrupted this problem — most likely a bug in its grading logic, not
        something you did. You can try again, or head back to the problem set.
      </Lede>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/problems" variant="secondary">
          Back to all problems
        </Button>
      </div>

      {error.digest ? (
        <p className="mt-8 tech-label">
          Error reference: <span className="tech-value">{error.digest}</span>
        </p>
      ) : null}
    </Section>
  );
}
