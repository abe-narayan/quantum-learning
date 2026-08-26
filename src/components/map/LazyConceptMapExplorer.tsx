"use client";

import dynamic from "next/dynamic";

const ConceptMapExplorer = dynamic(
  () => import("./ConceptMapExplorer").then((mod) => mod.ConceptMapExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="not-prose grid gap-4 lg:grid-cols-[1fr_360px]" aria-hidden="true">
        <div className="instrument flex h-[420px] items-center justify-center overflow-hidden sm:h-[560px]">
          <span className="tech-label">Loading concept map…</span>
        </div>
        <div className="instrument hidden overflow-hidden lg:block lg:max-h-[652px]" />
      </div>
    ),
  }
);

export { ConceptMapExplorer as LazyConceptMapExplorer };
