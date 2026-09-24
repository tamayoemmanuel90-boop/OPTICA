"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VolumeX } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

const TARGET_VOLUME = 0.32;
const AUDIO_SRC = "/audio/ambiente.mp3";

/** Barras de ecualizador animadas (atenuadas mientras está en silencio). */
function EqualizerBars({ pending = false }: { pending?: boolean }) {
  return (
    <span
      className={`flex h-[18px] items-end gap-[3px] transition-opacity duration-500 ${
        pending ? "opacity-40" : "opacity-100"
      }`}
      aria-hidden
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="eq-bar h-full w-[3px] rounded-full bg-brand motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  );
}

/**
 * Audio ambiental de fondo con control flotante (esquina inferior izquierda).
 *
 * Comportamiento (decisión del cliente):
 *  · Arranca automáticamente al cargar pero SIEMPRE en silencio (muted).
 *  · NUNCA se desmutea sola: ningún gesto de la página (clic, tap, tecla o
 *    scroll) le da sonido por su cuenta.
 *  · ÚNICAMENTE el botón flotante activa el sonido (y otro clic lo vuelve a
 *    silenciar). Sin persistencia: cada carga de página inicia en silencio.
 */
export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  // Espejo síncrono de `audible` para los callbacks del fade.
  const audibleRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [audible, setAudible] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const fadeTo = useCallback(
    (target: number, duration = 900, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      cancelAnimationFrame(rafRef.current);
      const start = audio.volume;
      const t0 = performance.now();
      const step = (now: number) => {
        const a = audioRef.current;
        if (!a) return;
        const p = Math.min(1, (now - t0) / duration);
        a.volume = Math.max(0, Math.min(1, start + (target - start) * p));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else onDone?.();
      };
      rafRef.current = requestAnimationFrame(step);
    },
    []
  );

  /** Activar sonido: SOLO vía clic explícito en el botón (gesto válido). */
  const activate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(rafRef.current);
    audio.muted = false;
    audibleRef.current = true;
    setAudible(true);
    setShowHint(false);
    if (audio.paused) audio.volume = 0;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(TARGET_VOLUME, 800);
      })
      .catch(() => {});
  }, [fadeTo]);

  /** Volver al silencio (fade-out corto + mute; la pista sigue girando). */
  const silence = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(rafRef.current);
    audibleRef.current = false;
    setAudible(false);
    fadeTo(0, 200, () => {
      const a = audioRef.current;
      if (a && !audibleRef.current) a.muted = true;
    });
  }, [fadeTo]);

  // Arranque automático SIEMPRE silenciado; la pista gira desde t=0.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let cancelled = false;

    audio.volume = 0;
    audio.muted = true;
    audio
      .play()
      .then(() => {
        if (!cancelled) setPlaying(true); // sonando en silencio
      })
      .catch(() => {
        // Política muy estricta: queda pausado; el botón lo activará.
      });

    // Aviso puntual de descubrimiento (solo apunta al botón, nunca auto-suena).
    const t1 = setTimeout(() => setShowHint(true), 2400);
    const t2 = setTimeout(() => setShowHint(false), 10500);
    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggle = () => {
    if (audible) silence();
    else activate();
  };

  const label = audible ? "Silenciar música ambiente" : "Activar música ambiente";

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" className="hidden" />
      {/* Aviso puntual + botón: mismo contenedor para que queden alineados */}
      <div
        className="fixed left-5 z-[55] flex items-center gap-2.5 md:left-6"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <AnimatePresence>
          {showHint && !audible && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="pointer-events-none whitespace-nowrap rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_8px_22px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md"
            >
              Activa la música aquí
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
        type="button"
        onClick={toggle}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6, ease: EASE_OUT }}
        aria-pressed={audible}
        aria-label={label}
        title={label}
        data-cursor="click"
        className="group flex h-12 items-center rounded-full border border-black/10 bg-white/85 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md transition-colors hover:bg-white"
      >
        <span className="flex h-12 w-12 items-center justify-center" aria-hidden>
          {playing ? (
            <EqualizerBars pending={!audible} />
          ) : (
            <VolumeX className="h-[18px] w-[18px] text-ink" />
          )}
        </span>
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap pr-0 text-[11px] font-bold uppercase tracking-[0.16em] text-ink opacity-0 transition-all duration-500 group-hover:pr-4 group-hover:opacity-100 md:inline">
          {audible ? "Silenciar" : "Música"}
        </span>
      </motion.button>
      </div>
    </>
  );
}
