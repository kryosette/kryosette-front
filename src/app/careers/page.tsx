import Link from "next/link";
import { ArrowLeft, Heart, Brain, Cpu, Network, Shield, Lock, Database, Code2, Zap, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers – kryosette",
  description: "Join us in building the future of secure communication.",
};

const values = [
  { icon: Shield, title: "Security First", text: "Every decision starts with user safety. If it compromises security, we don't do it." },
  { icon: Cpu, title: "Systems Thinking", text: "We work at the deepest levels — kernel, memory, protocols. You will, too." },
  { icon: Code2, title: "Open Source Ethos", text: "Transparency isn't optional. Our code is open, our decisions are public, our bugs are owned." },
  { icon: Heart, title: "User Sovereignty", text: "Users own their data. Period. We build tools for them, not data pipelines for us." },
  { icon: Zap, title: "Performance Obsession", text: "Microseconds matter. Bytes matter. We optimise because our users deserve fast, lean software." },
  { icon: Brain, title: "Intellectual Rigor", text: "No hand-waving. We prove correctness. If you can't explain it formally, you don't understand it." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center px-6 lg:px-16 py-20">
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
              Join the team
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Careers
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              We're not hiring yet. But we will be.
            </p>
          </div>
        </div>
      </section>

      {/* Openings — Coming Soon */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/40 mb-8">
            <Clock className="w-4 h-4" />
            Coming soon
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] mb-6">
            No open positions yet
          </h2>
          <p className="text-lg text-white/30 max-w-xl mx-auto leading-relaxed">
            We're not actively hiring right now, but we're always interested in meeting
            exceptional people. If you think you can contribute to kryosette, don't wait
            for a job posting — reach out.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] mb-6">
            Want to change the world?
          </h2>
          <p className="text-lg text-white/40 mb-8">
            write to{" "}
            <a href="mailto:kryosette@gmail.com" className="text-white underline hover:text-white/80 transition-colors">
              kryosette@gmail.com
            </a>
          </p>
          <a
            href="mailto:kryosette@gmail.com"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-all"
          >
            Contact us
          </a>
        </div>
      </section>
    </div>
  );
}