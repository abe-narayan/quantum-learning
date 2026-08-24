"use client";

import { useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAllProblemMeta, getProblem } from "@/lib/problems/registry";

/** Sums a string's char codes, mod `length` — a simple, deterministic hash. */
function hashToIndex(key: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % length;
}

function todaysProblem() {
  const meta = getAllProblemMeta();
  if (meta.length === 0) return null;
  const dateKey = new Date().toISOString().slice(0, 10);
  const index = hashToIndex(dateKey, meta.length);
  // getProblem() looks up the same PROBLEMS array entry every time for a
  // given slug, so this is referentially stable within a calendar day —
  // required for useSyncExternalStore to avoid a re-render loop.
  return getProblem(meta[index].slug) ?? null;
}

const noopSubscribe = () => () => {};

/**
 * "Problem of the Day": a deterministic, backend-free daily pick. Every
 * visitor on the same calendar date sees the same problem — the date
 * string is hashed to an index into the full problem list, so there's no
 * server, no database, and no build-time computation involved.
 *
 * This page is otherwise fully static (no dynamic APIs used anywhere in
 * the tree), so it's prerendered once at build time — if `new Date()` were
 * read directly during render, every visitor would see the build day's
 * problem baked into the cached HTML until they hydrate on a *different*
 * day, producing a hydration mismatch. `useSyncExternalStore` with a null
 * server snapshot keeps the server/first-client-render output identical
 * (nothing renders) and only shows the real "today" after mount, the same
 * SSR-safe pattern this codebase's localStorage-backed progress hooks use.
 */
export function DailyPuzzle() {
  const problem = useSyncExternalStore(noopSubscribe, todaysProblem, () => null);

  if (!problem) return null;

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Card className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Problem of the day</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{problem.meta.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{problem.question.prompt}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge tone="brand" className="capitalize">{problem.meta.difficulty}</Badge>
            <Badge>{problem.meta.estimatedMinutes} min</Badge>
          </div>
          <Button href={`/problems/${problem.meta.slug}`} className="mt-5">
            Solve today&rsquo;s problem
          </Button>
        </Card>
      </Container>
    </section>
  );
}
