"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  slug: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
}

/**
 * Carrito persistido localmente (localStorage).
 * El precio/información se deriva del catálogo en render — el storage
 * solo guarda slug + cantidad para mantenerlo ligero.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (slug, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === slug ? { ...i, qty: Math.min(99, i.qty + qty) } : i
              ),
            };
          }
          return { items: [...s.items, { slug, qty }] };
        }),
      remove: (slug) =>
        set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.slug !== slug)
              : s.items.map((i) =>
                  i.slug === slug ? { ...i, qty: Math.min(99, qty) } : i
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "ql-cart-v1" }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.qty, 0);
}

export function cartTotal(
  items: CartItem[],
  prices: Map<string, number>
): number {
  return items.reduce((acc, i) => acc + (prices.get(i.slug) ?? 0) * i.qty, 0);
}
