import { HomeExperience } from "@/components/site/HomeExperience";
import { CONTACT } from "@/lib/data/catalog";

/** JSON-LD — SEO local: óptica en Querétaro. */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Optician",
  name: "QUIERO LENTES",
  description:
    "Óptica premium en Querétaro desde 2007. Armazones de diseño, lentes oftálmicos y solares, examen de la vista de cortesía en tienda.",
  url: "https://quierolentes.mx",
  image: "https://quierolentes.mx/images/sections/hero-poster.jpg",
  telephone: "+52443259175",
  email: CONTACT.email,
  foundingDate: "2007",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Juárez Norte No. 119",
    addressLocality: "Querétaro",
    addressRegion: "Querétaro",
    postalCode: "76000",
    addressCountry: "MX",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "17:00",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HomeExperience />
    </>
  );
}
