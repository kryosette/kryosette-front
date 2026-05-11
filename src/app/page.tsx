"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Cpu,
  Network,
  Shield,
  Lock,
  Database,
  BrainCircuit,
  Edit3,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";

// ------------------------------------------------------------------------------
// Data
// ------------------------------------------------------------------------------
const techStack = [
  { id: "kryo-arch", title: "Kryo Arch", subtitle: "Serverless by design", description: "Local‑first architecture with infinite granular control.", icon: Cpu, accent: "#5B8AF5" },
  { id: "transcendent-bridge", title: "Transcendent Bridge", subtitle: "Beyond OSI layers", description: "Direct L2–L4 encapsulation. Undetectable by DPI.", icon: Network, accent: "#B45BF5" },
  { id: "security-scanners", title: "Security Scanners", subtitle: "Real‑time threat detection", description: "Heuristic engines monitor memory & network integrity.", icon: Shield, accent: "#F55B8A" },
  { id: "onion-routing", title: "Onion Routing", subtitle: "Multi‑hop anonymity", description: "Independent of Tor. Anti‑traffic‑analysis padding.", icon: Lock, accent: "#5BF5D4" },
  { id: "in-memory-db", title: "In‑Memory DB", subtitle: "Encrypted at runtime", description: "ACID graph database in C. AES‑256‑GCM, BLAKE3 checksums.", icon: Database, accent: "#F5C45B" },
  { id: "truth-engine", title: "Truth Engine", subtitle: "Local AI verification", description: "On‑device detection. Your data stays local.", icon: BrainCircuit, accent: "#5BF57A" },
  { id: "transparent-editor", title: "Transparent Editor", subtitle: "Full visibility", description: "Watch every process, tweak routing & policies.", icon: Edit3, accent: "#F5885B" },
];

const implemented = [
  "User profile system", "Friend adding mechanism", "Posts with comments & polls",
  "Public / private chats", "Transcendent bridge (partially)", "Security scanners & detectors (partially)",
  "Proprietary onion routing (partially)", "In‑memory DB (base)",
];

const inDevelopment = [
  "Kryo arch", "Additional network security tools", "Secure private chats",
  "Transparent Editor", "Translator & editor", "Replication & more",
  "Local truth‑engine analyzer", "Advanced DPI bypass",
];

const sliderItems = [
  { id: "kryo-arch", title: "Kryo Arch", description: "Local‑first architecture", icon: Cpu, accent: "#5B8AF5" },
  { id: "transcendent-bridge", title: "Transcendent Bridge", description: "L2–L4 direct encapsulation", icon: Network, accent: "#B45BF5" },
  { id: "security-scanners", title: "Security Scanners", description: "Real‑time threat detection", icon: Shield, accent: "#F55B8A" },
  { id: "onion-routing", title: "Onion Routing", description: "Multi‑hop anonymity", icon: Lock, accent: "#5BF5D4" },
  { id: "in-memory-db", title: "In‑Memory DB", description: "Encrypted at runtime", icon: Database, accent: "#F5C45B" },
  { id: "truth-engine", title: "Truth Engine", description: "Local AI verification", icon: BrainCircuit, accent: "#5BF57A" },
  { id: "transparent-editor", title: "Transparent Editor", description: "Full visibility", icon: Edit3, accent: "#F5885B" },
];

// ------------------------------------------------------------------------------
// Liquid Glass Background (BIG orbs only)
// ------------------------------------------------------------------------------
const orbs = [
  { color: "#4F7EFF", x: 8,  y: 12, size: 500, speed: 14, dx: 12, dy: 8  },
  { color: "#A855F7", x: 72, y: 8,  size: 420, speed: 18, dx: -10, dy: 14 },
  { color: "#F43F8E", x: 88, y: 58, size: 380, speed: 22, dx: -14, dy: -8 },
  { color: "#06B6D4", x: 18, y: 65, size: 460, speed: 16, dx: 8,  dy: -12 },
  { color: "#10D981", x: 48, y: 82, size: 300, speed: 20, dx: -6, dy: 10  },
  { color: "#F59E0B", x: 55, y: 28, size: 280, speed: 25, dx: 10, dy: -6  },
  { color: "#8B5CF6", x: 30, y: 40, size: 350, speed: 19, dx: -8, dy: 14  },
  { color: "#EC4899", x: 78, y: 78, size: 260, speed: 23, dx: 12, dy: 8   },
  { color: "#14B8A6", x: 62, y: 50, size: 220, speed: 28, dx: -10, dy: -10 },
  { color: "#6366F1", x: 5,  y: 88, size: 320, speed: 17, dx: 14, dy: -6  },
];

const LiquidGlassBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(79,126,255,0.08) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.06) 0%, transparent 55%), " +
          "radial-gradient(ellipse at 10% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), " +
          "linear-gradient(180deg, #0a0a0a 0%, #050510 50%, #0a0a0a 100%)",
      }}
    />
    {orbs.map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${orb.x}%`,
          top: `${orb.y}%`,
          width: orb.size,
          height: orb.size,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle at 40% 40%, ${orb.color}CC 0%, ${orb.color}55 40%, transparent 70%)`,
          filter: "blur(60px)",
          willChange: "transform",
        }}
        animate={{
          x: [0, orb.dx * 6, orb.dx * 2, orb.dx * 10, 0],
          y: [0, orb.dy * 5, orb.dy * 9, orb.dy * 3, 0],
          scale: [1, 1.08, 0.95, 1.05, 1],
          opacity: [0.55, 0.7, 0.5, 0.65, 0.55],
        }}
        transition={{
          duration: orb.speed,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.8,
        }}
      />
    ))}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(0.5px)",
      }}
    />
    <div
      className="absolute left-0 right-0 bottom-0"
      style={{
        height: "35%",
        background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 75%, #000000 100%)",
      }}
    />
  </div>
);

// ------------------------------------------------------------------------------
// Liquid Glass Card Component — Apple-style glass effect with color diffusion
// ------------------------------------------------------------------------------
const LiquidGlassCard = ({ tech, index }: { tech: typeof techStack[0]; index: number }) => {
  const Icon = tech.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <FadeUp delay={index * 0.055}>
      <Link
        href={`/technology/${tech.id}`}
        className="block h-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="h-full relative rounded-[28px] p-[1px] aspect-[16/10] transition-all duration-700"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${tech.accent}60 0%, ${tech.accent}20 30%, rgba(255,255,255,0.1) 50%, ${tech.accent}20 70%, ${tech.accent}60 100%)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
            boxShadow: isHovered
              ? `0 0 0 1px ${tech.accent}15, 0 25px 50px -12px ${tech.accent}30, 0 0 80px ${tech.accent}15, inset 0 0 60px ${tech.accent}05`
              : '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="h-full rounded-[27px] p-7 sm:p-8 relative overflow-hidden transition-all duration-700"
            style={{
              background: isHovered
                ? 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          >
            <motion.div
              className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${tech.accent}40 0%, ${tech.accent}20 30%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
              animate={{ opacity: isHovered ? 1 : 0.3, scale: isHovered ? 1.3 : 1, x: isHovered ? 10 : 0, y: isHovered ? 10 : 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <motion.div
              className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${tech.accent}25 0%, ${tech.accent}10 40%, transparent 70%)`,
                filter: 'blur(35px)',
              }}
              animate={{ opacity: isHovered ? 0.9 : 0.15, scale: isHovered ? 1.4 : 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
            />
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${tech.accent}15 0%, transparent 60%)`, filter: 'blur(25px)' }}
              animate={{ opacity: isHovered ? 0.7 : 0, scale: isHovered ? 1.2 : 0.8 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            />
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${tech.accent}30 20%, rgba(255,255,255,0.5) 50%, ${tech.accent}30 80%, transparent 100%)` }}
              animate={{ opacity: isHovered ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute top-2 left-4 right-4 h-16 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)', filter: 'blur(8px)' }}
              animate={{ opacity: isHovered ? 0.6 : 0.2 }}
              transition={{ duration: 0.5 }}
            />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${tech.accent}25 0%, ${tech.accent}10 100%)`,
                      boxShadow: isHovered ? `0 0 20px ${tech.accent}40, inset 0 0 20px ${tech.accent}10` : 'none',
                      border: `1px solid ${tech.accent}30`,
                    }}
                    animate={{ scale: isHovered ? 1.08 : 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: `radial-gradient(circle at center, ${tech.accent}30 0%, transparent 70%)` }}
                      animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.5 : 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <Icon className="w-5 h-5 relative z-10 transition-all duration-500" style={{ color: tech.accent, filter: isHovered ? `drop-shadow(0 0 8px ${tech.accent}80)` : 'none' }} />
                  </motion.div>
                  <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/50">
                    {tech.subtitle}
                  </span>
                </div>
                <h3 className="text-[1.3rem] sm:text-[1.5rem] font-bold tracking-[-0.02em] text-white mb-3 transition-opacity duration-400 group-hover:opacity-90">
                  {tech.title}
                </h3>
                <p className="text-[14px] font-light text-white/50 leading-relaxed transition-colors duration-400 group-hover:text-white/70 max-w-md">
                  {tech.description}
                </p>
              </div>

              <div
                className="relative z-10 mt-auto pt-5 transition-colors duration-500"
                style={{ borderTop: `1px solid ${isHovered ? `${tech.accent}25` : 'rgba(255,255,255,0.06)'}` }}
              >
                <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40">
                  Learn more
                  <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform duration-400" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </FadeUp>
  );
};

