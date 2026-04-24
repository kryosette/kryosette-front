"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Network, Shield, Lock, Database, BrainCircuit, Edit3, Globe } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import GraphBackground from "@/components/GraphBackground";

// ---------------------------------------------------------------------------
// Глаза из PNG, следящие за мышью
// ---------------------------------------------------------------------------
const HeroEyes = () => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Несколько глаз с разными позициями и размерами
  const eyes = [
    { left: "3%", top: "12%", size: 140 },
    { left: "92%", top: "8%", size: 120 },
    { left: "10%", top: "72%", size: 160 },
    { left: "88%", top: "78%", size: 180 },
    { left: "48%", top: "88%", size: 110 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {eyes.map((eye, i) => {
        // Небольшое смещение всего глаза
        const dx = (mouse.x - 0.5) * 10;
        const dy = (mouse.y - 0.5) * 10;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: eye.left,
              top: eye.top,
              width: eye.size,
              height: eye.size,
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
              opacity: 0.1,
            }}
          >
            <img
              src="/assets/grunge-eye-1.png"
              alt=""
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Данные
// ---------------------------------------------------------------------------
const technologies = [
  {
    id: "kryo-arch",
    title: "Kryo Arch",
    description: "Local‑first architecture. Infinite granular control.",
    icon: Cpu,
  },
  {
    id: "transcendent-bridge",
    title: "Transcendent Bridge",
    description: "L2→L4 direct encapsulation. Undetectable.",
    icon: Network,
  },
  {
    id: "security-scanners",
    title: "Security Scanners",
    description: "Heuristic engines. Memory & network integrity.",
    icon: Shield,
  },
  {
    id: "onion-routing",
    title: "Onion Routing",
    description: "Independent multi‑hop anonymity.",
    icon: Lock,
  },
  {
    id: "in-memory-db",
    title: "In‑Memory DB",
    description: "Encrypted graph database. Microsecond latency.",
    icon: Database,
  },
  {
    id: "truth-engine",
    title: "Truth Engine",
    description: "On‑device detection. Data never leaves.",
    icon: BrainCircuit,
  },
  {
    id: "transparent-editor",
    title: "Transparent Editor",
    description: "Watch every process. Tweak everything.",
    icon: Edit3,
  },
  {
    id: "rpki-validator",
    title: "RPKI Validator",
    description: "BGP route security. Prevents hijacking.",
    icon: Globe,
  },
];

const implemented = [
  "User profile system",
  "Friend adding mechanism",
  "Posts with comments & polls",
  "Public / private chats",
  "Transcendent bridge (prototype)",
  "Security scanners & detectors",
  "Proprietary onion routing",
  "In‑memory DB (base)",
];

const inDevelopment = [
  "RPKI validator",
  "Additional network security tools",
  "Secure private chats",
  "Transparent Editor",
  "Translator",
  "Replication & more",
  "Local truth‑engine analyzer",
  "Advanced DPI bypass",
];

// ---------------------------------------------------------------------------
// Плавное появление
// ---------------------------------------------------------------------------
const FadeUp = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ---------------------------------------------------------------------------
// Главная страница
// ---------------------------------------------------------------------------
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progressBarScale = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
  });

  return (
    <div ref={containerRef} className="relative bg-white text-black">
      {/* 3D‑граф (едва заметен) */}
      {/* <div className="fixed inset-0 -z-10 opacity-20">
        <GraphBackground />
      </div> */}

      {/* Прогресс‑бар */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-black/20 z-50 origin-left"
        style={{ scaleX: progressBarScale }}
      />

      {/* ===================================================================== */}
      {/* Hero с глазами и короной */}
      {/* ===================================================================== */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 py-20 overflow-hidden">
        {/* Глаза PNG */}
        <HeroEyes />

        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-3xl relative z-10">
            <FadeUp delay={0.1}>
              <p className="text-xs font-bold tracking-[0.3em] text-black/30 mb-8 uppercase">
                Desktop only · Linux x86 · C/ASM
              </p>
            </FadeUp>

            {/* Заголовок с короной, прижатой к последней букве */}
            <div className="relative inline-block">
              <FadeUp delay={0.2}>
                <h1 className="text-[5rem] sm:text-[8rem] lg:text-[12rem] font-black tracking-[-0.03em] leading-[0.85] text-black mb-8">
                  kryosette
                </h1>
              </FadeUp>

              {/* Корона – абсолютно позиционирована справа от заголовка, уровень последней "e" */}
             
               
            </div>

            <FadeUp delay={0.3}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-black/50 max-w-2xl leading-relaxed mb-12">
                A social network built from the ground up for security,
                resilience, and true ownership.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#technologies"
                  className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wide text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-500"
                >
                  <span>Discover the tech</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
                <Link
                  href="/self-university"
                  className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wide text-black/70 bg-black/5 backdrop-blur-md border border-black/10 rounded-full hover:bg-black/10 hover:text-black transition-all duration-500"
                >
                  <span>Self University</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Скролл‑подсказка */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-black/15"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-black/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* Остальные секции (без изменений)                                     */}
      {/* ===================================================================== */}
      {/* Technologies */}
      <section id="technologies" className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-20">
            <p className="text-xs font-bold tracking-[0.3em] text-black/30 uppercase mb-4">
              Technology
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-black">
              Core systems
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <FadeUp key={tech.id} delay={index * 0.05}>
                  <Link href={`/technology/${tech.id}`} className="block h-full group">
                    <div className="h-full bg-black/[0.02] backdrop-blur-md border border-black/[0.06] rounded-3xl p-8 hover:bg-black/[0.04] hover:border-black/10 transition-all duration-500 flex flex-col justify-between min-h-[260px]">
                      <div>
                        <Icon className="w-6 h-6 text-black/30 mb-6 group-hover:text-black/50 transition-colors duration-500" />
                        <h3 className="text-xl font-bold tracking-[-0.01em] mb-3 text-black group-hover:text-black/90 transition-colors duration-500">
                          {tech.title}
                        </h3>
                        <p className="text-sm font-light text-black/40 leading-relaxed group-hover:text-black/50 transition-colors duration-500">
                          {tech.description}
                        </p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-black/[0.04]">
                        <span className="inline-flex items-center text-xs font-bold text-black/20 group-hover:text-black/40 transition-colors duration-500">
                          Learn more
                          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-black/30 uppercase mb-4">
              Preview
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-black">
              See it in action
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-black/[0.01] backdrop-blur-md border border-black/[0.06] rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl shadow-black/5">
              <Image
                src="https://github.com/user-attachments/assets/93610fa8-71f6-448a-85c4-08d9f96ab8f0"
                alt="kryosette preview interface"
                width={2940}
                height={1786}
                className="w-full h-auto rounded-2xl"
                priority
                unoptimized
              />
            </div>
            <p className="text-center text-xs font-bold tracking-[0.15em] text-black/20 mt-6 uppercase">
              Early preview — work in progress
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Status */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-20 text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-black/30 uppercase mb-4">
              Progress
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-black">
              Current Status
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeUp delay={0.1}>
              <div className="h-full bg-black/[0.02] backdrop-blur-md border border-black/[0.06] rounded-3xl p-8 sm:p-10">
                <h3 className="text-xl font-bold tracking-[-0.01em] mb-8 flex items-center gap-3 text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Implemented
                </h3>
                <ul className="space-y-4">
                  {implemented.map((item, i) => (
                    <li key={i} className="text-sm font-light text-black/40 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-black/15 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="h-full bg-black/[0.02] backdrop-blur-md border border-black/[0.06] rounded-3xl p-8 sm:p-10">
                <h3 className="text-xl font-bold tracking-[-0.01em] mb-8 flex items-center gap-3 text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  In Development
                </h3>
                <ul className="space-y-4">
                  {inDevelopment.map((item, i) => (
                    <li key={i} className="text-sm font-light text-black/40 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-black/10 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="mt-16 text-center">
            <p className="text-lg font-light text-black/40">
              First working demo expected{" "}
              <span className="font-bold text-black/70">May 2026</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light italic text-black/60 leading-relaxed">
              “There will be features that have never existed or have never been
              implemented in this way.”
            </blockquote>
            <p className="mt-8 text-xs font-bold tracking-[0.3em] text-black/20 uppercase">
              — kryosette
            </p>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="text-center">
          <FadeUp>
            <Link
              href="/self-university"
              className="group inline-flex items-center justify-center px-10 py-5 text-sm font-bold tracking-wide text-black/80 bg-black/5 backdrop-blur-md border border-black/10 rounded-full hover:bg-black/10 hover:text-black transition-all duration-500"
            >
              <span>Explore Self University</span>
              <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
            <p className="mt-8 text-xs font-bold tracking-[0.3em] text-black/15 uppercase">
              Production only when ready
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}