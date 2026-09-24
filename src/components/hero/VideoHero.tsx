"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CalendarCheck, ShoppingBag } from "lucide-react";
import { HERO_VIDEO } from "@/config/site";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * HERO CINEMATOGRÁFICO — video a pantalla completa (100vw × 100dvh).
 * - Tagline OFICIAL de marca: "Cambiamos la forma de ver tu mundo".
 * - Fuente configurable desde src/config/site.ts (lista para cambiar a CDN .mp4).
 * - CTAs magnéticos con barrido de brillo, grano de película, texto vertical
 *   lateral y parallax al scroll. Respeta reduced motion.
 */
export function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const reduce = useReducedMotion();

  /**
   * Reproducción robusta del video:
   * 1. El evento `canplay` puede dispararse ANTES de la hidratación (video
   *    local cacheado) y perderse → se verifica readyState directamente.
   * 2. La política de autoplay de algunos navegadores bloquea el inicio
   *    tras un reload → se reintenta play() en la primera interacción.
   */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const markReady = () => setVideoReady(true);
    const tryPlay = () => {
      const p = v.play();
      if (p) p.catch(() => {
        /* autoplay bloqueado: se reintenta con la primera interacción */
      });
    };

    if (v.readyState >= 3) {
      markReady();
      if (v.paused) tryPlay();
    }
    v.addEventListener("canplay", markReady);
    v.addEventListener("playing", markReady);

    const kickOnGesture = () => {
      if (v.paused && v.readyState >= 2) tryPlay();
      window.removeEventListener("pointerdown", kickOnGesture);
      window.removeEventListener("touchstart", kickOnGesture);
      window.removeEventListener("keydown", kickOnGesture);
    };
    window.addEventListener("pointerdown", kickOnGesture, { passive: true });
    window.addEventListener("touchstart", kickOnGesture, { passive: true });
    window.addEventListener("keydown", kickOnGesture, { passive: true });

    return () => {
      v.removeEventListener("canplay", markReady);
      v.removeEventListener("playing", markReady);
      window.removeEventListener("pointerdown", kickOnGesture);
      window.removeEventListener("touchstart", kickOnGesture);
      window.removeEventListener("keydown", kickOnGesture);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.07]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, reduce ? 0 : -36]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-label="QUIERO LENTES — Cambiamos la forma de ver tu mundo"
      className="grain relative h-dvh min-h-[560px] w-full overflow-hidden bg-ink"
    >
      {/* VIDEO BACKGROUND */}
      <motion.div
        style={{ scale, y: videoY }}
        className="absolute inset-0 will-change-transform"
      >
        <video
          ref={videoRef}
          className={cn(
            "h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-out",
            videoReady && !videoFailed ? "opacity-100" : "opacity-0"
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          {HERO_VIDEO.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
          Tu navegador no soporta video HTML5.
        </video>

        {/* Poster visible durante la carga — se desvanece cuando el video está listo */}
        <img
          src={HERO_VIDEO.poster}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700",
            videoReady && !videoFailed ? "opacity-0" : "opacity-100"
          )}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </motion.div>

      {/* OVERLAY sutil para legibilidad — conserva el impacto del video */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/55"
      />
      {/* Velo lateral derecho: apoya el bloque de texto como en la referencia */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/20 to-transparent"
      />

      {/* Línea de acento roja animada (marca) */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 z-10 h-[3px] w-full origin-left bg-brand"
        />
      )}

      {/* Texto vertical lateral (editorial) — lado izquierdo para dejar el
          cuadro del video limpio: el eslogan vive abajo a la derecha */}
      <motion.div
        aria-hidden
        style={{ opacity: contentOpacity }}
        className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="rotate-90 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.42em] text-white/55"
        >
          Est. 2007 — Querétaro, Qro.
        </motion.p>
      </motion.div>

      {/* CONTENIDO EDITORIAL — abajo a la DERECHA (video limpio a la
          izquierda/centro, según referencia del cliente) */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full flex-col items-end justify-end pb-[clamp(5.5rem,12vh,8.5rem)] pr-5 text-right sm:pr-8 lg:pr-12"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: "easeOut" }}
            className="kicker text-white/80"
          >
            Óptica Quiero Lentes
          </motion.p>

          <AnimatedText
            as="h1"
            mode="mount"
            delay={0.4}
            stagger={0.07}
            text="CAMBIAMOS LA FORMA"
            className="mt-5 font-display text-[clamp(2.2rem,6.4vw,5.4rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-white"
          />
          <AnimatedText
            as="p"
            mode="mount"
            delay={0.72}
            stagger={0.07}
            text="de ver tu mundo."
            className="mt-1 font-serif text-[clamp(2.6rem,8vw,6.4rem)] italic leading-[1.02] text-white"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8, ease: "easeOut" }}
            className="ml-auto mt-6 max-w-xl text-base text-white/85 md:text-lg"
          >
            Estilo, tecnología y calidad en un solo lugar. Encuentra los
            armazones perfectos para ti y cuida tu visión con nuestros
            exámenes y lentes de última generación.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            className="mt-8 flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-end"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("ql:open-appointment"))
                }
                data-cursor="click"
                className="cta-shine inline-flex h-12 min-w-44 items-center justify-center gap-2.5 bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Agendar examen de la vista
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("#armazones")}
                data-cursor="click"
                className="inline-flex h-12 min-w-44 items-center justify-center gap-2.5 border border-white/60 px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-[2px] transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Comprar ahora
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* INDICADOR DE SCROLL */}
      <motion.button
        type="button"
        onClick={() => scrollToId("#armazones")}
        aria-label="Bajar a la sección de armazones"
        data-cursor="click"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-white/80 transition-colors hover:text-white"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
          Desliza
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/25">
          {!reduce && (
            <motion.span
              className="absolute left-0 top-0 block h-full w-full bg-white"
              animate={{ y: ["-100%", "100%"] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </span>
      </motion.button>
    </section>
  );
}
