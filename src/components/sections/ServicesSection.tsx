"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainImage } from "@/components/motion/CurtainImage";
import { SERVICES, waLink } from "@/lib/data/catalog";
import { useUI } from "@/store/ui-store";
import { scrollToId } from "@/lib/scroll";

/**
 * SERVICIOS — 6 servicios con imagen, descripción y CTA.
 */
export function ServicesSection() {
  const openAppointment = useUI((s) => s.openAppointment);

  const handleCta = (cta: string) => {
    if (cta === "appointment") {
      openAppointment("services");
    }
  };

  return (
    <section
      id="servicios"
      aria-label="Servicios"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <Container>
        <SectionTitle
          kicker="Todo en un solo lugar"
          title="SERVICIOS"
          description="De la evaluación a los lentes terminados: salud visual completa con atención cercana."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.08} className="h-full">
              <article className="group flex h-full flex-col border border-black/8 bg-white transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CurtainImage
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="absolute left-4 top-4 bg-white/90 px-2.5 py-1 font-display text-xs font-extrabold tracking-[0.2em] text-ink backdrop-blur-sm"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-neutral-600">
                    {s.description}
                  </p>
                  {s.slug === "armazones" ? (
                    <button
                      type="button"
                      onClick={() => scrollToId("#armazones")}
                      data-cursor="click"
                      className="mt-5 inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink underline decoration-brand underline-offset-4 transition-colors hover:text-brand"
                    >
                      Ver armazones
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  ) : s.cta === "whatsapp" ? (
                    <a
                      href={waLink(
                        `Hola, quiero información sobre ${s.title.toLowerCase()} en Quiero Lentes.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="open"
                      className="mt-5 inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink underline decoration-brand underline-offset-4 transition-colors hover:text-brand"
                    >
                      Más información
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCta(s.cta)}
                      data-cursor="click"
                      className="mt-5 inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink underline decoration-brand underline-offset-4 transition-colors hover:text-brand"
                    >
                      Agendar
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
