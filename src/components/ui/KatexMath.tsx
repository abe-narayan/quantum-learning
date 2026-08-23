"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

/**
 * Renders a LaTeX string client-side via KaTeX's own renderer. This is for
 * math whose value changes at runtime (e.g. live simulator state) — static
 * lesson math is instead compiled at build time via remark-math/rehype-katex.
 * Both paths share the same `katex` package and the same stylesheet.
 */
export function KatexMath({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      }),
    [tex, display]
  );

  return <span className={cn("katex-math", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
