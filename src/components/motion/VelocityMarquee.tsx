"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface VelocityMarqueeProps {
  children: ReactNode;
  /** Velocidad base en px/s. */
  baseVelocity?: number;
  className?: string;
  /** Contenido duplicado N veces para llenar pantallas anchas. */
  copies?: number;
}

/**
 * Marquee reactivo a la velocidad de scroll: mientras más rápido scrollea
 * el usuario, más rápido se mueve (e incluso invierte dirección) y se
 * inclina ligeramente. Efecto firma de sitios premium (estilo Hawkers/Apple).
 */
export function VelocityMarquee({
  children,
  baseVelocity = 1.6,
  className,
  copies = 3,
}: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4.5], {
    clamp: false,
  });
  const skew = useTransform(
    smoothVelocity,
    [-1500, 0, 1500],
    [-3.5, 0, 3.5]
  );
  const x = useTransform(baseX, (v) => `${wrap(-33.333, 0, v)}%`);
  const directionRef = useRef(1);
  const [width, setWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setWidth(trackRef.current.offsetWidth / copies);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [copies]);

  useAnimationFrame((_t, delta) => {
    if (reduce || !width) return;
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    // Scroll hacia abajo invierte/hace más rápido; hacia arriba restaura.
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;
    moveBy += directionRef.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + (moveBy / width) * 100);
  });

  if (reduce) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className="flex w-max items-center">
          {Array.from({ length: copies }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
              {children}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={{ x, skewX: skew }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Mueve v al rango [min, max) con wrap circular. */
function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}
