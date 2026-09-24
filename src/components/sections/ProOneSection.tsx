"use client";

import { ArrowRight, Eye, ShieldCheck, Sun } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainImage } from "@/components/motion/CurtainImage";
import { waLink, WHATSAPP_MESSAGES } from "@/lib/data/catalog";

const BENEFITS = [
  {
    Icon: Eye,
    title: "Mayor comodidad visual",
    text: "Visión nítida y natural en todas las distancias.",
  },
  {
    Icon: ShieldCheck,
    title: "Protección para tus ojos",
    text: "Filtran la luz azul y protegen de los rayos UV.",
  },
  {
    Icon: Sun,
    title: "Diseñados para tu día a día",
    text: "Tecnología avanzada, mayor durabilidad.",
  },
] as const;

/**
 * LENTES OFTÁLMICOS — monofocales y progresivos PRO-ONE (última parada
 * comercial). Layout de referencia: imagen del lente a la izquierda,
 * contenido con bullets e íconos rojos al centro y panel PRO-ONE con
 * CTA «Cotizar» a la derecha, con divisores verticales.
 */
export function ProOneSection() {
  return (
    <section
      id="lentes"
      aria-label="Lentes PRO-ONE monofocales y progresivos"
      className="bg-paper py-20 md:py-28 lg:py-32"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
          {/* Imagen del lente */}
          <Reveal className="lg:col-span-4">
            <figure className="relative flex h-full min-h-[300px] items-center overflow-hidden bg-gradient-to-b from-white to-[#eae7e1] lg:min-h-[500px]">
              <CurtainImage
                src="/images/sections/lens-proone.jpg"
                alt="Lente oftálmico PRO-ONE con recubrimiento antirreflejo iridiscente"
                className="h-full w-full"
                imgClassName="object-cover"
              />
              <figcaption className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                PRO-ONE
              </figcaption>
            </figure>
          </Reveal>

          {/* Contenido */}
          <div className="flex flex-col justify-center lg:col-span-5 lg:pl-12 lg:pr-6">
            <Reveal>
              <p className="kicker text-brand">Lentes oftálmicos</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.06] tracking-tight text-ink sm:text-4xl xl:text-[2.45rem]">
                Monofocales y
                <br className="hidden sm:block" /> progresivos PRO-ONE
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base">
                Lentes diseñados con precisión digital para acompañarte en
                cada distancia, con una transición suave y natural.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-6">
              {BENEFITS.map((b, i) => (
                <li key={b.title}>
                  <Reveal delay={0.18 + i * 0.1}>
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-white">
                        <b.Icon
                          className="h-5 w-5 text-brand"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </span>
                      <div className="pt-0.5">
                        <h3 className="font-display text-[15px] font-bold leading-tight text-ink">
                          {b.title}
                        </h3>
                        <p className="mt-1 max-w-sm text-sm leading-snug text-neutral-500">
                          {b.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel PRO-ONE */}
          <div className="flex flex-col justify-center lg:col-span-3 lg:border-l lg:border-black/10 lg:pl-12">
            <Reveal delay={0.2}>
              <p
                aria-hidden
                className="font-display text-[2rem] font-black leading-none tracking-[0.14em] text-ink sm:text-3xl"
              >
                PRO·ONE
              </p>
              <span className="sr-only">PRO-ONE</span>
              <p className="mt-4 max-w-[24ch] text-sm leading-relaxed text-neutral-600">
                Lentes de alto rendimiento para una visión más clara.
              </p>
              <a
                href={waLink(WHATSAPP_MESSAGES.proOne)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="click"
                className="group mt-7 inline-flex h-12 w-full max-w-[220px] items-center justify-center gap-2.5 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong sm:w-auto"
              >
                Cotizar
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
