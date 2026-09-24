"use client";

import { Fragment, createElement } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

type AnimatedTextTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface AnimatedTextProps {
  text: string;
  as?: AnimatedTextTag;
  className?: string;
  /** Retardo inicial en segundos */
  delay?: number;
  /** Escalonado entre palabras */
  stagger?: number;
  /** mount = anima al montar (hero) · inview = anima al entrar en viewport */
  mode?: "mount" | "inview";
}

/**
 * Text reveal editorial: cada palabra emerge desde abajo con máscara.
 * Respeta prefers-reduced-motion (renderiza el texto estático).
 */
export function AnimatedText({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.05,
  mode = "inview",
}: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return createElement(as, { className }, text);
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const word: Variants = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration: 0.85, ease: EASE_OUT } },
  };

  const MotionTag = motion[as];

  const stateProps =
    mode === "mount"
      ? { variants: container, initial: "hidden", animate: "show" }
      : {
          variants: container,
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-60px" },
        };

  return (
    <MotionTag className={className} {...stateProps} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block">
            <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
              <motion.span
                variants={word}
                className="inline-block will-change-transform"
              >
                {w}
              </motion.span>
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
