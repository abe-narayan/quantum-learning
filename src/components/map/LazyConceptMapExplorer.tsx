"use client";

import dynamic from "next/dynamic";

const ConceptMapExplorer = dynamic(
  () => import("./ConceptMapExplorer").then((mod) => mod.ConceptMapExplorer),
  {
    ssr: false,
    loading: () => (
      <div
        className="not-prose flex h-[420px] items-center justify-center rounded-2xl border border-border bg-surface sm:h-[560px]"
        aria-hidden="true"
      >
        <span className="text-sm text-muted-foreground">Loading concept map…</span>
      </div>
    ),
  }
);

export { ConceptMapExplorer as LazyConceptMapExplorer };
