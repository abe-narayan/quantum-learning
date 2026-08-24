import type { ReactNode } from "react";

type LabNote = { label: string; content: ReactNode };

/**
 * "Lab notebook" framing text — what this simulator is for, what to try,
 * a live "what to notice" line reacting to the current approximation
 * ratio, and where to go next. QAOA had no narration at all before this,
 * so this panel carries both the static framing and (via the caller
 * passing a ratio-derived note) the one live-computed line.
 */
export function LabNotes({ notes }: { notes: LabNote[] }) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4 text-sm">
      {notes.map((note) => (
        <div key={note.label}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{note.label}</p>
          <div className="mt-1 text-foreground">{note.content}</div>
        </div>
      ))}
    </div>
  );
}
