"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, ShieldCheck, Wallet, X } from "lucide-react";
import { useUI, useBodyScrollLock } from "@/store/ui-store";
import { useCart } from "@/store/cart-store";
import { getProduct, waLink } from "@/lib/data/catalog";
import { formatMXN } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* CHECKOUT PREMIUM                                                    */
/* Pagos: NO se simulan cargos reales. Los métodos (Tarjeta / Mercado  */
/* Pago) quedan preparados para integración backend. El pedido se      */
/* finaliza por WhatsApp (canal real de conversión).                   */
/* ------------------------------------------------------------------ */

interface CheckoutForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  calle: string;
  colonia: string;
  ciudad: string;
  cp: string;
}

const EMPTY: CheckoutForm = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  calle: "",
  colonia: "",
  ciudad: "",
  cp: "",
};

export function CheckoutView() {
  const checkoutOpen = useUI((s) => s.checkoutOpen);
  const closeCheckout = useUI((s) => s.closeCheckout);
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  useBodyScrollLock(checkoutOpen);

  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [sent, setSent] = useState(false);

  const rows = useMemo(
    () =>
      items
        .map((i) => ({ ...i, product: getProduct(i.slug) }))
        .filter((r) => r.product !== undefined),
    [items]
  );
  const subtotal = rows.reduce(
    (acc, r) => acc + (r.product?.price ?? 0) * r.qty,
    0
  );

  const set = (k: keyof CheckoutForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellido.trim()) e.apellido = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    if (!/^[+\d][\d\s\-()]{7,}$/.test(form.telefono.trim()))
      e.telefono = "Teléfono inválido";
    if (!form.calle.trim()) e.calle = "Requerido";
    if (!form.colonia.trim()) e.colonia = "Requerido";
    if (!form.ciudad.trim()) e.ciudad = "Requerido";
    if (!/^\d{5}$/.test(form.cp.trim())) e.cp = "C.P. a 5 dígitos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const finishByWhatsApp = () => {
    if (!validate() || rows.length === 0) return;
    const lines = rows
      .map(
        (r) =>
          `• ${r.qty}× ${r.product!.brand} ${r.product!.name} (${
            r.product!.color.name
          }) — ${formatMXN(r.product!.price * r.qty)}`
      )
      .join("\n");
    const msg = `Hola, quiero finalizar mi pedido:\n\n${lines}\n\nSubtotal: ${formatMXN(
      subtotal
    )}\n\nDatos de envío:\n${form.nombre} ${form.apellido}\n${form.calle}, ${
      form.colonia
    }\n${form.ciudad}, C.P. ${form.cp}\nTel: ${form.telefono}\nEmail: ${form.email}`;
    window.open(waLink(msg), "_blank", "noopener");
    setSent(true);
    clear();
  };

  const inputCls =
    "h-11 w-full border border-black/10 bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-brand";

  return (
    <CheckoutShell
      open={checkoutOpen}
      onClose={closeCheckout}
      sent={sent}
      rowsCount={rows.length}
      subtotal={subtotal}
      inputCls={inputCls}
      form={form}
      errors={errors}
      set={set}
      onFinish={finishByWhatsApp}
      onBackToCart={closeCheckout}
    />
  );
}

/* ----------------------------- Shell UI ---------------------------- */

interface ShellProps {
  open: boolean;
  onClose: () => void;
  sent: boolean;
  rowsCount: number;
  subtotal: number;
  inputCls: string;
  form: CheckoutForm;
  errors: Partial<Record<keyof CheckoutForm, string>>;
  set: (k: keyof CheckoutForm, v: string) => void;
  onFinish: () => void;
  onBackToCart: () => void;
}

