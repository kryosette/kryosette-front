import Link from "next/link";
import { ArrowLeft, Check, Construction } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – kryosette",
  description: "kryosette is free. Privacy shouldn't cost anything.",
};

export default function PricingPage() {
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
              Simple pricing
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Pricing
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white/40 mt-4">
              <Construction className="w-4 h-4" />
              Nothing here yet — the product isn't ready to sell
            </div>
          </div>
        </div>
      </section>

      
      
    </div>
  );
}