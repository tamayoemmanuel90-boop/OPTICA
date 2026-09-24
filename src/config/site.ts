/**
 * Configuración central del sitio.
 * La fuente del video hero es intercambiable: al tener el .mp4 en CDN/Storage/Hosting
 * basta con actualizar `sources[0].src` (o agregar más fuentes como fallback) sin
 * modificar el componente VideoHero.
 */
export const HERO_VIDEO = {
  // Fuente actual: archivo descargado a /public/videos/hero.mp4 (origen: Google Drive del cliente).
  // TODO(cliente): reemplazar por URL de CDN cuando esté disponible, p. ej. "https://cdn.dominio.com/hero.mp4"
  sources: [{ src: "/videos/hero.mp4", type: "video/mp4" }],
  poster: "/images/sections/hero-poster.jpg",
} as const;

export const BACKGROUND_AUDIO = {
  // Audio ambiental descargado a /public/audio/ambiente.mp3 (origen: Google Drive del cliente).
  src: "/audio/ambiente.mp3",
} as const;

/**
 * Identidad oficial — extraída del Manual de Identidad Corporativa
 * (carpeta de Drive del cliente).
 *  · Rojo Quiero Lentes: PANTONE 485 C — HEX #E60012 (RGB 230, 0, 18)
 *  · Tipografía: Montserrat (títulos y textos) + logotipo personalizado
 *  · Tagline oficial: "Cambiamos la forma de ver tu mundo"
 *  · Esencia de marca: Salud Visual · Estilo · Tecnología · Confianza
 */
export const BRAND = {
  red: "#e60012",
  domain: "querolentes.mx",
  tagline: "Cambiamos la forma de ver tu mundo",
  logo: {
    white: "/brand/logo-white.png",
    red: "/brand/logo-red.png",
  },
  pillars: [
    {
      key: "salud-visual",
      label: "Salud Visual",
      text: "Cuidamos tu visión con profesionalismo.",
    },
    {
      key: "estilo",
      label: "Estilo",
      text: "Lentes que complementan tu personalidad.",
    },
    {
      key: "tecnologia",
      label: "Tecnología",
      text: "Soluciones ópticas con innovación y calidad.",
    },
    {
      key: "confianza",
      label: "Confianza",
      text: "Más de una década acompañando tu visión.",
    },
  ],
} as const;

export const SITE = {
  name: "QUIERO LENTES",
  tagline: "Cambiamos la forma de ver tu mundo.",
  founded: 2007,
} as const;
