"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProductViewer3D } from "@/components/three/ProductViewer3D";
import { useUI } from "@/store/ui-store";
import { getProduct } from "@/lib/data/catalog";

const HIGHLIGHTS = [
  { n: "01", title: "Diseño", text: "Siluetas contemporáneas con acabados impecables." },
  { n: "02", title: "Comodidad", text: "Ligereza y ajuste pensado para todo el día." },
  { n: "03", title: "Protección", text: "Materiales resistentes y lentes de calidad." },
  { n: "04", title: "Personalización", text: "Gradúalos a tu medida con tratamientos a tu estilo." },
];

/**
 * "DISEÑO QUE SE VE" — producto 3D destacado con textos alrededor.
 * El modelo rota con el scroll, responde al mouse y tiene iluminación PBR.
 */
export function Featured3DSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const openProduct = useUI((s) => s.openProduct);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const featured = getProduct("nordik-aurora");

  return (
    <section
      id="diseno"
      ref={sectionRef}
      aria-label="Experiencia 3D del producto destacado"
      className="relative overflow-hidden bg-ink py-20 text-white md:py-28 lg:py-32"
    >
      {/* Acento rojo ambiental */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-brand/15 blur-[140px]"
      />

      <Container>
        <SectionTitle
          align="center"
          dark
          kicker="Experiencia 3D"
          title="DISEÑO QUE SE VE"
          description="Explora el armazón como si lo tuvieras en tus manos: gíralo con tu cursor, descubre cada detalle y la calidad de sus materiales."
        />

        <div className="relative mx-auto mt-8 max-w-4xl">
          {/* Etiquetas flotantes desktop */}
          <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden>
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.7 }}
                className={
                  i === 0
                    ? "absolute left-0 top-10 max-w-44"
                    : i === 1
                      ? "absolute right-0 top-16 max-w-44 text-right"
                      : i === 2
                        ? "absolute bottom-16 left-0 max-w-44"
                        : "absolute bottom-6 right-0 max-w-44 text-right"
                }
              >
                <p className="font-display text-3xl font-extrabold text-brand">
                  {h.n}
                </p>
                <p className="mt-1 font-display text-lg font-bold uppercase tracking-wide">
                  {h.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  {h.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Escena 3D */}
          <div className="h-[380px] w-full sm:h-[460px] lg:h-[540px]">
            <ProductViewer3D
              kind="glasses"
              fallbackImage={
                featured
                  ? featured.images[0]
                  : "/images/sections/hero-poster.png"
              }
              alt="NORDVIK Aurora — armazón destacado"
              scrollProgress={scrollYProgress}
            />
          </div>

          {/* Highlights móvil/tablet */}
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 lg:hidden">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.n} delay={i * 0.08}>
                <p className="font-display text-2xl font-extrabold text-brand">
                  {h.n}
                </p>
                <p className="mt-0.5 font-display text-base font-bold uppercase tracking-wide">
                  {h.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  {h.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => openProduct("nordik-aurora")}
            data-cursor="click"
            className="inline-flex h-12 items-center justify-center bg-white px-8 text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-brand hover:text-white"
          >
            Ver producto destacado
          </button>
        </Reveal>
      </Container>
    </section>
  );
}
