"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * true solo después de la hidratación (client).
 * Evita hydration mismatch con stores persistidos (p.ej. carrito).
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
