"use client";

import { useState } from "react";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainImage } from "@/components/motion/CurtainImage";
import {
  FRAMES_SHOWCASE,
  FRAME_CATEGORIES,
  waLink,
  WHATSAPP_MESSAGES,
  type FrameCategoryKey,
} from "@/lib/data/catalog";
import { useUI } from "@/store/ui-store";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/* Retratos editoriales — fotografía de campaña premium (mano izquierda) */
const EDITORIAL_PORTRAITS = [
  {
    src: "/images/sections/editorial-1.jpg",
    alt: "Hombre con armazón rectangular de acetato negro",
  },
  {
    src: "/images/sections/editorial-2.jpg",
    alt: "Mujer con gafas de sol oversize negras",
  },
  {
    src: "/images/sections/editorial-3.jpg",
    alt: "Hombre con armazón redondo de metal fino",
  },
] as const;

/* Tarjetas de categoría — conducen a la galería de modelos */
const CATEGORY_CARDS = [
  { label: "Mujer", image: "/images/sections/cat-mujer.jpg" },
  { label: "Hombre", image: "/images/sections/cat-hombre.jpg" },
  { label: "Unisex", image: "/images/sections/cat-unisex.jpg" },
] as const;

/**
 * ARMAZONES Y GAFAS — sección comercial principal (prioridad #1).
 * Layout editorial tipo campaña: texto a la izquierda, retratos grandes al
 * centro y tarjetas de categoría (Mujer / Hombre / Unisex) a la derecha.
 * Debajo, la galería de modelos con filtros. Conversión real por WhatsApp.
 */
