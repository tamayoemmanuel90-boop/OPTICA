"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "view" | "open" | "click";

/**
 * Cursor personalizado minimalista (solo desktop con puntero fino).
 * Los elementos declaran su intención con data-cursor="view|open|click".
 * Respeta prefers-reduced-motion y nunca se activa en móvil/touch.
 */
const LABELS: Record<CursorMode, string | null> = {
  default: null,
  view: "VER",
  open: "ABRIR",
  click: "CLIC",
};

/** Solo activo con puntero fino y sin reduced-motion (reactivo a cambios). */
function useCursorEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const fine = window.matchMedia("(pointer: fine)");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      fine.addEventListener("change", cb);
      reduce.addEventListener("change", cb);
      return () => {
        fine.removeEventListener("change", cb);
        reduce.removeEventListener("change", cb);
      };
    },
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function CustomCursor() {
  const enabled = useCursorEnabled();
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 550, damping: 45, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 550, damping: 45, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.("[data-cursor]");
      setMode(
        el
          ? ((el.getAttribute("data-cursor") as CursorMode) ?? "default")
          : "default"
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const label = LABELS[mode];
  const size = label ? 72 : 14;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x: sx, y: sy }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full"
          animate={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.82 : 1,
            backgroundColor: label ? "#e60012" : "rgba(255,255,255,0.9)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={label ? undefined : { mixBlendMode: "difference" }}
        >
          {label && (
            <span className="text-[10px] font-semibold tracking-[0.22em] text-white">
              {label}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
