import { Marquee } from "@/components/motion/Marquee";
import { BRANDS_FEATURED, BRANDS_OTHER, type BrandLogo } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

/**
 * CARRUSEL DE MARCAS OFICIALES — banda negra inmediatamente después del hero
 * (continuidad con el video). «Marcas que manejamos»:
 * · Fila 1 — las 5 marcas más reconocidas, MÁS GRANDES y de primeros.
 * · Fila 2 — el resto del portafolio, más pequeño y en contramarcha.
 * Los PNG son wordmarks BLANCOS sobre transparente; las marcas sin archivo
 * se muestran como wordmark tipográfico (también en blanco). Loop infinito
 * con pausa al hover y contenido visible con reduced-motion.
 */

function repeated<T>(items: readonly T[], times: number): T[] {
  return Array.from({ length: times }, () => items).flat();
}

function BrandItem({ brand, size }: { brand: BrandLogo; size: "lg" | "sm" }) {
  const big = size === "lg";
  return (
    <span
      className={cn(
        "flex shrink-0 select-none items-center",
        big ? "px-9 sm:px-12" : "px-6 sm:px-9"
      )}
    >
      {brand.image ? (
        <img
          src={brand.image}
          alt={brand.name}
          draggable={false}
          loading="eager"
          className={cn(
            "w-auto object-contain transition-opacity duration-300",
            big
              ? "h-8 opacity-95 sm:h-10 md:h-12"
              : "h-4 opacity-75 hover:opacity-100 sm:h-5 md:h-6"
          )}
        />
      ) : (
        <span
          className={cn(
            "whitespace-nowrap text-white transition-opacity duration-300",
            big ? "text-xl font-medium sm:text-2xl md:text-[1.65rem]" : "text-sm font-medium md:text-base",
            brand.className ?? "uppercase tracking-[0.3em]"
          )}
        >
          {brand.name}
        </span>
      )}
      {brand.tag ? (
        <span
          className={cn(
            "ml-2.5 rounded-full border border-white/25 px-2 py-0.5 font-medium uppercase text-white/70",
            big ? "text-[10px] tracking-[0.18em]" : "text-[9px] tracking-[0.16em]"
          )}
        >
          {brand.tag}
        </span>
      ) : null}
    </span>
  );
}

export function BrandLogoStrip() {
  // Repeticiones por copia: garantizan loop perfecto (-50%) en pantallas anchas.
  const featured = repeated(BRANDS_FEATURED, 3);
  const others = repeated(BRANDS_OTHER, 2);

  return (
    <section
      aria-label="Marcas que manejamos"
      className="relative z-10 overflow-hidden border-y border-white/10 bg-black py-10 md:py-14"
    >
      <div className="mb-9 flex items-center justify-center gap-4 md:mb-11">
        <span aria-hidden className="h-px w-10 bg-white/20 md:w-20" />
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.42em] text-white/55 md:text-xs">
          Marcas que manejamos
        </p>
        <span aria-hidden className="h-px w-10 bg-white/20 md:w-20" />
      </div>

      <div className="space-y-8 md:space-y-10">
        <Marquee duration={46} pauseOnHover trackClassName="items-center">
          {featured.map((brand, i) => (
            <BrandItem key={`f-${brand.name}-${i}`} brand={brand} size="lg" />
          ))}
        </Marquee>
        <Marquee duration={34} pauseOnHover reverse trackClassName="items-center">
          {others.map((brand, i) => (
            <BrandItem key={`o-${brand.name}-${i}`} brand={brand} size="sm" />
          ))}
        </Marquee>
      </div>

      {/* Fundidos laterales sobre la banda negra */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black to-transparent md:w-32"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black to-transparent md:w-32"
      />
    </section>
  );
}
