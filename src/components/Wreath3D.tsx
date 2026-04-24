"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Beads = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetY = mouse.x * 0.5;
      const targetX = -mouse.y * 0.3;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.1;
    }
  });

  // Создаём три нитки бус, обвивающих букву
  const strands = [
    { radius: 0.45, height: 1.8, turns: 2.5, count: 50, size: 0.07, yOffset: 0 },
    { radius: 0.55, height: 1.6, turns: 2.0, count: 40, size: 0.06, yOffset: 0.1 },
    { radius: 0.5, height: 2.0, turns: 3.0, count: 60, size: 0.05, yOffset: -0.1 },
  ];

  const allBeads: { x: number; y: number; z: number; size: number }[] = [];

  strands.forEach((strand) => {
    for (let i = 0; i < strand.count; i++) {
      const t = i / (strand.count - 1);
      const angle = t * Math.PI * 2 * strand.turns;
      const x = Math.cos(angle) * strand.radius;
      const z = Math.sin(angle) * strand.radius;
      const y = -strand.height / 2 + t * strand.height + strand.yOffset;
      allBeads.push({ x, y, z, size: strand.size });
    }
  });

  return (
    <group ref={groupRef}>
      {allBeads.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <sphereGeometry args={[b.size, 12, 12]} />
          <meshStandardMaterial
            color="#FFD700"
            roughness={0.15}
            metalness={0.95}
          />
        </mesh>
      ))}
    </group>
  );
};

const MouseTracker = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <Beads mouse={mouse} />;
};

export default function Wreath3D() {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        color="#FFFDE7"
      />
      <spotLight
        position={[-3, 2, -2]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#FFE082"
      />
      <MouseTracker />
    </Canvas>
  );
}