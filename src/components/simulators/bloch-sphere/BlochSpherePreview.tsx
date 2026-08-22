import { Badge } from "@/components/ui/Badge";

const LINE_STYLE = { stroke: "var(--border)" } as const;

export function BlochSpherePreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--brand) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <svg
          viewBox="0 0 320 320"
          role="img"
          aria-label="Illustration of a qubit state vector on the Bloch sphere, pointing between the poles to represent a superposition state."
          className="mx-auto h-auto w-full max-w-xs"
        >
          <defs>
            <linearGradient id="bloch-vector" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "var(--brand)" }} />
              <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
            </linearGradient>
          </defs>

          <circle cx="160" cy="160" r="118" fill="none" strokeWidth="1.5" style={LINE_STYLE} />
          <ellipse cx="160" cy="160" rx="118" ry="34" fill="none" strokeWidth="1.25" style={LINE_STYLE} />
          <ellipse
            cx="160"
            cy="160"
            rx="118"
            ry="60"
            fill="none"
            strokeWidth="1"
            strokeDasharray="4 5"
            transform="rotate(-25 160 160)"
            style={LINE_STYLE}
          />
          <line x1="160" y1="32" x2="160" y2="288" strokeWidth="1.25" style={LINE_STYLE} />

          <line
            x1="160"
            y1="160"
            x2="246"
            y2="80"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ stroke: "url(#bloch-vector)" }}
          />
          <circle cx="246" cy="80" r="6" style={{ fill: "url(#bloch-vector)" }} />
          <circle
            cx="246"
            cy="80"
            r="12"
            fill="none"
            strokeWidth="1"
            style={{ stroke: "var(--brand)", opacity: 0.4 }}
          />
          <circle cx="160" cy="160" r="3" style={{ fill: "var(--muted-foreground)" }} />

          <text
            x="160"
            y="20"
            textAnchor="middle"
            className="font-mono text-sm"
            style={{ fill: "var(--foreground)" }}
          >
            |0⟩
          </text>
          <text
            x="160"
            y="306"
            textAnchor="middle"
            className="font-mono text-sm"
            style={{ fill: "var(--foreground)" }}
          >
            |1⟩
          </text>
        </svg>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-sm font-medium text-foreground">Bloch sphere</p>
            <p className="text-xs text-muted-foreground">Static preview</p>
          </div>
          <Badge tone="brand">Interactive version coming soon</Badge>
        </div>
      </div>
    </div>
  );
}
