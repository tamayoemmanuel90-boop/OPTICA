/**
 * ============================================================================
 * DATOS — QUIERO LENTES
 * ============================================================================
 * ⚠️ DATOS DE DEMOSTRACIÓN: servicios, vitrina de armazones y testimonios
 * son material de referencia claramente identificado. Estructurados para
 * migrarse después a API / CMS / Base de datos.
 * Nota: la vitrina de armazones es EDITORIAL (sin carrito ni precios):
 * presenta estilos con fotos del proyecto y convierte por WhatsApp/tienda.
 * Se reconstruirá con el inventario real cuando el cliente lo confirme.
 * ============================================================================
 */

/* --------------------- Vitrina de armazones (EDITORIAL) -----------------
 * ⚠️ REFERENCIA VISUAL — no es un catálogo transaccional.
 * Usa únicamente fotografías ya presentes en el proyecto
 * (/public/images/products). Sin nombres de marca, sin precios.
 * La etiqueta describe lo visible en la foto; la disponibilidad real
 * se confirma por WhatsApp o en tienda.
 * ----------------------------------------------------------------------- */

export interface FrameModel {
  slug: string;
  image: string;
  /** Estilo visible en la foto (p. ej. "Redondo · Acetato carey"). */
  label: string;
  /** Categoría visible: lentes oscuros = solar; resto = oftálmico. */
  category: "oftalmico" | "solar";
}

export const FRAMES_SHOWCASE: FrameModel[] = [
  {
    slug: "rectangular-negro",
    image: "/images/products/nordik-aurora-1.jpg",
    label: "Rectangular · Acetato negro",
    category: "oftalmico",
  },
  {
    slug: "aviador-dorado",
    image: "/images/products/solara-dorada-1.jpg",
    label: "Aviador · Metal dorado",
    category: "solar",
  },
  {
    slug: "redondo-carey",
    image: "/images/products/marea-ondina-1.jpg",
    label: "Redondo · Acetato carey",
    category: "oftalmico",
  },
  {
    slug: "hexagonal-solar",
    image: "/images/products/bruma-hex-1.jpg",
    label: "Hexagonal · Metal dorado",
    category: "solar",
  },
  {
    slug: "cuadrado-grafito",
    image: "/images/products/vertice-titanio-1.jpg",
    label: "Cuadrado · Metal grafito",
    category: "oftalmico",
  },
  {
    slug: "oversize-cristal",
    image: "/images/products/lumen-cristal-1.jpg",
    label: "Oversize · Cristal transparente",
    category: "oftalmico",
  },
  {
    slug: "ojo-de-gato",
    image: "/images/products/katana-aka-1.jpg",
    label: "Ojo de gato · Acetato rojo",
    category: "oftalmico",
  },
  {
    slug: "wayfarer-cafe",
    image: "/images/products/cordillera-pico-1.jpg",
    label: "Wayfarer · Acetato café",
    category: "oftalmico",
  },
];

export const FRAME_CATEGORIES = [
  { key: "todos", label: "Todos" },
  { key: "oftalmico", label: "Oftálmicos" },
  { key: "solar", label: "Gafas de sol" },
] as const;

export type FrameCategoryKey = (typeof FRAME_CATEGORIES)[number]["key"];

/* ------------------------- Marcas que manejamos --------------------------
 * Cinta de marcas oficiales del inicio (BrandLogoStrip). Logos wordmark
 * en BLANCO sobre transparente (/public/images/brands). Las 5 más
 * reconocidas van primero y en tamaño mayor. Las marcas sin archivo de
 * logo se muestran como wordmark tipográfico (también en blanco).
 * ----------------------------------------------------------------------- */

export interface BrandLogo {
  name: string;
  /** PNG blanco sobre transparente en /images/brands. Sin archivo → wordmark de texto. */
  image?: string;
  /** Etiqueta complementaria (p. ej. "Niños"). */
  tag?: string;
  /** Clases tipográficas para wordmarks de texto. */
  className?: string;
}

/** Las 5 más reconocidas — fila principal, más grande. */
export const BRANDS_FEATURED: BrandLogo[] = [
  { name: "Ray-Ban Meta", image: "/images/brands/rayban-meta.png" },
  { name: "Ray-Ban", image: "/images/brands/rayban.png" },
  { name: "Versace", image: "/images/brands/versace.png" },
  { name: "Oakley", image: "/images/brands/oakley.png" },
  { name: "Michael Kors", className: "uppercase tracking-[0.24em] font-medium" },
];

/** Resto del portafolio — fila secundaria. */
export const BRANDS_OTHER: BrandLogo[] = [
  { name: "Emporio Armani", image: "/images/brands/emporio-armani.png" },
  { name: "Armani Exchange", image: "/images/brands/armani-exchange.png" },
  { name: "Vogue", image: "/images/brands/vogue.png" },
  { name: "Polo Ralph Lauren", image: "/images/brands/polo-ralph-lauren.png" },
  { name: "Miraflex", tag: "Niños", className: "font-bold tracking-[0.2em] uppercase" },
  { name: "arnette", className: "font-black italic tracking-tight" },
  { name: "Carrera", image: "/images/brands/carrera.png" },
  { name: "Lacoste", className: "uppercase tracking-[0.42em] font-semibold" },
  { name: "Tommy Hilfiger", image: "/images/brands/tommy-hilfiger.png" },
  { name: "Polaroid", image: "/images/brands/polaroid.png" },
];

