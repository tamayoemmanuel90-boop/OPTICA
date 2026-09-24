"use client";

import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { TESTIMONIALS } from "@/lib/data/catalog";

/**
 * Testimonios — carrusel suave.
 * ⚠️ PLACEHOLDERS: los textos son de demostración, claramente
 * identificados, hasta contar con testimonios reales del cliente.
 */
export function TestimonialsSection() {
  return (
    <section
      id="testimonios"
      aria-label="Testimonios de clientes"
      className="bg-paper py-20 md:py-28"
    >
      <Container>
        <SectionTitle
          align="center"
          kicker="Comunidad QL"
          title="LO QUE DICEN NUESTROS CLIENTES"
        />

        <Reveal delay={0.15} className="relative mx-auto mt-12 max-w-4xl">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
            aria-roledescription="carrusel"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {TESTIMONIALS.map((t) => (
                <CarouselItem
                  key={t.name}
                  className="pl-4 md:basis-1/2 md:pl-6 lg:basis-1/3"
                >
                  <article className="flex h-full flex-col border border-black/8 bg-white p-7">
                    <Quote
                      className="h-6 w-6 text-brand/30"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div
                      className="mt-4 flex gap-0.5"
                      aria-label={`Calificación: ${t.rating} de 5 estrellas`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < t.rating
                              ? "h-4 w-4 fill-brand text-brand"
                              : "h-4 w-4 text-neutral-300"
                          }
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">
                      {t.text}
                    </p>
                    <p className="mt-5 font-display text-sm font-bold uppercase tracking-wide text-ink">
                      {t.name}
                    </p>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </Reveal>

        <p className="mt-8 text-center text-xs text-neutral-400">
          Testimonios de demostración — pendientes de reemplazar por
          testimonios reales del cliente.
        </p>
      </Container>
    </section>
  );
}
