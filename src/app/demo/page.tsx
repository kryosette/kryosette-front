"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Lock,
  Eye,
  Database,
  Network,
  Cpu,
  Edit3,
  BrainCircuit,
  Server,
  Cloud,
  GitGraph,
  Sparkles,
  Fingerprint,
  Binary,
  Hash,
  Shuffle,
  Unlock,
  X,
  Microscope,
  MessageCircle,
  Clock,
  FlaskConical,
  FileText,
  Layout,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Principles
// ---------------------------------------------------------------------------
const principles = [
  { slug: "c-asm-core", icon: Binary, label: "C/ASM Only", color: "text-blue-400" },
  { slug: "serverless", icon: Server, label: "Serverless", color: "text-emerald-400" },
  { slug: "local-first", icon: Cloud, label: "Local‑First", color: "text-sky-400" },
  { slug: "no-icmp", icon: Network, label: "No ICMP", color: "text-cyan-400" },
  { slug: "full-traffic-visibility", icon: Eye, label: "Full Traffic Visibility", color: "text-pink-400" },
  { slug: "encryption-everywhere", icon: Lock, label: "Encryption Everywhere", color: "text-purple-400" },
  { slug: "zero-dependencies", icon: Shield, label: "Zero Dependencies", color: "text-amber-400" },
  { slug: "fault-tolerance", icon: Shuffle, label: "Fault Tolerance", color: "text-rose-400" },
  { slug: "user-sovereignty", icon: Unlock, label: "User Sovereignty", color: "text-lime-400" },
];

const principleDetails = [
  { slug: "c-asm-core", icon: Binary, title: "C/ASM Only", subtitle: "No Java. No TypeScript. No garbage collectors.", description: "Every line of kryosette is written in C and Assembly. No virtual machines, no interpreters, no garbage collection pauses. Direct access to memory, direct control over execution, direct responsibility for every byte." },
  { slug: "serverless", icon: Server, title: "Serverless by Design (Done Schematically)", subtitle: "No central infrastructure. No single point of failure.", description: "kryosette has no servers. Not a single one. The entire network runs on improved peer‑to‑peer communication with improved distributed hash tables for discovery (This is just a small part, and there are fundamentally different approaches). There is nothing to hack, nothing to subpoena, nothing to shut down." },
  { slug: "local-first", icon: Cloud, title: "Local‑First Storage", subtitle: "Your data never leaves your machine without your permission.", description: "Everything is stored locally on your device. Messages, profiles, contacts, media — all on your hard drive, encrypted at rest. Your machine is the source of truth." },
  { slug: "no-icmp", icon: Network, title: "No ICMP — Custom Replacement", subtitle: "Replacing broken infrastructure with perfect solutions.", description: "ICMP is replaced with a custom protocol that provides full visibility into network diagnostics without leaking information. Where existing protocols fail or are abused to restrict communication, we build clean replacements that cannot be turned against users. Every legacy component that enables censorship gets replaced with an alternative designed for freedom — no compromises, no backdoors, no central points of control." },
  { slug: "full-traffic-visibility", icon: Eye, title: "Full Traffic Visibility", subtitle: "Nothing is hidden from you.", description: "Through the Transparent Editor, you can watch every packet your machine sends and receives. Every route through the onion network. Every encryption handshake." },
  { slug: "encryption-everywhere", icon: Lock, title: "Encryption Everywhere", subtitle: "Every byte. Every channel. Every device. Always.", description: "End‑to‑end encryption is the only mode of operation. Every message, every file, every profile update is encrypted before it leaves your machine." },
  { slug: "zero-dependencies", icon: Shield, title: "Zero External Dependencies", subtitle: "No third‑party services. No cloud providers.", description: "kryosette does not depend on any external service. The entire system is self‑contained. If a cloud provider goes bankrupt, kryosette doesn't notice." },
  { slug: "fault-tolerance", icon: Shuffle, title: "Fault Tolerance by Design", subtitle: "The network survives when most nodes go offline.", description: "There is no critical infrastructure. The DHT automatically re‑routes around failures. Data replicates via CRDTs without a central coordinator." },
  { slug: "user-sovereignty", icon: Unlock, title: "User Sovereignty", subtitle: "You control who sees your data.", description: "Granular access control built into the architecture. Decide who sees a post, who can comment, who can forward. Change settings retroactively." },
];

