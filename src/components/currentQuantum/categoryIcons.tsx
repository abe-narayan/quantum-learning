import type { ComponentType, SVGProps } from "react";
import type { CurrentQuantumCategory } from "@/lib/content/currentQuantum/types";

/**
 * One small line glyph per Current Quantum category — the non-color-only
 * half of the category signal (pillar tint carries the curriculum-area
 * color; these carry the *kind of result*, and always render next to the
 * category's text label, never alone). Generic, schematic shapes — a
 * circuit graph, a shield, a beaker — not literal illustrations of any real
 * apparatus, so there's no factual claim for them to get wrong.
 *
 * All props forward to the root `<svg>`, so a call site sets
 * `aria-hidden="true" data-decorative=""` directly (they're always paired
 * with visible text, per docs/DESIGN_SYSTEM.md's accessibility rules).
 */
type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function AlgorithmIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5.4 10 L14.6 5.6 M5.4 10 L14.6 14.4" />
      <circle cx="4" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1.6" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function HardwareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="6" width="8" height="8" rx="1" />
      <path d="M6 8H3 M6 12H3 M14 8H17 M14 12H17 M8 6V3 M12 6V3 M8 14V17 M12 14V17" />
    </IconBase>
  );
}

function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 2.5 L16.5 5 V9.3 C16.5 13.3 13.7 16.1 10 17.5 C6.3 16.1 3.5 13.3 3.5 9.3 V5 Z" />
      <path d="M7.2 10 L9.2 12 L13 7.6" />
    </IconBase>
  );
}

function NetworkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 5.1 L4 13.6 M10 5.1 L16 13.6 M5.4 15 H14.6" />
      <circle cx="10" cy="3.6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function SensingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="4.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M7.3 12.7 A6 6 0 0 0 7.3 4.3" />
      <path d="M10.1 15.5 A10 10 0 0 0 10.1 1.5" />
    </IconBase>
  );
}

function FlaskIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 2.5H12 M8.5 2.5V7.5L4.5 15A2 2 0 0 0 6.3 18H13.7A2 2 0 0 0 15.5 15L11.5 7.5V2.5" />
      <path d="M6.5 13H13.5" />
    </IconBase>
  );
}

function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="9" width="10" height="8" rx="1.5" />
      <path d="M7 9V6.5A3 3 0 0 1 13 6.5V9" />
    </IconBase>
  );
}

export const CATEGORY_META: Record<
  CurrentQuantumCategory,
  { label: string; Icon: ComponentType<IconProps> }
> = {
  algorithms: { label: "Algorithms", Icon: AlgorithmIcon },
  "hardware milestone": { label: "Hardware Milestone", Icon: HardwareIcon },
  "error correction": { label: "Error Correction", Icon: ShieldIcon },
  "quantum networking": { label: "Quantum Networking", Icon: NetworkIcon },
  sensing: { label: "Sensing", Icon: SensingIcon },
  "historical experiment": { label: "Historical Experiment", Icon: FlaskIcon },
  cryptography: { label: "Cryptography", Icon: LockIcon },
};
