import { cn } from "@/lib/utils";

type ExternalFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  creditUrl?: string;
  license: string;
  className?: string;
};

/**
 * An externally-sourced photo/illustration (NASA, a university lab, IBM/Google
 * Quantum AI, Wikimedia Commons, etc.) — deliberately rendered as a plain
 * `<img>`, not next/image: next/image would require every external host to be
 * listed in next.config.ts's `images.remotePatterns` and can fail the whole
 * static build if a single external URL is unreachable at build time. A plain
 * `<img>` just shows a broken-image icon for that one lesson instead.
 */
export function ExternalFigure({ src, alt, caption, credit, creditUrl, license, className }: ExternalFigureProps) {
  return (
    <figure className={cn("not-prose my-6 overflow-hidden rounded-xl border border-border bg-surface-muted/40", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-auto w-full" />
      <figcaption className="space-y-1 border-t border-border p-3 text-xs text-muted-foreground">
        {caption && <p className="text-sm text-foreground">{caption}</p>}
        <p>
          {creditUrl ? (
            <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              {credit}
            </a>
          ) : (
            credit
          )}
          {" · "}
          {license}
        </p>
      </figcaption>
    </figure>
  );
}
