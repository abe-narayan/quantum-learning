"use client";

import dynamic from "next/dynamic";

const CHSHBellTestExplorer = dynamic(
  () => import("./CHSHBellTestExplorer").then((mod) => mod.CHSHBellTestExplorer),
  {
    ssr: false,
    loading: () => (
      <div
        className="not-prose flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-surface sm:aspect-[2/1]"
        aria-hidden="true"
      >
        <span className="text-sm text-muted-foreground">Loading simulator…</span>
      </div>
    ),
  }
);

export { CHSHBellTestExplorer as LazyCHSHBellTestExplorer };
