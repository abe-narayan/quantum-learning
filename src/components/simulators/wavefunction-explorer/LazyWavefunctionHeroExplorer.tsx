"use client";

import dynamic from "next/dynamic";

const WavefunctionHeroExplorer = dynamic(
  () => import("./WavefunctionHeroExplorer").then((mod) => mod.WavefunctionHeroExplorer),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex aspect-[16/10] items-center justify-center rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        aria-hidden="true"
      >
        <span className="text-sm text-muted-foreground">Loading simulator…</span>
      </div>
    ),
  }
);

export { WavefunctionHeroExplorer as LazyWavefunctionHeroExplorer };
