import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners – kryosette",
  description: "Projects and organizations we work with.",
};

const partners = [
  {
    name: "Self University",
    description: "Our knowledge base — deep technical articles, PDF library, and future mini‑courses. The educational engine behind kryosette.",
    href: "https://selfuniversity.vercel.app",
  },
  {
    name: "ByteGraph",
    description: "Static binary analysis and formal verification. Visual proof that every byte is accounted for.",
    href: "/bytegraph",
  },
  {
    name: "Truth Engine",
    description: "Formal verification system for proving security properties of code. The mathematical foundation of our security claims.",
    href: "/#technologies",
  },
];

export default function PartnersPage() {
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
              Our ecosystem
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Partners
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              kryosette is not built in isolation. We work with projects that share our commitment to security, transparency, and user sovereignty.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {partners.map((partner, i) => (
              <Link
                key={i}
                href={partner.href}
                target={partner.href.startsWith("http") ? "_blank" : undefined}
                rel={partner.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group block bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/80 transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">{partner.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-white mb-4">
            Interested in partnering?
          </h2>
          <p className="text-white/40 mb-6">
            If you're building something that aligns with our mission — privacy, security, user sovereignty — we'd love to talk.
          </p>
          <a
            href="mailto:kryosette@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-all"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  );
}