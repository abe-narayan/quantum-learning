"use client";

import { useEffect } from "react";
import type { Pillar } from "@/lib/content/types";
import type { FieldRegime } from "@/lib/design/pillars";
import { resetFieldState, setFieldState } from "./fieldStore";

/**
 * Declares which background environment the current page wants.
 *
 * Renders nothing. Exists as its own leaf client component so that a page
 * needing a background regime does not have to become a client component
 * itself, `PillarScope` (a server component) renders one of these alongside
 * its server-rendered children.
 */
export function FieldRegimeSetter({
  regime,
  pillar = null,
}: {
  regime: FieldRegime;
  pillar?: Pillar | null;
}) {
  useEffect(() => {
    setFieldState({ regime, pillar });
    // Reset on unmount so a route that declares no regime falls back to the
    // default rather than inheriting the previous page's environment through
    // a client-side navigation.
    return resetFieldState;
  }, [regime, pillar]);

  return null;
}
