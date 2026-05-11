import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Wrench, FlaskConical } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap – kryosette",
  description: "What we're building and when.",
};

const phases = [
  {
    status: "done",
    icon: CheckCircle2,
    color: "text-green-500 bg-green-500/10",
    line: "bg-green-500/20",
    title: "Phase 1: Foundation",
    period: "Q1 2026 — Present",
    items: [
      "User profile system",
      "Friend adding mechanism",
      "Posts with comments & polls",
      "Public & private chats",
      "In‑memory DB (base)",
      "Security scanners & detectors",
      "Proprietary onion routing (partial)",
    ],
  },
  {
    status: "in-progress",
    icon: FlaskConical,
    color: "text-yellow-500 bg-yellow-500/10",
    line: "bg-yellow-500/20",
    title: "Phase 2: Core Tech",
    period: "Q2 2026 — Q4 2026",
    items: [
      "Transcendent Bridge completion",
      "Secure private chats (E2EE)",
      "Transparent Editor MVP",
      "Kryo Arch implementation",
      "RPKI validator",
      "Advanced DPI bypass",
      "Replication & sync",
    ],
  },
  {
    status: "planned",
    icon: Clock,
    color: "text-blue-400 bg-blue-400/10",
    line: "bg-blue-400/20",
    title: "Phase 3: Intelligence",
    period: "Q1 2027 — Q2 2027",
    items: [
      "Truth Engine (formal verification)",
      "ByteGraph visualization",
      "Local truth‑engine analyzer",
      "Self University mini‑courses",
      "Practicum Arena platform",
      "Knowledge Graph integration",
    ],
  },
  {
    status: "future",
    icon: Wrench,
    color: "text-white/30 bg-white/5",
    line: "bg-white/10",
    title: "Phase 4: Ecosystem",
    period: "Q3 2027 — ∞",
    items: [
      "Desktop client v1.0",
      "Enterprise deployment",
      "Mobile companion app",
      "Developer API & SDK",
      "Plugin & extension system",
      "Decentralized identity standard",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      <section className="relative min-h-[40vh] flex items-center px-6 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto w-full">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white/40 hover:text-white/70 transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase mb-8">
              The plan
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Roadmap
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              Here's what we're building and when you can expect it.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-0">
            {phases.map((phase, i) => (
              <div key={i} className="relative pl-12 pb-16 last:pb-0">
                {/* Timeline line */}
                {i < phases.length - 1 && (
                  <div className={`absolute left-[19px] top-12 bottom-0 w-px ${phase.line}`} />
                )}
                {/* Dot */}
                <div className={`absolute left-3 top-0 w-5 h-5 rounded-full border-2 border-current ${phase.color}`}>
                  <phase.icon className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${phase.color} mb-4`}>
                  {phase.status === "done" ? "Completed" : phase.status === "in-progress" ? "In Progress" : phase.status === "planned" ? "Planned" : "Future"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-white mb-2">
                  {phase.title}
                </h2>
                <p className="text-sm text-white/30 mb-6">{phase.period}</p>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="text-sm text-white/50 flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-white/20 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16 text-center">
        <p className="text-sm text-white/20">
          This roadmap is a living document and may change.
        </p>
      </section>
    </div>
  );
}