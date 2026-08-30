"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LazyConceptMapExplorer } from "./LazyConceptMapExplorer";
import type { Difficulty } from "@/lib/content/types";

/**
 * Progressive enhancement for `/map`: server-rendered outline first, the
 * interactive explorer once its chunk is actually in memory.
 *
 * `children` is `ConceptOutline`, rendered on the server (see its file for why
 * the route needs one at all). The first client render returns exactly the
 * same thing, so hydration matches; then the effect below pulls the explorer
 * chunk and, only once it has resolved, swaps the outline for it.
 *
 * Waiting for the module rather than swapping on mount is the whole point.
 * `LazyConceptMapExplorer` is a `next/dynamic` import with `ssr: false`, so
 * rendering it before its chunk has landed shows a 640px box reading "Loading
 * concept map…". Swapping on mount would therefore replace real, readable
 * content with that placeholder for the length of a chunk download, which is
 * a downgrade on exactly the connections that can least afford one. This way
 * the reader never sees the placeholder at all: they read the outline until
 * the explorer is ready to draw.
 *
 * If the chunk never arrives (offline, a stale hashed filename after a
 * deploy), `ready` stays false and the reader keeps a complete, working text
 * version of the map. That is deliberately a better outcome than the error
 * boundary inside `LazyConceptMapExplorer`, which is still there for a fault
 * thrown during the explorer's own render.
 */
export function ConceptMapSurface({
  children,
  lessonTitles,
  lessonDifficulty,
}: {
  children: ReactNode;
  lessonTitles: Record<string, string>;
  lessonDifficulty: Record<string, Difficulty>;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("./ConceptMapExplorer")
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        // Keep the outline. See the note above: a text map beats an error box.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return <>{children}</>;
  return <LazyConceptMapExplorer lessonTitles={lessonTitles} lessonDifficulty={lessonDifficulty} />;
}
