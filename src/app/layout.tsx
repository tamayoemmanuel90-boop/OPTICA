import type { Metadata, Viewport } from "next";
import { Montserrat, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/* Tipografía oficial del Manual de Identidad: Montserrat (títulos y textos).
   Fraunces se conserva solo como acento editorial itálico. */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quierolentes.mx"),
  title: {
    default:
      "QUIERO LENTES — Óptica en Querétaro | Cambiamos la forma de ver tu mundo",
    template: "%s | QUIERO LENTES",
  },
  description:
    "Cambiamos la forma de ver tu mundo. Óptica premium en Querétaro desde 2007: armazones de diseño, lentes oftálmicos y solares, examen de la vista en tienda y tecnología óptica avanzada. Salud visual · Estilo · Tecnología · Confianza.",
  keywords: [
    "óptica en Querétaro",
    "examen de la vista en Querétaro",
    "lentes en Querétaro",
    "armazones Querétaro",
    "lentes de sol Querétaro",
    "lentes progresivos",
    "Quiero Lentes",
  ],
  authors: [{ name: "Quiero Lentes" }],
  openGraph: {
    title: "QUIERO LENTES — Cambiamos la forma de ver tu mundo",
    description:
      "Salud visual, tecnología y estilo en el corazón de Querétaro. Óptica premium desde 2007.",
    url: "/",
    siteName: "QUIERO LENTES",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/images/sections/hero-poster.jpg",
        width: 1440,
        height: 720,
        alt: "QUIERO LENTES — Óptica premium en Querétaro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QUIERO LENTES — Cambiamos la forma de ver tu mundo",
    description:
      "Salud visual, tecnología y estilo en el corazón de Querétaro. Óptica premium desde 2007.",
    images: ["/images/sections/hero-poster.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#e60012",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
