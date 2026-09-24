"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { getProduct, PRODUCTS, type Product } from "@/lib/data/catalog";
import { formatMXN } from "@/lib/format";
import { useUI, useBodyScrollLock } from "@/store/ui-store";
import { useCart } from "@/store/cart-store";
import { ProductCard } from "@/components/product/ProductCard";
import { waLink } from "@/lib/data/catalog";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* VISTA DE PRODUCTO (overlay a pantalla completa estilo app).         */
/* Arquitectura lista para extraerse a /producto/[slug] como ruta.     */
/* ------------------------------------------------------------------ */

function relatedFor(product: Product): Product[] {
  return PRODUCTS.filter((p) => p.slug !== product.slug)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 3;
      if (p.brand === product.brand) score += 2;
      if (p.shape === product.shape) score += 2;
      if (p.color.name === product.color.name) score += 1;
      if (Math.abs(p.price - product.price) <= 500) score += 1;
      if (p.audience === product.audience) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.p);
}

export function ProductDetailOverlay() {
  const slug = useUI((s) => s.activeProductSlug);
  const closeProduct = useUI((s) => s.closeProduct);
  const openAppointment = useUI((s) => s.openAppointment);
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  useBodyScrollLock(!!slug);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = useMemo(() => (slug ? getProduct(slug) : undefined), [slug]);
  const related = useMemo(
    () => (product ? relatedFor(product) : []),
    [product]
  );

  // Reset al cambiar de producto (patrón de ajuste de estado en render)
  const [prevSlug, setPrevSlug] = useState(slug);
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    setImgIndex(0);
    setQty(1);
    setAdded(false);
  }

  // Scroll al inicio cuando cambia el producto (solo manipulación de DOM)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProduct();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProduct]);

  const handleBuy = () => {
    if (!product) return;
    add(product.slug, qty);
    setAdded(true);
    setTimeout(() => {
      setCartOpen(true);
      setAdded(false);
    }, 550);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="product-view"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="fixed inset-0 z-[70] bg-white"
          role="dialog"
          aria-modal="true"
          aria-label={`Producto: ${product.brand} ${product.name}`}
        >
          {/* Barra superior */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-black/5 bg-white/90 px-4 backdrop-blur-md sm:px-6">
            <button
              type="button"
              onClick={closeProduct}
              data-cursor="click"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Volver
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
              {product.brand}
            </p>
            <button
              type="button"
              onClick={closeProduct}
              aria-label="Cerrar producto"
              data-cursor="click"
              className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-black/5 hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="h-full overflow-y-auto pt-14">
            <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
              {/* ---------------- IZQUIERDA: galería / 3D ---------------- */}
              <div>
                <div className="relative aspect-square w-full overflow-hidden bg-[#f4f3f1]">
                  <img
                    src={product.images[imgIndex]}
                    alt={`${product.brand} ${product.name} — ${product.shape.toLowerCase()}, color ${product.color.name}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (
                        e.currentTarget as HTMLImageElement
                      ).style.visibility = "hidden";
                    }}
                  />
                  {product.isNew && (
                    <span className="absolute left-3 top-3 bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      Nuevo
                    </span>
                  )}
                </div>

                {/* Thumbs */}
                <div className="mt-3 flex gap-3">
                  {product.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      aria-label={`Ver imagen ${i + 1}`}
                      onClick={() => setImgIndex(i)}
                      data-cursor="click"
                      className={cn(
                        "h-20 w-20 overflow-hidden border-2 bg-[#f4f3f1] transition-colors",
                        imgIndex === i
                          ? "border-ink"
                          : "border-transparent hover:border-black/20"
                      )}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (
                            e.currentTarget as HTMLImageElement
                          ).style.visibility = "hidden";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* ---------------- DERECHA: información ---------------- */}
              <div className="lg:pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  {product.brand}
                </p>
                <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-ink sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-2xl font-semibold text-ink">
                  {formatMXN(product.price)}
                  <span className="ml-2 align-middle text-xs font-normal text-neutral-400">
                    MXN
                  </span>
                </p>

                <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600">
                  {product.description}
                </p>

                {/* Color */}
                <div className="mt-6 flex items-center gap-2.5">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-black/10"
                    style={{ backgroundColor: product.color.hex }}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-ink">
                    Color: {product.color.name}
                  </span>
                </div>

                {/* Especificaciones */}
                <dl className="mt-6 grid grid-cols-2 gap-px border border-black/8 bg-black/8 text-sm">
                  {[
                    ["Forma", product.shape],
                    ["Material", product.material],
                    ["Tamaño", product.size],
                    [
                      "Disponibilidad",
                      product.stock === "disponible"
                        ? "En tienda"
                        : product.stock === "bajo"
                          ? "Últimas piezas"
                          : "Agotado",
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white p-3.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        {k}
                      </dt>
                      <dd className="mt-1 font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* Cantidad + CTA */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <div className="flex h-12 items-center border border-black/15">
                    <button
                      type="button"
                      aria-label="Disminuir cantidad"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-full w-11 items-center justify-center text-neutral-600 transition-colors hover:bg-black/5"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-semibold" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar cantidad"
                      onClick={() => setQty((q) => Math.min(9, q + 1))}
                      className="flex h-full w-11 items-center justify-center text-neutral-600 transition-colors hover:bg-black/5"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={product.stock === "agotado"}
                    data-cursor="click"
                    className={cn(
                      "inline-flex h-12 flex-1 min-w-48 items-center justify-center gap-2 px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors",
                      product.stock === "agotado"
                        ? "cursor-not-allowed bg-neutral-300"
                        : added
                          ? "bg-ink"
                          : "bg-brand hover:bg-brand-strong"
                    )}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden /> Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" aria-hidden /> Comprar
                        ahora
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openAppointment("services")}
                  data-cursor="click"
                  className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 border border-ink px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-white sm:w-auto sm:min-w-64"
                >
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  Agendar examen
                </button>

                <a
                  href={waLink(
                    `Hola, quiero información sobre este armazón: ${product.brand} ${product.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="open"
                  className="mt-5 block text-sm text-neutral-500 underline decoration-brand/50 underline-offset-4 transition-colors hover:text-brand"
                >
                  ¿Dudas? Escríbenos por WhatsApp
                </a>

                {/* Features */}
                <ul className="mt-8 space-y-2.5 border-t border-black/5 pt-6">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-neutral-600"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---------------- TAMBIÉN PODRÍA GUSTARTE ---------------- */}
            {related.length > 0 && (
              <section
                aria-label="Productos relacionados"
                className="border-t border-black/5 bg-paper py-14 md:py-20"
              >
                <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
                    También podría gustarte
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    Recomendaciones por categoría, forma, color y precio.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-7 lg:grid-cols-4">
                    {related.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
