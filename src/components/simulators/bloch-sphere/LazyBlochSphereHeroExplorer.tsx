"use client";

import dynamic from "next/dynamic";

const BlochSphereHeroExplorer = dynamic(
  () => import("./BlochSphereHeroExplorer").then((mod) => mod.BlochSphereHeroExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="relative mx-auto w-full max-w-sm">
        <div
          className="flex aspect-square items-center justify-center rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
          aria-hidden="true"
        >
          <span className="text-sm text-muted-foreground">Loading simulator…</span>
        </div>
      </div>
    ),
  }
);

export { BlochSphereHeroExplorer as LazyBlochSphereHeroExplorer };
