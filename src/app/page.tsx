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
import { useRef, useMemo, useState, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
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
  "Public / private chats", "Transcendent bridge (prototype)", "Security scanners & detectors",
  "Proprietary onion routing", "In‑memory DB (base)",
];

const inDevelopment = [
  "RPKI validator", "Additional network security tools", "Secure private chats",
  "Transparent Editor", "Translator", "Replication & more",
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

// ---------------------------------------------------------------------------
// Liquid Glass Background (BIG orbs only, no small stars)
// ---------------------------------------------------------------------------
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
    {/* Base gradient */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(79,126,255,0.06) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 80% 70%, rgba(168,85,247,0.05) 0%, transparent 55%), " +
          "radial-gradient(ellipse at 10% 80%, rgba(6,182,212,0.05) 0%, transparent 50%), " +
          "linear-gradient(180deg, #fafafe 0%, #f8f8ff 50%, #fafaff 100%)",
      }}
    />

    {/* Big animated orbs */}
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

    {/* Glass pane */}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)",
        backdropFilter: "blur(0.5px)",
      }}
    />

    {/* Transition to white at bottom */}
    <div
      className="absolute left-0 right-0 bottom-0"
      style={{
        height: "35%",
        background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.95) 75%, #ffffff 100%)",
      }}
    />
  </div>
);

