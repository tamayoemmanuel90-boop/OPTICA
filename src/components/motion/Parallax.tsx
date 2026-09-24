"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Desplazamiento al inicio del recorrido (px) */
  from?: number;
  /** Desplazamiento al final del recorrido (px) */
  to?: number;
}

/**
 * Parallax vertical sutil ligado al scroll del elemento.
 * Respeta prefers-reduced-motion (sin desplazamiento).
 */
export function Parallax({
  children,
  className,
  from = 36,
  to = -36,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [reduce ? 0 : from, reduce ? 0 : to]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
