"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle, Lede, TechLabel } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

// Scoped to /lessons and every /lessons/[...slug] page, the routes most
// likely to embed a numeric simulator inline in lesson content. Catching the
// error here (rather than only at the root) keeps the Navbar/Footer chrome
// and lets the fallback point back to the lesson library instead of home.
// No lesson/course is reliably known here (the error may have fired before
// content resolved), so this stays outside any `PillarScope`, the default,
// pillar-less token ramp, rather than guessing an identity.
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
      <TechLabel as="p" className="text-danger">
        Instrument fault
      </TechLabel>
      <SectionTitle level={1} size="xl" className="mt-3">
        This lesson hit a snag
      </SectionTitle>
      <Lede className="mt-5">
        An unexpected error interrupted this lesson, most likely a bug in one of its interactive
        simulators, not something you did. You can try again, or head back to the lesson library.
      </Lede>

      {/* `/lessons`, not `/learn`. The label says "all lessons" and `/lessons`
          is the page titled exactly that, the flat index of every written
          lesson. `/learn` is the curriculum explorer: the recommended order,
          grouped by track, which is a different page answering a different
          question. Sending a reader whose lesson just crashed to an index
          that does not contain the flat list they asked for is a second
          small failure on top of the first. */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button href="/lessons" variant="secondary">
          Back to all lessons
        </Button>
      </div>

      {error.digest ? (
        <p className="mt-8 text-xs text-subtle-foreground">
          Error reference: <span className="tech-value">{error.digest}</span>
        </p>
      ) : null}
    </Container>
  );
}