// ---------------------------------------------------------------------------
// Jelly letter
// ---------------------------------------------------------------------------
const JellyLetter = ({
  letter, delay, duration = 7,
}: { letter: string; delay: number; duration?: number }) => (
  <motion.span className="inline-block" style={{ willChange: "transform" }}
    animate={{ y: [0, -2, 0, 2, 0], rotate: [0, 0.9, 0, -0.9, 0], scale: [1, 1.01, 1, 0.99, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>{letter}</motion.span>
);

// ---------------------------------------------------------------------------
// FadeUp
// ---------------------------------------------------------------------------
const FadeUp = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.72, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>{children}</motion.div>
);

// ---------------------------------------------------------------------------
// Technology Slider
// ---------------------------------------------------------------------------
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
    <section className="py-24 lg:py-32 px-4 lg:px-8 bg-[#f5f5f7] border-t border-black/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div><p className="text-[11px] font-semibold tracking-[0.35em] text-black/40 uppercase mb-4">Explore more</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-black leading-tight">Dive into the stack</h2></div>
          <div className="hidden sm:flex gap-2.5">
            {(["left","right"] as const).map(dir => (
              <button key={dir} onClick={() => scroll(dir)} disabled={dir === "left" ? !canScrollLeft : !canScrollRight}
                className="w-9 h-9 rounded-full bg-black/[0.05] border border-black/[0.08] flex items-center justify-center disabled:opacity-25 hover:bg-black/10 transition-all duration-300"
                aria-label={`Scroll ${dir}`}>{dir === "left" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</button>))}
          </div>
        </div>
        <div ref={sliderRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-1 pb-2"
          onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}>
          {sliderItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={`/technology/${item.id}`} className="snap-start shrink-0 group relative block" style={{ width: 480, height: 290 }}>
                <div className="w-full h-full bg-white border border-black/[0.06] rounded-2xl p-7 hover:shadow-2xl hover:shadow-black/[0.08] transition-all duration-500 flex items-start gap-6 relative overflow-hidden"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 20% 50%, ${item.accent}0A 0%, transparent 60%)` }} />
                  <div className="relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center mt-0.5 transition-all duration-500 group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${item.accent}22, ${item.accent}11)`, border: `1px solid ${item.accent}33` }}>
                    <Icon className="w-7 h-7 transition-colors duration-500" style={{ color: item.accent }} /></div>
                  <div className="relative flex-1 min-w-0">
                    <h3 className="text-[1.1rem] font-semibold text-black tracking-tight truncate mb-1.5 group-hover:opacity-80 transition-opacity duration-300">{item.title}</h3>
                    <p className="text-[13px] text-black/50 leading-relaxed truncate group-hover:text-black/65 transition-colors duration-300">{item.description}</p>
                    <span className="inline-flex items-center text-[11px] font-semibold tracking-[0.18em] text-black/40 group-hover:text-black/70 transition-all duration-500 uppercase mt-5">Learn more<ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform duration-400" /></span>
                  </div>
                  <span className="absolute bottom-4 right-5 text-[4.5rem] font-extrabold text-black/[0.04] leading-none pointer-events-none select-none tabular-nums">{String(index+1).padStart(2,"0")}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const Footer = () => (
  <footer className="bg-[#f5f5f7] text-[#6e6e73] text-[12px] leading-normal py-10 px-6 lg:px-16 border-t border-black/[0.06]">
    <div className="max-w-6xl mx-auto">
      <div className="mb-9 flex items-end">
        <Image src="/assets/logo.png" alt="kryosette" width={80} height={20} className="h-8 w-auto translate-y-2 -translate-x-1" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-9">
        {[{ title: "Explore", links: [{ href: "/#technologies", label: "Technologies" }, { href: "/self-university", label: "Self University" }, { href: "/#status", label: "Status" }] },
          { title: "kryosette", links: [{ href: "/manifesto", label: "Manifesto" }, { href: "/threat-model", label: "Threat Model" }, { href: "/warrant-canary", label: "Warrant Canary" }] },
          { title: "Contact", links: [{ href: "mailto:contact@kryosette.net", label: "Email (PGP)" }, { href: "/assets/pgp-key.asc", label: "PGP Key" }, { href: "http://kryosettexxxxxxxx.onion", label: ".onion mirror", external: true }] },
          { title: "Legal", links: [{ href: "/privacy", label: "Privacy Policy" }, { href: "/terms", label: "Terms of Use" }] }].map(col => (
          <div key={col.title}><h4 className="text-black text-[13px] font-semibold mb-3">{col.title}</h4><ul className="space-y-2">
            {col.links.map(link => <li key={link.label}>{"external" in link && link.external ? <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors duration-200">{link.label}</a> : <Link href={link.href} className="hover:text-black transition-colors duration-200">{link.label}</Link>}</li>)}
            {col.title === "Legal" && <li><span className="cursor-default">© 2026 kryosette</span></li>}
          </ul></div>))}
      </div>
      <div className="border-t border-gray-200/80 pt-5 flex flex-col md:flex-row md:justify-between text-[11px]">
        <p>Built with security as foundation. No trackers. No analytics. No compromises.</p>
        <p className="mt-2 md:mt-0">Desktop only · Linux x86 · C/ASM core</p>
      </div>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressBarScale = useSpring(scrollYProgress, { stiffness: 40, damping: 15 });

  return (
    <div ref={containerRef} className="relative bg-white text-black overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-[1.5px] z-50 origin-left"
        style={{ scaleX: progressBarScale, background: "linear-gradient(90deg, rgba(79,126,255,0.6), rgba(168,85,247,0.6), rgba(244,63,142,0.6))" }} />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 py-20 overflow-hidden">
        <LiquidGlassBackground />
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <FadeUp delay={0.05}><p className="text-[11px] font-semibold tracking-[0.38em] text-black/40 uppercase mb-10">Desktop only · Linux x86 · C/ASM core</p></FadeUp>
            <FadeUp delay={0.12}>
              <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[10rem] xl:text-[12rem] font-extrabold tracking-[-0.035em] leading-[0.82] text-black mb-10 -translate-x-2">
                <span className="whitespace-nowrap">{["k","r","y","o","s","e","t","t","e"].map((l,i) => <JellyLetter key={i} letter={l} delay={i*0.18} />)}</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.25}><p className="text-xl sm:text-2xl lg:text-[1.65rem] font-light text-black/60 max-w-2xl leading-relaxed mb-12 tracking-[-0.01em]">A social network built from the ground up for security, resilience, and true ownership.</p></FadeUp>
            <FadeUp delay={0.35}>
              <div className="flex flex-wrap gap-4">
                <Link href="#tech-stack" className="group inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-400 shadow-lg shadow-black/20"><span>Discover the tech</span><ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-0.5 transition-transform duration-400" /></Link>
                <Link href="/self-university" className="group inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-black bg-white/60 backdrop-blur-sm border border-black/12 rounded-full hover:bg-white/80 hover:border-black/20 transition-all duration-400 shadow-sm"><span>Self University</span><ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-0.5 transition-transform duration-400" /></Link>
              </div>
            </FadeUp>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"><motion.div animate={{ y: [0,7,0] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }} className="flex flex-col items-center gap-2"><div className="w-[1px] h-8 bg-gradient-to-b from-black/20 to-transparent" /></motion.div></div>
      </section>

      {/* Tech Grid */}
      <section id="tech-stack" className="py-32 lg:py-40 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-20"><p className="text-[11px] font-semibold tracking-[0.38em] text-black/35 uppercase mb-5">Technology</p><h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-black leading-tight">Core systems</h2></FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <FadeUp key={tech.id} delay={index*0.055}><Link href={`/technology/${tech.id}`} className="block h-full group">
                  <div className="h-full bg-[#f9f9fb] border border-black/[0.05] rounded-2xl p-6 hover:bg-white hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-500 flex flex-col justify-between aspect-[16/9] relative overflow-hidden">
                    <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle, ${tech.accent}22 0%, transparent 70%)`, filter: "blur(20px)" }} />
                    <div className="relative"><div className="flex items-center gap-3 mb-5"><div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${tech.accent}25, ${tech.accent}12)`, border: `1px solid ${tech.accent}30` }}><Icon className="w-4 h-4" style={{ color: tech.accent }} /></div><span className="text-[10px] font-semibold tracking-[0.22em] text-black/40 uppercase group-hover:text-black/60 transition-colors duration-400">{tech.subtitle}</span></div><h3 className="text-xl sm:text-[1.3rem] font-bold tracking-[-0.02em] text-black mb-2.5">{tech.title}</h3><p className="text-[13px] font-light text-black/55 leading-relaxed group-hover:text-black/70 transition-colors duration-400">{tech.description}</p></div>
                    <div className="relative mt-4 pt-4 border-t border-black/[0.05]"><span className="inline-flex items-center text-[11px] font-semibold tracking-[0.18em] text-black/35 group-hover:text-black/65 transition-colors duration-400 uppercase">Learn more<ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-400" /></span></div>
                  </div></Link></FadeUp>);
            })}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16 text-center"><p className="text-[11px] font-semibold tracking-[0.38em] text-black/35 uppercase mb-5">Preview</p><h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-black leading-tight">See it in action</h2></FadeUp>
          <FadeUp delay={0.1}><div className="bg-white border border-black/[0.05] rounded-3xl p-3 sm:p-5 overflow-hidden shadow-2xl shadow-black/[0.06]"><Image src="https://github.com/user-attachments/assets/93610fa8-71f6-448a-85c4-08d9f96ab8f0" alt="kryosette preview interface" width={2940} height={1786} className="w-full h-auto rounded-2xl" priority unoptimized /></div><p className="text-center text-[11px] font-semibold tracking-[0.2em] text-black/30 mt-6 uppercase">Early preview · work in progress</p></FadeUp>
        </div>
      </section>

      {/* Status */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-20 text-center"><p className="text-[11px] font-semibold tracking-[0.38em] text-black/35 uppercase mb-5">Progress</p><h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-black leading-tight">Current Status</h2></FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeUp delay={0.1}><div className="h-full bg-[#f9f9fb] border border-black/[0.05] rounded-3xl p-8 sm:p-10 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500"><h3 className="text-[1.05rem] font-bold tracking-[-0.015em] mb-8 flex items-center gap-3 text-black"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />Implemented</h3><ul className="space-y-3.5">{implemented.map((item,i) => <li key={i} className="text-[13px] font-light text-black/65 flex items-start gap-3"><span className="w-1 h-1 rounded-full bg-green-400/60 mt-2 shrink-0" />{item}</li>)}</ul></div></FadeUp>
            <FadeUp delay={0.2}><div className="h-full bg-[#f9f9fb] border border-black/[0.05] rounded-3xl p-8 sm:p-10 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500"><h3 className="text-[1.05rem] font-bold tracking-[-0.015em] mb-8 flex items-center gap-3 text-black"><span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />In Development</h3><ul className="space-y-3.5">{inDevelopment.map((item,i) => <li key={i} className="text-[13px] font-light text-black/65 flex items-start gap-3"><span className="w-1 h-1 rounded-full bg-yellow-400/60 mt-2 shrink-0" />{item}</li>)}</ul></div></FadeUp>
          </div>
          <FadeUp delay={0.3} className="mt-16 text-center"><p className="text-lg font-light text-black/55">First working demo expected <span className="font-semibold text-black">May 2026</span></p></FadeUp>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto text-center"><FadeUp><blockquote className="text-2xl sm:text-3xl lg:text-[2.1rem] font-light italic text-black/70 leading-relaxed tracking-[-0.015em]">&ldquo;There will be features that have never existed or have never been implemented in this way.&rdquo;</blockquote><p className="mt-8 text-[11px] font-semibold tracking-[0.38em] text-black/30 uppercase">kryosette</p></FadeUp></div>
      </section>

      {/* CTA */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-white">
        <div className="text-center"><FadeUp><Link href="/self-university" className="group inline-flex items-center justify-center px-10 py-4 text-[13px] font-semibold tracking-[0.02em] text-black bg-[#f5f5f7] border border-black/8 rounded-full hover:bg-black hover:text-white hover:border-transparent transition-all duration-500 shadow-sm"><span>Explore Self University</span><ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-0.5 transition-transform duration-400" /></Link><p className="mt-8 text-[11px] font-semibold tracking-[0.38em] text-black/25 uppercase">Production only when ready</p></FadeUp></div>
      </section>

      <TechnologySlider />
      <Footer />
    </div>
  );
}