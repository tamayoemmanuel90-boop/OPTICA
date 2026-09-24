"use client";

import { CalendarCheck, Cog, HeartPulse, UserRound } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainImage } from "@/components/motion/CurtainImage";
import { waLink, WHATSAPP_MESSAGES } from "@/lib/data/catalog";
import { useUI } from "@/store/ui-store";

const EXAM_FEATURES = [
  {
    Icon: Cog,
    title: "Diagnóstico preciso",
    text: "con equipos modernos",
  },
  {
    Icon: UserRound,
    title: "Atención profesional",
    text: "y personalizada",
  },
  {
    Icon: HeartPulse,
    title: "Prevención y cuidado",
    text: "de tu salud visual",
  },
] as const;

/**
 * EXAMEN DE LA VISTA — prioridad #2 del recorrido comercial.
 * Layout de referencia: fotografía grande a la izquierda, contenido al
 * centro y lista de atributos con íconos rojos a la derecha (bordes
 * verticales divisores). CTA real: modal de citas.
 */
export function VisionExamSection() {
  const openAppointment = useUI((s) => s.openAppointment);

  return (
    <section
      id="vision"
      aria-label="Examen de la vista de cortesía"
      className="bg-paper py-20 md:py-28 lg:py-32"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
          {/* Fotografía */}
          <Reveal className="lg:col-span-5">
            <figure className="relative h-full min-h-[300px] overflow-hidden lg:min-h-[540px]">
              <CurtainImage
                src="/images/sections/examen-vista.jpg"
                alt="Optometrista realizando un examen de la vista con equipo moderno"
                className="h-full w-full"
                loading="eager"
              />
              <figcaption className="absolute bottom-4 left-4 bg-white/90 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
                De cortesía en tienda
              </figcaption>
            </figure>
          </Reveal>

          {/* Contenido */}
          <div className="flex flex-col justify-center lg:col-span-4 lg:pl-12 lg:pr-8">
            <Reveal>
              <p className="kicker text-brand">Nuestros servicios</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.04] tracking-tight text-ink sm:text-4xl xl:text-[2.55rem]">
                Examen de la vista
              </h2>
              <p className="mt-2 font-serif text-[1.45rem] italic leading-snug text-ink sm:text-[1.6rem]">
                Tu visión, en manos de expertos.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
                Realiza tu examen visual con tecnología avanzada y un equipo
                profesional que cuida de tu salud visual, sin costo y sin
                compromiso.
              </p>
            </Reveal>
            <Reveal delay={0.24} className="mt-8">
              <button
                type="button"
                onClick={() => openAppointment("services")}
                data-cursor="click"
                className="inline-flex h-12 items-center justify-center gap-2.5 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Agendar examen de la vista
              </button>
            </Reveal>
          </div>

          {/* Atributos con íconos rojos */}
          <div className="lg:col-span-3 lg:border-l lg:border-black/10 lg:pl-12">
            <ul className="flex h-full flex-col justify-center gap-8 lg:gap-10">
              {EXAM_FEATURES.map((f, i) => (
                <li key={f.title}>
                  <Reveal delay={0.15 + i * 0.1}>
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-white">
                        <f.Icon
                          className="h-5 w-5 text-brand"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </span>
                      <div className="pt-0.5">
                        <h3 className="font-display text-[15px] font-bold leading-tight text-ink">
                          {f.title}
                        </h3>
                        <p className="mt-1 text-sm leading-snug text-neutral-500">
                          {f.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA secundaria de WhatsApp para quienes prefieren preguntar */}
        <Reveal delay={0.2}>
          <p className="mt-10 border-t border-black/5 pt-6 text-center text-xs leading-relaxed text-neutral-400">
            ¿Dudas sobre tu graduación o tratamientos?{" "}
            <a
              href={waLink(WHATSAPP_MESSAGES.services)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="font-semibold text-ink underline decoration-brand underline-offset-4 transition-colors hover:text-brand"
            >
              Escríbenos por WhatsApp
            </a>{" "}
            y te orientamos antes de tu visita.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
