"use client";

import { Heart, Glasses, ShieldCheck, Handshake } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { BRAND } from "@/config/site";

/**
 * FRANJA DE CONFIANZA — los 4 pilares oficiales del Manual de Identidad
 * (Salud Visual · Estilo · Tecnología · Confianza) en formato compacto:
 * ícono + título + texto, con divisores verticales.
 */
const PILLAR_ICONS = {
  "salud-visual": Heart,
  estilo: Glasses,
  tecnologia: ShieldCheck,
  confianza: Handshake,
} as const;

export function BenefitsSection() {
  return (
    <section
      aria-label="Esencia de marca"
      className="border-y border-black/5 bg-white"
    >
      <Container>
        <ul className="grid grid-cols-1 divide-y divide-black/5 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {BRAND.pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[p.key as keyof typeof PILLAR_ICONS];
            return (
              <li key={p.key} className="group">
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="flex h-full items-center gap-4 px-2 py-6 transition-colors duration-500 sm:px-4 lg:px-5 lg:py-8">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                      <Icon
                        className="h-8 w-8 text-ink transition-colors duration-500 group-hover:text-brand"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-wide text-ink">
                        {p.label}
                      </h3>
                      <p className="mt-1 text-xs leading-snug text-neutral-500">
                        {p.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
