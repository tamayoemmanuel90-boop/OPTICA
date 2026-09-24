"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, PerformanceMonitor } from "@react-three/drei";
import type { MotionValue } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Armazón estilizado construido proceduralmente (sin assets externos) */
/* Materiales PBR: acetato con clearcoat + detalles metálicos.         */
/* ------------------------------------------------------------------ */

const ACETATE = {
  color: "#17171b",
  roughness: 0.22,
  metalness: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
};

const METAL = {
  color: "#c8c9ce",
  roughness: 0.28,
  metalness: 0.9,
};

const LENS = {
  color: "#d8ddd9",
  roughness: 0.05,
  metalness: 0,
  transparent: true,
  opacity: 0.24,
  side: THREE.DoubleSide,
};

interface GlassesProps {
  scrollProgress: MotionValue<number> | null;
  animate: boolean;
}

function Glasses({ scrollProgress, animate }: GlassesProps) {
  const group = useRef<THREE.Group>(null);
  const BASE_Y = -0.38;
  const BASE_X = 0.03;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const spin = scrollProgress ? scrollProgress.get() * Math.PI * 1.2 : 0;
    const auto = animate ? Math.sin(t * 0.28) * 0.32 : 0;
    const targetY = BASE_Y + auto + state.pointer.x * 0.5 + spin;
    const targetX = BASE_X + state.pointer.y * 0.16;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      animate ? Math.sin(t * 0.6) * 0.05 : 0,
      3,
      delta
    );
  });

  return (
    <group ref={group} scale={1.28} rotation={[BASE_X, BASE_Y, 0]}>
      {/* Frentes + lentes */}
      {[1, -1].map((s) => (
        <group key={s} position={[1.12 * s, 0, 0]}>
          <mesh>
            <torusGeometry args={[1.0, 0.085, 24, 64]} />
            <meshPhysicalMaterial {...ACETATE} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 0.05, 48]} />
            <meshPhysicalMaterial {...LENS} />
          </mesh>
        </group>
      ))}

      {/* Puente */}
      <mesh
        position={[0, 0.62, 0]}
        rotation={[0, 0, Math.PI * 0.125]}
      >
        <torusGeometry args={[0.42, 0.07, 16, 48, Math.PI * 0.75]} />
        <meshPhysicalMaterial {...ACETATE} />
      </mesh>

      {/* Plaquetas */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0.24 * s, -0.14, 0.16]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshPhysicalMaterial {...METAL} />
        </mesh>
      ))}

      {/* Varillas + bisagras + puntas */}
      {[1, -1].map((s) => (
        <group key={s} position={[2.12 * s, 0.12, 0]}>
          <mesh position={[0.02 * s, 0, 0.08]}>
            <boxGeometry args={[0.1, 0.22, 0.16]} />
            <meshPhysicalMaterial {...METAL} />
          </mesh>
          <mesh
            position={[0.04 * s, -0.05, 1.5]}
            rotation={[0.04, -0.05 * s, 0]}
          >
            <boxGeometry args={[0.07, 0.12, 3.0]} />
            <meshPhysicalMaterial {...ACETATE} />
          </mesh>
          <mesh
            position={[0.01 * s, -0.42, 3.02]}
            rotation={[1.15, -0.05 * s, 0]}
          >
            <boxGeometry args={[0.07, 0.11, 0.8]} />
            <meshPhysicalMaterial {...ACETATE} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export interface GlassesSceneProps {
  scrollProgress?: MotionValue<number> | null;
  animate?: boolean;
  onDecline?: () => void;
  lowQuality?: boolean;
}

export default function GlassesScene({
  scrollProgress = null,
  animate = true,
  onDecline,
  lowQuality = false,
}: GlassesSceneProps) {
  return (
    <Canvas
      dpr={lowQuality ? 1 : [1, 1.75]}
      camera={{ position: [0, 0.3, 5.8], fov: 32 }}
      gl={{
        antialias: !lowQuality,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
      aria-label="Vista 3D interactiva del armazón"
      role="img"
    >
      <PerformanceMonitor onDecline={() => onDecline?.()} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <pointLight
        position={[-5, 1.5, -4]}
        intensity={55}
        color="#dc2626"
        distance={22}
      />
      <pointLight position={[4, -2, 3]} intensity={9} color="#ffffff" distance={15} />

      <Float
        enabled={!lowQuality}
        speed={1.3}
        rotationIntensity={0.12}
        floatIntensity={0.35}
        floatingRange={[-0.05, 0.05]}
      >
        <Glasses scrollProgress={scrollProgress} animate={animate} />
      </Float>

      {!lowQuality && (
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.32}
          scale={11}
          blur={2.8}
          far={4}
          color="#0a0a0a"
        />
      )}
    </Canvas>
  );
}
