"use client";

import { Award, HandHeart, Cpu, Users } from "lucide-react";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { CurtainImage } from "@/components/motion/CurtainImage";
import { Counter } from "@/components/motion/Counter";
import { SERVICES } from "@/lib/data/catalog";

const VALUES = [
  { Icon: Award, title: "Experiencia", text: "Más de una década cuidando la visión de familias queretanas." },
  { Icon: Users, title: "Profesionalismo", text: "Atención especializada en cada paso del proceso." },
  { Icon: Cpu, title: "Tecnología", text: "Equipos digitales para diagnósticos precisos." },
  { Icon: HandHeart, title: "Cercanía", text: "Te tratamos como lo que eres: parte de la familia QL." },
];

/**
 * "MÁS QUE UNA ÓPTICA" — historia desde 2007 con layout editorial,
 * contadores animados, revelados de cortina y parallax.
 */
export function AboutSection() {
  const years = new Date().getFullYear() - 2007;

  return (
    <section
      id="nosotros"
      aria-label="Nosotros — Más que una óptica"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Texto */}
          <div>
            <SectionTitle
              kicker="Desde 2007 · Querétaro"
              title="MÁS QUE UNA ÓPTICA."
              description={`Hace ${years} años abrimos nuestras puertas en el centro de Querétaro con una idea simple: que ver mejor debería también significar verte mejor.`}
            />

            <Reveal delay={0.2}>
              <div className="mt-8 space-y-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                <p>
                  Desde entonces hemos combinado <strong className="font-semibold text-ink">salud
                  visual</strong> con <strong className="font-semibold text-ink">diseño</strong>: examen de
                  la vista profesional, tecnología óptica avanzada y una
                  curaduría de armazones para cada personalidad.
                </p>
                <p>
                  No creemos en recetas apresuradas ni en ventas de mostrador.
                  Creemos en conversar, conocer cómo ves el mundo y encontrar —
                  contigo — la mejor forma de verlo.
                </p>
              </div>
            </Reveal>

            {/* Cifras con contadores animados */}
            <Reveal delay={0.25}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-black/5 py-7 sm:gap-6">
                <div>
                  <dd className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
                    <Counter to={years} suffix="+" />
                  </dd>
                  <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Años cuidando tu visión
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-4xl font-extrabold tracking-tight text-brand md:text-5xl">
                    <Counter to={2007} />
                  </dd>
                  <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Año de fundación
                  </dt>
                </div>
                <div>
                  <dd className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
                    <Counter to={SERVICES.length} />
                  </dd>
                  <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Servicios especializados
                  </dt>
                </div>
              </dl>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={0.1 + i * 0.08}>
                  <div className="group border-l-2 border-brand/70 pl-4 transition-colors hover:border-brand">
                    <v.Icon className="h-5 w-5 text-brand transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.75} aria-hidden />
                    <h3 className="mt-2 font-display text-base font-extrabold uppercase tracking-wide text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      {v.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Imágenes editoriales: revelado de cortina + parallax */}
          <div className="relative">
            <Parallax from={30} to={-30}>
              <CurtainImage
                src="/images/sections/about-store.jpg"
                alt="Interior de la óptica Quiero Lentes en Querétaro"
                className="relative aspect-[4/3] w-full"
              />
            </Parallax>
            <Parallax from={-20} to={30} className="-mt-16 ml-auto w-3/5">
              <CurtainImage
                src="/images/sections/about-craft.jpg"
                alt="Ajuste de precisión de un armazón en el taller"
                delay={0.15}
                className="relative aspect-[3/4] border-8 border-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
              />
            </Parallax>
            <Reveal delay={0.25} className="mt-8">
              <p className="font-serif text-2xl italic leading-snug text-ink md:text-3xl">
                «Ver mejor es salud.
                <br />
                Verte mejor es identidad.»
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
