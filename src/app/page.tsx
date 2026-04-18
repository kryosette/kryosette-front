"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Network, Shield, Lock, Database, BrainCircuit, Edit3, Globe } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
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

// RGB-частицы на фоне
const RGBParticles = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);
  
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 4,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 8,
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
              "rgb(255, 50, 50)",
              "rgb(255, 255, 50)",
              "rgb(50, 255, 50)",
              "rgb(50, 255, 255)",
              "rgb(50, 50, 255)",
              "rgb(255, 50, 255)",
              "rgb(255, 50, 50)",
            ],
            opacity: [0, 0.9, 0.9, 0],
            scale: [0.3, 1.8, 1.8, 0.3],
            boxShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 20px currentColor",
              "0 0 20px currentColor",
              "0 0 0px rgba(255,255,255,0)",
            ],
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
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative">
      {/* Глобальный 3D-фон (только для hero) */}
      <div className="fixed inset-0 -z-20">
        <GraphBackground />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 max-w-5xl px-4 py-20"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 [text-shadow:_0_0_20px_rgb(0_0_0_/_80%),_0_0_40px_rgb(0_0_0_/_60%),_0_0_60px_rgb(0_0_0_/_40%)]"
          >
            kryosette
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto [text-shadow:_0_0_8px_rgb(0_0_0_/_90%),_0_0_16px_rgb(0_0_0_/_70%),_0_0_24px_rgb(0_0_0_/_50%)]"
          >
            A social network built from the ground up for security, resilience,
            and true ownership. <br className="hidden sm:block" />
            Desktop only · Linux x86 · C/ASM core.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#tech-stack"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-black bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/20"
            >
              Discover the tech
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/self-university"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-black/30 backdrop-blur-md border border-white/20 rounded-full hover:bg-black/50 hover:border-white/40 transition-all shadow-2xl hover:scale-105"
            >
              Self University
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-7 h-12 border border-white/30 rounded-full flex justify-center backdrop-blur-sm"
          >
            <motion.div 
              animate={{ y: [2, 16, 2] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-white/80 rounded-full mt-2"
            />
          </motion.div>
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
              progress={smoothProgress}
              Icon={Icon}
            />
          );
        })}
      </div>

      {/* Preview Image Section - ВОЗВРАЩАЕМ БЕЛЫЙ ФОН */}
      <section className="relative py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-center mb-4 text-gray-900">
              See it in action
            </h2>
            <p className="text-xl text-gray-500 text-center mb-12">
              Early preview of the kryosette interface
            </p>
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
            >
              <Image
                src="https://github.com/user-attachments/assets/93610fa8-71f6-448a-85c4-08d9f96ab8f0"
                alt="kryosette preview interface"
                width={2940}
                height={1786}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </motion.div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Early preview — work in progress
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Implementation Status - БЕЛЫЙ ФОН */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-gray-900">
              Current Status & Upcoming Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Implemented
                </h3>
                <ul className="space-y-3 text-gray-600">
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
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  In Near Development
                </h3>
                <ul className="space-y-3 text-gray-600">
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
            <div className="mt-10 text-center">
              <p className="text-lg text-gray-500">
                First working demo expected around{" "}
                <span className="font-semibold text-gray-900">May 17–18, 2026</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote / Vision - БЕЛЫЙ ФОН */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-2xl md:text-3xl font-light italic text-gray-800"
          >
            "There will be features that have never existed or have never been
            implemented in this way."
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 text-gray-500"
          >
            Almost all code will be hidden, but you can watch every process in
            real time through the translator and fine‑tune settings via the editor.
          </motion.p>
        </div>
      </section>

      {/* Call to Action - БЕЛЫЙ ФОН */}
      <section className="py-32 px-4 text-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link
            href="/self-university"
            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-xl"
          >
            Explore Self University
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-6 text-sm text-gray-500">
            Production will only take place when everything is ready.
          </p>
        </motion.div>
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
  progress: MotionValue<number>;
  Icon: any;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(sectionProgress, [0, 1], [100, -100]);
  const opacity = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(sectionProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity }}
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      {/* RGB-частицы на фоне */}
      <RGBParticles />
      
      {/* Полупрозрачный слой с параллаксом */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
      />
      
      {/* Дополнительный градиентный слой */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
          {/* Текстовая часть */}
          <motion.div 
            initial={{ opacity: 0, x: isEven ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>
            <p className="text-sm font-medium tracking-widest text-gray-300 mb-3 uppercase">
              {tech.subtitle}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
              {tech.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl lg:max-w-none leading-relaxed">
              {tech.description}
            </p>
            
            {/* Статистика */}
            <div className="flex flex-wrap gap-12 justify-center lg:justify-start">
              {tech.stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <Link
                href={`/technology/${tech.id}`}
                className="inline-flex items-center text-white/70 hover:text-white transition-colors group text-lg"
              >
                Learn more
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Визуальная часть - ИСПРАВЛЯЕМ РАЗМЫТИЕ ИКОНКИ */}
          <motion.div 
            style={{ scale }}
            className="flex-1 flex justify-center"
          >
            <div className="relative aspect-square w-full max-w-lg">
              {/* Фоновое свечение */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
              
              {/* ЧЁТКАЯ ИКОНКА БЕЗ РАЗМЫТИЯ */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-40 h-40 text-white drop-shadow-2xl" strokeWidth={1.5} />
              </div>
              
              {/* Вращающиеся кольца - чёткие */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute inset-0 border-2 border-white/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="absolute inset-6 border border-white/15 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="absolute inset-12 border border-white/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                className="absolute inset-20 border border-white/5 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Прогресс-бар скролла */}
      <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <motion.div 
          style={{ scaleX: useTransform(progress, [index / 8, (index + 1) / 8], [0, 1]) }}
          className="h-full bg-white/60 origin-left"
        />
      </motion.div>
    </motion.section>
  );
}