/* ------------------------------ Servicios ------------------------------ */

export interface Service {
  slug: string;
  title: string;
  description: string;
  image: string;
  cta: "appointment" | "whatsapp";
}

export const SERVICES: Service[] = [
  {
    slug: "examen-de-la-vista",
    title: "Examen de la vista",
    description:
      "Evaluación visual completa con equipos digitales y atención profesional. De cortesía en tienda.",
    image: "/images/sections/service-exam.jpg",
    cta: "appointment",
  },
  {
    slug: "lentes-monofocales",
    title: "Lentes monofocales",
    description:
      "Corrección clara y precisa para visión cercana o lejana, con alta definición y adelgazamiento disponible.",
    image: "/images/sections/service-monofocal.jpg",
    cta: "whatsapp",
  },
  {
    slug: "lentes-progresivos",
    title: "Lentes progresivos",
    description:
      "Transición natural entre distancias sin cambiar de lente. Tecnología PRO-ONE adaptada a tu día a día.",
    image: "/images/sections/service-progressive.jpg",
    cta: "whatsapp",
  },
  {
    slug: "tratamientos",
    title: "Tratamientos y filtros",
    description:
      "Antirreflejo, fotoadaptables, filtros de luz azul y polarizados: protege tus ojos y tus lentes.",
    image: "/images/sections/service-treatment.jpg",
    cta: "whatsapp",
  },
  {
    slug: "asesoria-de-imagen",
    title: "Asesoría de imagen",
    description:
      "Te ayudamos a encontrar el armazón que combina con tu rostro, tu estilo y tu personalidad.",
    image: "/images/sections/service-style.jpg",
    cta: "whatsapp",
  },
  {
    slug: "armazones",
    title: "Armazones",
    description:
      "Curaduría de armazones de acetato, metal y titanio para hombre, mujer y unisex.",
    image: "/images/sections/service-frames.jpg",
    cta: "whatsapp",
  },
];

/* ----------------------- Testimonios (PLACEHOLDER) ----------------------
 * ⚠️ PLACEHOLDERS CLARAMENTE IDENTIFICADOS — no son testimonios reales.
 * Reemplazar con testimonios aprobados por el cliente.
 * ----------------------------------------------------------------------- */

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "María G.",
    text: "Placeholder — El equipo es muy profesional y me ayudaron a encontrar el armazón ideal para mi rostro. El examen fue rápido y muy completo.",
    rating: 5,
  },
  {
    name: "Jorge R.",
    text: "Placeholder — Mis lentes progresivos estuvieron listos en menos de una semana y la adaptación fue perfecta desde el primer día.",
    rating: 5,
  },
  {
    name: "Ana P.",
    text: "Placeholder — Excelente asesoría de imagen, me encantó el resultado. La tienda es hermosa y la atención de primera.",
    rating: 4,
  },
];

/* ------------------------------ Navegación ----------------------------- */

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Gafas y Armazones", href: "#armazones" },
  { label: "Examen", href: "#vision" },
  { label: "Tecnología", href: "#tecnologia" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

/* ------------------------------- Contacto ------------------------------ */

export const CONTACT = {
  address: {
    street: "Juárez Norte No. 119",
    colonia: "Col. Centro",
    cp: "C.P. 76000",
    city: "Querétaro, Qro.",
    country: "México",
  },
  hours: [
    { days: "Lunes a Viernes", time: "10:00 AM — 7:00 PM" },
    { days: "Sábados", time: "10:00 AM — 5:00 PM" },
  ],
  phone: { display: "(44) 325 9175", tel: "+52443259175" },
  whatsapp: { display: "(442) 465 5358", number: "524424655358" },
  email: "quierolentes@gmail.com",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Juarez+Norte+119%2C+Centro%2C+76000+Queretaro%2C+Qro.",
  mapsEmbed:
    "https://www.google.com/maps?q=Juarez%20Norte%20119%2C%20Centro%2C%2076000%20Queretaro%2C%20Qro.&output=embed",
} as const;

export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp.number}?text=${encodeURIComponent(
    message
  )}`;
}

export const WHATSAPP_MESSAGES = {
  default: "Hola, quiero información sobre Quiero Lentes.",
  product: (name: string) =>
    `Hola, quiero información sobre este armazón: ${name}.`,
  services: "Hola, quiero agendar un examen de la vista.",
  buy: "Hola, quiero comprar armazones. ¿Me pueden compartir los modelos disponibles?",
  quote:
    "Hola, quiero cotizar armazones y gafas en Quiero Lentes. ¿Me ayudan?",
  quoteFrame: (label: string) =>
    `Hola, me interesa el armazón «${label}» de la galería de su sitio web. ¿Está disponible y cuál es su precio?`,
  proOne:
    "Hola, quiero cotizar lentes PRO-ONE (monofocales o progresivos). ¿Me ayudan?",
} as const;
