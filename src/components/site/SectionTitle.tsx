import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { ScrambleText } from "@/components/motion/ScrambleText";

interface SectionTitleProps {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionTitle({
  kicker,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Reveal>
        <p className={cn("kicker flex items-center gap-3", align === "center" && "justify-center", dark ? "text-red-500" : "text-brand")}>
          <span aria-hidden className={cn("inline-block h-px w-8 bg-current", align === "center" && "hidden")} />
          <ScrambleText text={kicker} />
          <span aria-hidden className={cn("inline-block h-px w-8 bg-current", align === "center" && "hidden")} />
        </p>
      </Reveal>
      <AnimatedText
        as="h2"
        text={title}
        className={cn(
          "mt-4 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl",
          dark ? "text-white" : "text-ink"
        )}
      />
      {description && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed md:text-lg",
              dark ? "text-white/70" : "text-neutral-600"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