// ---------------------------------------------------------------------------
// Technologies (4 items)
// ---------------------------------------------------------------------------
const technologies = [
  { slug: "kryo-arch", icon: Cpu, label: "Kryo Arch", color: "text-indigo-400" },
  { slug: "transcendent-bridge", icon: Network, label: "Transcendent Bridge", color: "text-violet-400" },
  { slug: "in-memory-db", icon: Database, label: "In‑Memory DB", color: "text-orange-400" },
  { slug: "transparent-editor", icon: Edit3, label: "Transparent Editor", color: "text-green-400" },
];

const techDetails = [
  {
    slug: "kryo-arch", icon: Cpu, title: "Kryo Arch", subtitle: "Local‑first serverless architecture",
    shortDesc: "The architectural foundation. Every component runs on your machine. No cloud backend. No API server. (Done Schematically)",
    extended: "Kryo Arch is a radical departure from traditional client‑server models. Everything is stored locally on your machine. You decide exactly who sees your posts, who is hidden, and how data flows. This architecture makes the network virtually unblockable and puts you in complete ownership of your digital presence. This is just a small part, and there are fundamentally different approaches",
    images: null,
  },
  {
    slug: "transcendent-bridge", icon: Network, title: "Transcendent Bridge", subtitle: "Extends beyond L2 – a new network layer.",
    shortDesc: "Bypasses traditional routing. Undetectable by deep packet inspection. Unstoppable by firewalls. Security Scanners.",
    extended: "The Transcendent Bridge is a proprietary network extension that operates across all OSI layers, not just L2. It allows us to establish direct, secure channels even in hostile network environments, bypassing DPI and other interference techniques.",
    images: [
      { src: "/assets/bridge1.png", width: 1054, height: 782 },
      { src: "/assets/bridge2.png", width: 1054, height: 782 },
      { src: "/assets/bridge3.png", width: 1054, height: 782 },
      { src: "/assets/bridge4.png", width: 1054, height: 782 },
      { src: "/assets/bridge5.png", width: 652, height: 1020 },
    ],
  },
  {
    slug: "in-memory-db", icon: Database, title: "In‑Memory DB", subtitle: "Custom database engine in C",
    shortDesc: "Segregated fits allocator. AES‑256‑GCM encryption. BLAKE3 checksums. Microsecond query latency.",
    extended: "Why build our own database? Because existing solutions weren't designed for our threat model. Our engine — KryoDB — uses a segregated fits allocator with size classes optimised for social graph operations. Every page is individually encrypted with its own IV.",
    images: null,
  },
  {
    slug: "transparent-editor", icon: Edit3, title: "Transparent Editor", subtitle: "Watch every process. Change every setting.",
    shortDesc: "Real‑time dashboard of all internal processes. TCP states, memory stats, routing paths, encryption handshakes. Live parameter editing.",
    extended: "The Transparent Editor exposes every internal process through a real‑time dashboard. TCP connection states with RTT and congestion window. Memory allocator statistics per size class. Current onion routing paths with latency per hop.",
    images: [
      { src: "/assets/editor1.png", width: 1054, height: 782 },
      { src: "/assets/editor2.png", width: 1054, height: 782 },
      { src: "/assets/editor3.png", width: 1054, height: 782 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Overview screenshots
// ---------------------------------------------------------------------------
const overviewImages = [
  { src: "/assets/demo1.png", width: 902, height: 747 },
  { src: "/assets/demo2.png", width: 902, height: 747 },
];

// ---------------------------------------------------------------------------
// Planned (Truth Engine + ByteGraph with links)
// ---------------------------------------------------------------------------
const planned = [
  {
    slug: "truth-engine",
    icon: BrainCircuit,
    title: "Truth Engine",
    subtitle: "On‑device AI verification",
    shortDesc: "Manipulated media detection. Coordinated behaviour analysis. All processing happens locally — your data never leaves your machine.",
    color: "text-fuchsia-400",
    href: "/technology/truth-engine",
  },
  {
    slug: "bytegraph",
    icon: GitGraph,
    title: "ByteGraph",
    subtitle: "Formal binary verification via data‑flow graphs",
    shortDesc: "Byte‑level static analysis of x86 binaries. Complete data‑flow graph construction. Security property verification in two modes: Test Mode for internal auditing and Public Mode for publishing proofs without revealing implementation.",
    color: "text-yellow-400",
    href: "/bytegraph",
  },
  {
  slug: "local-great-analyzer",
  icon: Microscope,
  title: "Local Great Analyzer",
  subtitle: "Common-sense control for every user action",
  shortDesc: "Based on the Truth Engine. Monitors all user actions to ensure they remain within the bounds of common sense and security policies. Prevents accidental data leaks, risky sharing, and policy violations before they happen — without ever sending data off‑device.",
  color: "text-teal-400",
  href: "/technology/truth-engine",
},
];

// ---------------------------------------------------------------------------
// Algorithms (security, not cryptography)
// ---------------------------------------------------------------------------
const algorithms = [
  {
    slug: "entangled-prng",
    icon: Shuffle,
    title: "Entangled PRNG / DRS‑Generator",
    subtitle: "Double Randomized Seed Generator",
    shortDesc: "A multi‑level cascade pseudo‑random number generator with dual independent seeds and non‑linear combination. Provides forward secrecy guarantees for all random values in the system.",
    detailed: "The DRS‑Generator uses two independent seeds that evolve using different algorithms. The seed of values and the seed of offsets develop independently with no reverse feedback from the output. At generation time, the two streams combine through a non‑linear function, making the next output unpredictable even with full knowledge of both current seeds. This provides mathematical forward secrecy — compromising the current state reveals nothing about past outputs. Used for ASLR in the allocator, session key generation, and nonce creation throughout kryosette. This is a security algorithm — not a cryptographic primitive.",
    color: "text-purple-400",
  },
  {
    slug: "ephemeral-hash-cas",
    icon: Hash,
    title: "Ephemeral Hash CAS",
    subtitle: "One‑time hashes for lock‑free data structures",
    shortDesc: "Replaces traditional version counters with unpredictable one‑time hashes in Compare‑And‑Swap operations. Provides inherent resistance to targeted ABA attacks in concurrent data structures.",
    detailed: "Traditional CAS operations use monotonically increasing version counters, creating predictable patterns that attackers exploit in ABA attacks. Ephemeral Hash CAS replaces version counters with one‑time unpredictable hashes generated by the Entangled PRNG. The hashes have no predictable sequence, making it mathematically impossible for an attacker to engineer a successful ABA exploit. Cyclic hash reuse is normal and expected — there are no overflow edge cases to handle. This approach works identically for stacks, queues, trees, and memory allocators, providing a unified security model for all concurrent operations. This is a security algorithm — not a cryptographic primitive.",
    color: "text-cyan-400",
  },
  {
    slug: "s-msgid-cache",
    icon: MessageCircle,
    title: "S_MSGID_CACHE",
    subtitle: "Secure Message ID Cache",
    shortDesc: "A deterministic, timing‑attack resistant message and session ID allocator powered by the DRS‑Generator. Maintains constant‑time performance regardless of load or cache state.",
    detailed: "S_MSGID_CACHE uses the Entangled PRNG to generate message and session identifiers with minimal predictability. Unlike traditional ID allocators that exhibit timing variations under different load conditions — variations that leak information to attackers — this cache guarantees deterministic performance regardless of cache hit or miss. The generator's forward secrecy property means that even with a complete memory dump, future message IDs cannot be predicted. Integrated with the allocator's ASLR to provide defence‑in‑depth: even if an attacker compromises one layer, the other remains intact. This is a security algorithm — not a cryptographic primitive.",
    color: "text-rose-400",
  },
  {
    slug: "zerosum",
    icon: Binary,
    title: "ZeroSum Algorithm",
    subtitle: "Data integrity via symmetric zero‑sum sequences",
    shortDesc: "A mathematical integrity verification method using zero‑sum sequence generation. Detects data corruption and tampering with configurable sensitivity. Used for checksum verification in the in‑memory database.",
    detailed: "ZeroSum generates symmetric sequences where all elements sum to zero with high numerical precision. The algorithm uses two parameters — f₀ (base factor) and s₀ (expected first element) — to generate a sequence that acts as a mathematical signature. After data transmission or storage, the sequence is regenerated and compared. Deviations as small as 0.2% are reliably detected. In testing across 1000 runs, the zero-sum condition was satisfied 938 times. The remaining 62 runs produced a non-zero residual due to floating-point accumulation errors — a known limitation currently being addressed. This is a security algorithm — not a cryptographic primitive.", color: "text-amber-400",
  }, 
];

// ---------------------------------------------------------------------------
// Fade-in wrapper
// ---------------------------------------------------------------------------
function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Principle Section
// ---------------------------------------------------------------------------
function PrincipleSection({ item, index }: { item: typeof principleDetails[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div id={item.slug} className={`relative py-16 lg:py-20 px-6 lg:px-16 scroll-mt-20 ${index % 2 === 1 ? "bg-white/[0.01]" : ""}`}>
      <div className={`max-w-5xl mx-auto flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-10 lg:gap-20`}>
        <FadeInSection>
          <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center flex-shrink-0">
            <item.icon className="w-20 h-20 lg:w-28 lg:h-28 text-white/[0.06]" />
          </div>
        </FadeInSection>
        <div className="flex-1 max-w-xl">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-white/50 mb-4 backdrop-blur-sm tracking-wide">
              {item.subtitle}
            </div>
          </FadeInSection>
          <FadeInSection>
            <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-[-0.03em] text-white leading-[1.1] mb-3">{item.title}</h3>
          </FadeInSection>
          <FadeInSection>
            <p className="text-base text-white/80 leading-relaxed font-light">{item.description}</p>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DemoPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (activeSlug) {
      scrollTo(activeSlug);
      setActiveSlug(null);
    }
  }, [activeSlug]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-16 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <FadeInSection><p className="text-[10px] sm:text-[12px] font-bold tracking-[0.4em] text-white/30 uppercase mb-6">kryosette</p></FadeInSection>
          <FadeInSection><h1 className="text-[5rem] sm:text-[8rem] lg:text-[12rem] font-black tracking-[-0.05em] leading-[0.9] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Demo26</h1></FadeInSection>
          <FadeInSection><p className="text-lg sm:text-xl lg:text-2xl font-medium text-white/50 max-w-3xl mx-auto leading-relaxed mb-12 tracking-[-0.01em]">Every principle. Every technology. Every line of C/ASM. Explore what makes kryosette fundamentally different.</p></FadeInSection>
          <FadeInSection>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => scrollTo("overview")} className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all gap-2 tracking-wide">Explore the stack <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></button>
              <Link href="/community" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm tracking-wide">Join the community</Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Overview Screenshots */}
      <section id="overview" className="py-24 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-white/40 mb-6 backdrop-blur-sm tracking-wide">
                <Layout className="w-3.5 h-3.5" /> Overview
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-[-0.04em] text-white leading-[1.05]">Social Network</h2>
              <p className="text-white/40 mt-4 max-w-xl mx-auto text-lg font-light">A first look at the kryosette interface. Built from scratch.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {overviewImages.map((img, idx) => (
              <FadeInSection key={idx}>
                <button
                  onClick={() => setLightboxImage(img.src)}
                  className="relative w-full bg-white/[0.01] border border-white/[0.04] rounded-3xl overflow-hidden group hover:border-white/10 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img
                    src={img.src}
                    alt={`kryosette overview ${idx + 1}`}
                    className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md rounded-xl px-3 py-1.5 text-[11px] font-bold tracking-wider text-white/50 group-hover:text-white/80 transition-all uppercase">
                    Expand
                  </div>
                </button>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <p className="text-[11px] text-white/20 text-center mt-6 font-medium tracking-wide">
              Early development preview — not final design
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Principles Chips */}
      <section id="principles" className="py-12 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <FadeInSection><p className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase text-center mb-6">9 architectural principles · click to jump</p></FadeInSection>
          <div className="flex flex-wrap justify-center gap-2.5">
            {principles.map((p, i) => (
              <FadeInSection key={i}><button onClick={() => scrollTo(p.slug)} className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-wider uppercase hover:scale-105 transition-all duration-300 backdrop-blur-sm border-white/10 text-white/50 hover:text-white/80"><p.icon className={`w-3.5 h-3.5 ${p.color} group-hover:scale-110 transition-transform`} /> {p.label}</button></FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Details */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          {principleDetails.map((p, i) => <PrincipleSection key={p.slug} item={p} index={i} />)}
        </div>
      </section>

      {/* Technology Chips */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <FadeInSection><p className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase text-center mb-6">4 core technologies · click to jump</p></FadeInSection>
          <div className="flex flex-wrap justify-center gap-2.5">
            {technologies.map((tech, i) => (
              <FadeInSection key={i}><button onClick={() => scrollTo(tech.slug)} className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-wider uppercase hover:scale-105 transition-all duration-300 backdrop-blur-sm border-white/10 text-white/50 hover:text-white/80"><tech.icon className={`w-3.5 h-3.5 ${tech.color} group-hover:scale-110 transition-transform`} /> {tech.label}</button></FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Details */}
      <section id="technologies" className="py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          {techDetails.map((tech, i) => (
            <div key={tech.slug} id={tech.slug} className={`relative py-24 lg:py-32 px-6 lg:px-16 scroll-mt-20 ${i % 2 === 1 ? "bg-white/[0.01]" : ""}`}>
              <div className="max-w-5xl mx-auto">
                <FadeInSection><p className="text-[8rem] sm:text-[14rem] lg:text-[18rem] font-black text-white/[0.04] leading-none select-none pointer-events-none mb-[-2rem] sm:mb-[-4rem] lg:mb-[-6rem]">{String(i + 1).padStart(2, "0")}</p></FadeInSection>
                <div className="relative z-10">
                  <FadeInSection><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-white/50 mb-6 backdrop-blur-sm tracking-wide"><tech.icon className="w-3.5 h-3.5" /> {tech.subtitle}</div></FadeInSection>
                  <FadeInSection><h3 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-[-0.04em] text-white leading-[1.05] mb-8">{tech.title}</h3></FadeInSection>

                  {/* Images — Bridge */}
                  {tech.slug === "transcendent-bridge" && tech.images && (
                    <FadeInSection>
                      <div className="space-y-3 mb-10">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="col-span-2 grid grid-cols-2 gap-3">
                            {tech.images.slice(0, 4).map((img, idx) => (
                              <button key={idx} onClick={() => setLightboxImage(img.src)} className="relative aspect-video bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                <img src={img.src} alt={`Bridge ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                                <div className="absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/50 group-hover:text-white/80 transition-all uppercase">Expand</div>
                              </button>
                            ))}
                          </div>
                          <button onClick={() => setLightboxImage(tech.images[4].src)} className="relative row-span-2 bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-500 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                            <img src={tech.images[4].src} alt="Bridge 5" className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700" />
                            <div className="absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/50 group-hover:text-white/80 transition-all uppercase">Expand</div>
                          </button>
                        </div>
                        <p className="text-[11px] text-white/20 text-center mt-3 font-medium tracking-wide">Test data only — not real user information</p>
                      </div>
                    </FadeInSection>
                  )}

                  {/* Images — Editor */}
                  {tech.slug === "transparent-editor" && tech.images && (
                    <FadeInSection>
                      <div className="space-y-3 mb-10">
                        <div className="grid grid-cols-2 gap-3">
                          {tech.images.slice(0, 2).map((img, idx) => (
                            <button key={idx} onClick={() => setLightboxImage(img.src)} className="relative aspect-video bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-500">
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                              <img src={img.src} alt={`Editor ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                              <div className="absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/50 group-hover:text-white/80 transition-all uppercase">Expand</div>
                            </button>
                          ))}
                        </div>
                        <button onClick={() => setLightboxImage(tech.images[2].src)} className="relative w-full aspect-video bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden group hover:border-white/10 transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                          <img src={tech.images[2].src} alt="Editor 3" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                          <div className="absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/50 group-hover:text-white/80 transition-all uppercase">Expand</div>
                        </button>
                        <p className="text-[11px] text-white/20 text-center mt-3 font-medium tracking-wide">Test data only — not real user information</p>
                      </div>
                    </FadeInSection>
                  )}

                  <FadeInSection><p className="text-xl sm:text-2xl text-white leading-relaxed mb-6 font-medium tracking-[-0.01em]">{tech.shortDesc}</p></FadeInSection>
                  <FadeInSection><div className="prose prose-invert max-w-none"><p className="text-white/60 leading-relaxed text-base font-light">{tech.extended}</p></div></FadeInSection>
                </div>
              </div>
            </div>
          ))}

          {/* Roadmap link */}
          <FadeInSection>
            <div className="text-center pt-16 pb-8">
              <Link href="/roadmap" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm font-bold text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all tracking-wide">View full roadmap <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Planned — Truth Engine + ByteGraph */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-white/40 mb-6 backdrop-blur-sm tracking-wide">
                <FlaskConical className="w-3.5 h-3.5" /> Research phase
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-[-0.04em] text-white leading-[1.05]">Planned</h2>
              <p className="text-white/40 mt-4 max-w-xl mx-auto text-lg font-light">Technologies currently in research and development.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {planned.map((item) => (
              <FadeInSection key={item.slug}>
                <Link href={item.href} className="block h-full bg-white/[0.02] border border-white/[0.04] rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-extrabold text-white tracking-[-0.02em]">{item.title}</h3>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-white/20 bg-white/5 px-2 py-0.5 rounded-full">Planned</span>
                      </div>
                      <p className="text-sm text-white/40 font-medium tracking-wide mb-3">{item.subtitle}</p>
                      <p className="text-white/50 text-sm leading-relaxed font-light">{item.shortDesc}</p>
                      <div className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-white/30 group-hover:text-white/50 transition-colors">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithms */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-medium text-white/40 mb-6 backdrop-blur-sm tracking-wide"><Microscope className="w-3.5 h-3.5" /> Proprietary security algorithms</div>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-[-0.04em] text-white leading-[1.05]">Core Algorithms</h2>
              <p className="text-white/40 mt-4 max-w-xl mx-auto text-lg font-light">These are security algorithms — not cryptographic primitives. They protect data integrity, memory safety, and system resilience. Papers coming soon.</p>
            </div>
          </FadeInSection>
          <div className="space-y-6">
            {algorithms.map((algo) => (
              <FadeInSection key={algo.slug}>
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"><algo.icon className={`w-7 h-7 ${algo.color}`} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-extrabold text-white tracking-[-0.02em]">{algo.title}</h3>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-white/20 bg-white/5 px-2 py-0.5 rounded-full inline-flex items-center gap-1.5">
                          <FileText className="w-3 h-3" /> Paper coming
                        </span>
                      </div>
                      <p className="text-sm text-white/40 font-medium tracking-wide mb-3">{algo.subtitle}</p>
                      <p className="text-white/50 text-sm leading-relaxed font-light mb-4">{algo.shortDesc}</p>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-white/60 text-sm leading-relaxed font-light">{algo.detailed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl" onClick={() => setLightboxImage(null)}>
            <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"><X className="w-4 h-4" /></button>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="relative max-w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
              <img src={lightboxImage} alt="Full size screenshot" className="max-w-full max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-40 px-6 lg:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-[150px]" /></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeInSection><h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-[-0.04em] text-white leading-[1.05] mb-6">Ready to take back control?</h2><p className="text-lg text-white/40 mb-10 leading-relaxed font-medium">No servers. No tracking. No compromises.</p></FadeInSection>
          <FadeInSection>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/community" className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all gap-2 tracking-wide">Join the community <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></Link>
              <Link href="/faq" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm tracking-wide">Read the FAQ</Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}