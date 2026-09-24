"use client";

import { useEffect, useMemo } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CustomCursor } from "@/components/site/CustomCursor";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { BackgroundAudio } from "@/components/site/BackgroundAudio";
import { Preloader } from "@/components/site/Preloader";
import { BrandMarquee } from "@/components/site/BrandMarquee";
import { BrandLogoStrip } from "@/components/site/BrandLogoStrip";
import { VideoHero } from "@/components/hero/VideoHero";
import { FramesShowcaseSection } from "@/components/sections/FramesShowcaseSection";
import { VisionExamSection } from "@/components/sections/VisionExamSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { ProOneSection } from "@/components/sections/ProOneSection";
import { PurchaseJourneySection } from "@/components/sections/PurchaseJourneySection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { AppointmentModal } from "@/components/appointment/AppointmentModal";
import { useUI } from "@/store/ui-store";
import { WHATSAPP_MESSAGES } from "@/lib/data/catalog";

/**
 * Experiencia QUIERO LENTES — sitio de PRESENTACIÓN con recorrido comercial:
 * marcas oficiales (carrusel) → 1. Armazones y gafas (venta principal) →
 * 2. Examen de la vista → 3. Tecnología y equipos → 4. Lentes oftálmicos
 * PRO-ONE, seguidos de las secciones de confianza (experiencia, esencia,
 * servicios, nosotros, testimonios) y contacto. Conversión por WhatsApp y citas.
 */
export function HomeExperience() {
  const waContext = useUI((s) => s.waContext);
  const openAppointment = useUI((s) => s.openAppointment);

  // Puente entre el hero (server-safe markup) y el store de citas
  useEffect(() => {
    const handler = () => openAppointment("services");
    window.addEventListener("ql:open-appointment", handler);
    return () => window.removeEventListener("ql:open-appointment", handler);
  }, [openAppointment]);

  const waMessage = useMemo(() => {
    if (waContext === "services") return WHATSAPP_MESSAGES.services;
    return WHATSAPP_MESSAGES.default;
  }, [waContext]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Preloader />
      <CustomCursor />
      <Header />

      <main id="contenido" className="flex-1">
        <VideoHero />
        {/* Carrusel de marcas oficiales — las 5 más reconocidas, más grandes y de primeros */}
        <BrandLogoStrip />
        {/* 1 · Venta de armazones y gafas — prioridad comercial principal */}
        <FramesShowcaseSection />
        {/* 2 · Agendamiento de exámenes de la vista */}
        <VisionExamSection />
        {/* 3 · Tecnologías y equipos ópticos */}
        <TechnologySection />
        {/* 4 · Lentes oftálmicos (última parada comercial) */}
        <ProOneSection />
        {/* Confianza y cierre */}
        <PurchaseJourneySection />
        {/* Banda roja de la esencia de marca — separador cinético entre recorrido y pilares */}
        <BrandMarquee />
        <BenefitsSection />
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer sticky: se mantiene al fondo con min-h-screen + mt-auto interno */}
      <Footer />

      {/* Audio ambiental de fondo con control flotante */}
      <BackgroundAudio />

      {/* Utilidades */}
      <WhatsAppButton message={waMessage} />
      <AppointmentModal />
    </div>
  );
}
