"use client";

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Environment } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const KEYWORDS = [
  "SECURITY", "PRIVACY", "TRUST", "ENCRYPTION", "RESILIENCE",
  "DECENTRALIZED", "ANONYMOUS", "FREEDOM", "ONION", "TRUTH",
  "INTEGRITY", "C/ASM", "SERVERLESS", "UNBLOCKABLE", "VERIFIED",
  "IMMUTABLE", "TRANSPARENT", "AUDITABLE", "ZERO-KNOWLEDGE",
  "SOVEREIGNTY", "HARDENED", "PARANOID", "AIR-GAPPED", "MESH",
  "DARKNET", "CRYPTO", "SIGNATURES", "CHECKSUMS", "ISOLATION",
  "OBFUSCATION", "BRIDGE", "SCANNER", "VALIDATOR",
];

// Вращаем камеру вместо всей сцены
const CameraController = () => {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const radius = 18;
    const speed = 0.06;
    
    camera.position.x = Math.sin(t * speed) * radius;
    camera.position.z = Math.cos(t * speed) * radius;
    camera.position.y = Math.sin(t * 0.04) * 3;
    
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const GraphNodes = () => {
  const textRefs = useRef<THREE.Mesh[]>([]);

  const nodes = useMemo(() => {
    const count = 200;
    const positions: THREE.Vector3[] = [];
    const texts: string[] = [];
    const speeds: number[] = [];
    const phases: number[] = [];
    const radius = 6.0;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(
        new THREE.Vector3(
          x + (Math.random() - 0.5) * 1.8,
          y + (Math.random() - 0.5) * 1.8,
          z + (Math.random() - 0.5) * 1.8
        )
      );

      if (Math.random() < 0.65) {
        texts.push(KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]);
      } else {
        texts.push("?");
      }

      speeds.push(0.05 + Math.random() * 0.2);
      phases.push(Math.random() * Math.PI * 2);
    }
    return { positions, texts, speeds, phases };
  }, []);

  const connections = useMemo(() => {
    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    const threshold = 2.6;
    for (let i = 0; i < nodes.positions.length; i++) {
      for (let j = i + 1; j < nodes.positions.length; j++) {
        if (nodes.positions[i].distanceTo(nodes.positions[j]) < threshold) {
          pairs.push([nodes.positions[i], nodes.positions[j]]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  useFrame(({ clock }) => {
    textRefs.current.forEach((mesh, idx) => {
      if (mesh && mesh.material) {
        const material = mesh.material as THREE.MeshBasicMaterial;
        const t = clock.getElapsedTime() * nodes.speeds[idx] + nodes.phases[idx];
        material.color.setHSL((t * 0.08) % 1, 0.85, 0.7);
      }
    });
  });

  return (
    <group>
      {connections.map(([start, end], i) => (
        <Line
          key={`line-${i}`}
          points={[start, end]}
          color="#aaaaaa"
          lineWidth={0.1}
          transparent
          opacity={0.08}
        />
      ))}

      {nodes.positions.map((pos, i) => {
        const text = nodes.texts[i];
        const isQuestion = text === "?";
        const fontSize = isQuestion ? 0.32 : 0.22;

        return (
          <Text
            key={`node-${i}`}
            position={pos}
            fontSize={fontSize}
            anchorX="center"
            anchorY="middle"
            font={undefined}
            letterSpacing={isQuestion ? 0 : 0.04}
            frustumCulled={false}
            ref={(ref) => {
              if (ref) textRefs.current[i] = ref as any;
            }}
          >
            <meshBasicMaterial />
            {text}
          </Text>
        );
      })}
    </group>
  );
};

const Starfield = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = 14.0;

    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();

      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);

      const color = new THREE.Color().setHSL(
        Math.random() * 0.2,
        0.5,
        0.5 + Math.random() * 0.5
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleData.colors.length / 3}
          array={particleData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <CameraController />
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 20, 40]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -5, -10]} intensity={0.3} />
      <Suspense fallback={null}>
        <Starfield />
        <GraphNodes />
        <Environment preset="city" />
        <EffectComposer multisampling={8}>
          <Bloom
            luminanceThreshold={0.05}
            luminanceSmoothing={0.95}
            intensity={0.8}
            radius={1.0}
          />
        </EffectComposer>
      </Suspense>
    </>
  );
};

export default function GraphBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 40, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}