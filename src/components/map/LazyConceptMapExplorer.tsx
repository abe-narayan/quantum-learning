"use client";

import dynamic from "next/dynamic";

const ConceptMapExplorer = dynamic(
  () => import("./ConceptMapExplorer").then((mod) => mod.ConceptMapExplorer),
  {
    ssr: false,
    // `ssr: false`, so this placeholder is what a cold visit to /map actually
    // renders until the explorer chunk arrives — it is the state readers see,
    // not a formality. Its height therefore has to match the explorer's, and
    // the explorer is not just a viewport: it stacks an orientation block, a
    // legend/zoom row and a status line above the graph, ~220px of chrome that
    // this box used to omit entirely. Omitting it meant the rest of the page
    // jumped down by that much the moment the chunk landed. `640px`/`780px` is
    // the 420/560 graph plus that chrome; keep the two in step.
    loading: () => (
      <div className="not-prose grid gap-4 lg:grid-cols-[1fr_360px]" aria-hidden="true">
        <div className="instrument flex h-[640px] items-center justify-center overflow-hidden sm:h-[780px]">
          <span className="tech-label">Loading concept map…</span>
        </div>
        <div className="instrument hidden overflow-hidden lg:block lg:max-h-[652px]" />
      </div>
    ),
  }
);

export { ConceptMapExplorer as LazyConceptMapExplorer };
