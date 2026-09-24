"use client";

import { useEffect } from "react";
import { create } from "zustand";

export type WaContext = "default" | "services";

interface UIState {
  menuOpen: boolean;
  appointmentOpen: boolean;
  waContext: WaContext;
  setMenuOpen: (v: boolean) => void;
  toggleMenu: () => void;
  setAppointmentOpen: (v: boolean) => void;
  openAppointment: (ctx?: WaContext) => void;
  closeAll: () => void;
}

/**
 * Store de UI del sitio de presentación: menú móvil + modal de citas.
 * (El estado de carrito/checkout/producto se retiró junto con la tienda.)
 */
export const useUI = create<UIState>((set) => ({
  menuOpen: false,
  appointmentOpen: false,
  waContext: "default",
  setMenuOpen: (v) => set({ menuOpen: v }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  setAppointmentOpen: (v) => set({ appointmentOpen: v }),
  openAppointment: (ctx = "services") =>
    set({
      appointmentOpen: true,
      menuOpen: false,
      waContext: ctx,
    }),
  closeAll: () =>
    set({
      menuOpen: false,
      appointmentOpen: false,
      waContext: "default",
    }),
}));

/** Lock de scroll del body cuando hay overlays abiertos */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}
