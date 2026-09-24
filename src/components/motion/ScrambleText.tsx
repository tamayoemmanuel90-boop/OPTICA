"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$/&";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Duración total del efecto en ms. */
  duration?: number;
}

/**
 * Efecto "decode/scramble" para kickers y etiquetas: los caracteres se
 * resuelven de izquierda a derecha al entrar en viewport. Reduced-motion →
 * texto estático. No modifica el layout (misma longitud siempre).
 */
export function ScrambleText({
  text,
  className,
  duration = 900,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [output, setOutput] = useState(reduce ? text : text.replace(/[^\s]/g, "·"));

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < resolved || !/[A-Za-z0-9]/.test(ch)) {
          next += ch;
        } else {
          next += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
        }
      }
      setOutput(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setOutput(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={text}>
      <span aria-hidden>{output}</span>
    </span>
  );
}
