"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CurtainImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Clases del <img> interno (object-cover, hover, etc.). */
  imgClassName?: string;
  delay?: number;
  loading?: "lazy" | "eager";
}

/**
 * Revelado tipo "cortina editorial": la imagen emerge con clip-path desde
 * abajo + leve zoom-out al entrar en viewport. Usa useInView + animate
 * (patrón robusto verificado en Counter/ScrambleText). Reduced-motion →
 * fade simple. Fallback elegante si la imagen falla.
 *
 * Fail-safe: si el IntersectionObserver no dispara (salto de scroll,
 * pestaña en segundo plano, scroll restaurado por el navegador), un sondeo
 * geométrico ligero fuerza el revelado cuando la pieza ya es visible.
 */
export function CurtainImage({
  src,
  alt,
  className,
  imgClassName,
  delay = 0,
  loading = "lazy",
}: CurtainImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [fallback, setFallback] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Fail-safe geométrico: corre SOLO mientras la pieza sigue oculta.
  useEffect(() => {
    if (inView) return;
    const poll = setInterval(() => {
      const el = ref.current;
      if (!el || !el.isConnected) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh - 40 && r.bottom > 40) setFallback(true);
    }, 350);
    return () => clearInterval(poll);
  }, [inView]);

  const shown = inView || fallback;

  if (hidden) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[#f4f3f1]",
          className
        )}
        aria-hidden
      >
        <span className="font-display text-xl font-extrabold tracking-[0.25em] text-neutral-300">
          QL
        </span>
      </div>
    );
  }

  if (reduce) {
    return (
      <div ref={ref} className={cn("overflow-hidden bg-[#f4f3f1]", className)}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setHidden(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("overflow-hidden bg-[#f4f3f1]", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={shown ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      transition={{ duration: 1.05, delay, ease: EASE_OUT }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onError={() => setHidden(true)}
        className={cn("h-full w-full object-cover will-change-transform", imgClassName)}
        initial={{ scale: 1.18 }}
        animate={shown ? { scale: 1 } : undefined}
        transition={{ duration: 1.25, delay, ease: EASE_OUT }}
      />
    </motion.div>
  );
}
