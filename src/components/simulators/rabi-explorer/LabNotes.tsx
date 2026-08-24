import type { ReactNode } from "react";

type LabNote = { label: string; content: ReactNode };

/**
 * Static "lab notebook" framing text — what this simulator is for, what to
 * try, and where to go next — rendered underneath the live numeric
 * narration box. Kept as its own tiny component (rather than inline JSX)
 * so the framing content stays easy to scan separately from the
 * live-computed narration above it.
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
