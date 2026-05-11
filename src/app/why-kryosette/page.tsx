import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why kryosette? – kryosette",
  description: "Why we built kryosette and why it matters.",
};

export default function WhyKryosettePage() {
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
              The case for kryosette
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Why kryosette?
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              A detailed comparison of kryosette with other platforms is coming soon.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-white/30">
            We're preparing a comprehensive breakdown of how kryosette compares to Telegram, Signal, Matrix, and other platforms — across privacy, security, architecture, and performance. Check back soon.
          </p>
        </div>
      </section>
    </div>
  );
}