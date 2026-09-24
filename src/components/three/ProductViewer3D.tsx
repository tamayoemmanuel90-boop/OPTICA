"use client";

import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const GlassesScene = lazy(() => import("@/components/three/GlassesScene"));
const LensScene = lazy(() => import("@/components/three/LensScene"));

/* ------------------------- utilidades perf ------------------------- */

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/* ------------------------------ viewer ----------------------------- */

export type SceneKind = "glasses" | "lens";

interface ProductViewer3DProps {
  kind?: SceneKind;
  /** Imagen premium de respaldo si WebGL no está disponible o falla */
  fallbackImage: string;
  alt: string;
  scrollProgress?: MotionValue<number> | null;
  className?: string;
}

/**
 * Visor 3D con estrategia de performance:
 * - Mount diferido: solo cuando entra en viewport (IntersectionObserver).
 * - Lazy import + Suspense (el bundle de three se carga bajo demanda).
 * - DPR limitado + PerformanceMonitor → degrada calidad en dispositivos lentos.
 * - Si no hay WebGL o la escena falla → imagen premium (la compra nunca
 *   depende de WebGL).
 */
export function ProductViewer3D({
  kind = "glasses",
  fallbackImage,
  alt,
  scrollProgress = null,
  className,
}: ProductViewer3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lowQuality, setLowQuality] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!webglAvailable()) setFailed(true);
    });
    const el = ref.current;
    if (!el) {
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const showScene = inView && !failed;

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      {/* Fallback / placeholder premium */}
      <img
        src={fallbackImage}
        alt={showScene ? "" : alt}
        aria-hidden={showScene}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          showScene ? "opacity-0" : "opacity-100"
        )}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
      {showScene && (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            {kind === "glasses" ? (
              <GlassesScene
                scrollProgress={scrollProgress}
                animate
                lowQuality={lowQuality}
                onDecline={() => setLowQuality(true)}
              />
            ) : (
              <LensScene
                scrollProgress={scrollProgress}
                lowQuality={lowQuality}
                onDecline={() => setLowQuality(true)}
              />
            )}
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
