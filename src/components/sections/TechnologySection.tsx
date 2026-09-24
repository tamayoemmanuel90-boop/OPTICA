"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainImage } from "@/components/motion/CurtainImage";
import { scrollToId } from "@/lib/scroll";

const TECH_CARDS = [
  {
    image: "/images/sections/tech-equipos.jpg",
    alt: "Equipo digital de diagnóstico óptico",
    title: "Equipos de diagnóstico",
    sub: "Precisión en cada análisis",
    href: "#vision",
  },
  {
    image: "/images/sections/tech-digital.jpg",
    alt: "Detalle de iris con tecnología digital",
    title: "Tecnología digital",
    sub: "Resultados más confiables",
    href: "#vision",
  },
  {
    image: "/images/sections/tech-lentes.jpg",
    alt: "Lente oftálmico con recubrimiento antirreflejo",
    title: "Adaptación de lentes",
    sub: "Comodidad y claridad",
    href: "#lentes",
  },
] as const;

/**
 * TECNOLOGÍA Y EQUIPOS — prioridad #3 del recorrido comercial.
 * Layout de referencia: encabezado y CTA a la izquierda, tres tarjetas
 * visuales a la derecha (imagen + título + subtítulo + flecha). Cada
 * tarjeta conduce a una sección real del recorrido.
 */
export function TechnologySection() {
  return (
    <section
      id="tecnologia"
      aria-label="Tecnología y equipos ópticos"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Encabezado */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="kicker text-brand">Tecnología y equipos</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.06] tracking-tight text-ink sm:text-4xl xl:text-[2.55rem]">
                Tecnología de
                <br className="hidden sm:block" /> última generación
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
                Contamos con equipos ópticos de alta precisión y tecnología
                avanzada para un diagnóstico confiable y un mejor cuidado
                visual.
              </p>
            </Reveal>
            <Reveal delay={0.24} className="mt-8">
              <button
                type="button"
                onClick={() => scrollToId("#lentes")}
                data-cursor="click"
                className="group inline-flex h-12 items-center justify-center gap-2.5 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                Conoce más
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </button>
            </Reveal>
          </div>

          {/* Tarjetas visuales */}
          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {TECH_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={0.1 + i * 0.08} className="h-full">
                <button
                  type="button"
                  onClick={() => scrollToId(card.href)}
                  data-cursor="click"
                  aria-label={`${card.title}: ${card.sub}`}
                  className="group flex h-full w-full flex-col border border-black/8 bg-white text-left transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.28)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <CurtainImage
                      src={card.image}
                      alt={card.alt}
                      delay={0.1 + i * 0.08}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 p-4 md:p-5">
                    <div>
                      <h3 className="font-display text-sm font-bold uppercase leading-tight tracking-wide text-ink">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs leading-snug text-neutral-500">
                        {card.sub}
                      </p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
