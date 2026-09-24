"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, PerformanceMonitor } from "@react-three/drei";
import type { MotionValue } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Lente PRO-ONE: casquete esférico con recubrimiento iridiscente      */
/* (antirreflejo) que rota y responde al scroll y al puntero.          */
/* ------------------------------------------------------------------ */

function Lens({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number> | null;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const spin = scrollProgress ? scrollProgress.get() * Math.PI * 2 : 0;
    const targetY = Math.sin(t * 0.25) * 0.3 + state.pointer.x * 0.45 + spin;
    const targetX = 0.55 + state.pointer.y * 0.2 + (scrollProgress ? scrollProgress.get() * 0.4 : 0);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
  });

  return (
    <group ref={group} scale={1.5}>
      {/* Lente curva */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[4, 64, 64, 0, Math.PI * 2, 0, 0.35]} />
        <meshPhysicalMaterial
          color="#eef0f2"
          roughness={0.04}
          metalness={0}
          transparent
          opacity={0.4}
          clearcoat={1}
          clearcoatRoughness={0.06}
          iridescence={0.85}
          iridescenceIOR={1.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Aro rojo de marca */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.022, 12, 80]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}

export interface LensSceneProps {
  scrollProgress?: MotionValue<number> | null;
  onDecline?: () => void;
  lowQuality?: boolean;
}

export default function LensScene({
  scrollProgress = null,
  onDecline,
  lowQuality = false,
}: LensSceneProps) {
  return (
    <Canvas
      dpr={lowQuality ? 1 : [1, 1.6]}
      camera={{ position: [0, 0.4, 5.2], fov: 34 }}
      gl={{
        antialias: !lowQuality,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
      aria-label="Vista 3D del lente PRO-ONE"
      role="img"
    >
      <PerformanceMonitor onDecline={() => onDecline?.()} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} />
      <pointLight
        position={[-4, 2, -3]}
        intensity={45}
        color="#dc2626"
        distance={20}
      />
      <pointLight position={[4, -1, 3]} intensity={8} color="#ffffff" distance={14} />

      <Lens scrollProgress={scrollProgress} />

      {!lowQuality && (
        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.25}
          scale={10}
          blur={3}
          far={4}
          color="#0a0a0a"
        />
      )}
    </Canvas>
  );
}
