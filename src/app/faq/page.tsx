import Link from "next/link";
import { ArrowLeft, ChevronDown, HelpCircle, Construction } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ – kryosette",
  description: "Frequently asked questions about kryosette.",
};

const faqs = [
  {
    q: "What is kryosette?",
    a: "kryosette is a security‑focused, decentralized social network designed to run on desktop Linux. It stores your data locally on your device and uses improved peer‑to‑peer communication with end‑to‑end encryption. There are no central servers that can be hacked, subpoenaed, or shut down.",
  },
  {
    q: "How is kryosette different from Signal or Telegram?",
    a: "Signal and Telegram rely on central servers for routing and (in Telegram's case) storage. kryosette has no central server. Your data lives on your machine. The network is improved peer‑to‑peer with onion routing. We don't even have the ability to hand over your data because we never possess it.",
  },
  {
    q: "When will kryosette be ready?",
    a: "The first public test version is expected in 2026-2027. Production release will follow after extensive security auditing. We will not ship until we're confident in the security of every component. Nothing is ready yet — but it will be.",
  },
  {
    q: "Can I contribute?",
    a: "Yes! We welcome contributions. Whether you're a systems engineer, security researcher, designer, or technical writer — there's a place for you. Check our Careers page, join the Community.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      {/* Hero */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 mb-8">
              <HelpCircle className="w-3.5 h-3.5" />
              Common questions
            </div>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              FAQ
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/40 mt-4">
              <Construction className="w-4 h-4" />
              Nothing here yet either — but the answers will come
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex items-start gap-6 cursor-pointer list-none bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white/[0.08] leading-none mt-1 select-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-white/80 transition-colors pr-8">
                      {faq.q}
                    </h3>
                    <div className="overflow-hidden max-h-0 group-open:max-h-[500px] transition-all duration-500 ease-out">
                      <p className="text-white/50 leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-white/30 group-open:rotate-180 transition-transform duration-300 flex-shrink-0 mt-1" />
                </summary>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 lg:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl sm:text-3xl font-light text-white/40 leading-relaxed mb-6">
            Still have questions?
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