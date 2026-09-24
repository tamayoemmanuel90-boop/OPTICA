import { cn } from "@/lib/utils";
import { BRAND } from "@/config/site";

interface LogoProps {
  className?: string;
  /** true = versión blanca (sobre fondo oscuro/video). false = roja oficial. */
  dark?: boolean;
}

/**
 * Logotipo OFICIAL de Ópticas Quiero Lentes (extraído del PDF vectorial
 * del Manual de Identidad). Uso según manual: siempre en su forma original,
 * sin modificar. Blanco sobre fondos oscuros / rojo sobre blancos.
 */
export function Logo({ className, dark = false }: LogoProps) {
  return (
    <img
      src={dark ? BRAND.logo.white : BRAND.logo.red}
      alt="Ópticas Quiero Lentes"
      width={1629}
      height={787}
      className={cn("h-8 w-auto sm:h-9 lg:h-10", className)}
      decoding="async"
    />
  );
}
