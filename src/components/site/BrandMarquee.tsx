"use client";

import { Marquee } from "@/components/motion/Marquee";
import { BRAND } from "@/config/site";

/**
 * Cinta cinética de la Esencia de Marca (Manual de Identidad):
 * Salud Visual · Estilo · Tecnología · Confianza — banda roja oficial
 * #E60012 con ligera rotación editorial.
 */
export function BrandMarquee() {
  const items = BRAND.pillars.map((p) => p.label);

  return (
    <section aria-label="Pilares de la marca" className="relative z-10 -my-5 select-none">
      <div className="rotate-[-1.1deg] scale-[1.02]">
        <Marquee
          duration={26}
          pauseOnHover
          className="border-y border-black/10 bg-brand py-3.5 shadow-[0_18px_40px_-24px_rgba(230,0,18,0.55)]"
          trackClassName="gap-0"
        >
          {items.map((label) => (
            <span key={label} className="flex items-center">
              <span className="whitespace-nowrap px-7 font-display text-sm font-extrabold uppercase tracking-[0.3em] text-white sm:text-base">
                {label}
              </span>
              <span aria-hidden className="text-white/70">
                ✦
              </span>
            </span>
          ))}
          <span className="flex items-center">
            <span className="whitespace-nowrap px-7 font-serif text-base italic text-white/90">
              Desde 2007
            </span>
            <span aria-hidden className="text-white/70">
              ✦
            </span>
          </span>
        </Marquee>
      </div>
    </section>
  );
}
