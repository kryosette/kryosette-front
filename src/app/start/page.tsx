import Link from "next/link";
import { ArrowLeft, Download, Terminal, Users, Shield, Construction } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started – kryosette",
  description: "How to install and start using kryosette.",
};

const steps = [
  {
    num: "01",
    icon: Download,
    title: "Download",
    text: "kryosette is currently available for Linux x86_64. Download the latest binary from our GitHub releases. Always verify the PGP signature before running.",
    action: { label: "Download", href: "https://github.com/kryosette" },
  },
  {
    num: "02",
    icon: Terminal,
    title: "Install",
    text: "Extract the archive and run the installer. The entire application runs locally — no server connection required. Your data stays on your machine from the first second.",
    action: { label: "Installation Guide", href: "/docs" },
  },
  {
    num: "03",
    icon: Users,
    title: "Connect",
    text: "Add friends by sharing your public key. kryosette uses peer-to-peer connections — there's no central server that holds your contact list. You control who can reach you.",
    action: { label: "Community", href: "/community" },
  },
  {
    num: "04",
    icon: Shield,
    title: "Stay Safe",
    text: "Review your privacy settings, set up your security keys, and read our Threat Model to understand exactly what kryosette protects you from — and what it doesn't.",
    action: { label: "Threat Model", href: "/threat-model" },
  },
];

export default function StartPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      <section className="relative min-h-[50vh] flex items-center px-6 lg:px-16 py-20">
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
              Welcome
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Getting Started
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              Nothing here yet. The client isn't ready for public use — but the plan is here.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/40 mb-16">
            <Construction className="w-4 h-4" />
            Coming soon
          </div>

          <div className="space-y-16">
            {steps.map((step, i) => (
              <div key={i} className="relative pl-16 opacity-60">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-white/30" />
                </div>
                <p className="text-xs font-semibold tracking-[0.2em] text-white/15 uppercase mb-2">
                  Step {step.num}
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-white/20 mb-3">
                  {step.title}
                </h2>
                <p className="text-white/20 leading-relaxed mb-4">{step.text}</p>
                <span className="inline-flex items-center text-sm font-semibold text-white/20">
                  {step.action.label} →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}