// ------------------------------------------------------------------------------
// Jelly letter
// ------------------------------------------------------------------------------
const JellyLetter = ({ letter, delay, duration = 7 }: { letter: string; delay: number; duration?: number }) => (
  <motion.span
    className="inline-block"
    style={{ willChange: "transform" }}
    animate={{ y: [0, -2, 0, 2, 0], rotate: [0, 0.9, 0, -0.9, 0], scale: [1, 1.01, 1, 0.99, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {letter}
  </motion.span>
);

// ------------------------------------------------------------------------------
// FadeUp
// ------------------------------------------------------------------------------
const FadeUp = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.72, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ------------------------------------------------------------------------------
// Liquid Glass Slider Card
// ------------------------------------------------------------------------------
const LiquidGlassSliderCard = ({ item, index }: { item: typeof sliderItems[0]; index: number }) => {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/technology/${item.id}`}
      className="snap-start shrink-0 group relative block"
      style={{ width: 480, height: 290 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full h-full relative rounded-[24px] p-[1px] transition-all duration-700"
        style={{
          background: isHovered
            ? `linear-gradient(135deg, ${item.accent}50 0%, ${item.accent}15 35%, rgba(255,255,255,0.1) 50%, ${item.accent}15 65%, ${item.accent}50 100%)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          boxShadow: isHovered
            ? `0 0 0 1px ${item.accent}20, 0 25px 60px -15px ${item.accent}35, 0 0 100px ${item.accent}15`
            : '0 0 0 1px rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="w-full h-full rounded-[23px] p-7 relative overflow-hidden transition-all duration-700"
          style={{
            background: isHovered
              ? 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          }}
        >
          <motion.div
            className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${item.accent}35 0%, ${item.accent}15 35%, transparent 70%)`, filter: 'blur(45px)' }}
            animate={{ opacity: isHovered ? 1 : 0.25, scale: isHovered ? 1.4 : 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${item.accent}25 0%, transparent 65%)`, filter: 'blur(40px)' }}
            animate={{ opacity: isHovered ? 0.85 : 0.1, scale: isHovered ? 1.3 : 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
          />
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${item.accent}40, rgba(255,255,255,0.5), ${item.accent}40, transparent)` }}
            animate={{ opacity: isHovered ? 1 : 0.2 }}
            transition={{ duration: 0.5 }}
          />

          <div className="relative z-10 flex items-start gap-6 h-full">
            <motion.div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center mt-0.5 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${item.accent}22, ${item.accent}11)`,
                border: `1px solid ${item.accent}33`,
                boxShadow: isHovered ? `0 0 25px ${item.accent}35` : 'none',
              }}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle, ${item.accent}25 0%, transparent 70%)` }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              <Icon className="w-7 h-7 relative z-10 transition-all duration-500" style={{ color: item.accent, filter: isHovered ? `drop-shadow(0 0 10px ${item.accent}90)` : 'none' }} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[1.1rem] font-semibold text-white tracking-tight truncate mb-1.5 group-hover:opacity-80 transition-opacity duration-300">
                {item.title}
              </h3>
              <p className="text-[13px] text-white/40 leading-relaxed truncate group-hover:text-white/60 transition-colors duration-300">
                {item.description}
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.18em] uppercase mt-5 text-white/30">
                Learn more
                <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform duration-400" />
              </span>
            </div>
            <span className="absolute bottom-4 right-5 text-[4.5rem] font-extrabold text-white/[0.03] leading-none pointer-events-none select-none tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ------------------------------------------------------------------------------
// Technology Slider
// ------------------------------------------------------------------------------
const TechnologySlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const checkScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = 500 + 20;
    el.scrollBy({ left: direction === "left" ? -cardWidth * 1.2 : cardWidth * 1.2, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => { setIsDragging(true); startX.current = e.clientX; scrollLeftPos.current = sliderRef.current?.scrollLeft ?? 0; };
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => { if (!isDragging || !sliderRef.current) return; sliderRef.current.scrollLeft = scrollLeftPos.current - (e.clientX - startX.current); };

  return (
    <section className="py-24 lg:py-32 px-4 lg:px-8 bg-[#1c1c1e] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] text-white/50 uppercase mb-4">Explore more</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-white leading-tight">Dive into the stack</h2>
          </div>
          <div className="hidden sm:flex gap-2.5">
            {(["left", "right"] as const).map(dir => (
              <button key={dir} onClick={() => scroll(dir)} disabled={dir === "left" ? !canScrollLeft : !canScrollRight}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-25 hover:bg-white/10 transition-all duration-300"
                aria-label={`Scroll ${dir}`}
              >
                {dir === "left" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-1 pb-2"
          onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}
        >
          {sliderItems.map((item, index) => (
            <LiquidGlassSliderCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#1c1c1e] text-[#6e6e73] text-[12px] leading-normal py-10 px-6 lg:px-16 border-t border-white/5">
    <div className="max-w-6xl mx-auto">
      <div className="mb-9 flex items-end">
        <div className="text-2xl font-bold text-white tracking-tighter">kryosette</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-9">
        {[
          { 
            title: "Explore", 
            links: [
              { href: "/#technologies", label: "Technologies" }, 
              { href: "/self-university", label: "Self University" }, 
              { href: "/bytegraph", label: "ByteGraph" },
              { href: "/roadmap", label: "Roadmap" },
              { href: "/changelog", label: "Changelog" },
            ] 
          },
          { 
            title: "Community", 
            links: [
              { href: "/community", label: "Community" },
              { href: "/docs", label: "Documentation" },
              { href: "/careers", label: "Careers" },
              { href: "/press", label: "Press Kit" },
              { href: "/events", label: "Events" },
            ] 
          },
          { 
            title: "Security", 
            links: [
              { href: "/security", label: "Security Center" },
              { href: "/transparency", label: "Transparency Report" },
              { href: "/warrant-canary", label: "Warrant Canary" },
              { href: "/threat-model", label: "Threat Model" },
            ] 
          },
          { 
            title: "More", 
            links: [
              { href: "/manifesto", label: "Manifesto" },
              { href: "/start", label: "Getting Started" },
              { href: "/faq", label: "FAQ" },
              { href: "/why-kryosette", label: "Why kryosette?" },
              { href: "/pricing", label: "Pricing" },
              { href: "/partners", label: "Partners" },
            ] 
          },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-white text-[13px] font-semibold mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row md:justify-between text-[11px]">
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          <Link href="mailto:kryosette@gmail.com" className="hover:text-white transition-colors">Contact</Link>
          <span className="cursor-default">© 2026 kryosette</span>
        </div>
        <p className="mt-2 md:mt-0">Desktop only · Linux x86 · C/ASM core</p>
      </div>
    </div>
  </footer>
);

const BlogSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Array<{
    title: string;
    slug: string;
    date: string;
    summary: string;
    path: string;
    images?: string[];
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  useEffect(() => {
    fetch('https://selfuniversity.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => {
        const enPosts = data
          .filter((p: any) => p.language === 'en')
          .filter((p: any, i: number, arr: any[]) => arr.findIndex((x: any) => x.slug === p.slug) === i);
        setPosts(enPosts);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const checkScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = 500 + 20;
    el.scrollBy({ left: direction === "left" ? -cardWidth * 1.2 : cardWidth * 1.2, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => { setIsDragging(true); startX.current = e.clientX; scrollLeftPos.current = sliderRef.current?.scrollLeft ?? 0; };
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => { if (!isDragging || !sliderRef.current) return; sliderRef.current.scrollLeft = scrollLeftPos.current - (e.clientX - startX.current); };

  return (
    <section className="py-24 lg:py-32 px-4 lg:px-8 bg-[#1c1c1e] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] text-white/50 uppercase mb-4">
              From Self University
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-white leading-tight">
              Latest articles
            </h2>
          </div>
          <div className="hidden sm:flex gap-2.5">
            {(["left", "right"] as const).map(dir => (
              <button key={dir} onClick={() => scroll(dir)} disabled={dir === "left" ? !canScrollLeft : !canScrollRight}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-25 hover:bg-white/10 transition-all duration-300"
                aria-label={`Scroll ${dir}`}
              >
                {dir === "left" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="snap-start shrink-0 bg-white/5 rounded-2xl animate-pulse" style={{ width: 480, height: 290 }} />
            ))}
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-1 pb-2"
            onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}
          >
            {posts.map((post, index) => (
              <a
                key={post.slug}
                href={`https://selfuniversity.vercel.app/${post.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start shrink-0 group relative block"
                style={{ width: 480, height: 290 }}
              >
                <div className="w-full h-full bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-7 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl hover:shadow-black/50 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Edit3 className="w-5 h-5 text-white/40" />
                      </div>
                      <span className="text-[10px] font-semibold tracking-[0.22em] text-white/40 uppercase">
                        Self University
                      </span>
                    </div>
                    <h3 className="text-[1.1rem] font-semibold text-white tracking-tight line-clamp-2 mb-2 group-hover:opacity-80 transition-opacity duration-300">
                      {post.title}
                    </h3>
                    <p className="text-[13px] text-white/40 leading-relaxed line-clamp-2">
                      {post.summary || 'Read the full article on Self University'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <span className="text-[11px] font-semibold tracking-[0.18em] text-white/30 uppercase">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.18em] text-white/50 hover:text-white transition-colors uppercase">
                      Read more
                      <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform duration-400" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ------------------------------------------------------------------------------
