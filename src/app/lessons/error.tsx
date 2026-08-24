"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

// Scoped to /lessons and every /lessons/[...slug] page — the routes most
// likely to embed a numeric simulator inline in lesson content. Catching the
// error here (rather than only at the root) keeps the Navbar/Footer chrome
// and lets the fallback point back to the lesson library instead of home.
export default function LessonsError({
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
        title="This lesson hit a snag"
        description="An unexpected error interrupted this lesson — most likely a bug in one of its interactive simulators, not something you did. You can try again, or head back to the lesson library."
      />

      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/lessons" variant="secondary">
          Back to all lessons
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
