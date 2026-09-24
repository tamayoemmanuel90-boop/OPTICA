"use client";

import { Instagram, Facebook, Youtube, Linkedin, Twitter, Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/site/Logo";
import { Container } from "@/components/site/Container";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { NAV_ITEMS } from "@/lib/data/catalog";
import { BRAND } from "@/config/site";

const SOCIALS = [
  { label: "Instagram", Icon: Instagram },
  { label: "Facebook", Icon: Facebook },
  { label: "TikTok", Icon: Music2 },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "YouTube", Icon: Youtube },
  { label: "X", Icon: Twitter },
];

interface FooterLink {
  label: string;
  href?: string;
}

export function Footer() {
  const { toast } = useToast();

  const soon = () =>
    toast({
      title: "Disponible próximamente",
      description: "Estamos preparando esta sección para ti.",
    });

  const navLinks: FooterLink[] = NAV_ITEMS.map((n) => ({
    label: n.label,
    href: n.href,
  }));

  const helpLinks: FooterLink[] = [
    { label: "Preguntas frecuentes" },
    { label: "Envíos" },
    { label: "Garantías" },
  ];

  const legalLinks: FooterLink[] = [
    { label: "Aviso de privacidad" },
    { label: "Términos y condiciones" },
  ];

  return (
    <footer className="mt-auto bg-ink text-white">
      {/* Banda tipográfica cinética — reacciona a la velocidad del scroll */}
      <VelocityMarquee
        baseVelocity={1.4}
        copies={3}
        className="border-b border-white/10 py-8 md:py-10"
      >
        {[
          "QUIERO LENTES",
          "CAMBIAMOS LA FORMA DE VER TU MUNDO",
          "QUERÉTARO · DESDE 2007",
        ].map((t) => (
          <span key={t} className="flex items-center">
            <span className="text-outline-white whitespace-nowrap px-6 font-display text-4xl font-extrabold uppercase tracking-tight md:text-6xl">
              {t}
            </span>
            <span aria-hidden className="text-brand">
              ✦
            </span>
          </span>
        ))}
      </VelocityMarquee>

      <Container className="pb-10 pt-14 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          {/* Marca + redes */}
          <div>
            <a href="#inicio" aria-label="QUIERO LENTES — volver al inicio" data-cursor="open" className="inline-block">
              <Logo dark className="h-10 sm:h-11" />
            </a>
            <p className="mt-5 max-w-sm font-serif text-lg italic leading-relaxed text-white/70">
              {BRAND.tagline}.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
              Óptica premium en Querétaro desde 2007. Salud visual, tecnología
              y estilo en un solo lugar.
            </p>
            <div className="mt-6 flex gap-1.5" role="group" aria-label="Redes sociales">
              {SOCIALS.map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={soon}
                  aria-label={`${label} (próximamente)`}
                  data-cursor="open"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                </button>
              ))}
            </div>
          </div>

          {/* Columnas */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <FooterCol title="Navegación" links={navLinks} />
            <FooterCol title="Ayuda" links={helpLinks} onSoon={soon} />
            <FooterCol title="Legal" links={legalLinks} onSoon={soon} />
            <div>
              <h3 className="kicker text-white/40">Redes</h3>
              <ul className="mt-5 space-y-2.5">
                {SOCIALS.map(({ label }) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={soon}
                      data-cursor="open"
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Esencia de marca + dominio oficial (Manual de Identidad) */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} QUIERO LENTES · Juárez Norte No. 119,
            Col. Centro, C.P. 76000, Querétaro, Qro.
          </p>
          <p className="font-semibold uppercase tracking-[0.22em] text-white/50">
            Salud Visual · Tecnología · Estilo · Confianza
          </p>
          <p>{BRAND.domain}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  onSoon,
}: {
  title: string;
  links: FooterLink[];
  onSoon?: () => void;
}) {
  return (
    <nav aria-label={title}>
      <h3 className="kicker text-white/40">{title}</h3>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.href ? (
              <a
                href={l.href}
                data-cursor="open"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={onSoon}
                data-cursor="open"
                className="text-left text-sm text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
