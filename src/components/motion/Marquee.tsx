"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Duración de un ciclo completo en segundos. */
  duration?: number;
  reverse?: boolean;
  /** Pausa la animación al hacer hover. */
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
}

/**
 * Marquee infinito CSS (cinta cinética). Duplica el contenido para lograr
 * el loop perfecto. Con prefers-reduced-motion la animación global queda
 * congelada pero el contenido permanece visible (accesible).
 */
export function Marquee({
  children,
  duration = 28,
  reverse = false,
  pauseOnHover = false,
  className,
  trackClassName,
}: MarqueeProps) {
  return (
    <div
      className={cn("overflow-hidden", pauseOnHover && "marquee-paused", className)}
      role="marquee"
      aria-label="Cinta de contenido destacado"
    >
      <div
        className={cn("marquee-track", trackClassName)}
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
