import Link from "next/link";
import { ArrowLeft, GitGraph, Cpu, Shield, Eye, Lock } from "lucide-react";
import type { Metadata } from "next";

import { Clock } from 'lucide-react';

const PlannedBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 cursor-default select-none">
      <Clock size={16} strokeWidth={2.5} />
      <span className="text-sm font-medium tracking-wide">
        Planned
      </span>
    </div>
  );
};

export const metadata: Metadata = {
  title: "ByteGraph – kryosette",
  description: "Visual proof of security. Every byte accounted for.",
};

export default function ByteGraphPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center px-6 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto w-full">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white/40 hover:text-white/70 transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <div className="tracking-[0.38em] mb-8">
              <PlannedBadge />
            </div>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              ByteGraph
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed mb-4">
              Visual proof of security.
            </p>
            <p className="text-lg text-white/30 max-w-xl">
              Every byte accounted for. Every path verified. Every vulnerability exposed before it
              becomes a threat.
            </p>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase mb-6">
            Overview
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] max-w-2xl mb-16">
            A graph of every bit. <span className="text-white/30">Literally.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <Cpu className="w-8 h-8 text-white/30 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Static Binary Analysis</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                ByteGraph parses your x86 binary and builds a complete data-flow graph at the
                byte level. Every instruction, every register, every memory access — traced and
                verified automatically. No source code needed.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <GitGraph className="w-8 h-8 text-white/30 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Interactive Visualization</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                Explore the graph in real time. Zoom into individual bits, trace data from input
                to output, and see exactly where security checks happen — or where they're missing.
                No more guessing what your code actually does.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <Shield className="w-8 h-8 text-white/30 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Two Modes</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                <span className="text-white/60 font-semibold">Test Mode</span> — full graph with
                every detail for internal audits and vulnerability research.
                <br /><br />
                <span className="text-white/60 font-semibold">Public Mode</span> — simplified
                graph that proves security without revealing implementation. Perfect for
                whitepapers and public verification.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <Eye className="w-8 h-8 text-white/30 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Formal Proof of Security</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                Every path in the graph is analyzed. If there's a way for data to reach a
                sensitive operation without proper checks, ByteGraph finds it. If no such path
                exists — you now have mathematical proof that your code is secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase mb-6">
            Use cases
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-[1.1] max-w-2xl mb-16">
            Who needs ByteGraph?
          </h2>

          <div className="space-y-12">
            <div className="border-l-2 border-white/10 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">Security Auditors</h3>
              <p className="text-white/40 text-sm max-w-xl">
                Replace weeks of manual reverse engineering with an automated graph. Find
                vulnerabilities in hours, not weeks. Deliver proof, not opinions.
              </p>
            </div>

            <div className="border-l-2 border-white/10 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">C/C++/ASM Developers</h3>
              <p className="text-white/40 text-sm max-w-xl">
                Verify your memory safety, bounds checks, and input validation before shipping.
                ByteGraph catches what valgrind and fuzzing miss — because it traces every
                possible path, not just the ones you test.
              </p>
            </div>

            <div className="border-l-2 border-white/10 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">Blockchain & Crypto Projects</h3>
              <p className="text-white/40 text-sm max-w-xl">
                Prove your smart contract runtime or wallet is free of memory corruption and
                side-channel leaks. Public Mode lets you publish verifiable security proofs
                without exposing proprietary code.
              </p>
            </div>

            <div className="border-l-2 border-white/10 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">Zero-Day Researchers</h3>
              <p className="text-white/40 text-sm max-w-xl">
                Map the attack surface of any x86 binary. ByteGraph shows you every unchecked
                input, every potential overflow, every missing canary — visualized as a graph
                you can explore interactively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/40 mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            In Development
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white mb-4">
            Currently in research phase
          </h2>
          <p className="text-white/30 text-lg max-w-xl mx-auto">
            ByteGraph is being built alongside the Truth Engine. Together, they will provide
            formal verification of kryosette's entire codebase — and eventually, yours.
          </p>
        </div>
      </section>
    </div>
  );
}