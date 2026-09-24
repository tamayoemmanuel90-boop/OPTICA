"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Contador numérico animado: cuenta de 0 al valor objetivo al entrar en
 * viewport. Con reduced-motion muestra el valor final directamente.
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce || !inView) {
      if (inView) el.textContent = `${prefix}${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate(v) {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}0{suffix}
    </span>
  );
}