function CheckoutShell(p: ShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: p.open ? 1 : 0 }}
      className={cn(
        "fixed inset-0 z-[85] bg-paper",
        !p.open && "pointer-events-none"
      )}
      style={{ visibility: p.open ? "visible" : "hidden" }}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      {/* Barra superior */}
      <div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b border-black/5 bg-white px-4 sm:px-6">
        <button
          type="button"
          onClick={p.onClose}
          data-cursor="click"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Volver a la tienda
        </button>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
          Checkout seguro
        </p>
        <button
          type="button"
          onClick={p.onClose}
          aria-label="Cerrar checkout"
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-black/5 hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="h-full overflow-y-auto pt-14">
        <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
          {p.sent ? (
            /* ------------- PEDIDO ENVIADO ------------- */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="mx-auto max-w-lg py-16 text-center"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                <ShieldCheck className="h-8 w-8 text-brand" aria-hidden />
              </span>
              <h1 className="mt-6 font-display text-3xl font-bold uppercase tracking-tight text-ink">
                Pedido iniciado
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Abre WhatsApp para enviar tu pedido al equipo de QUIERO
                LENTES. Confirmaremos disponibilidad, envío y total final.
              </p>
              <button
                type="button"
                onClick={p.onClose}
                data-cursor="click"
                className="mt-8 h-12 bg-ink px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand"
              >
                Volver a la tienda
              </button>
            </motion.div>
          ) : p.rowsCount === 0 ? (
            /* ------------- CARRITO VACÍO ------------- */
            <div className="mx-auto max-w-lg py-20 text-center">
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">
                Tu carrito está vacío
              </h1>
              <p className="mt-3 text-sm text-neutral-600">
                Agrega armazones al carrito para continuar con el checkout.
              </p>
              <button
                type="button"
                onClick={p.onClose}
                data-cursor="click"
                className="mt-8 h-12 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                Explorar armazones
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">
                Finalizar compra
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Completa tus datos — confirmamos todo contigo antes del envío.
              </p>

              <div className="mt-9 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                {/* ------------ FORMULARIO ------------ */}
                <div>
                  <h2 className="kicker text-neutral-400">1 · Contacto</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input
                      id="ck-nombre"
                      label="Nombre"
                      value={p.form.nombre}
                      onChange={(v) => p.set("nombre", v)}
                      error={p.errors.nombre}
                      cls={p.inputCls}
                      autoComplete="given-name"
                    />
                    <Input
                      id="ck-apellido"
                      label="Apellido"
                      value={p.form.apellido}
                      onChange={(v) => p.set("apellido", v)}
                      error={p.errors.apellido}
                      cls={p.inputCls}
                      autoComplete="family-name"
                    />
                    <Input
                      id="ck-email"
                      label="Email"
                      type="email"
                      value={p.form.email}
                      onChange={(v) => p.set("email", v)}
                      error={p.errors.email}
                      cls={p.inputCls}
                      autoComplete="email"
                    />
                    <Input
                      id="ck-tel"
                      label="Teléfono"
                      type="tel"
                      value={p.form.telefono}
                      onChange={(v) => p.set("telefono", v)}
                      error={p.errors.telefono}
                      cls={p.inputCls}
                      autoComplete="tel"
                    />
                  </div>

                  <h2 className="kicker mt-9 text-neutral-400">2 · Dirección de envío</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        id="ck-calle"
                        label="Calle y número"
                        value={p.form.calle}
                        onChange={(v) => p.set("calle", v)}
                        error={p.errors.calle}
                        cls={p.inputCls}
                        autoComplete="street-address"
                      />
                    </div>
                    <Input
                      id="ck-colonia"
                      label="Colonia"
                      value={p.form.colonia}
                      onChange={(v) => p.set("colonia", v)}
                      error={p.errors.colonia}
                      cls={p.inputCls}
                    />
                    <Input
                      id="ck-ciudad"
                      label="Ciudad / Estado"
                      value={p.form.ciudad}
                      onChange={(v) => p.set("ciudad", v)}
                      error={p.errors.ciudad}
                      cls={p.inputCls}
                    />
                    <Input
                      id="ck-cp"
                      label="Código Postal"
                      value={p.form.cp}
                      onChange={(v) =>
                        p.set("cp", v.replace(/[^\d]/g, "").slice(0, 5))
                      }
                      error={p.errors.cp}
                      cls={p.inputCls}
                      autoComplete="postal-code"
                      inputMode="numeric"
                    />
                  </div>

                  <h2 className="kicker mt-9 text-neutral-400">3 · Método de pago</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <PayMethod
                      Icon={CreditCard}
                      title="Tarjeta"
                      note="Próximamente"
                      disabled
                    />
                    <PayMethod
                      Icon={Wallet}
                      title="Mercado Pago"
                      note="Próximamente"
                      disabled
                    />
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-neutral-500">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      aria-hidden
                    />
                    Los pagos en línea se activarán con la integración backend
                    (Mercado Pago). Hoy tu pedido se finaliza por WhatsApp con
                    confirmación personal — sin cargos automáticos.
                  </p>
                </div>

                {/* ------------ RESUMEN ------------ */}
                <aside
                  aria-label="Resumen de compra"
                  className="h-fit border border-black/8 bg-white p-6 lg:sticky lg:top-20"
                >
                  <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                    Resumen
                  </h2>
                  <CheckoutSummary />
                  <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="font-semibold text-ink">
                        {formatMXN(p.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Envío</span>
                      <span className="text-neutral-500">Por confirmar</span>
                    </div>
                    <div className="flex justify-between border-t border-black/5 pt-3">
                      <span className="font-display text-base font-bold text-ink">
                        Total
                      </span>
                      <span className="font-display text-lg font-bold text-ink">
                        {formatMXN(p.subtotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={p.onFinish}
                    data-cursor="click"
                    className="mt-6 h-12 w-full bg-brand text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
                  >
                    Finalizar pedido por WhatsApp
                  </button>
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400">
                    Al finalizar, tu resumen de compra se envía por WhatsApp
                    para confirmación personal.
                  </p>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutSummary() {
  const items = useCart((s) => s.items);
  const rows = useMemo(
    () =>
      items
        .map((i) => ({ ...i, product: getProduct(i.slug) }))
        .filter((r) => r.product !== undefined),
    [items]
  );
  return (
    <ul className="mt-4 space-y-4">
      {rows.map((r) => (
        <li key={r.slug} className="flex items-center gap-3">
          <img
            src={r.product!.images[0]}
            alt=""
            className="h-14 w-14 shrink-0 bg-[#f4f3f1] object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              {r.product!.brand}
            </p>
            <p className="truncate text-sm font-semibold text-ink">
              {r.product!.name} × {r.qty}
            </p>
          </div>
          <p className="text-sm font-semibold text-ink">
            {formatMXN(r.product!.price * r.qty)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function PayMethod({
  Icon,
  title,
  note,
  disabled,
}: {
  Icon: typeof CreditCard;
  title: string;
  note: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border border-black/10 bg-white p-4",
        disabled && "opacity-60"
      )}
      aria-disabled={disabled}
    >
      <Icon className="h-5 w-5 text-ink" aria-hidden />
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-neutral-400">{note}</p>
      </div>
    </div>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  error,
  cls,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  cls: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={cn(cls, error && "border-brand")}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-brand" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
