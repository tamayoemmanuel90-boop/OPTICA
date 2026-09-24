"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/data/catalog";
import { formatMXN } from "@/lib/format";
import { useUI } from "@/store/ui-store";
import { EASE_OUT } from "@/lib/motion";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * Product card editorial:
 * hover → cambio de imagen + zoom ligero + CTA. Click en toda la tarjeta
 * abre la vista de producto. Fallback elegante si falta la imagen.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const openProduct = useUI((s) => s.openProduct);
  const [errMain, setErrMain] = useState(false);
  const [errAlt, setErrAlt] = useState(false);

  const open = () => openProduct(product.slug);
  const bothFailed = errMain && errAlt;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="group relative flex flex-col"
      data-cursor="view"
      onClick={open}
    >
      {/* Imagen — tilt 3D + brillo especular que sigue al cursor */}
      <TiltCard max={6} className="w-full">
        <div className="relative aspect-square w-full overflow-hidden bg-[#f4f3f1]">
        {bothFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="font-display text-2xl font-extrabold tracking-[0.2em] text-neutral-300">
              QL
            </span>
            <span className="px-4 text-xs text-neutral-400">
              {product.brand} {product.name}
            </span>
          </div>
        ) : (
          <>
            <img
              src={product.images[0]}
              alt={`${product.brand} ${product.name} — armazón ${product.shape.toLowerCase()} en color ${product.color.name}`}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              onError={() => setErrMain(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-0",
                errMain && "hidden"
              )}
            />
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              onError={() => setErrAlt(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100",
                errAlt && "hidden"
              )}
            />
          </>
        )}

        {product.isNew && (
          <span className="absolute left-3 top-3 bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            Nuevo
          </span>
        )}
        {product.stock === "bajo" && (
          <span className="absolute right-3 top-3 bg-ink/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            Últimas piezas
          </span>
        )}

        {/* CTA hover (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <span className="flex h-11 items-center justify-center bg-ink text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Ver producto
          </span>
        </div>
        </div>
      </TiltCard>

      {/* Información */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {product.brand}
          </p>
          <h3 className="mt-1 truncate font-display text-lg font-bold leading-tight text-ink">
            {product.name}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: product.color.hex }}
              aria-hidden
            />
            <span className="truncate">
              {product.shape} · {product.material} · {product.color.name}
            </span>
          </p>
        </div>
        <p className="whitespace-nowrap text-sm font-semibold text-ink">
          {formatMXN(product.price)}
        </p>
      </div>

      {/* Acceso por teclado / lectores de pantalla */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
        className="mt-3 inline-flex w-fit items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ink underline decoration-brand underline-offset-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        Ver producto
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </motion.article>
  );
}
