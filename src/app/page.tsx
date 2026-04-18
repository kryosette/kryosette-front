"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Network, Shield, Lock, Database, BrainCircuit, Edit3, Globe } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import GraphBackground from "@/components/GraphBackground";

// Данные технологий
const techStack = [
  {
    id: "kryo-arch",
    title: "Kryo Arch",
    subtitle: "Serverless by design",
    description: "Local-first architecture with infinite granular control. You decide who sees your data — down to individual bits.",
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
    description: "Direct L2→L4 encapsulation bypassing traditional routing. Undetectable by DPI, unstoppable by firewalls.",
    icon: Network,
    stats: [
      { label: "DPI bypass rate", value: "99.7%" },
      { label: "Encapsulation overhead", value: "4 bytes" },
    ],
  },
  {
    id: "security-scanners",
    title: "Security Scanners",
    subtitle: "Real-time threat detection",
    description: "Proprietary heuristic engines monitor memory, network, and system integrity. Zero-day exploits neutralized before they execute.",
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
    description: "Custom implementation independent of Tor. Sphinx packet format with anti-traffic-analysis padding.",
    icon: Lock,
    stats: [
      { label: "Minimum hops", value: "3" },
      { label: "Latency overhead", value: "~200ms" },
    ],
  },
  {
    id: "in-memory-db",
    title: "In‑Memory Database",
    subtitle: "Encrypted at runtime",
    description: "ACID-compliant graph database written in C. AES-256-GCM encryption with BLAKE3 checksums.",
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
    description: "On-device models detect manipulated media and coordinated inauthentic behavior. Your data never leaves your machine.",
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
    description: "Real-time visualization of internal processes. Tweak routing tables, inspect handshakes, modify policies.",
    icon: Edit3,
    stats: [
      { label: "Configurable params", value: "1,847" },
      { label: "Real-time updates", value: "60 FPS" },
    ],
  },
  {
    id: "rpki-validator",
    title: "RPKI Validator",
    subtitle: "BGP route security",
    description: "RFC 8210 compliant validator ensures communication only with legitimate peers. Prevents BGP hijacking.",
    icon: Globe,
    stats: [
      { label: "ROA cache", value: "47,382" },
      { label: "Validation time", value: "<1ms" },
    ],
  },
];

// Компонент с RGB-точками на фоне
const RGBParticles = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);
  
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 7,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            backgroundColor: [
              "rgb(255, 0, 0)",
              "rgb(255, 255, 0)",
              "rgb(0, 255, 0)",
              "rgb(0, 255, 255)",
              "rgb(0, 0, 255)",
              "rgb(255, 0, 255)",
              "rgb(255, 0, 0)",
            ],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Глобальный 3D-фон (только для hero) */}
      <div className="fixed inset-0 -z-20">
        <GraphBackground />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-5xl px-4 py-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 [text-shadow:_0_0_15px_rgb(0_0_0_/_80%),_0_0_30px_rgb(0_0_0_/_60%),_0_0_45px_rgb(0_0_0_/_40%)]">
            kryosette
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto [text-shadow:_0_0_8px_rgb(0_0_0_/_90%),_0_0_16px_rgb(0_0_0_/_70%),_0_0_24px_rgb(0_0_0_/_50%)]">
            A social network built from the ground up for security, resilience,
            and true ownership. <br className="hidden sm:block" />
            Desktop only · Linux x86 · C/ASM core.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#tech-stack"
              className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
            >
              Discover the tech
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/self-university"
              className="group inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black/30 backdrop-blur-md border border-white/20 rounded-full hover:bg-black/50 hover:border-white/40 transition-all shadow-lg hover:scale-105"
            >
              Self University
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center backdrop-blur-sm">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-2 bg-white/80 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Tech Stack Scroll Sections */}
      <div id="tech-stack" className="relative">
        {techStack.map((tech, index) => {
          const Icon = tech.icon;
          const isEven = index % 2 === 0;
          
          return (
            <TechSection
              key={tech.id}
              tech={tech}
              index={index}
              isEven={isEven}
              progress={scrollYProgress}
              Icon={Icon}
            />
          );
        })}
      </div>

      {/* Preview Image Section */}
      <section className="relative py-32">
        <RGBParticles />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-black/30 rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-4 text-white">
              See it in action
            </h2>
            <p className="text-xl text-gray-400 text-center mb-8">
              Early preview of the kryosette interface
            </p>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="https://github.com/user-attachments/assets/93610fa8-71f6-448a-85c4-08d9f96ab8f0"
                alt="kryosette preview interface"
                width={2940}
                height={1786}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Early preview — work in progress
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Implementation Status */}
      <section className="relative py-32">
        <RGBParticles />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-md bg-black/30 rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-white">
              Current Status & Upcoming Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Implemented
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• User profile system</li>
                  <li>• Friend adding mechanism</li>
                  <li>• Posts with comments & polls</li>
                  <li>• Public / private chats</li>
                  <li>• Transcendent bridge (prototype)</li>
                  <li>• Security scanners & detectors</li>
                  <li>• Proprietary onion routing</li>
                  <li>• In‑memory DB (base)</li>
                </ul>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  In Near Development
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• RPKI validator</li>
                  <li>• Additional network security tools</li>
                  <li>• Secure private chats</li>
                  <li>• Transparent Editor</li>
                  <li>• Translator</li>
                  <li>• Replication & more</li>
                  <li>• Local truth‑engine analyzer</li>
                  <li>• Advanced DPI bypass</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-300">
                First working demo expected around{" "}
                <span className="font-semibold text-white">May 17–18, 2026</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote / Vision */}
      <section className="relative py-32">
        <RGBParticles />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-light italic text-white"
          >
            "There will be features that have never existed or have never been
            implemented in this way."
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-gray-400"
          >
            Almost all code will be hidden, but you can watch every process in
            real time through the translator and fine‑tune settings via the editor.
          </motion.p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-32">
        <RGBParticles />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/self-university"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all hover:scale-105 shadow-lg border border-white/20"
            >
              Explore Self University
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Production will only take place when everything is ready.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Компонент для каждой технологической секции
function TechSection({ 
  tech, 
  index, 
  isEven, 
  progress,
  Icon 
}: { 
  tech: typeof techStack[0]; 
  index: number; 
  isEven: boolean;
  progress: any;
  Icon: any;
}) {
  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* RGB-частицы на фоне */}
      <RGBParticles />
      
      {/* Полупрозрачный слой */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      
      {/* Дополнительный градиентный слой */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
          {/* Текстовая часть */}
          <motion.div 
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium tracking-wider text-gray-400 mb-2">
              {tech.subtitle}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {tech.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl lg:max-w-none">
              {tech.description}
            </p>
            
            {/* Статистика */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              {tech.stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link
                href={`/technology/${tech.id}`}
                className="inline-flex items-center text-white/60 hover:text-white transition-colors group"
              >
                Learn more
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Визуальная часть */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-32 h-32 text-white/40" />
              </div>
              {/* Вращающиеся кольца */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-0 border border-white/10 rounded-full backdrop-blur-sm"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute inset-4 border border-white/5 rounded-full backdrop-blur-sm"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute inset-8 border border-white/5 rounded-full backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Прогресс-бар скролла */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-white/10"
      >
        <motion.div 
          style={{ scaleX: useTransform(progress, [index / 8, (index + 1) / 8], [0, 1]) }}
          className="h-full bg-white/40 origin-left"
        />
      </motion.div>
    </section>
  );
}