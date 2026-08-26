import type { ReactNode } from "react";
import { Instrument } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

type Mode = "observe" | "predict" | "run" | "compare";

/**
 * MDX usage:
 * ```mdx
 * <InteractiveSection
 *   title="Watch the packet spread"
 *   description="Increase the initial momentum spread and note how quickly the packet delocalizes."
 *   mode="observe"
 * >
 *   <LazyWavePacketSimulator />
 * </InteractiveSection>
 * ```
 * `title` defaults to `"Try it yourself"`. `mode` has **no default value** —
 * when omitted, the badge reads the neutral "Interact" rather than assuming
 * any particular beat. (It used to default to `"run"`, so every one of the
 * 161 pre-existing call sites — none of which pass `mode` — was badged "RUN
 * EXPERIMENT" whether or not anything was actually being run; see
 * docs/UX_REVIEW.md P1-9. Falling back to a neutral label instead of a
 * specific, possibly-wrong one is what makes all 161 correct again without
 * editing a single call site.) Pass `mode` explicitly to get the sharper,
 * honest badge — `"observe"` for a slider-and-watch embed, `"predict"` when
 * pairing with a commit-then-reveal moment, `"run"` for a genuine
 * multi-parameter experiment, `"compare"` for a side-by-side.
 */

const MODE_LABEL: Record<Mode, string> = {
  observe: "Observe",
  predict: "Predict",
  run: "Run experiment",
  compare: "Compare",
};

/** Shown when `mode` is omitted — neutral rather than defaulting to a
 *  specific claim ("RUN EXPERIMENT") that may not be true of this embed. */
const DEFAULT_LABEL = "Interact";

function ModeIcon({ mode }: { mode?: Mode }) {
  if (!mode) {
    // Neutral glyph for the no-mode-given case: a simple toggle, distinct
    // from every specific mode's icon below.
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-none stroke-current" strokeWidth="1.1">
        <rect x="1" y="3.5" width="10" height="5" rx="2.5" />
        <circle cx="4" cy="6" r="1.15" className="fill-current stroke-none" />
      </svg>
    );
  }
  if (mode === "observe") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
        <path
          d="M1 6c1.4-2.6 3.2-3.9 5-3.9s3.6 1.3 5 3.9c-1.4 2.6-3.2 3.9-5 3.9S2.4 8.6 1 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle cx="6" cy="6" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  if (mode === "predict") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-none stroke-current" strokeWidth="1.1">
        <circle cx="6" cy="6" r="4.7" />
        <circle cx="6" cy="6" r="1.1" className="fill-current stroke-none" />
      </svg>
    );
  }
  if (mode === "compare") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-none stroke-current" strokeWidth="1.1">
        <path d="M2 3h3.2v6H2zM6.8 3H10v6H6.8z" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-current">
      <path d="M2.5 1.5 L10 6 L2.5 10.5 Z" />
    </svg>
  );
}

/**
 * Wraps a simulator embed inside lesson prose as mounted equipment rather
 * than "here is a simulator" — an `<Instrument>` label strip names the mode
 * of engagement (`OBSERVE` / `PREDICT` / `RUN EXPERIMENT` / `COMPARE`, or the
 * neutral `INTERACT` when the call site doesn't say), and the body still
 * carries the concrete "what to actually do" prompt so a student always
 * knows the action before they reach the embed.
 *
 * `data-mdx="instrument-mount"` and `data-mdx-slot="embed"` are the print
 * stylesheet's hooks (globals.css §12) — they replace the embedded
 * interactive content with a short "view online" note on paper. Keyed off
 * data attributes rather than an exact Tailwind class combination so a
 * future visual tweak here can't silently break print output.
 *
 * **Double-framing.** All 14 simulators (`src/components/simulators/**`)
 * already draw their own `.instrument` panel via `SimulatorInstrument` —
 * pillar-tinted, corner-ticked, hairline-edged. Wrapping that in a second
 * `<Instrument>` here would stack two bordered equipment panels, which is
 * exactly the nested-bordering docs/DESIGN_SYSTEM.md §4 exists to prevent.
 * The lighter visualization widgets under `src/components/visualizations/`
 * (bar charts, parametric curves, matrix grids, …) carry no frame of their
 * own by contrast, and still need this wrapper's panel to read as mounted
 * equipment rather than a bare floating figure.
 *
 * Resolved with a `has-()` selector rather than a prop, so the 204 existing
 * call sites (none of which can name which kind of child they hold) don't
 * need to change and this stays a server component either way: when the
 * embed slot contains a nested `.instrument`, this wrapper's own panel
 * chrome (border, pillar wash, shadow, corner ticks) is switched off,
 * leaving only the pedagogical header — mode badge, title, description —
 * above the simulator's own single frame. Every other embed keeps the full
 * panel exactly as before.
 */
export function InteractiveSection({
  title = "Try it yourself",
  description,
  mode,
  children,
}: {
  title?: string;
  description: string;
  /** Which beat of the experiment this embed frames. No default: an
   *  omitted `mode` renders the neutral "Interact" badge instead of
   *  guessing a specific one (see docs/UX_REVIEW.md P1-9) — pass it
   *  explicitly whenever the sharper label is true of this embed. */
  mode?: Mode;
  children: ReactNode;
}) {
  const label = mode ? MODE_LABEL[mode] : DEFAULT_LABEL;
  return (
    <div data-mdx="instrument-mount" className="not-prose my-8">
      <Instrument
        label={
          <span className="flex items-center gap-1.5">
            <ModeIcon mode={mode} />
            {label}
          </span>
        }
        className={cn(
          // See the "Double-framing" doc comment above: switches off this
          // wrapper's own panel when its embed already draws one.
          "has-[[data-mdx-slot=embed]_.instrument]:border-transparent",
          "has-[[data-mdx-slot=embed]_.instrument]:bg-transparent",
          "has-[[data-mdx-slot=embed]_.instrument]:shadow-none",
          "has-[[data-mdx-slot=embed]_.instrument]:after:content-none"
        )}
      >
        <p className="font-display text-base font-semibold text-foreground sm:text-lg">{title}</p>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        <div data-mdx-slot="embed" className="mt-4">
          {children}
        </div>
      </Instrument>
    </div>
  );
}
