import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

export type FigurePin = {
  /** Stable key, unique within this figure. */
  id: string;
  /** Horizontal position, percent of image width (0–100). */
  x: number;
  /** Vertical position, percent of image height (0–100). */
  y: number;
  /** What the pin points out — plain text, shown in the legend and (for
   *  screen readers) inline at the pin itself. */
  label: string;
};

/**
 * MDX usage:
 * ```mdx
 * <AnnotatedFigure
 *   src="https://upload.wikimedia.org/.../dilution-fridge.png"
 *   alt="Cutaway of a dilution refrigerator"
 *   caption="Each stage cools the mixing chamber further toward millikelvin temperatures."
 *   pins={[
 *     { id: "still", x: 30, y: 22, label: "Still — where the ³He/⁴He mixture is distilled." },
 *     { id: "mc", x: 55, y: 78, label: "Mixing chamber — the coldest stage, where the qubits sit." },
 *   ]}
 *   number={3}
 * />
 * ```
 * `x`/`y` are percentages of the image's own box, so pins stay correctly
 * placed at any width. As with `ExternalFigure`, an external `src` must be
 * on next.config.ts's CSP `img-src` allow-list.
 *
 * This is the component to reach for the moment a figure needs a reader to
 * find more than one specific thing in it — a labelled apparatus photo, an
 * instrument cutaway, a schematic with several named stages. If the image
 * only needs one caption describing the whole thing, that's `ExternalFigure`
 * instead; converting *to* `AnnotatedFigure` only pays for itself once
 * you're naming individual features. `number`/`wide` intentionally mirror
 * `ExternalFigure`'s props of the same name, so swapping one for the other
 * on an existing figure (e.g. Quantum Hardware's platform/dilution-fridge
 * photos, which are exactly this shape) never loses figure numbering or
 * width, and involves no other API relearning.
 */

/**
 * A figure with numbered pins over the image and a matching keyed legend —
 * for pointing at several specific features of one diagram or photo at
 * once, rather than describing them in prose. Pins are plain anchors to
 * their legend entry: no client-side state, so this stays a Server
 * Component. Each pin also carries its note as screen-reader-only text
 * inline (`sr-only`), so a screen reader user reaches the same information
 * at the point in the image where a sighted reader would look, in addition
 * to the always-visible legend below.
 */
export function AnnotatedFigure({
  src,
  alt,
  caption,
  pins,
  aspect,
  credit,
  creditUrl,
  license,
  number,
  wide = false,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  pins: FigurePin[];
  /**
   * Tailwind aspect-ratio class reserving the figure's space before the image
   * loads — e.g. `"aspect-[4/3]"`, `"aspect-square"`.
   *
   * Unlike `ExternalFigure`, this is **not** defaulted, and that is
   * deliberate. Pin `x`/`y` are percentages of the rendered image box, so a
   * reserved ratio that does not match the image's true ratio would letterbox
   * the image inside its container and slide every pin off the feature it
   * points at — a figure that confidently mislabels an apparatus is worse
   * than one that shifts on load. So: pass the image's *actual* ratio and get
   * both correct pins and zero layout shift; omit it and get correct pins
   * with the natural-sizing shift this component has always had.
   */
  aspect?: string;
  credit?: string;
  creditUrl?: string;
  license?: string;
  /** Optional figure number, e.g. `3` — renders as a "Fig. 3" tech-label
   *  ahead of the caption, matching `ExternalFigure`'s prop of the same
   *  name so converting between the two never loses numbering. */
  number?: number;
  /** Widens the figure beyond the reading column on large screens — same
   *  bounded, `sm`-and-up-only treatment as `ExternalFigure`'s `wide`, safe
   *  at 320px. Multi-pin apparatus photos are the case this most often
   *  helps: more width means less pin/legend crowding. */
  wide?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("not-prose my-8", wide && "sm:mx-0 lg:-mx-6 xl:-mx-10", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-panel)] border border-border bg-surface-muted/40",
          aspect
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={aspect ? "h-full w-full object-fill" : "h-auto w-full"}
        />
        {pins.map((pin, index) => (
          <span
            key={pin.id}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-pillar-edge bg-pillar text-[0.6875rem] font-semibold text-background shadow-[0_1px_4px_rgb(0_0_0_/_0.35)]"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span aria-hidden="true">{index + 1}</span>
            <span className="sr-only">{`Note ${index + 1}: ${pin.label}`}</span>
          </span>
        ))}
      </div>

      {(number != null || caption || pins.length > 0) && (
        <figcaption className="mt-3 space-y-2">
          {(number != null || caption) && (
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {number != null ? <TechLabel className="text-pillar">{`Fig. ${number}`}</TechLabel> : null}
              {caption ? <span className="text-sm text-foreground">{caption}</span> : null}
            </p>
          )}
          {pins.length > 0 ? (
            <ol className="space-y-1 text-sm">
              {pins.map((pin, index) => (
                <li key={pin.id} className="flex gap-2">
                  <span className="tech-value shrink-0 text-pillar-strong">{index + 1}</span>
                  <span className="text-muted-foreground">{pin.label}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {credit ? (
            <p className="flex flex-wrap items-center gap-x-1.5 pt-1 text-xs text-subtle-foreground">
              {creditUrl ? (
                <a
                  href={creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-2 hover:text-foreground"
                >
                  {credit}
                </a>
              ) : (
                credit
              )}
              {license ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{license}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
