"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { PRODUCTS } from "@/lib/data/catalog";
import { formatMXN } from "@/lib/format";
import { useUI, useBodyScrollLock } from "@/store/ui-store";
import { EASE_OUT } from "@/lib/motion";

/** Modal de búsqueda global: nombre, marca, modelo, categoría. */
export function SearchModal() {
  const open = useUI((s) => s.searchOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const openProduct = useUI((s) => s.openProduct);
  useBodyScrollLock(open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90]"
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar productos"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="relative mx-auto mt-[12vh] w-[min(680px,calc(100%-2rem))] bg-white shadow-2xl"
          >
            <SearchPanel
              onClose={() => setSearchOpen(false)}
              onSelect={(slug) => openProduct(slug)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Panel interno: se monta solo cuando el modal está abierto (estado fresco). */
function SearchPanel({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (slug: string) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PRODUCTS.filter((p) =>
      `${p.name} ${p.brand} ${p.shape} ${p.material} ${p.color.name} ${
        p.category === "solar" ? "solares" : "oftálmicos"
      }`
        .toLowerCase()
        .includes(t)
    ).slice(0, 6);
  }, [q]);

  return (
    <>
      <div className="flex items-center gap-3 border-b border-black/5 px-5">
        <Search className="h-5 w-5 shrink-0 text-neutral-400" aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, marca, modelo o categoría…"
          aria-label="Buscar productos"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-neutral-400"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar búsqueda"
          className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-black/5 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[50vh] overflow-y-auto p-2">
        {!q.trim() ? (
          <p className="p-6 text-sm leading-relaxed text-neutral-500">
            Busca armazones por nombre, marca, forma o material.{" "}
            <span className="text-neutral-400">
              Ej.: «aviador», «titanio», «NORDVIK».
            </span>
          </p>
        ) : results.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">
            Sin resultados para «{q}». Prueba con otro término.
          </p>
        ) : (
          results.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => onSelect(p.slug)}
              data-cursor="view"
              className="flex w-full items-center gap-4 p-3 text-left transition-colors hover:bg-neutral-50"
            >
              <img
                src={p.images[0]}
                alt=""
                className="h-14 w-14 shrink-0 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility =
                    "hidden";
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {p.brand}
                </span>
                <span className="block truncate font-display text-sm font-bold text-ink">
                  {p.name}
                </span>
                <span className="block text-xs text-neutral-500">
                  {p.category === "solar" ? "Solar" : "Oftálmico"} · {p.shape}
                </span>
              </span>
              <span className="text-sm font-semibold text-ink">
                {formatMXN(p.price)}
              </span>
              <ArrowUpRight className="h-4 w-4 text-neutral-400" aria-hidden />
            </button>
          ))
        )}
      </div>
    </>
  );
}
