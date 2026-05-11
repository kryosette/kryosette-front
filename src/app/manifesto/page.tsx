import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifesto – kryosette",
  description: "The principles and vision behind kryosette.",
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      {/* Hero section with big typography */}
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
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase mb-8">
              Our principles
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-8">
              Manifesto
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/50 max-w-2xl leading-relaxed">
              We believe in a digital world where individuals — not corporations, not governments —
              control their own data, identity, and communication.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto space-y-32">
          {[
            {
              num: "01",
              title: "Privacy is not a feature.",
              subtitle: "It is the foundation.",
              text: "Every decision we make starts with the question: does this protect the user? If the answer is no, we don't build it. Security is not something we add later — it is the architecture itself.",
            },
            {
              num: "02",
              title: "You are not the product.",
              subtitle: "",
              text: "There are no advertisers, no data brokers, no hidden trackers. kryosette exists to serve its users, not to monetise their behaviour. Your attention is not for sale.",
            },
            {
              num: "03",
              title: "The network belongs",
              subtitle: "to its participants.",
              text: "There is no central server that can be bought, subpoenaed, or shut down. The power resides where it belongs: in the hands of the people who use the network. We just build the tools.",
            },
            {
              num: "04",
              title: "Encryption",
              subtitle: "is non‑negotiable.",
              text: "Every byte that leaves your machine is encrypted. We do not provide backdoors. We do not weaken security for convenience. A secure system with a backdoor is not a secure system.",
            },
            {
              num: "05",
              title: "Transparency",
              subtitle: "builds trust.",
              text: "We will always be honest about what we can and cannot protect you from. No marketing fluff. No false promises. Just clear, technical truth. If we have a vulnerability, you'll hear it from us first.",
            },
            {
              num: "06",
              title: "The right to disappear.",
              subtitle: "",
              text: "You can delete your local data at any time. There is nothing to deactivate on a server, because there is no server‑side profile. You were never in our database, because our database is your device. You are a ghost by default.",
            },
          ].map((principle, i) => (
            <div key={i} className="group">
              <p className="text-[10rem] sm:text-[14rem] lg:text-[18rem] font-extrabold text-white/[0.02] leading-none select-none mb-[-3rem] sm:mb-[-4rem] lg:mb-[-5rem] pointer-events-none">
                {principle.num}
              </p>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white leading-[1.1]">
                  {principle.title}
                </h2>
                {principle.subtitle && (
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white/40 leading-[1.1] mt-1">
                    {principle.subtitle}
                  </h2>
                )}
                <p className="text-lg sm:text-xl text-white/40 leading-relaxed mt-8 max-w-2xl font-light">
                  {principle.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="py-32 px-6 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light italic text-white/30 leading-relaxed">
            "At the moment, we cannot guarantee all of the above."
          </p>
          <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-white/20 uppercase">
            — The kryosette team
          </p>
        </div>
      </section>
    </div>
  );
}