// Main Page
// ------------------------------------------------------------------------------
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressBarScale = useSpring(scrollYProgress, { stiffness: 40, damping: 15 });

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] z-50 origin-left"
        style={{ scaleX: progressBarScale, background: "linear-gradient(90deg, rgba(79,126,255,0.6), rgba(168,85,247,0.6), rgba(244,63,142,0.6))" }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 py-20 overflow-hidden">
        <LiquidGlassBackground />
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <FadeUp delay={0.05}>
              <p className="text-[11px] font-semibold tracking-[0.38em] text-white/50 uppercase mb-10">Desktop only · Linux x86 · C/ASM core</p>
            </FadeUp>
            <FadeUp delay={0.12}>
              <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[10rem] xl:text-[12rem] font-extrabold tracking-[-0.035em] leading-[0.82] text-white mb-10 -translate-x-2">
                <span className="whitespace-nowrap">
                  {["k","r","y","o","s","e","t","t","e"].map((l, i) => (
                    <JellyLetter key={i} letter={l} delay={i * 0.18} />
                  ))}
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-xl sm:text-2xl lg:text-[1.65rem] font-light text-white/70 max-w-2xl leading-relaxed mb-12 tracking-[-0.01em]">
                A social network built from the ground up for security, resilience, and true ownership.
              </p>
            </FadeUp>
            <FadeUp delay={0.35}>
              <div className="flex flex-wrap gap-4">
                <Link
  href="/demo"
  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-white rounded-full transition-all duration-500 overflow-hidden"
  style={{
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 30px rgba(255, 255, 255, 0.08), inset 0 0 30px rgba(255, 255, 255, 0.03)',
  }}
>
  {/* Медленное RGB-свечение — всегда активно */}
  <motion.div
    className="absolute inset-0 rounded-full"
    style={{
      background: `
        radial-gradient(circle at 30% 50%, rgba(255, 0, 0, 0.2), transparent 50%),
        radial-gradient(circle at 70% 50%, rgba(0, 0, 255, 0.2), transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.15), transparent 50%)
      `,
    }}
    animate={{
      background: [
        `
          radial-gradient(circle at 30% 50%, rgba(255, 0, 0, 0.2), transparent 50%),
          radial-gradient(circle at 70% 50%, rgba(0, 0, 255, 0.2), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.15), transparent 50%)
        `,
        `
          radial-gradient(circle at 20% 60%, rgba(255, 255, 0, 0.2), transparent 50%),
          radial-gradient(circle at 80% 40%, rgba(255, 0, 255, 0.2), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.15), transparent 50%)
        `,
        `
          radial-gradient(circle at 40% 50%, rgba(0, 255, 0, 0.2), transparent 50%),
          radial-gradient(circle at 60% 50%, rgba(0, 255, 255, 0.2), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.15), transparent 50%)
        `,
        `
          radial-gradient(circle at 30% 40%, rgba(0, 0, 255, 0.2), transparent 50%),
          radial-gradient(circle at 70% 60%, rgba(255, 0, 0, 0.2), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.15), transparent 50%)
        `,
        `
          radial-gradient(circle at 30% 50%, rgba(255, 0, 0, 0.2), transparent 50%),
          radial-gradient(circle at 70% 50%, rgba(0, 0, 255, 0.2), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.15), transparent 50%)
        `,
      ],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "linear",
    }}
  />

  {/* Блик по верху */}
  <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

  {/* Контент */}
  <span className="relative z-10 flex items-center gap-2.5">
    DEMO2026
    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-400" />
  </span>
</Link>
                <Link href="/self-university" className="group inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-white bg-white/20 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/30 transition-all duration-400 shadow-sm">
                  <span>Self University</span>
                  <ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-0.5 transition-transform duration-400" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Tech Grid */}
      <section id="tech-stack" className="py-32 lg:py-40 px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-20">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/40 uppercase mb-5">Technology</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-white leading-tight">Core systems</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techStack.map((tech, index) => (
              <LiquidGlassCard key={tech.id} tech={tech} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/40 uppercase mb-5">Preview</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-white leading-tight">See it in action</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-3 sm:p-5 overflow-hidden shadow-2xl shadow-black/50">
              <Image src="https://github.com/user-attachments/assets/93610fa8-71f6-448a-85c4-08d9f96ab8f0" alt="kryosette preview interface" width={2940} height={1786} className="w-full h-auto rounded-2xl" priority unoptimized />
            </div>
            <p className="text-center text-[11px] font-semibold tracking-[0.2em] text-white/20 mt-6 uppercase">Early preview · work in progress</p>
          </FadeUp>
        </div>
      </section>

      {/* Status */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-20 text-center">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/40 uppercase mb-5">Progress</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-white leading-tight">Current Status</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeUp delay={0.1}>
              <div className="h-full bg-[#2c2c2e] border border-white/5 rounded-3xl p-8 sm:p-10 hover:shadow-xl hover:shadow-black/50 transition-all duration-500">
                <h3 className="text-[1.05rem] font-bold tracking-[-0.015em] mb-8 flex items-center gap-3 text-white">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> Implemented
                </h3>
                <ul className="space-y-3.5">
                  {implemented.map((item, i) => (
                    <li key={i} className="text-[13px] font-light text-white/50 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-green-400/60 mt-2 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="h-full bg-[#2c2c2e] border border-white/5 rounded-3xl p-8 sm:p-10 hover:shadow-xl hover:shadow-black/50 transition-all duration-500">
                <h3 className="text-[1.05rem] font-bold tracking-[-0.015em] mb-8 flex items-center gap-3 text-white">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]" /> In Development
                </h3>
                <ul className="space-y-3.5">
                  {inDevelopment.map((item, i) => (
                    <li key={i} className="text-[13px] font-light text-white/50 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-yellow-400/60 mt-2 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
          {/* <FadeUp delay={0.3} className="mt-16 text-center">
            <p className="text-lg font-light text-white/40">First working demo expected <span className="font-semibold text-white">May 2026</span></p>
          </FadeUp> */}
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <blockquote className="text-2xl sm:text-3xl lg:text-[2.1rem] font-light italic text-white/60 leading-relaxed tracking-[-0.015em]">
              &ldquo;There will be features that have never existed or have never been implemented in this way.&rdquo;
            </blockquote>
            <p className="mt-8 text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase">kryosette</p>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black">
        <div className="text-center">
          <FadeUp>
            <Link href="/self-university" className="group inline-flex items-center justify-center px-10 py-4 text-[13px] font-semibold text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition-all duration-500 shadow-sm">
              <span>Explore Self University</span>
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-0.5 transition-transform duration-400" />
            </Link>
            <p className="mt-8 text-[11px] font-semibold tracking-[0.38em] text-white/20 uppercase">Production only when ready</p>
          </FadeUp>
        </div>
      </section>

      <BlogSlider />
      <Footer />
    </div>
  );
}