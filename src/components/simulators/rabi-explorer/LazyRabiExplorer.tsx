"use client";

import dynamic from "next/dynamic";

const RabiExplorer = dynamic(() => import("./RabiExplorer").then((mod) => mod.RabiExplorer), {
  ssr: false,
  loading: () => (
    <div
      className="not-prose flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-surface sm:aspect-[2/1]"
      aria-hidden="true"
    >
      <span className="text-sm text-muted-foreground">Loading simulator…</span>
    </div>
  ),
});

export { RabiExplorer as LazyRabiExplorer };
