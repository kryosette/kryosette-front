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
  {
    id: "kryo-arch",
    title: "Kryo Arch",
    subtitle: "Serverless by design",
    description: "Local‑first architecture with infinite granular control.",
    icon: Cpu,
  },
  {
    id: "transcendent-bridge",
    title: "Transcendent Bridge",
    subtitle: "Beyond OSI layers",
    description: "Direct L2→L4 encapsulation. Undetectable by DPI.",
    icon: Network,
  },
  {
    id: "security-scanners",
    title: "Security Scanners",
    subtitle: "Real‑time threat detection",
    description: "Heuristic engines monitor memory & network integrity.",
    icon: Shield,
  },
  {
    id: "onion-routing",
    title: "Onion Routing",
    subtitle: "Multi‑hop anonymity",
    description: "Independent of Tor. Anti‑traffic‑analysis padding.",
    icon: Lock,
  },
  {
    id: "in-memory-db",
    title: "In‑Memory DB",
    subtitle: "Encrypted at runtime",
    description: "ACID graph database in C. AES‑256‑GCM, BLAKE3 checksums.",
    icon: Database,
  },
  {
    id: "truth-engine",
    title: "Truth Engine",
    subtitle: "Local AI verification",
    description: "On‑device detection. Your data stays local.",
    icon: BrainCircuit,
  },
  {
    id: "transparent-editor",
    title: "Transparent Editor",
    subtitle: "Full visibility",
    description: "Watch every process, tweak routing & policies.",
    icon: Edit3,
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

const sliderItems = [
  { id: "kryo-arch", title: "Kryo Arch", description: "Local‑first architecture", icon: Cpu },
  { id: "transcendent-bridge", title: "Transcendent Bridge", description: "L2→L4 direct encapsulation", icon: Network },
  { id: "security-scanners", title: "Security Scanners", description: "Real‑time threat detection", icon: Shield },
  { id: "onion-routing", title: "Onion Routing", description: "Multi‑hop anonymity", icon: Lock },
  { id: "in-memory-db", title: "In‑Memory DB", description: "Encrypted at runtime", icon: Database },
  { id: "truth-engine", title: "Truth Engine", description: "Local AI verification", icon: BrainCircuit },
  { id: "transparent-editor", title: "Transparent Editor", description: "Full visibility", icon: Edit3 },
];

// ---------------------------------------------------------------------------
// Jelly Letter
// ---------------------------------------------------------------------------
const JellyLetter = ({
  letter,
  delay,
  duration = 7,
}: {
  letter: string;
  delay: number;
  duration?: number;
}) => (
  <motion.span
    className="inline-block"
    style={{ willChange: "transform" }}
    animate={{
      y: [0, -1.5, 0, 1.5, 0],
      rotate: [0, 0.8, 0, -0.8, 0],
      scale: [1, 1.008, 1, 0.992, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {letter}
  </motion.span>
);

// ---------------------------------------------------------------------------
// Hero Decorations
// ---------------------------------------------------------------------------
const HeroDecorations = () => {
  const shapes = useMemo(
    () => [
      { cx: "8%", cy: "15%", r: 120, delay: 0 },
      { cx: "92%", cy: "22%", r: 80, delay: 0.3 },
      { cx: "5%", cy: "78%", r: 180, delay: 0.6 },
      { cx: "85%", cy: "72%", r: 60, delay: 0.9 },
      { cx: "50%", cy: "85%", r: 40, delay: 1.2 },
      { cx: "15%", cy: "45%", r: 8, delay: 0.2 },
      { cx: "78%", cy: "40%", r: 5, delay: 0.7 },
      { cx: "42%", cy: "12%", r: 6, delay: 1.0 },
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
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 1.5, delay: s.delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full h-full rounded-full border border-black/10" />
        </motion.div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// FadeUp
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
    const cardWidth = 320; // фиксированная ширина карточки
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    scrollLeftPos.current = sliderRef.current?.scrollLeft ?? 0;
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const dx = e.clientX - startX.current;
    sliderRef.current.scrollLeft = scrollLeftPos.current - dx;
  };

  return (
    <section className="py-20 lg:py-28 px-4 lg:px-8 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] text-black uppercase mb-4">
              Explore more
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.025em] text-black">
              Dive into the stack
            </h2>
          </div>
          <div className="hidden sm:flex gap-3">
            <button onClick={() => scroll("left")} disabled={!canScrollLeft} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center disabled:opacity-30 hover:bg-black/5 transition" aria-label="Scroll left">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center disabled:opacity-30 hover:bg-black/5 transition" aria-label="Scroll right">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-1"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {sliderItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/technology/${item.id}`}
                className="snap-start shrink-0 group"
                style={{ width: 500, height: 300 }} // ширина как у Apple-карточки
              >
                <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-2xl p-5 hover:bg-black/[0.03] hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500 flex items-center gap-5">
                  {/* Иконка слева */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                  {/* Текст справа */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-black group-hover:text-black transition-colors duration-500 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm font-extralight text-black/60 group-hover:text-black/80 transition-colors duration-500 truncate">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center text-xs font-semibold tracking-[0.2em] text-black group-hover:text-black transition-colors duration-500 uppercase mt-2">
                      Learn more
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
                    </span>
                  </div>
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
// Footer (Apple‑style) – with logo
// ---------------------------------------------------------------------------
const Footer = () => (
  <footer className="bg-[#f5f5f7] text-[#6e6e73] text-[12px] leading-normal py-8 px-6 lg:px-16">
    <div className="max-w-6xl mx-auto">
      {/* Logo row */}
      <div className="mb-8">
        <Image
          src="/assets/logo.png"
          alt="kryosette"
          width={70}
          height={10}
          className="h-8 w-auto"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="text-black text-[13px] font-semibold mb-3">Explore</h4>
          <ul className="space-y-2">
            <li><Link href="/#technologies" className="hover:text-black">Technologies</Link></li>
            <li><Link href="/self-university" className="hover:text-black">Self University</Link></li>
            <li><Link href="/#status" className="hover:text-black">Status</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-black text-[13px] font-semibold mb-3">kryosette</h4>
          <ul className="space-y-2">
            <li><Link href="/manifesto" className="hover:text-black">Manifesto</Link></li>
            <li><Link href="/threat-model" className="hover:text-black">Threat Model</Link></li>
            <li><Link href="/warrant-canary" className="hover:text-black">Warrant Canary</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-black text-[13px] font-semibold mb-3">Contact</h4>
          <ul className="space-y-2">
            <li><Link href="mailto:contact@kryosette.net" className="hover:text-black">Email (PGP)</Link></li>
            <li><Link href="/assets/pgp-key.asc" className="hover:text-black">PGP Key</Link></li>
            <li><a href="http://kryosettexxxxxxxx.onion" target="_blank" rel="noopener noreferrer" className="hover:text-black">.onion mirror</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-black text-[13px] font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="hover:text-black">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-black">Terms of Use</Link></li>
            <li><span className="cursor-default">© 2026 kryosette</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-5 flex flex-col md:flex-row md:justify-between text-[11px]">
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
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-black/10 z-50 origin-left"
        style={{ scaleX: progressBarScale }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 py-20 overflow-hidden">
        <HeroDecorations />
        <div className="w-full max-w-6xl mx-auto">
          <div className="max-w-3xl relative z-10">
            <FadeUp delay={0.05}>
              <p className="text-[11px] font-semibold tracking-[0.35em] text-black uppercase mb-10">
                Desktop only · Linux x86 · C/ASM core
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[10rem] xl:text-[12rem] font-extrabold tracking-[-0.035em] leading-[0.82] text-black mb-10">
                <span className="whitespace-nowrap">
                  <JellyLetter letter="k" delay={0} />
                  <JellyLetter letter="r" delay={0.2} />
                  <JellyLetter letter="y" delay={0.4} />
                  <JellyLetter letter="o" delay={0.6} />
                  <JellyLetter letter="s" delay={0.8} />
                  <JellyLetter letter="e" delay={1.0} />
                  <JellyLetter letter="t" delay={1.2} />
                  <JellyLetter letter="t" delay={1.4} />
                  <JellyLetter letter="e" delay={1.6} />
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-xl sm:text-2xl lg:text-3xl font-extralight text-black/70 max-w-2xl leading-relaxed mb-12">
                A social network built from the ground up for security, resilience,
                and true ownership.
              </p>
            </FadeUp>
            <FadeUp delay={0.35}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#tech-stack"
                  className="group inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Discover the tech</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
                <Link
                  href="/self-university"
                  className="group inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide text-black bg-black/[0.03] backdrop-blur-sm border border-black/10 rounded-full hover:bg-black/[0.06] hover:text-black hover:border-black/20 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Self University</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-black/20"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase font-semibold">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-black/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Grid – landscape cards (16:9) */}
      <section id="tech-stack" className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-20">
            <p className="text-[11px] font-semibold tracking-[0.35em] text-black uppercase mb-5">Technology</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.025em] text-black">Core systems</h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <FadeUp key={tech.id} delay={index * 0.06}>
                  <Link href={`/technology/${tech.id}`} className="block h-full group">
                    <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-2xl p-6 hover:bg-black/[0.03] hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500 flex flex-col justify-between aspect-[16/9]">
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <Icon className="w-5 h-5 text-black group-hover:text-black transition-colors duration-500" />
                          <span className="text-[11px] font-semibold tracking-[0.25em] text-black uppercase group-hover:text-black transition-colors duration-500">
                            {tech.subtitle}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-black mb-3 group-hover:text-black transition-colors duration-500">
                          {tech.title}
                        </h3>
                        <p className="text-sm font-extralight text-black/60 leading-relaxed max-w-xl group-hover:text-black/80 transition-colors duration-500">
                          {tech.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-black/[0.05]">
                        <span className="inline-flex items-center text-xs font-semibold tracking-[0.2em] text-black group-hover:text-black transition-colors duration-500 uppercase">
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
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black/[0.01]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <p className="text-[11px] font-semibold tracking-[0.35em] text-black uppercase mb-5">Preview</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.025em] text-black">See it in action</h2>
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
            <p className="text-center text-[11px] font-semibold tracking-[0.2em] text-black mt-6 uppercase">Early preview — work in progress</p>
          </FadeUp>
        </div>
      </section>

      {/* Status */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-20 text-center">
            <p className="text-[11px] font-semibold tracking-[0.35em] text-black uppercase mb-5">Progress</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.025em] text-black">Current Status</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FadeUp delay={0.1}>
              <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-3xl p-8 sm:p-10">
                <h3 className="text-xl font-extrabold tracking-[-0.015em] mb-8 flex items-center gap-3 text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" /> Implemented
                </h3>
                <ul className="space-y-4">
                  {implemented.map((item, i) => (
                    <li key={i} className="text-sm font-extralight text-black/70 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-black/20 mt-2 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="h-full bg-black/[0.015] backdrop-blur-sm border border-black/[0.05] rounded-3xl p-8 sm:p-10">
                <h3 className="text-xl font-extrabold tracking-[-0.015em] mb-8 flex items-center gap-3 text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" /> In Development
                </h3>
                <ul className="space-y-4">
                  {inDevelopment.map((item, i) => (
                    <li key={i} className="text-sm font-extralight text-black/70 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-black/20 mt-2 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.3} className="mt-16 text-center">
            <p className="text-lg font-extralight text-black/70">
              First working demo expected <span className="font-semibold text-black">May 2026</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 lg:py-40 px-6 lg:px-16 bg-black/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extralight italic text-black/80 leading-relaxed">
              &ldquo;There will be features that have never existed or have never been
              implemented in this way.&rdquo;
            </blockquote>
            <p className="mt-8 text-[11px] font-semibold tracking-[0.35em] text-black/50 uppercase">— kryosette</p>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 lg:py-40 px-6 lg:px-16">
        <div className="text-center">
          <FadeUp>
            <Link
              href="/self-university"
              className="group inline-flex items-center justify-center px-10 py-5 text-sm font-semibold tracking-wide text-black bg-black/[0.03] backdrop-blur-sm border border-black/10 rounded-full hover:bg-black/[0.07] hover:text-black hover:border-black/20 transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Explore Self University</span>
              <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform duration-500" />
            </Link>
            <p className="mt-8 text-[11px] font-semibold tracking-[0.35em] text-black/30 uppercase">Production only when ready</p>
          </FadeUp>
        </div>
      </section>

      <TechnologySlider />
      <Footer />
    </div>
  );
}