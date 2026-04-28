"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Network,
  Shield,
  Lock,
  Database,
  BrainCircuit,
  Edit3,
  Globe,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, useMemo } from "react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const techStack = [
  {
    id: "kryo-arch",
    title: "Kryo Arch",
    subtitle: "Serverless by design",
    description:
      "Local-first architecture with infinite granular control. You decide who sees your data — down to individual bits.",
    icon: Cpu,
    stats: [
      { label: "Data stored locally", value: "100%" },
      { label: "Latency", value: "<1ms" },
    ],
  },
  {
    id: "transcendent-bridge",
    title: "Transcendent Bridge",
    subtitle: "Beyond OSI layers",
    description:
      "Direct L2→L4 encapsulation bypassing traditional routing. Undetectable by DPI, unstoppable by firewalls.",
    icon: Network,
    stats: [
      { label: "DPI bypass rate", value: "~99.7%" },
      { label: "Overhead", value: "<3%" },
    ],
  },
  {
    id: "security-scanners",
    title: "Security Scanners",
    subtitle: "Real-time threat detection",
    description:
      "Proprietary heuristic engines monitor memory, network, and system integrity. Zero-day exploits neutralized before execution.",
    icon: Shield,
    stats: [
      { label: "Scan interval", value: "10ms" },
      { label: "Threats blocked", value: "1,247+" },
    ],
  },
  {
    id: "onion-routing",
    title: "Onion Routing",
    subtitle: "Multi-hop anonymity",
    description:
      "Custom implementation independent of Tor. Sphinx packet format with anti-traffic-analysis padding for true privacy.",
    icon: Lock,
    stats: [
      { label: "Minimum hops", value: "3" },
      { label: "Latency overhead", value: "~200ms" },
    ],
  },
  {
    id: "in-memory-db",
    title: "In‑Memory DB",
    subtitle: "Encrypted at runtime",
    description:
      "ACID-compliant graph database written in C. AES-256-GCM encryption with BLAKE3 checksums for integrity.",
    icon: Database,
    stats: [
      { label: "Query latency", value: "<10µs" },
      { label: "Encryption", value: "AES-256-GCM" },
    ],
  },
  {
    id: "truth-engine",
    title: "Truth Engine",
    subtitle: "Local AI verification",
    description:
      "On-device models detect manipulated media and coordinated inauthentic behavior. Your data never leaves your machine.",
    icon: BrainCircuit,
    stats: [
      { label: "Model size", value: "47MB" },
      { label: "Inference time", value: "<50ms" },
    ],
  },
  {
    id: "transparent-editor",
    title: "Transparent Editor",
    subtitle: "See everything, change anything",
    description:
      "Real-time visualization of internal processes. Tweak routing tables, inspect handshakes, modify policies at runtime.",
    icon: Edit3,
    stats: [
      { label: "Configurable params", value: "1,847" },
      { label: "Update rate", value: "60 FPS" },
    ],
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
// Subtle geometric decorations for the hero (Awwwards-style abstract shapes)
// ---------------------------------------------------------------------------
const HeroDecorations = () => {
  const shapes = useMemo(
    () => [
      { cx: "8%", cy: "15%", r: 120, stroke: "black", opacity: 0.04, delay: 0 },
      { cx: "92%", cy: "22%", r: 80, stroke: "black", opacity: 0.03, delay: 0.3 },
      { cx: "5%", cy: "78%", r: 180, stroke: "black", opacity: 0.05, delay: 0.6 },
      { cx: "85%", cy: "72%", r: 60, stroke: "black", opacity: 0.04, delay: 0.9 },
      { cx: "50%", cy: "85%", r: 40, stroke: "black", opacity: 0.03, delay: 1.2 },
      { cx: "15%", cy: "45%", r: 8, fill: "black", opacity: 0.06, delay: 0.2 },
      { cx: "78%", cy: "40%", r: 5, fill: "black", opacity: 0.05, delay: 0.7 },
      { cx: "42%", cy: "12%", r: 6, fill: "black", opacity: 0.04, delay: 1.0 },
    ],
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: s.cx,
            top: s.cy,
            width: s.r * 2,
            height: s.r * 2,
            transform: "translate(-50%, -50%)",
            opacity: s.opacity,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: s.opacity, scale: 1 }}
          transition={{ duration: 1.5, delay: s.delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {s.fill ? (
            <div
              className="w-full h-full rounded-full bg-black"
              style={{ opacity: s.opacity * 20 }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full border border-black/10"
              style={{ opacity: s.opacity * 25 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// FadeUp — reusable scroll-triggered entrance
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
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ---------------------------------------------------------------------------
// Main Page
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
    <div ref={containerRef} className="relative bg-white text-black overflow-x-hidden">
      {/* ---- Progress bar ---- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-black/20 z-50 origin-left"
        style={{ scaleX: progressBarScale }}
      />

      {/* ================================================================= */}
      {/*  HERO                                                             */}
      {/* ================================================================= */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 py-20 overflow-hidden">
        <HeroDecorations />

        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-3xl relative z-10">
            {/* Label */}
            <FadeUp delay={0.05}>
              <p className="text-[11px] font-bold tracking-[0.35em] text-black/25 uppercase mb-10">
                Desktop only · Linux x86 · C/ASM core
              </p>
            </FadeUp>

            {/* Title */}
            <FadeUp delay={0.15}>
              <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[10rem] xl:text-[12rem] font-black tracking-[-0.035em] leading-[0.82] text-black mb-10">
                kryosette
              </h1>
            </FadeUp>

            {/* Subtitle */}
            <FadeUp delay={0.25}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-black/45 max-w-2xl leading-relaxed mb-12">
                A social network built from the ground up for security, resilience,
                and true ownership.
              </p>
            </FadeUp>

            {/* CTAs */}
            <FadeUp delay={0.35}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#tech-stack"
                  className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wide text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Discover the tech</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
                <Link
                  href="/self-university"
                  className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wide text-black/65 bg-black/[0.03] backdrop-blur-sm border border-black/8 rounded-full hover:bg-black/[0.06] hover:text-black hover:border-black/15 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Self University</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-black/12"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold">
              Scroll
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-black/15 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  TECH STACK GRID                                                  */}
      {/* ================================================================= */}
      <section id="tech-stack" className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <FadeUp className="mb-20">
            <p className="text-[11px] font-bold tracking-[0.35em] text-black/25 uppercase mb-5">
              Technology
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.025em] text-black">
              Core systems
            </h2>
          </FadeUp>

          {/* Cards grid — 2 columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <FadeUp key={tech.id} delay={index * 0.06}>
                  <Link
                    href={`/technology/${tech.id}`}
                    className="block h-full group"
                  >
                    <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-3xl p-8 sm:p-10 lg:p-12 hover:bg-black/[0.03] hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500 flex flex-col justify-between min-h-[340px]">
                      {/* Top content */}
                      <div>
                        {/* Icon + subtitle */}
                        <div className="flex items-center gap-3 mb-5">
                          <Icon className="w-5 h-5 text-black/25 group-hover:text-black/45 transition-colors duration-500" />
                          <span className="text-[11px] font-bold tracking-[0.25em] text-black/25 uppercase group-hover:text-black/35 transition-colors duration-500">
                            {tech.subtitle}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-black mb-4 group-hover:text-black/85 transition-colors duration-500">
                          {tech.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base font-light text-black/40 leading-relaxed max-w-xl group-hover:text-black/50 transition-colors duration-500">
                          {tech.description}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-10 mt-8 pt-6 border-t border-black/[0.04]">
                          {tech.stats.map((stat, i) => (
                            <div key={i}>
                              <p className="text-2xl sm:text-3xl font-black text-black tracking-[-0.02em]">
                                {stat.value}
                              </p>
                              <p className="text-[11px] font-bold tracking-[0.15em] text-black/25 uppercase mt-1">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Learn more */}
                      <div className="mt-8 pt-5 border-t border-black/[0.04]">
                        <span className="inline-flex items-center text-xs font-bold tracking-[0.2em] text-black/20 group-hover:text-black/40 transition-colors duration-500 uppercase">
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

      {/* ================================================================= */}
      {/*  PREVIEW IMAGE                                                    */}
      {/* ================================================================= */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black/[0.01]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <p className="text-[11px] font-bold tracking-[0.35em] text-black/25 uppercase mb-5">
              Preview
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.025em] text-black">
              See it in action
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-white border border-black/[0.06] rounded-3xl p-3 sm:p-5 overflow-hidden shadow-2xl shadow-black/[0.04]">
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
            <p className="text-center text-[11px] font-bold tracking-[0.2em] text-black/18 mt-6 uppercase">
              Early preview — work in progress
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  STATUS                                                           */}
      {/* ================================================================= */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-20 text-center">
            <p className="text-[11px] font-bold tracking-[0.35em] text-black/25 uppercase mb-5">
              Progress
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.025em] text-black">
              Current Status
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Implemented */}
            <FadeUp delay={0.1}>
              <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-3xl p-8 sm:p-10">
                <h3 className="text-xl font-black tracking-[-0.015em] mb-8 flex items-center gap-3 text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                  Implemented
                </h3>
                <ul className="space-y-4">
                  {implemented.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm font-light text-black/40 flex items-start gap-3"
                    >
                      <span className="w-1 h-1 rounded-full bg-black/12 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* In Development */}
            <FadeUp delay={0.2}>
              <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-3xl p-8 sm:p-10">
                <h3 className="text-xl font-black tracking-[-0.015em] mb-8 flex items-center gap-3 text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                  In Development
                </h3>
                <ul className="space-y-4">
                  {inDevelopment.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm font-light text-black/40 flex items-start gap-3"
                    >
                      <span className="w-1 h-1 rounded-full bg-black/8 mt-2 shrink-0" />
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
              <span className="font-bold text-black/65">May 2026</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  QUOTE                                                            */}
      {/* ================================================================= */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light italic text-black/55 leading-relaxed">
              &ldquo;There will be features that have never existed or have never been
              implemented in this way.&rdquo;
            </blockquote>
            <p className="mt-8 text-[11px] font-bold tracking-[0.35em] text-black/18 uppercase">
              — kryosette
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  CTA                                                              */}
      {/* ================================================================= */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="text-center">
          <FadeUp>
            <Link
              href="/self-university"
              className="group inline-flex items-center justify-center px-10 py-5 text-sm font-bold tracking-wide text-black/75 bg-black/[0.03] backdrop-blur-sm border border-black/8 rounded-full hover:bg-black/[0.07] hover:text-black hover:border-black/15 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Explore Self University</span>
              <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
            <p className="mt-8 text-[11px] font-bold tracking-[0.35em] text-black/15 uppercase">
              Production only when ready
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}