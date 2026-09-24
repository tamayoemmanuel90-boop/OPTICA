"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BRAND } from "@/config/site";
import { EASE_OUT } from "@/lib/motion";

const SESSION_KEY = "ql-intro-shown";

/**
 * Intro de marca (preloader): cortina roja con el logotipo oficial y el
 * tagline, que se levanta como telón. Aparece una vez por sesión
 * (sessionStorage). Se omite por completo con prefers-reduced-motion.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let shown = false;
    try {
      shown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      shown = false;
    }
    if (shown) return;

    let exitT = 0;
    // rAF: evita setState síncrono dentro del effect y monta tras el primer frame
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      document.documentElement.style.overflow = "hidden";
      exitT = window.setTimeout(() => {
        setVisible(false);
        document.documentElement.style.overflow = "";
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* noop */
        }
      }, 1750);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitT);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-brand"
          role="status"
          aria-label="Cargando QUIERO LENTES"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <motion.img
            src={BRAND.logo.white}
            alt="Ópticas Quiero Lentes"
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
            className="w-[min(72vw,420px)]"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 px-6 text-center font-serif text-lg italic text-white/85 sm:text-xl"
          >
            {BRAND.tagline}.
          </motion.p>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE_OUT }}
            className="mt-8 h-px w-24 origin-center bg-white/70"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