export function FramesShowcaseSection() {
  const [category, setCategory] = useState<FrameCategoryKey>("todos");
  const openAppointment = useUI((s) => s.openAppointment);

  const visible =
    category === "todos"
      ? FRAMES_SHOWCASE
      : FRAMES_SHOWCASE.filter((f) => f.category === category);

  return (
    <section
      id="armazones"
      aria-label="Armazones y gafas"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <Container>
        {/* --------------------- BANNER EDITORIAL --------------------- */}
        <div className="grid gap-10 lg:grid-cols-[minmax(250px,320px)_1fr] lg:gap-12 xl:grid-cols-[minmax(250px,320px)_1fr_230px] xl:gap-8">
          {/* Texto */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="kicker text-brand">Gafas y armazones</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-balance font-display text-[1.7rem] font-extrabold uppercase leading-[1.1] tracking-tight text-ink sm:text-[2rem] xl:text-[2.1rem]">
                Estilo que te acompaña en cada momento
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
                Descubre nuestra colección de gafas y armazones de las mejores
                marcas y diseños. Modernos, clásicos y deportivos, para todos
                los estilos.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row xl:flex-col">
              <button
                type="button"
                onClick={() => scrollToId("#modelos")}
                data-cursor="click"
                className="inline-flex h-12 items-center justify-center gap-2.5 bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Comprar ahora
              </button>
              <a
                href={waLink(WHATSAPP_MESSAGES.quote)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="open"
                className="inline-flex h-12 items-center justify-center gap-2.5 border border-ink px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Cotizar
              </a>
            </Reveal>
          </div>

          {/* Retratos editoriales grandes */}
          <Reveal delay={0.12}>
            <div
              aria-label="Fotografía editorial de la colección"
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 lg:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {EDITORIAL_PORTRAITS.map((p) => (
                <figure
                  key={p.src}
                  className="group relative w-[74%] shrink-0 snap-start sm:w-[58%] md:w-auto"
                >
                  <CurtainImage
                    src={p.src}
                    alt={p.alt}
                    className="aspect-[3/4] w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </figure>
              ))}
            </div>
          </Reveal>

          {/* Tarjetas de categoría */}
          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2 xl:col-span-1 xl:grid-cols-1">
            {CATEGORY_CARDS.map((c, i) => (
              <Reveal key={c.label} delay={0.16 + i * 0.08} className="h-full">
                <button
                  type="button"
                  onClick={() => scrollToId("#modelos")}
                  data-cursor="click"
                  aria-label={`Ver modelos para ${c.label.toLowerCase()}`}
                  className="group relative flex h-full min-h-[110px] w-full items-end overflow-hidden text-left"
                >
                  <CurtainImage
                    src={c.image}
                    alt={`Colección para ${c.label.toLowerCase()}`}
                    delay={0.16 + i * 0.08}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
                  />
                  <span className="relative z-10 flex w-full items-center justify-between gap-3 px-4 pb-3.5 text-white">
                    <span className="font-display text-sm font-bold uppercase tracking-[0.12em]">
                      {c.label}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---------------------------- GALERÍA ---------------------------- */}
        <div id="modelos" className="mt-24 scroll-mt-24 md:mt-32">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
                Modelos destacados<span className="text-brand">.</span>
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
                Una muestra de los estilos que te esperan en tienda. Colores,
                tallas y disponibilidad exactos se confirman al cotizar.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div
                role="group"
                aria-label="Filtrar modelos por categoría"
                className="flex flex-wrap gap-2"
              >
                {FRAME_CATEGORIES.map((c) => {
                  const active = category === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(c.key)}
                      data-cursor="click"
                      className={cn(
                        "h-9 border px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-black/15 bg-white text-neutral-600 hover:border-ink hover:text-ink"
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-8">
            {visible.map((f, i) => (
              <li key={f.slug}>
                <Reveal delay={(i % 4) * 0.07} className="h-full">
                  <article className="group flex h-full flex-col">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#efece7]">
                      <CurtainImage
                        src={f.image}
                        alt={`Armazón ${f.label.toLowerCase()} — referencia de la selección`}
                        className="h-full w-full"
                        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <span
                        className={cn(
                          "absolute left-3.5 top-3.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
                          f.category === "solar"
                            ? "bg-ink text-white"
                            : "border border-black/10 bg-white/90 text-ink backdrop-blur-sm"
                        )}
                      >
                        {f.category === "solar" ? "Gafas de sol" : "Oftálmico"}
                      </span>
                    </div>
                    <div className="mt-3.5 flex items-center justify-between gap-3">
                      <h4 className="font-display text-[13px] font-bold uppercase leading-tight tracking-wide text-ink">
                        {f.label}
                      </h4>
                      <a
                        href={waLink(WHATSAPP_MESSAGES.quoteFrame(f.label))}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="open"
                        aria-label={`Cotizar armazón ${f.label} por WhatsApp`}
                        className="shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-ink underline decoration-brand underline-offset-4 transition-colors hover:text-brand"
                      >
                        Cotizar
                      </a>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-xs leading-relaxed text-neutral-400">
              Imágenes de referencia de nuestra selección. Los modelos exactos,
              colores y precios varían en tienda: cotiza por WhatsApp o
              visítanos y te asesoramos.
            </p>
          </Reveal>
        </div>

        {/* --------------------------- CIERRE CTA --------------------------- */}
        <Reveal className="mt-16 md:mt-20">
          <div className="flex flex-col gap-7 bg-ink px-6 py-10 text-white md:flex-row md:items-center md:justify-between md:gap-10 md:px-12 md:py-12">
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
                ¿Encontraste tu estilo<span className="text-brand">?</span>
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
                Cotiza por WhatsApp, agenda tu examen de la vista y estrena
                tus lentes completos en menos de una semana.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <a
                href={waLink(WHATSAPP_MESSAGES.buy)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="click"
                className="inline-flex h-12 items-center justify-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                Comprar ahora
              </a>
              <button
                type="button"
                onClick={() => openAppointment("services")}
                data-cursor="click"
                className="inline-flex h-12 items-center justify-center border border-white/50 px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                Agendar examen de la vista
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
