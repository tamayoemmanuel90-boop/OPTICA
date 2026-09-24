"use client";

import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ExternalLink,
} from "lucide-react";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Container } from "@/components/site/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CONTACT, waLink, WHATSAPP_MESSAGES } from "@/lib/data/catalog";
import { useUI } from "@/store/ui-store";

/**
 * CONTACTO — dirección, horarios, teléfonos, email y mapa.
 */
export function ContactSection() {
  const openAppointment = useUI((s) => s.openAppointment);

  return (
    <section
      id="contacto"
      aria-label="Contacto"
      className="bg-white py-20 md:py-28 lg:py-32"
    >
      <Container>
        <SectionTitle
          kicker="Visítanos"
          title="ESTAMOS EN QUERÉTARO"
          description="Ven por tu examen de la vista o escríbenos: estamos listos para atenderte."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          {/* Información */}
          <div className="space-y-8">
            <Reveal>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10">
                  <MapPin className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">
                    Dirección
                  </h3>
                  <address className="mt-1.5 text-sm not-italic leading-relaxed text-neutral-600">
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.colonia} · {CONTACT.address.cp}
                    <br />
                    {CONTACT.address.city}, {CONTACT.address.country}
                  </address>
                  <a
                    href={CONTACT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="open"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink underline decoration-brand underline-offset-4 hover:text-brand"
                  >
                    Abrir en Google Maps
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10">
                  <Clock className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">
                    Horario
                  </h3>
                  <ul className="mt-1.5 space-y-1 text-sm text-neutral-600">
                    {CONTACT.hours.map((h) => (
                      <li key={h.days} className="flex justify-between gap-6">
                        <span>{h.days}</span>
                        <span className="font-semibold text-ink">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16} className="grid gap-5 sm:grid-cols-2">
              <a
                href={`tel:${CONTACT.phone.tel}`}
                data-cursor="open"
                className="group flex gap-3.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 transition-colors group-hover:border-brand">
                  <Phone className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-ink">
                    Teléfono
                  </span>
                  <span className="mt-1 block text-sm text-neutral-600 transition-colors group-hover:text-ink">
                    {CONTACT.phone.display}
                  </span>
                </span>
              </a>
              <a
                href={waLink(WHATSAPP_MESSAGES.default)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="open"
                className="group flex gap-3.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 transition-colors group-hover:border-brand">
                  <MessageCircle className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-ink">
                    WhatsApp
                  </span>
                  <span className="mt-1 block text-sm text-neutral-600 transition-colors group-hover:text-ink">
                    {CONTACT.whatsapp.display}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                data-cursor="open"
                className="group flex gap-3.5 sm:col-span-2"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 transition-colors group-hover:border-brand">
                  <Mail className="h-5 w-5 text-brand" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-ink">
                    Correo
                  </span>
                  <span className="mt-1 block break-all text-sm text-neutral-600 transition-colors group-hover:text-ink">
                    {CONTACT.email}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.24} className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openAppointment("services")}
                data-cursor="click"
                className="inline-flex h-12 items-center justify-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-strong"
              >
                Agendar mi examen
              </button>
              <a
                href={waLink(WHATSAPP_MESSAGES.default)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="open"
                className="inline-flex h-12 items-center justify-center border border-ink px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Escribir por WhatsApp
              </a>
            </Reveal>
          </div>

          {/* Mapa */}
          <Reveal delay={0.15}>
            <div className="relative h-[340px] overflow-hidden border border-black/8 sm:h-[420px] lg:h-full lg:min-h-[480px]">
              <iframe
                title="Mapa — QUIERO LENTES, Juárez Norte No. 119, Centro, Querétaro"
                src={CONTACT.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full grayscale-[35%]"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
