"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/lib/data/catalog";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ProductFilters,
  EMPTY_FILTERS,
  type FilterState,
} from "@/components/product/ProductFilters";

/**
 * Sección catálogo: "ENCUENTRA TU PRÓXIMO ARMAZÓN".
 * Galería premium + filtros + búsqueda, con transiciones de layout.
 */
export function CatalogSection() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (q) {
        const hay =
          `${p.name} ${p.brand} ${p.shape} ${p.material} ${p.color.name} ` +
          `${p.category === "oftalmico" ? "oftalmicos oftálmicos oftálmico" : "solares solar"} ` +
          `${p.audience}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.audience.length && !filters.audience.includes(p.audience))
        return false;
      if (filters.category.length && !filters.category.includes(p.category))
        return false;
      if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
      if (filters.shape.length && !filters.shape.includes(p.shape)) return false;
      if (filters.material.length && !filters.material.includes(p.material))
        return false;
      if (filters.color.length && !filters.color.includes(p.color.name))
        return false;
      if (filters.price) {
        const [min, max] = filters.price.split("-").map(Number);
        if (p.price < min || p.price > max) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <section
      id="catalogo"
      aria-label="Catálogo de armazones"
      className="bg-paper py-20 md:py-28 lg:py-32"
    >
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            kicker="Colección"
            title="ENCUENTRA TU PRÓXIMO ARMAZÓN"
            description="Encuentra el estilo que se adapta a ti."
          />
          <Reveal delay={0.2} className="shrink-0">
            <p className="text-xs text-neutral-400">
              Catálogo de demostración — próximamente conectado a inventario.
            </p>
          </Reveal>
        </div>

        <div className="mt-10">
          <ProductFilters
            value={filters}
            onChange={setFilters}
            count={filtered.length}
          />
        </div>

        <div className="mt-10 md:mt-12">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-display text-2xl font-bold text-ink">
                No encontramos armazones con esos filtros
              </p>
              <p className="max-w-md text-sm text-neutral-500">
                Prueba con otra búsqueda o limpia los filtros para ver toda la
                colección.
              </p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-2 h-11 bg-ink px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-7 lg:grid-cols-3 lg:gap-y-14 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCard key={p.slug} product={p} priority={i < 4} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
