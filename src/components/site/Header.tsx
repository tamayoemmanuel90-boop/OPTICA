"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  MessageCircle,
  ShoppingBag,
  Eye,
  ShieldCheck,
  Glasses,
} from "lucide-react";
import { useUI, useBodyScrollLock } from "@/store/ui-store";
import { NAV_ITEMS, CONTACT, waLink, WHATSAPP_MESSAGES } from "@/lib/data/catalog";
import { Logo } from "@/components/site/Logo";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * HEADER COMERCIAL — logo protagonista, navegación por secciones y CTAs
 * de conversión reales: «Comprar ahora» (vitrina de armazones),
 * «Cotizar» (WhatsApp) y «Agendar cita» (modal de citas).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useUI((s) => s.menuOpen);
  const toggleMenu = useUI((s) => s.toggleMenu);
  const openAppointment = useUI((s) => s.openAppointment);
  const closeAll = useUI((s) => s.closeAll);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const light = !scrolled && !menuOpen; // texto blanco sobre el video

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,border-color] duration-500",
          light
            ? "border-b border-transparent bg-transparent text-white"
            : "border-b border-black/5 bg-white/95 text-ink shadow-[0_1px_0_rgba(0,0,0,0.03),0_10px_30px_-18px_rgba(0,0,0,0.18)] backdrop-blur-md"
        )}
      >
        {/* Barra de anuncios — se compacta al hacer scroll */}
        <div
          aria-hidden={scrolled}
          className={cn(
            "overflow-hidden bg-brand text-white transition-[max-height,opacity] duration-300",
            scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          )}
        >
          <div className="mx-auto flex h-9 w-full max-w-[1400px] items-center justify-between gap-4 px-4 text-[11px] font-semibold tracking-wide sm:px-6 lg:px-10 xl:px-12">
            <p className="hidden items-center gap-2 sm:flex">
              <Glasses className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Armazones para hombre, mujer y niños
            </p>
            <p className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Tu visión, nuestra prioridad
            </p>
            <p className="hidden items-center gap-2 sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Desde 2007 cuidando tu mirada
            </p>
          </div>
        </div>

        <div className="mx-auto flex h-18 w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-10 xl:px-12">
          {/* Logo — más grande y visible, proporciones originales intactas */}
          <a
            href="#inicio"
            aria-label="QUIERO LENTES — Inicio"
            data-cursor="open"
            className="flex shrink-0 items-center"
          >
            <Logo dark={light} className="h-10 w-auto sm:h-11 lg:h-12 xl:h-14" />
          </a>

          {/* Navegación desktop (xl+) */}
          <nav aria-label="Navegación principal" className="hidden xl:block">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    data-cursor="open"
                    onClick={closeAll}
                    className="nav-underline text-[11px] font-semibold uppercase tracking-[0.14em] opacity-90 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li aria-hidden className="h-4 w-px bg-current opacity-25" />
              <li>
                <button
                  type="button"
                  onClick={() => openAppointment("services")}
                  data-cursor="click"
                  className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.14em] text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:text-brand-strong focus-visible:text-brand-strong"
                >
                  Agendar cita
                </button>
              </li>
            </ul>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <a
              href={waLink(WHATSAPP_MESSAGES.quote)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className={cn(
                "hidden h-10 items-center gap-2 whitespace-nowrap border px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors sm:inline-flex lg:px-5",
                light
                  ? "border-white/50 text-white hover:border-white hover:bg-white hover:text-ink"
                  : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white"
              )}
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Cotizar
            </a>

            <button
              type="button"
              onClick={() => scrollToId("#armazones")}
              data-cursor="click"
              className="inline-flex h-10 items-center gap-2 whitespace-nowrap bg-brand px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-strong focus-visible:bg-brand-strong lg:px-6"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <span className="hidden sm:inline">Comprar ahora</span>
              <span className="sm:hidden" aria-hidden>
                Comprar
              </span>
            </button>

            <IconBtn
              label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              light={light}
              onClick={toggleMenu}
              className="xl:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.75} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              )}
            </IconBtn>
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  light,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  light: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      data-cursor="click"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        light
          ? "hover:bg-white/15"
          : "hover:bg-black/5",
        className
      )}
    >
      {children}
    </button>
  );
}

function MobileMenu() {
  const menuOpen = useUI((s) => s.menuOpen);
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const openAppointment = useUI((s) => s.openAppointment);
  const closeAll = useUI((s) => s.closeAll);
  useBodyScrollLock(menuOpen);

  const goBuy = () => {
    closeAll();
    // Espera al cierre del overlay para scrollear con el body libre
    requestAnimationFrame(() => scrollToId("#armazones"));
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex flex-col bg-white xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-24">
            <nav aria-label="Navegación móvil">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.5 }}
                    className="border-b border-black/5"
                  >
                    <a
                      href={item.href}
                      onClick={closeAll}
                      className="flex items-center justify-between py-4 font-display text-3xl font-bold uppercase tracking-tight text-ink"
                    >
                      {item.label}
                      <span className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
                        0{i + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-8 space-y-3"
            >
              <button
                type="button"
                onClick={goBuy}
                className="flex h-13 w-full items-center justify-center gap-2 whitespace-nowrap bg-brand text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-strong"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Comprar ahora
              </button>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={waLink(WHATSAPP_MESSAGES.quote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-13 items-center justify-center gap-2 whitespace-nowrap border border-ink text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Cotizar
                </a>
                <button
                  type="button"
                  onClick={() => openAppointment("services")}
                  className="flex h-13 items-center justify-center whitespace-nowrap bg-ink text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-black"
                >
                  Agendar cita
                </button>
              </div>

              <div className="pt-4 text-sm text-neutral-600">
                <p className="font-semibold text-ink">Visítanos</p>
                <p>
                  {CONTACT.address.street}, {CONTACT.address.colonia},{" "}
                  {CONTACT.address.cp} {CONTACT.address.city}
                </p>
                <p className="mt-2">
                  <a
                    href={`tel:${CONTACT.phone.tel}`}
                    className="underline decoration-brand/40 underline-offset-4"
                  >
                    {CONTACT.phone.display}
                  </a>
                  {" · "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="underline decoration-brand/40 underline-offset-4"
                  >
                    {CONTACT.email}
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
          <button
            type="button"
            className="sr-only"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
