"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados. */
  max?: number;
  /** Desactiva el tilt (útil en grid con muchas tarjetas). */
  disabled?: boolean;
}

/**
 * Tilt 3D por movimiento del mouse (sin WebGL): rotación sutil + brillo
 * especular que sigue al cursor. Se desactiva en touch y reduced-motion.
 */
export function TiltCard({ children, className, max = 7, disabled }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 55%)`;

  if (reduce || disabled) return <div className={className}>{children}</div>;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    ry.set((nx - 0.5) * max * 2);
    rx.set(-(ny - 0.5) * max * 2);
    glareX.set(nx * 100);
    glareY.set(ny * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    px.set(0.5);
    py.set(0.5);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative [perspective:1100px]", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ rotateX: rx, rotateY: ry }}
      >
        {children}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glare }}
        />
      </motion.div>
    </motion.div>
  );
}
