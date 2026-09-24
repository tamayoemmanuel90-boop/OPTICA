"use client";

import { useMemo } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUI, useBodyScrollLock } from "@/store/ui-store";
import { useCart, cartCount } from "@/store/cart-store";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { getProduct } from "@/lib/data/catalog";
import { formatMXN } from "@/lib/format";
import { scrollToId } from "@/lib/scroll";

/** Drawer lateral del carrito — persistido localmente. */
export function CartDrawer() {
  const cartOpen = useUI((s) => s.cartOpen);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const openCheckout = useUI((s) => s.openCheckout);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const hasMounted = useHasMounted();
  useBodyScrollLock(cartOpen);

  const count = hasMounted ? cartCount(items) : 0;

  const rows = useMemo(
    () =>
      hasMounted
        ? items
            .map((i) => ({ ...i, product: getProduct(i.slug) }))
            .filter((r) => r.product !== undefined)
        : [],
    [items, hasMounted]
  );

  const subtotal = rows.reduce(
    (acc, r) => acc + (r.product?.price ?? 0) * r.qty,
    0
  );

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 rounded-none border-l border-black/5 bg-white p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-black/5 p-5">
          <SheetTitle className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Tu carrito {count > 0 && <span className="text-brand">({count})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Productos seleccionados en tu carrito de compras.
          </SheetDescription>
        </SheetHeader>

        {rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper">
              <ShoppingBag className="h-7 w-7 text-neutral-400" aria-hidden />
            </span>
            <p className="font-display text-lg font-bold text-ink">
              Tu carrito está vacío
            </p>
            <p className="max-w-60 text-sm text-neutral-500">
              Explora la colección y encuentra tu próximo armazón.
            </p>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                setTimeout(() => scrollToId("#catalogo"), 250);
              }}
              data-cursor="click"
              className="mt-2 h-11 bg-ink px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand"
            >
              Explorar armazones
            </button>
          </div>
        ) : (
          <>
            {/* Lista */}
            <ul className="flex-1 divide-y divide-black/5 overflow-y-auto px-5">
              {rows.map((r) => (
                <li key={r.slug} className="flex gap-4 py-5">
                  <img
                    src={r.product!.images[0]}
                    alt={`${r.product!.brand} ${r.product!.name}`}
                    className="h-20 w-20 shrink-0 bg-[#f4f3f1] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility =
                        "hidden";
                    }}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                          {r.product!.brand}
                        </p>
                        <p className="truncate font-display text-sm font-bold text-ink">
                          {r.product!.name}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {r.product!.color.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Eliminar ${r.product!.name} del carrito`}
                        onClick={() => remove(r.slug)}
                        className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-black/5 hover:text-brand"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-black/10">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          onClick={() => setQty(r.slug, r.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-black/5"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span
                          className="w-8 text-center text-sm font-semibold"
                          aria-live="polite"
                        >
                          {r.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() => setQty(r.slug, r.qty + 1)}
                          className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:bg-black/5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-ink">
                        {formatMXN(r.product!.price * r.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resumen */}
            <div className="border-t border-black/5 bg-paper p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold text-ink">
                  {formatMXN(subtotal)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-display text-base font-bold text-ink">
                  Total
                </span>
                <span className="font-display text-lg font-bold text-ink">
                  {formatMXN(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                Envío calculado en el checkout · Precios en MXN
              </p>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={() => openCheckout()}
                  data-cursor="click"
                  className="h-12 w-full bg-brand text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
                >
                  Ir al checkout
                </button>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  data-cursor="click"
                  className="h-12 w-full border border-ink text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
