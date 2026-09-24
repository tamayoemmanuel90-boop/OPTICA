"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico visual",
    text: "Evaluamos tu visión con equipos digitales y atención profesional.",
  },
  {
    n: "02",
    title: "Selección de armazón",
    text: "Te ayudamos a encontrar el armazón perfecto para ti.",
  },
  {
    n: "03",
    title: "Personalización de lentes",
    text: "Graduación precisa según tu estilo de vida y tus necesidades.",
  },
  {
    n: "04",
    title: "Tratamiento",
    text: "Antirreflejo, filtros y protecciones aplicadas con precisión.",
  },
  {
    n: "05",
    title: "Entrega",
    text: "Lentes completos en menos de una semana, listos para estrenar.",
  },
];

/**
 * "NO SOLO VENDEMOS LENTES." — recorrido de compra con línea de progreso
 * animada ligada al scroll.
 */
export function PurchaseJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experiencia"
      aria-label="Experiencia de compra"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <Container>
        <SectionTitle
          kicker="Experiencia de compra"
          title="NO SOLO VENDEMOS LENTES."
          description="Te ayudamos a encontrar la mejor forma de ver y de verte."
        />

        <div ref={sectionRef} className="relative mt-14 md:mt-16">
          {/* Línea de progreso */}
          <div
            aria-hidden
            className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-black/10 md:left-1/2"
          >
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-brand"
            />
          </div>

          <ol className="space-y-10 md:space-y-0">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className={`relative grid grid-cols-[40px_1fr] gap-4 md:grid-cols-2 md:gap-0 ${
                  i !== 0 ? "md:-mt-2 md:pt-10" : ""
                }`}
              >
                {/* Nodo */}
                <span
                  aria-hidden
                  className="relative z-10 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white font-display text-xs font-extrabold text-ink md:absolute md:left-1/2 md:-translate-x-1/2"
                >
                  {step.n}
                </span>

                <div
                  className={`pb-2 md:pb-10 ${
                    i % 2 === 0
                      ? "md:col-start-1 md:pr-16 md:text-right"
                      : "md:col-start-2 md:pl-16"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600 md:inline-block">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
