"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, X } from "lucide-react";
import { useUI, useBodyScrollLock } from "@/store/ui-store";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* SISTEMA DE CITAS — AGENDAR EXAMEN                                   */
/* Disponibilidad de DEMOSTRACIÓN (determinista, ~70%): la agenda      */
/* real se conectará vía API/calendario. NO es disponibilidad real.    */
/* ------------------------------------------------------------------ */

function slotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  if (day === 0) return []; // domingo cerrado
  const end = day === 6 ? 16 : 18; // sáb hasta 16:00, L-V hasta 18:00
  const out: string[] = [];
  for (let h = 10; h <= end; h++) out.push(`${h}:00`);
  return out;
}

function isSlotAvailable(date: string, hour: string): boolean {
  const s = date + hour;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return h % 10 < 7;
}

function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fecha: string;
  hora: string;
}

const EMPTY: FormData = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
  fecha: "",
  hora: "",
};

export function AppointmentModal() {
  const open = useUI((s) => s.appointmentOpen);
  const setAppointmentOpen = useUI((s) => s.setAppointmentOpen);
  useBodyScrollLock(open);

  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [confirmed, setConfirmed] = useState<FormData | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAppointmentOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setAppointmentOpen]);

  useEffect(() => {
    if (!open) {
      // reset suave al cerrar
      const t = setTimeout(() => {
        setForm(EMPTY);
        setErrors({});
        setConfirmed(null);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  const slots = useMemo(() => slotsForDate(form.fecha), [form.fecha]);

  const set = (k: keyof FormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v, ...(k === "fecha" ? { hora: "" } : {}) }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (!form.apellido.trim()) e.apellido = "Ingresa tu apellido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      e.correo = "Ingresa un correo válido";
    if (!/^[+\d][\d\s\-()]{7,}$/.test(form.telefono.trim()))
      e.telefono = "Ingresa un teléfono válido";
    if (!form.fecha) e.fecha = "Selecciona una fecha";
    if (!form.hora) e.hora = "Selecciona un horario";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setConfirmed(form);
  };

  const inputCls =
    "h-11 w-full border border-black/10 bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-brand";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[95]"
        >
          <div
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={() => setAppointmentOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Agendar examen de la vista"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="relative mx-auto mt-[6vh] flex max-h-[88vh] w-[min(760px,calc(100%-1.5rem))] flex-col overflow-hidden bg-white shadow-2xl"
          >
            {/* Barra superior */}
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
              <div>
                <p className="kicker text-brand">Agendar cita</p>
                <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-ink">
                  Examen de la vista
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAppointmentOpen(false)}
                aria-label="Cerrar"
                data-cursor="click"
                className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-black/5 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6">
              {confirmed ? (
                /* ---------------- SUCCESS ---------------- */
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                    <CheckCircle2 className="h-8 w-8 text-brand" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-tight text-ink">
                    Cita solicitada
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
                    Gracias, {confirmed.nombre}. Tu solicitud quedó registrada
                    para el <strong>{confirmed.fecha}</strong> a las{" "}
                    <strong>{confirmed.hora}</strong>. Recibirás confirmación
                    por WhatsApp o teléfono.
                  </p>
                  <p className="mt-4 max-w-md rounded-none border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                    Demo — la disponibilidad mostrada es ilustrativa. La agenda
                    real se integrará vía API/calendario.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAppointmentOpen(false)}
                    data-cursor="click"
                    className="mt-7 h-12 bg-ink px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand"
                  >
                    Listo
                  </button>
                </motion.div>
              ) : (
                /* ---------------- FORM ---------------- */
                <form onSubmit={submit} noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nombre" error={errors.nombre} htmlFor="ap-nombre">
                      <input
                        id="ap-nombre"
                        className={inputCls}
                        value={form.nombre}
                        onChange={(e) => set("nombre", e.target.value)}
                        placeholder="Tu nombre"
                        autoComplete="given-name"
                        required
                      />
                    </Field>
                    <Field label="Apellido" error={errors.apellido} htmlFor="ap-apellido">
                      <input
                        id="ap-apellido"
                        className={inputCls}
                        value={form.apellido}
                        onChange={(e) => set("apellido", e.target.value)}
                        placeholder="Tu apellido"
                        autoComplete="family-name"
                        required
                      />
                    </Field>
                    <Field label="Correo" error={errors.correo} htmlFor="ap-correo">
                      <input
                        id="ap-correo"
                        type="email"
                        className={inputCls}
                        value={form.correo}
                        onChange={(e) => set("correo", e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        autoComplete="email"
                        required
                      />
                    </Field>
                    <Field label="Teléfono" error={errors.telefono} htmlFor="ap-tel">
                      <input
                        id="ap-tel"
                        type="tel"
                        className={inputCls}
                        value={form.telefono}
                        onChange={(e) => set("telefono", e.target.value)}
                        placeholder="(442) 000 0000"
                        autoComplete="tel"
                        required
                      />
                    </Field>
                    <Field label="Fecha" error={errors.fecha} htmlFor="ap-fecha">
                      <input
                        id="ap-fecha"
                        type="date"
                        min={todayISO()}
                        className={cn(inputCls, !form.fecha && "text-neutral-400")}
                        value={form.fecha}
                        onChange={(e) => set("fecha", e.target.value)}
                        required
                      />
                    </Field>
                    <div />
                  </div>

                  {/* Horarios */}
                  <fieldset className="mt-5">
                    <legend className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Horario
                    </legend>
                    {form.fecha && slots.length === 0 ? (
                      <p className="mt-3 text-sm text-neutral-500">
                        Los domingos cerramos. Elige otro día (L-V 10:00–19:00 ·
                        Sáb 10:00–17:00).
                      </p>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Horarios disponibles">
                        {(form.fecha ? slots : []).map((h) => {
                          const available = isSlotAvailable(form.fecha, h);
                          const selected = form.hora === h;
                          return (
                            <button
                              key={h}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              disabled={!available}
                              onClick={() => set("hora", h)}
                              className={cn(
                                "h-10 min-w-20 border px-3 text-sm font-semibold transition-colors",
                                selected
                                  ? "border-ink bg-ink text-white" // Seleccionado
                                  : available
                                    ? "border-black/15 bg-white text-ink hover:border-ink" // Disponible
                                    : "cursor-not-allowed border-black/5 bg-neutral-100 text-neutral-400 line-through" // No disponible
                              )}
                            >
                              {h}
                            </button>
                          );
                        })}
                        {!form.fecha && (
                          <p className="text-sm text-neutral-400">
                            Selecciona primero una fecha.
                          </p>
                        )}
                      </div>
                    )}
                    {errors.hora && (
                      <p className="mt-2 text-xs text-brand" role="alert">
                        {errors.hora}
                      </p>
                    )}
                  </fieldset>

                  <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-5 sm:flex-row">
                    <p className="flex items-center gap-2 text-xs text-neutral-500">
                      <CalendarCheck className="h-4 w-4 text-brand" aria-hidden />
                      Asistencia profesional · Equipos digitales · Sin costo
                    </p>
                    <button
                      type="submit"
                      data-cursor="click"
                      className="h-12 w-full bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong sm:w-auto"
                    >
                      Confirmar cita
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-brand" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
